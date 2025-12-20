# n8n Workflow Automation

이 디렉토리에는 KPI Automation Platform을 위한 4개의 n8n 워크플로우가 포함되어 있습니다.

## 워크플로우 목록

### 1. SNS 데이터 수집 워크플로우 (`sns-data-collector.json`)

**목적**: Postiz에서 모든 SNS 포스트의 분석 데이터를 자동으로 수집하고 데이터베이스에 저장합니다.

**실행 주기**: 매일 자정 (00:00)

**노드 구성**:
- Cron Trigger - 매일 자정 실행
- HTTP Request - Postiz API에서 모든 포스트 조회
- Loop Over Posts - 각 포스트를 반복 처리
- HTTP Request - 각 포스트의 상세 분석 데이터 조회
- HTTP Request - 데이터베이스에 분석 데이터 저장
- Slack Notification - 작업 완료/실패 알림

**필요한 환경 변수**:
```env
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=your_postiz_api_key
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_database_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

### 2. 랜딩 페이지 → 리드 자동 생성 (`landing-to-lead.json`)

**목적**: 랜딩 페이지 폼 제출 시 자동으로 Twenty CRM에 리드를 생성하고 UTM 파라미터를 추적합니다.

**트리거**: Webhook (POST /webhook/landing-form)

**노드 구성**:
- Webhook Trigger - 랜딩 폼 제출 수신
- Extract UTM Parameters - UTM 파라미터 추출 및 정리
- HTTP Request - Twenty CRM에 Person 생성 (GraphQL)
- HTTP Request - 랜딩 방문 기록 저장
- HTTP Request - 리드에 랜딩 방문 정보 연결
- Slack Notification - 새 리드 알림
- Webhook Response - 성공/실패 응답

**Webhook URL**: `http://your-n8n-url:5678/webhook/landing-form`

**Payload 예시**:
```json
{
  "firstName": "홍",
  "lastName": "길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "company": "Example Corp",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer-2025"
}
```

**필요한 환경 변수**:
```env
TWENTY_API_URL=http://localhost:3001
TWENTY_API_KEY=your_twenty_api_key
TWENTY_CRM_URL=http://localhost:3001
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_database_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

### 3. Google Calendar 동기화 (`calendar-sync.json`)

**목적**: 데이터베이스의 미팅 정보를 Google Calendar와 자동 동기화합니다.

**실행 주기**: 매시간 (00분)

**노드 구성**:
- Cron Trigger - 매시간 실행
- HTTP Request - 예정된 미팅 목록 조회
- Loop Over Meetings - 각 미팅 반복 처리
- If Condition - 캘린더 이벤트 존재 여부 확인
- Google Calendar - 이벤트 생성/업데이트
- HTTP Request - 미팅 레코드 업데이트 (캘린더 이벤트 ID 저장)
- Error Handler - 재시도 로직
- Slack Notification - 동기화 완료/실패 알림

**Google Calendar 설정**:
1. n8n에서 Google Calendar OAuth2 연동 설정
2. Calendar ID 설정 (기본값: "primary")
3. 참석자 이메일 자동 초대 설정

**필요한 환경 변수**:
```env
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_database_api_key
GOOGLE_CALENDAR_ID=primary
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Google OAuth2 Credentials 필요**:
- n8n Credentials에서 Google Calendar OAuth2 설정
- Scope: `https://www.googleapis.com/auth/calendar`

---

### 4. 주간 리포트 발송 (`weekly-report.json`)

**목적**: 매주 월요일 아침에 지난 주의 KPI 리포트를 이메일로 발송합니다.

**실행 주기**: 매주 월요일 오전 9시

**노드 구성**:
- Cron Trigger - 매주 월요일 9시 실행
- HTTP Request - 주간 대시보드 데이터 조회
- Generate HTML Email - 리포트 HTML 생성 (Code 노드)
- SendGrid - 이메일 발송
- HTTP Request - 리포트 발송 기록 저장
- Slack Notification - 발송 완료/실패 알림
- Error Handler - 실패 시 로깅 및 알림

**리포트 내용**:
- 주간 총 매출 (전주 대비 증감률)
- 신규 리드 수 (전주 대비 증감률)
- 진행된 미팅 수 (전주 대비 증감률)
- 거래 성사 수 (전주 대비 증감률)
- 비즈니스 라인별 매출 분석
- 최고 성과 캠페인 및 영업 담당자

