# 팀 구조 및 역할 분담 전략

## 🎯 3인 팀 구성 전략

### 전략 A: 수직 분할 (비즈니스 라인별) - **추천**

각자 하나의 비즈니스 라인을 End-to-End로 담당

```
Person A: 외주 비즈니스 라인 전담
  ├── 외주 대시보드
  ├── 외주 SNS 포스팅
  ├── 외주 리드 관리
  └── 외주 거래 관리

Person B: B2B 비즈니스 라인 전담
  ├── B2B 대시보드
  ├── B2B SNS 포스팅
  ├── B2B 리드 관리
  └── B2B PoC 관리

Person C: ANYON + 공통 인프라 담당
  ├── ANYON 대시보드
  ├── ANYON 구독 관리
  ├── 통합 대시보드
  ├── Analytics Engine
  └── 자동화 워크플로우
```

**장점:**
- ✅ 각자 독립적으로 작업 가능 (충돌 최소화)
- ✅ 비즈니스 로직을 깊이 이해
- ✅ 책임 소재가 명확
- ✅ 빠른 의사결정

**단점:**
- ❌ 기술 스택 전체를 각자 알아야 함
- ❌ 코드 스타일이 달라질 수 있음

---

### 전략 B: 수평 분할 (레이어별)

기술 스택/레이어별로 분담

```
Person A: Frontend 전담
  ├── 모든 UI 컴포넌트
  ├── 대시보드 레이아웃
  ├── 폼 & 차트
  └── 상태 관리

Person B: Backend & API 전담
  ├── API Routes
  ├── Server Actions
  ├── 외부 API 연동
  └── 자동화 로직

Person C: Database & Infrastructure 전담
  ├── Prisma 스키마
  ├── 마이그레이션
  ├── BullMQ 설정
  └── 배포 & DevOps
```

**장점:**
- ✅ 각자의 전문성 활용
- ✅ 일관된 코드 스타일
- ✅ 깊은 기술적 이해

**단점:**
- ❌ 의존성이 많아 대기 시간 발생
- ❌ 커뮤니케이션 오버헤드
- ❌ End-to-End 흐름을 한 명이 모두 파악하기 어려움

---

### 전략 C: 하이브리드 (기능 모듈별) - **추천 #2**

핵심 기능 모듈별로 분담

```
Person A: SNS Manager + Email Module
  ├── SNS 포스팅 에디터
  ├── 플랫폼 API 연동 (LinkedIn, FB, etc.)
  ├── SNS 데이터 수집 자동화
  ├── 이메일 캠페인 관리
  └── SendGrid 연동

Person B: Lead & Deal Manager
  ├── 리드 폼 & 파이프라인
  ├── 미팅 관리
  ├── Google Calendar 연동
  ├── 거래 관리 UI
  └── PoC 트래킹

Person C: Analytics & Infrastructure
  ├── 통합 대시보드
  ├── 퍼널 분석
  ├── ROI 차트
  ├── Landing Tracker
  ├── Prisma 스키마
  └── 자동화 인프라 (BullMQ)
```

**장점:**
- ✅ 기능별로 집중 가능
- ✅ 각 기능이 독립적
- ✅ 병렬 개발 가능
- ✅ 전문성 + 독립성 균형

**단점:**
- ❌ 초기 인프라 셋업 필요
- ❌ 공통 컴포넌트 조율 필요

---

## 🏆 최종 추천: 전략 C (하이브리드)

### 이유
1. **병렬 개발**: 3명이 동시에 작업 가능
2. **명확한 경계**: 각 모듈이 독립적
3. **빠른 진행**: 서로 기다릴 필요 없음
4. **확장성**: 향후 팀 확장 시 모듈만 추가

---

## 👥 상세 역할 분담

### 🔵 Person A: SNS & Email Module 담당

#### 담당 파일 구조
```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── sns/              ⭐ Person A
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   └── analytics/
│   │   └── email/            ⭐ Person A
│   │       ├── campaigns/
│   │       └── templates/
│   └── api/
│       ├── sns/              ⭐ Person A
│       └── email/            ⭐ Person A
│
├── components/
│   ├── sns/                  ⭐ Person A
│   │   ├── PostEditor.tsx
│   │   ├── PlatformSelector.tsx
│   │   └── PostAnalytics.tsx
│   └── email/                ⭐ Person A
│       ├── EmailEditor.tsx
│       └── CampaignStats.tsx
│
└── lib/
    ├── integrations/         ⭐ Person A
    │   ├── linkedin.ts
    │   ├── facebook.ts
    │   ├── youtube.ts
    │   └── sendgrid.ts
    └── automation/
        └── sns-collector.ts  ⭐ Person A
```

#### 주요 작업
1. **Week 1-2**: SNS Manager
   - [ ] PostEditor 컴포넌트 (Postiz 참조)
   - [ ] LinkedIn API 연동
   - [ ] Facebook/Instagram API 연동
   - [ ] YouTube API 연동
   - [ ] 포스트 목록 & 통계 UI

