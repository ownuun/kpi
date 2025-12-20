# n8n 워크플로우 구축 완료 보고서

## 생성된 파일 목록

### 워크플로우 JSON 파일 (4개)

1. **sns-data-collector.json** (7.8 KB)
2. **landing-to-lead.json** (11 KB)
3. **calendar-sync.json** (11 KB)
4. **weekly-report.json** (17 KB)

### 문서 파일

5. **README.md** (8.9 KB) - 워크플로우 사용 가이드
6. **WORKFLOW_SUMMARY.md** (이 파일) - 구축 완료 보고서

### 업데이트된 파일

7. **.env.example** - 필요한 환경 변수 추가

---

## 워크플로우 상세 구성

### 1. SNS 데이터 수집 워크플로우 (sns-data-collector.json)

**노드 수**: 8개

**노드 구성**:
```
1. Cron Trigger - Daily Midnight
   └─> 2. Get All Posts from Postiz
       └─> 3. Loop Over Posts
           └─> 4. Get Post Analytics
               └─> 5. Save Analytics to Database
                   └─> 6. Check If Complete
                       ├─> 7. Send Slack Notification (성공)
                       └─> 3. Loop Over Posts (반복)

   [Error Path]
   └─> 8. Error Notification
```

**주요 기능**:
- Postiz API에서 모든 SNS 포스트 데이터 수집
- 각 포스트의 상세 분석 데이터 조회 (impressions, engagement, clicks, shares, comments, likes)
- 데이터베이스에 자동 저장
- Slack으로 수집 완료/실패 알림

**실행 주기**: 매일 자정 (00:00)

**필요한 API**:
- Postiz API (포스트 목록, 분석 데이터)
- Database API (저장)
- Slack Webhook (알림)

---

### 2. 랜딩 → 리드 자동 생성 (landing-to-lead.json)

**노드 수**: 10개

**노드 구성**:
```
1. Webhook - Landing Form Submit
   └─> 2. Extract UTM Parameters (Code 노드)
       └─> 3. Create Person in Twenty CRM (GraphQL)
           └─> 4. Save Landing Visit
               └─> 5. Link Landing Visit to Lead
                   └─> 6. Send Slack Notification
                       └─> 7. Webhook Response - Success

[Error Path]
├─> 8. Error Notification
    └─> 9. Webhook Response - Error
```

**주요 기능**:
- 랜딩 페이지 폼 제출 시 자동 처리
- UTM 파라미터 추출 및 추적 (source, medium, campaign)
- Twenty CRM에 자동으로 Person 생성 (GraphQL Mutation)
- 랜딩 방문 기록 저장 및 리드 연결
- IP 주소 및 타임스탬프 기록
- 실시간 Slack 알림
- Webhook 응답 (성공/실패)

**트리거**: Webhook POST `/webhook/landing-form`

**Payload 필드**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string"
}
```

**필요한 API**:
- Twenty CRM GraphQL API
- Database API (랜딩 방문 저장)
- Slack Webhook (알림)

---

### 3. Google Calendar 동기화 (calendar-sync.json)

**노드 수**: 11개

**노드 구성**:
```
1. Cron Trigger - Hourly
   └─> 2. Get Scheduled Meetings
       └─> 3. Loop Over Meetings
           └─> 4. Check If Event Exists
               ├─> 5. Create Google Calendar Event (신규)
               └─> 6. Update Google Calendar Event (기존)
                   └─> 7. Update Meeting Record
                       └─> 8. Check If Complete
                           ├─> 9. Send Success Notification
                           └─> 3. Loop Over Meetings (반복)

[Error Path]
├─> 10. Error Handler - Retry Logic (최대 3회)
    └─> 11. Error Notification
```

**주요 기능**:
- 데이터베이스의 예정된 미팅을 Google Calendar와 동기화
- 신규 이벤트 생성 또는 기존 이벤트 업데이트 자동 결정
- 참석자 이메일 자동 초대
- Google Meet 링크 자동 생성 및 데이터베이스 저장
- 에러 발생 시 자동 재시도 (최대 3회, Exponential Backoff)
- 동기화 완료/실패 알림

**실행 주기**: 매시간 (00분)

**Google Calendar 기능**:
- 이벤트 생성/업데이트
- 참석자 자동 초대
- Google Meet 링크 생성
- 시간대 설정 (Asia/Seoul)

**필요한 API/Credentials**:
- Database API (미팅 조회/업데이트)
- Google Calendar OAuth2 API
- Slack Webhook (알림)

---

### 4. 주간 리포트 발송 (weekly-report.json)

**노드 수**: 8개

**노드 구성**:
```
1. Cron Trigger - Monday 9AM
   └─> 2. Get Weekly Dashboard Data
       └─> 3. Generate HTML Email (Code 노드)
           └─> 4. Send Email via SendGrid
               └─> 5. Log Report Delivery
                   └─> 6. Send Slack Notification

[Error Path]
├─> 7. Error Notification
    └─> 8. Log Report Failure
