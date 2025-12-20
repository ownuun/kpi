# 🚀 빠른 시작 가이드

## 📋 사전 요구사항

- Docker Desktop 설치
- Node.js 18+ 설치
- pnpm 설치 (`npm install -g pnpm`)
- Git

---

## ⚡ 5분 안에 시작하기

### 1단계: 모든 서비스 실행

```bash
cd kpi-automation-platform
docker-compose up -d
```

**실행되는 서비스:**
- PostgreSQL (포트: 5432)
- Redis (포트: 6379)
- Postiz (포트: 5000)
- Twenty CRM (포트: 3001)
- n8n (포트: 5678)
- Metabase (포트: 3002)
- Mautic (포트: 8080)

### 2단계: 서비스 상태 확인

```bash
docker-compose ps
```

모든 서비스가 `Up` 상태인지 확인하세요.

### 3단계: 각 서비스 접속 & 초기 설정

#### 📱 Postiz (SNS 관리)
- URL: http://localhost:5000
- 계정 생성 후 로그인
- Settings → API Keys → 새 API 키 발급
- 메모해두기: `POSTIZ_API_KEY`

#### 👥 Twenty CRM (리드 관리)
- URL: http://localhost:3001
- Workspace 생성
- Settings → API → GraphQL Playground에서 API 키 발급
- 메모해두기: `TWENTY_API_KEY`

#### 🤖 n8n (자동화)
- URL: http://localhost:5678
- 로그인: `admin` / `admin`
- Credentials → PostgreSQL 연결 추가
  - Host: `postgres`
  - Port: `5432`
  - Database: `kpi_platform`
  - User: `kpi_user`
  - Password: `kpi_password`

#### 📊 Metabase (분석)
- URL: http://localhost:3002
- 계정 생성 (이메일, 비밀번호)
- Add Database → PostgreSQL 선택
  - Host: `postgres`
  - Port: `5432`
  - Database: `kpi_platform`
  - User: `kpi_user`
  - Password: `kpi_password`
- Settings → Embedding → Secret Key 복사
- 메모해두기: `METABASE_SECRET_KEY`

#### 📧 Mautic (이메일 마케팅)
- URL: http://localhost:8080
- 설치 마법사 따라가기
- Configuration → API Settings → Enable OAuth2
- API Credentials 생성
- 메모해두기: `MAUTIC_CLIENT_ID`, `MAUTIC_CLIENT_SECRET`

---

## 🔧 환경 변수 설정

루트에 `.env` 파일 생성:

```bash
cd kpi-automation-platform
cp .env.example .env
```

`.env` 파일 편집:
```env
# Database
DATABASE_URL=postgresql://kpi_user:kpi_password@localhost:5432/kpi_platform

# Postiz
POSTIZ_API_URL=http://localhost:5000
POSTIZ_API_KEY=여기에_발급받은_키_입력

# Twenty CRM
TWENTY_API_URL=http://localhost:3001
TWENTY_API_KEY=여기에_발급받은_키_입력

# n8n
N8N_URL=http://localhost:5678
N8N_API_KEY=여기에_발급받은_키_입력

# Metabase
METABASE_URL=http://localhost:3002
METABASE_SECRET_KEY=여기에_복사한_키_입력

# Mautic
MAUTIC_URL=http://localhost:8080
MAUTIC_CLIENT_ID=여기에_발급받은_ID_입력
MAUTIC_CLIENT_SECRET=여기에_발급받은_Secret_입력
```

---

## 🎯 첫 번째 테스트

### 1. Postiz에서 SNS 포스팅 테스트

1. http://localhost:5000 접속
2. "Add Account" → LinkedIn/Facebook 연결
3. "Create Post" → 글 작성 후 발행
4. "Analytics" → 통계 확인

### 2. Twenty CRM에서 리드 생성 테스트

1. http://localhost:3001 접속
2. "People" → "Add Person"
3. 이름, 이메일 입력
4. Custom Fields에 `businessLine: 외주` 추가