2. **Week 3-4**: Email Module
   - [ ] 이메일 에디터 (Mautic 참조)
   - [ ] SendGrid 연동
   - [ ] 캠페인 목록 & 통계
   - [ ] 발송 스케줄러

3. **Week 5**: 자동화
   - [ ] SNS 데이터 수집 Cron Job
   - [ ] 이메일 오픈/클릭 트래킹

---

### 🟢 Person B: Lead & Deal Manager 담당

#### 담당 파일 구조
```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── leads/            ⭐ Person B
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── pipeline/
│   │   └── deals/            ⭐ Person B
│   │       ├── page.tsx
│   │       └── [id]/
│   └── api/
│       ├── leads/            ⭐ Person B
│       ├── deals/            ⭐ Person B
│       └── webhooks/
│           └── google-calendar/  ⭐ Person B
│
├── components/
│   ├── leads/                ⭐ Person B
│   │   ├── LeadCard.tsx
│   │   ├── PipelineBoard.tsx
│   │   └── LeadForm.tsx
│   └── deals/                ⭐ Person B
│       ├── DealCard.tsx
│       └── DealForm.tsx
│
└── lib/
    ├── integrations/
    │   └── google-calendar.ts  ⭐ Person B
    └── automation/
        └── lead-processor.ts   ⭐ Person B
```

#### 주요 작업
1. **Week 1-2**: Lead Manager
   - [ ] 리드 폼 & 생성 API
   - [ ] 리드 목록 & 상세 페이지
   - [ ] 파이프라인 Kanban 보드 (Twenty 참조)
   - [ ] 리드 상태 변경 로직

2. **Week 3-4**: Google Calendar & Meeting
   - [ ] Google Calendar OAuth 연동
   - [ ] 미팅 일정 자동 생성
   - [ ] 미팅 결과 기록 UI
   - [ ] Webhook 수신 엔드포인트

3. **Week 5**: Deal Manager
   - [ ] 거래 등록 & 관리 UI
   - [ ] 입금 추적
   - [ ] 구독 관리 (ANYON)
   - [ ] 전환율 계산

---

### 🟣 Person C: Analytics & Infrastructure 담당

#### 담당 파일 구조
```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx          ⭐ Person C (통합 대시보드)
│   │   ├── outsource/        ⭐ Person C
│   │   ├── b2b/              ⭐ Person C
│   │   ├── anyon/            ⭐ Person C
│   │   └── analytics/        ⭐ Person C
│   │       ├── funnel/
│   │       ├── roi/
│   │       └── reports/
│   └── api/
│       ├── landing/          ⭐ Person C
│       └── cron/             ⭐ Person C
│
├── components/
│   ├── dashboard/            ⭐ Person C
│   │   ├── MetricCard.tsx
│   │   ├── FunnelChart.tsx
│   │   ├── RevenueProgress.tsx
│   │   └── ROIAnalysis.tsx
│   └── analytics/            ⭐ Person C
│
├── prisma/
│   └── schema.prisma         ⭐ Person C
│
└── lib/
    ├── db/
    │   └── prisma.ts         ⭐ Person C
    ├── queue/                ⭐ Person C
    │   ├── sns-queue.ts
    │   └── email-queue.ts
    └── automation/
        └── report-generator.ts  ⭐ Person C
```

#### 주요 작업
1. **Week 1**: 인프라 구축
   - [ ] Prisma 스키마 작성
   - [ ] Database 마이그레이션
   - [ ] 기본 UI 컴포넌트 (shadcn/ui)
   - [ ] 인증 시스템 (NextAuth.js)

2. **Week 2-3**: 대시보드
   - [ ] 통합 대시보드 레이아웃
   - [ ] 비즈니스 라인별 대시보드
   - [ ] MetricCard, FunnelChart 컴포넌트
   - [ ] 퍼널 분석 로직

3. **Week 4**: Landing Tracker
   - [ ] UTM 파라미터 생성기
   - [ ] 트래킹 스크립트 (tracking.js)
   - [ ] 방문 데이터 수집 API
   - [ ] 전환율 계산

4. **Week 5**: 자동화 & 리포트
   - [ ] BullMQ 설정
   - [ ] Cron Jobs (데이터 수집)
   - [ ] 주간 리포트 생성
   - [ ] Slack 알림 연동

---

## 🔄 협업 워크플로우

### Git 브랜치 전략

```
main                    # 프로덕션
├── develop            # 개발 메인
│   ├── feature/sns-manager           (Person A)
│   ├── feature/email-module          (Person A)
│   ├── feature/lead-manager          (Person B)
│   ├── feature/deal-manager          (Person B)
│   ├── feature/analytics-dashboard   (Person C)
│   └── feature/landing-tracker       (Person C)
```