```

**주요 기능**:
- 매주 월요일 오전 9시 자동 실행
- 지난 주 (7일간) KPI 데이터 조회
- 아름다운 HTML 이메일 리포트 생성
- SendGrid를 통한 이메일 발송
- 발송 기록 데이터베이스 저장
- Slack 알림

**리포트 내용**:
1. **주요 지표** (4개):
   - 총 매출 (전주 대비 증감률)
   - 신규 리드 수 (전주 대비 증감률)
   - 진행된 미팅 수 (전주 대비 증감률)
   - 거래 성사 수 (전주 대비 증감률)

2. **비즈니스 라인별 매출**:
   - 각 비즈니스 라인의 매출
   - 전주 대비 증감률
   - 시각적 테이블 표시

3. **최고 성과**:
   - 최고 성과 캠페인 (리드 수, 매출)
   - 최고 성과 영업 담당자 (거래 수, 매출)

**HTML 이메일 디자인**:
- 그라데이션 헤더
- 반응형 디자인
- 색상 코드 지표 (증가=녹색, 감소=빨간색)
- 이모지 아이콘
- 대시보드 링크

**실행 주기**: 매주 월요일 오전 9시

**필요한 API/Credentials**:
- Database API (대시보드 데이터)
- SendGrid API
- Slack Webhook (알림)

---

## 환경 변수 구성

### 추가된 환경 변수 (.env.example)

```env
# SendGrid (for weekly reports)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=reports@yourdomain.com
REPORT_RECIPIENTS=team@yourdomain.com,manager@yourdomain.com

# Slack (for notifications)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# n8n Workflow Environment Variables
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_database_api_key_here
TWENTY_CRM_URL=http://localhost:3001

# Google Services
GOOGLE_CALENDAR_ID=primary
```

---

## 공통 기능

### 1. 에러 핸들링
모든 워크플로우에 구현:
- Try-Catch 패턴
- Slack 에러 알림 (#kpi-alerts 채널)
- 상세 에러 정보 로깅 (노드명, 에러 메시지, 타임스탬프)
- 일부 워크플로우는 자동 재시도

### 2. 로깅
- 실행 시작/종료 시간 기록
- 처리한 항목 수 기록
- 성공/실패 상태 저장

### 3. 알림
- 성공 시: #kpi-notifications 채널
- 실패 시: #kpi-alerts 채널
- 주요 이벤트: 실시간 알림

### 4. n8n 표준 준수
- 모든 노드에 고유 ID 부여
- 노드 좌표 포함 (시각화)
- 버전 정보 포함
- 태그 설정 (검색 용이)
- 연결(connections) 명시적 정의

---

## 설정 가이드

### 1. Import 순서
1. `sns-data-collector.json`
2. `landing-to-lead.json`
3. `calendar-sync.json`
4. `weekly-report.json`

### 2. Credentials 설정
필요한 Credentials (n8n 설정):
1. **Google Calendar OAuth2 API**
2. **SendGrid API**
3. **HTTP Header Auth** (여러 개):
   - Postiz API
   - Twenty CRM API
   - Database API

### 3. 환경 변수 설정
n8n 컨테이너의 `.env` 파일에 추가

### 4. Slack 채널 생성
- `#kpi-notifications` - 일반 알림
- `#kpi-alerts` - 에러 알림
- `#kpi-leads` - 신규 리드 알림

### 5. 테스트
각 워크플로우의 "Execute Workflow" 버튼으로 수동 실행하여 테스트

---

## 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    External Data Sources                     │
├─────────────────────────────────────────────────────────────┤
│  Postiz API  │  Landing Pages  │  Database  │  Google Cal   │
└──────┬──────────────┬─────────────┬──────────────┬──────────┘
       │              │             │              │
       ▼              ▼             ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                        n8n Workflows                         │
├─────────────────────────────────────────────────────────────┤
│  SNS Collector  │  Landing→Lead  │  Cal Sync  │  Weekly Rpt │
└──────┬──────────────┬─────────────┬──────────────┬──────────┘
       │              │             │              │
       ▼              ▼             ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Destinations                       │
├─────────────────────────────────────────────────────────────┤
│   Database   │  Twenty CRM  │  Google Cal  │  Email/Slack   │
└─────────────────────────────────────────────────────────────┘
```

---

## 예상 효과

### 1. 자동화된 데이터 수집
- SNS 분석 데이터 자동 수집 (매일)
- 수동 작업 제거

### 2. 즉각적인 리드 생성
- 랜딩 페이지 제출 즉시 CRM 등록
- UTM 추적으로 마케팅 ROI 측정

### 3. 일정 관리 자동화
- 미팅 자동 캘린더 등록
- Google Meet 링크 자동 생성
- 참석자 자동 초대

### 4. 정기적인 리포트
- 주간 KPI 자동 전송
- 경영진 의사결정 지원
- 팀 성과 가시성 향상

---

## 유지보수 가이드

### 정기 점검 항목
1. **매주**: 워크플로우 실행 이력 확인
2. **매월**: Credentials 만료 확인
3. **분기별**: 환경 변수 업데이트 확인

### 모니터링
- Slack 알림 채널 모니터링
- n8n 실행 이력 확인
- 데이터베이스 로그 확인

---

## 기술 스택

- **워크플로우 엔진**: n8n
- **데이터베이스**: PostgreSQL
- **CRM**: Twenty CRM (GraphQL)
- **SNS 관리**: Postiz
- **캘린더**: Google Calendar API
- **이메일**: SendGrid
- **알림**: Slack Webhooks

---

## 다음 단계

### 추가 개발 권장 사항

1. **알림 워크플로우**
   - 미팅 1시간 전 리마인더
   - 중요 거래 단계 변경 알림

2. **데이터 백업 워크플로우**
   - 일일 데이터베이스 백업
   - S3/Google Drive 저장

3. **리포트 확장**
   - 월간 리포트
   - 커스텀 리포트 (비즈니스 라인별, 담당자별)

4. **AI 통합**
   - 리드 스코어링
   - 거래 성사 확률 예측

---

## 문의 및 지원

워크플로우 관련 문의:
- Slack: #kpi-automation-support
- 문서: `workflows/README.md`
- n8n 공식 문서: https://docs.n8n.io

---

## 버전 정보

- **생성 일자**: 2025-01-15
- **n8n 버전**: Latest (호환)
- **워크플로우 버전**: 1.0.0
- **상태**: Production Ready

---

## 라이센스

MIT License - KPI Automation Platform