### 3. n8n에서 자동화 워크플로우 만들기

1. http://localhost:5678 접속
2. "New Workflow" 클릭
3. 간단한 워크플로우 추가:
   ```
   Cron Trigger (매일 자정)
   ↓
   HTTP Request (Postiz API)
   ↓
   PostgreSQL (데이터 저장)
   ```
4. "Activate" 버튼 클릭

### 4. Metabase에서 첫 대시보드 만들기

1. http://localhost:3002 접속
2. "New" → "Question"
3. 간단한 쿼리 작성:
   ```sql
   SELECT platform, COUNT(*) as post_count
   FROM sns_metrics
   GROUP BY platform
   ```
4. "Visualize" → 차트 선택
5. "Save" → 대시보드에 추가

---

## 📁 프로젝트 구조 둘러보기

```
kpi-automation-platform/
├── apps/
│   ├── web-dashboard/      # 👈 여기서 커스텀 프론트엔드 개발
│   ├── api/                # 👈 백엔드 API 로직
│   └── automation-engine/  # 👈 자동화 스크립트
│
├── packages/
│   ├── shared-types/       # 공유 TypeScript 타입
│   ├── ui-components/      # 재사용 UI 컴포넌트
│   ├── database/           # Prisma 스키마
│   └── integrations/       # 👈 여기에 오픈소스 API 클라이언트 작성
│       ├── postiz/
│       ├── twenty/
│       ├── n8n/
│       ├── metabase/
│       └── mautic/
│
├── services/               # 마이크로서비스들
│   ├── sns-collector/      # SNS 데이터 수집
│   ├── email-tracker/      # 이메일 트래킹
│   └── lead-manager/       # 리드 처리
│
├── docker-compose.yml      # 모든 서비스 실행 설정
└── docs/                   # 문서들
```

---

## 🎨 다음 단계

### 커스텀 대시보드 개발 시작

```bash
cd apps/web-dashboard
pnpm install
pnpm dev
```

이제 http://localhost:3000에서 커스텀 대시보드를 볼 수 있습니다!

### 추천 개발 순서

1. **Week 1**: 통합 대시보드 UI 레이아웃
2. **Week 2**: Postiz 임베드 + SNS 통계 표시
3. **Week 3**: Twenty API 연동 + 리드 관리 UI
4. **Week 4**: n8n 워크플로우 구축 (자동화)
5. **Week 5**: Metabase 대시보드 임베드
6. **Week 6**: Mautic 이메일 캠페인 연동

---

## 🐛 문제 해결

### 서비스가 시작되지 않는 경우

```bash
# 로그 확인
docker-compose logs [서비스명]

# 예: Postiz 로그 확인
docker-compose logs postiz

# 모든 서비스 재시작
docker-compose restart
```

### 데이터베이스 연결 오류

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps postgres

# PostgreSQL 로그 확인
docker-compose logs postgres

# PostgreSQL 재시작
docker-compose restart postgres
```

### 포트 충돌 문제

이미 사용 중인 포트가 있다면 `docker-compose.yml`에서 포트 변경:

```yaml
services:
  postiz:
    ports:
      - "5001:3000"  # 5000 → 5001로 변경
```

---

## 📞 도움말

- **Documentation**: [docs/](./docs/)
- **Integration Guide**: [docs/INTEGRATION_STRATEGY.md](./docs/INTEGRATION_STRATEGY.md)
- **Issues**: GitHub Issues에 문제 등록

---

## ✅ 체크리스트

설정 완료 후 확인:

- [ ] Docker 컨테이너 모두 실행 중
- [ ] Postiz에서 계정 연결 완료
- [ ] Twenty CRM에서 리드 생성 가능
- [ ] n8n에서 워크플로우 생성 가능
- [ ] Metabase에서 대시보드 확인 가능
- [ ] Mautic에서 이메일 발송 가능
- [ ] `.env` 파일에 모든 API 키 입력 완료

모든 항목이 체크되면 개발 시작 준비 완료! 🎉

---

**Happy Coding!** 🚀