**필요한 환경 변수**:
```env
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_database_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=reports@yourdomain.com
REPORT_RECIPIENTS=team@yourdomain.com,manager@yourdomain.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**SendGrid 설정**:
- n8n Credentials에서 SendGrid API 설정
- 발신 이메일 주소 검증 필요

---

## 워크플로우 Import 방법

### 1. n8n 접속
```bash
# Docker Compose 사용 시
docker-compose up -d n8n

# 브라우저에서 접속
http://localhost:5678
```

### 2. 워크플로우 Import

1. n8n 웹 인터페이스 접속
2. 좌측 메뉴에서 "Workflows" 클릭
3. 우측 상단 "+" 버튼 클릭 → "Import from File" 선택
4. 각 JSON 파일 선택하여 import
5. Import 후 워크플로우 활성화

### 3. Credentials 설정

Import 후 다음 Credentials를 설정해야 합니다:

#### Google Calendar OAuth2
1. Settings → Credentials → New
2. "Google Calendar OAuth2 API" 선택
3. Google Cloud Console에서 OAuth2 클라이언트 생성
4. Client ID, Client Secret 입력
5. OAuth 인증 완료

#### SendGrid API
1. Settings → Credentials → New
2. "SendGrid API" 선택
3. SendGrid API Key 입력

#### HTTP Header Auth (여러 API)
각 워크플로우에서 사용하는 API별로:
1. Settings → Credentials → New
2. "HTTP Header Auth" 선택
3. Header Name: "Authorization"
4. Header Value: "Bearer YOUR_API_KEY"

### 4. 환경 변수 설정

n8n 컨테이너의 환경 변수를 설정합니다:

```bash
# .env 파일에 추가
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=your_key
TWENTY_API_URL=http://localhost:3001
TWENTY_API_KEY=your_key
DATABASE_API_URL=http://localhost:3000
DATABASE_API_KEY=your_key
SLACK_WEBHOOK_URL=your_webhook
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=your_email
REPORT_RECIPIENTS=recipient@email.com
GOOGLE_CALENDAR_ID=primary
```

### 5. 워크플로우 활성화

각 워크플로우 페이지에서:
1. 우측 상단 "Active" 토글 활성화
2. 첫 실행을 테스트하려면 "Execute Workflow" 클릭

---

## 에러 핸들링

모든 워크플로우는 에러 발생 시:
1. Slack 알림 전송 (#kpi-alerts 채널)
2. 에러 상세 정보 로깅
3. 일부 워크플로우는 자동 재시도 (최대 3회)

---

## Webhook 테스트

랜딩 페이지 워크플로우 테스트:

```bash
curl -X POST http://localhost:5678/webhook/landing-form \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "테스트",
    "lastName": "사용자",
    "email": "test@example.com",
    "phone": "010-1234-5678",
    "company": "테스트 회사",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "test-campaign"
  }'
```

---

## 모니터링

### 실행 이력 확인
1. n8n에서 각 워크플로우 클릭
2. "Executions" 탭에서 실행 이력 확인
3. 실패한 실행은 빨간색으로 표시

### Slack 알림
- 성공: `#kpi-notifications` 채널
- 실패: `#kpi-alerts` 채널

### 로그 확인
```bash
# n8n 컨테이너 로그
docker-compose logs -f n8n

# 최근 100줄
docker-compose logs --tail=100 n8n
```

---

## 문제 해결

### 워크플로우가 실행되지 않음
1. 워크플로우가 활성화되어 있는지 확인
2. Cron 표현식이 올바른지 확인
3. n8n 컨테이너가 실행 중인지 확인

### API 연결 실패
1. 환경 변수가 올바르게 설정되었는지 확인
2. API 엔드포인트가 접근 가능한지 확인
3. API 키가 유효한지 확인

### Google Calendar 동기화 실패
1. OAuth2 인증이 만료되지 않았는지 확인
2. Calendar ID가 올바른지 확인
3. 참석자 이메일이 유효한지 확인

### SendGrid 이메일 발송 실패
1. SendGrid API 키가 유효한지 확인
2. 발신 이메일이 검증되었는지 확인
3. 수신 이메일 형식이 올바른지 확인

---

## 커스터마이징

### Cron 스케줄 변경
노드의 `cronExpression` 값을 수정:
- 매일 자정: `0 0 * * *`
- 매시간: `0 * * * *`
- 매주 월요일 9시: `0 9 * * 1`
- 매월 1일 자정: `0 0 1 * *`

### Slack 채널 변경
각 Slack 알림 노드의 `channel` 파라미터 수정

### 리포트 수신자 변경
환경 변수 `REPORT_RECIPIENTS` 수정 (쉼표로 구분)

---

## 라이센스

이 워크플로우는 KPI Automation Platform의 일부이며 MIT 라이센스를 따릅니다.
