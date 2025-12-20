# KPI Tracker - 미구현 기능 구현 계획

## 📋 현재 상태

### ✅ 구현 완료
- **3개 주요 API**: Lead, SocialPost, EmailCampaign (CRUD 완료)
- **5개 UI 페이지**: 홈, SNS Posts, Leads, Email Campaigns
- **데이터베이스**: 10개 모델 정의 (Prisma + SQLite)
- **스타일링**: Tailwind CSS 3
- **검증**: Zod 스키마

### ❌ 미구현 (패키지만 설치됨)
- **resend** - 이메일 발송 (현재 시뮬레이션만)
- **bullmq + ioredis** - 작업 큐/스케줄링
- **recharts** - 차트 시각화
- **axios** - HTTP 클라이언트 (n8n 통합용)

### 📊 미구현 API (5개 모델)
1. Company - 회사 정보
2. SocialAccount - OAuth 토큰 관리
3. EmailEvent - 이메일 추적
4. Campaign - 마케팅 캠페인
5. Workflow - n8n 워크플로우

---

## 🎯 구현 계획 (3개 Phase, 28시간)

---

## PHASE 1: 핵심 통합 (Priority: HIGH) - 11시간

### 1.1 Resend 이메일 발송 (4시간)

**목표**: EmailCampaign 실제 이메일 발송 + 추적

**생성할 파일**:
```
lib/email/resend.ts          # Resend 클라이언트
lib/email/send.ts            # 이메일 발송 로직
app/api/webhooks/resend/route.ts  # 웹훅 핸들러
```

**수정할 파일**:
```
app/api/email/campaigns/[id]/send/route.ts  # 실제 발송 로직 통합
```

**구현 내용**:
1. Resend API 클라이언트 초기화
2. `sendCampaignEmails()` 함수 작성
   - 수신자별 이메일 발송
   - EmailEvent 생성 (SENT)
   - 에러 처리 및 BOUNCED 이벤트
3. Resend Webhook 핸들러
   - 이벤트 타입: SENT, DELIVERED, OPENED, CLICKED, BOUNCED, COMPLAINED, UNSUBSCRIBED
   - EmailEvent 생성
   - EmailCampaign 메트릭 업데이트 (openedCount, clickedCount)
4. `/send` 엔드포인트에 실제 발송 통합

**환경 변수**:
```env
RESEND_API_KEY=re_your_api_key
```

**테스트**:
```bash
curl -X POST http://localhost:3000/api/email/campaigns/[id]/send \
  -d '{"recipients": ["test@example.com"], "sendNow": true}'
```

---

### 1.2 BullMQ + Redis 작업 큐 (7시간)

**목표**: 이메일/SNS 비동기 처리 + 스케줄링

**생성할 파일**:
```
lib/queue/redis.ts           # Redis 연결
lib/queue/email-queue.ts     # 이메일 큐
lib/queue/social-queue.ts    # 소셜 포스트 큐
lib/queue/workers.ts         # Worker 프로세스
scripts/start-worker.ts      # Worker 시작 스크립트
```

**수정할 파일**:
```
package.json                 # worker 스크립트 추가
app/api/email/campaigns/[id]/send/route.ts  # 큐 통합
app/api/social/posts/route.ts               # 스케줄링 큐
```

**구현 내용**:
1. **Redis 클라이언트**: ioredis 초기화
2. **Email Queue**: BullMQ 큐 생성
   - Job 데이터: campaignId, recipient, subject, html
   - Retry: 3회, exponential backoff
   - `queueEmail()`, `queueBulkEmails()` 함수
3. **Social Queue**: 스케줄링 지원
   - Job 데이터: postId, platform, content, scheduledAt
   - Delay 계산: `scheduledAt - Date.now()`
4. **Workers**: 작업 처리
   - Email Worker: Resend API 호출, EmailEvent 생성
   - Social Worker: status → PUBLISHED 업데이트
   - Concurrency: Email 5, Social 3
5. **Worker 스크립트**: `npm run worker` 명령

**환경 변수**:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**테스트**:
```bash
# Redis 실행
docker run -d -p 6379:6379 redis:alpine

# Worker 시작 (별도 터미널)
npm run worker:dev

# 이메일 큐잉
curl -X POST http://localhost:3000/api/email/campaigns/[id]/send
```

---

## PHASE 2: 기본 API 구현 (Priority: MEDIUM) - 8시간

### 2.1 Company API (3시간)

**생성할 파일**:
```
lib/validations/company.ts           # Zod 스키마
app/api/companies/route.ts           # GET, POST
app/api/companies/[id]/route.ts      # GET, PATCH, DELETE
```

**주요 기능**:
- CRUD 엔드포인트
- 검색/필터링: `?industry=Tech&search=Google`
- Lead 관계 포함 (include)
- 삭제 방지: Lead가 있는 회사 삭제 불가

**Zod 스키마**:
```typescript
{
  name: string,
  domainUrl?: url,
  employees?: number,
  industry?: string,
  annualRevenue?: number,
  isIdealCustomer: boolean
}
```

---

### 2.2 SocialAccount API (3시간)

**생성할 파일**:
```
lib/crypto/encrypt.ts                    # 토큰 암호화
app/api/social/accounts/route.ts         # GET, POST
app/api/social/accounts/[id]/route.ts    # GET, PATCH, DELETE
```