### 작업 순서

#### Phase 1: 인프라 (Week 1)
```
Person C (선행 작업):
  1. Prisma 스키마 작성
  2. DB 마이그레이션
  3. 공통 UI 컴포넌트 설치

Person A & B:
  - Person C 완료 후 pull
```

#### Phase 2: 병렬 개발 (Week 2-4)
```
Person A: SNS Manager 개발
Person B: Lead Manager 개발
Person C: Dashboard 개발

⚠️ 매일 develop 브랜치에 머지하여 동기화
```

#### Phase 3: 통합 (Week 5)
```
모두: 기능 통합 & 테스트
Person A: SNS 자동화
Person B: 리드 자동화
Person C: 리포트 자동화
```

---

## 📅 주간 미팅 구조

### Daily Standup (10분)
- **시간**: 매일 아침 10시
- **내용**:
  - 어제 한 일
  - 오늘 할 일
  - 블로커 있는지

### Weekly Review (30분)
- **시간**: 매주 금요일 오후 5시
- **내용**:
  - 주간 진행 상황
  - 다음 주 계획
  - 기술 공유

### Code Review 규칙
- PR은 24시간 내 리뷰
- 최소 1명 Approve 필요
- 충돌 시 Person C가 최종 결정

---

## 🛠️ 공통 작업 가이드

### 공통으로 사용하는 것들

#### 1. 공통 컴포넌트 (Person C가 먼저 작성)
```typescript
components/ui/          # shadcn/ui 컴포넌트
  ├── button.tsx
  ├── card.tsx
  ├── input.tsx
  └── ...

components/dashboard/   # 공통 대시보드 컴포넌트
  ├── MetricCard.tsx   # Person C
  ├── BusinessLineSelector.tsx  # Person C
  └── ...
```

#### 2. 공통 타입 (Person C가 먼저 작성)
```typescript
types/database.ts       # Prisma 타입
types/api.ts           # API 요청/응답 타입
types/integrations.ts  # 외부 API 타입
```

#### 3. 공통 유틸리티 (각자 필요할 때 추가)
```typescript
lib/utils/
  ├── date.ts          # 날짜 포맷팅
  ├── format.ts        # 숫자/통화 포맷팅
  └── utm.ts           # UTM 파라미터 처리
```

---

## 📝 커뮤니케이션 가이드

### Slack 채널 구조
```
#kpi-tracker-general    # 전체 논의
#kpi-tracker-dev        # 기술 논의
#kpi-tracker-alerts     # CI/CD 알림
```

### GitHub Projects
- **보드**: Kanban 형태
- **컬럼**:
  - Backlog
  - In Progress
  - Review
  - Done

### 이슈 템플릿
```markdown
## 작업 내용
[무엇을 구현하는가]

## 담당자
Person A / B / C

## 예상 시간
2일

## 의존성
- [ ] Prisma 스키마 완료 필요
```

---

## 🎯 성공 기준

### Week 1 완료 기준
- [ ] Prisma 스키마 완료
- [ ] 기본 UI 컴포넌트 설치
- [ ] 3명 모두 로컬에서 실행 가능

### Week 2-4 완료 기준
- [ ] Person A: SNS 포스팅 가능
- [ ] Person B: 리드 생성 가능
- [ ] Person C: 대시보드 데이터 표시

### Week 5-6 완료 기준
- [ ] 모든 기능 통합
- [ ] 자동화 작동
- [ ] 배포 완료

---

## 🚨 충돌 방지 전략

### 파일 충돌 방지
```
✅ Good: 각자 독립된 폴더 작업
  - Person A: app/(dashboard)/sns/
  - Person B: app/(dashboard)/leads/
  - Person C: app/(dashboard)/page.tsx

❌ Bad: 같은 파일 동시 수정
```

### DB 스키마 변경
```
⚠️ 규칙: Person C만 schema.prisma 수정
- 다른 사람이 필드 추가 필요 시 → Person C에게 요청
- 또는 매주 금요일 일괄 업데이트
```

### API Routes 중복 방지
```
Person A: /api/sns/*
Person B: /api/leads/*, /api/deals/*
Person C: /api/analytics/*, /api/landing/*
```

---

## 📚 참고 자료

각자 참고할 오픈소스:

**Person A (SNS & Email)**
- `clones/postiz-app/` → SNS 에디터, API 연동
- `clones/mautic/` → 이메일 템플릿

**Person B (Lead & Deal)**
- `clones/twenty/` → Kanban 보드, 파이프라인
- `clones/n8n/nodes/Google/` → Calendar 연동

**Person C (Analytics & Infra)**
- `clones/metabase/` → 퍼널 분석 쿼리
- `clones/n8n/` → BullMQ 워크플로우

---

**작성일**: 2024년
**버전**: 1.0
**팀원**: Person A (SNS/Email) | Person B (Lead/Deal) | Person C (Analytics/Infra)