**주요 기능**:
- OAuth 토큰 암호화 저장 (AES-256-GCM)
- 플랫폼별 1개 계정만 (unique constraint)
- 토큰 응답 시 마스킹 (`***`)
- SocialPost 관계 포함

**환경 변수**:
```env
ENCRYPTION_KEY=your-32-char-secret-key!!
```

---

### 2.3 Campaign API (2시간)

**생성할 파일**:
```
app/api/campaigns/route.ts      # GET, POST
app/api/campaigns/[id]/route.ts # GET, PATCH, DELETE
```

**주요 기능**:
- 마케팅 캠페인 CRUD
- EmailCampaign과 1:N 관계

---

## PHASE 3: 워크플로우 통합 (Priority: LOW) - 4시간

### 3.1 Workflow API

**생성할 파일**:
```
lib/n8n/client.ts                        # n8n API 클라이언트
app/api/workflows/route.ts               # GET, POST
app/api/workflows/[id]/route.ts          # GET, PATCH, DELETE
app/api/workflows/[id]/execute/route.ts  # POST 실행
```

**주요 기능**:
- n8n 워크플로우 생성/활성화
- 웹훅 URL 등록
- WorkflowExecution 추적

**환경 변수**:
```env
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_api_key
```

---

## PHASE 4: UI 개선 (Priority: MEDIUM) - 5시간

### 4.1 Recharts 대시보드

**생성할 파일**:
```
app/api/dashboard/stats/route.ts              # 통계 API
components/dashboard/EmailPerformanceChart.tsx
components/dashboard/SocialPerformanceChart.tsx
components/dashboard/LeadFunnelChart.tsx
```

**수정할 파일**:
```
app/page.tsx  # 차트 컴포넌트 추가
```

**차트 종류**:
1. **이메일 성과**: BarChart (sent, opened, clicked)
2. **SNS 성과**: LineChart (views, likes, shares)
3. **리드 퍼널**: FunnelChart (NEW → CONTACTED → QUALIFIED → CONVERTED)

**통계 API**:
```typescript
GET /api/dashboard/stats
{
  leads: { total, byStatus, recent },
  campaigns: { total, metrics },
  social: { total, metrics }
}
```

---

## 📁 핵심 파일 (우선순위 순)

1. **lib/queue/email-queue.ts** - 이메일 큐 시스템 (Phase 1)
2. **lib/queue/workers.ts** - 작업 처리 워커 (Phase 1)
3. **app/api/webhooks/resend/route.ts** - 이메일 추적 (Phase 1)
4. **lib/email/send.ts** - 실제 이메일 발송 (Phase 1)
5. **app/api/companies/route.ts** - Company API (Phase 2)

---

## 🛠️ 환경 설정

### 필수 서비스
```bash
# Redis (BullMQ용)
docker run -d -p 6379:6379 redis:alpine

# n8n (워크플로우용, 선택)
docker run -d -p 5678:5678 n8nio/n8n
```

### .env 파일
```env
# Resend
RESEND_API_KEY=re_your_api_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Encryption
ENCRYPTION_KEY=your-32-character-secret-key!!

# n8n (선택)
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_api_key
```

### 새 npm 스크립트
```json
{
  "scripts": {
    "worker": "tsx scripts/start-worker.ts",
    "worker:dev": "tsx watch scripts/start-worker.ts"
  }
}
```

---

## 🧪 테스트 계획

### Phase 1 테스트
```bash
# 1. Redis 확인
redis-cli ping

# 2. Worker 시작
npm run worker:dev

# 3. 이메일 발송 테스트
curl -X POST http://localhost:3000/api/email/campaigns/[id]/send \
  -H "Content-Type: application/json" \
  -d '{"recipients": ["test@example.com"]}'

# 4. Webhook 테스트
curl -X POST http://localhost:3000/api/webhooks/resend \
  -d '{"type": "email.opened", "data": {...}}'

# 5. DB 확인
npm run db:studio
# EmailEvent 테이블 체크
```

---

## ⏱️ 타임라인

**Week 1**: Phase 1 (Resend + BullMQ) - 11시간
- Day 1-2: Resend 이메일 (4시간)
- Day 3-4: BullMQ 큐 (7시간)

**Week 2**: Phase 2 (API 구현) - 8시간
- Day 1: Company API (3시간)
- Day 2: SocialAccount API (3시간)
- Day 3: Campaign API (2시간)

**Week 3**: Phase 3-4 (워크플로우 + UI) - 9시간
- Day 1-2: Workflow API (4시간)
- Day 3-4: Recharts 대시보드 (5시간)

**총 예상 시간**: 28시간 (약 3.5주)

---

## ⚠️ 잠재적 문제 & 해결책

### Resend
- **문제**: API 제한 (무료 플랜 100통/일)
- **해결**: Rate limiting, 배치 발송

### Redis
- **문제**: Windows에서 Redis 실행
- **해결**: Docker 또는 Memurai 사용

### BullMQ
- **문제**: Worker 프로세스 관리
- **해결**: 개발 시 `tsx watch`, 프로덕션 시 PM2/Docker

### 토큰 암호화
- **문제**: 키 관리
- **해결**: 환경 변수, 프로덕션은 AWS Secrets Manager

---

## 📝 추가 권장사항

1. **Bull Board** - 큐 모니터링 UI
2. **Sentry** - 에러 추적
3. **Jest** - API 테스트
4. **Swagger** - API 문서
5. **Rate Limiting** - API 보호
