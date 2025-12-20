# 🚀 KPI 트래커 시작 가이드

## ✅ 완료된 작업

### 1. 프로젝트 구조 ✅
```
233/
├── clones/                    # 오픈소스 참조용
│   ├── postiz-app/
│   ├── twenty/
│   ├── metabase/
│   ├── mautic/
│   └── n8n/
│
└── kpi-automation-platform/
    ├── kpi-tracker/           # 메인 프로젝트
    │   ├── app/              # Next.js 14 App Router
    │   ├── components/       # React 컴포넌트
    │   ├── lib/              # 유틸리티
    │   ├── prisma/           # ✅ DB 스키마 완성!
    │   ├── types/            # TypeScript 타입
    │   └── package.json      # ✅ 모든 패키지 정의
    │
    └── docs/                 # 문서
        ├── NEW_ARCHITECTURE.md     # 아키텍처 설계
        ├── TEAM_STRUCTURE.md       # 팀 구조
        ├── PERSON_A_GUIDE.md       # Person A 가이드
        ├── PERSON_B_GUIDE.md       # Person B 가이드
        └── PERSON_C_GUIDE.md       # Person C 가이드
```

### 2. 기술 스택 ✅
```yaml
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Prisma
Database: PostgreSQL (11개 모델 완성)
UI: shadcn/ui
Charts: Recharts + Tremor
```

### 3. 팀 역할 분담 ✅
- **Person A**: SNS & Email Module
- **Person B**: Lead & Deal Manager
- **Person C**: Analytics & Infrastructure

---

## 🎯 각자 시작하기

### 🔵 Person A: SNS & Email Module

#### 1. 가이드 읽기
```bash
cat kpi-automation-platform/docs/PERSON_A_GUIDE.md
```

#### 2. Week 1 작업 (대기)
Person C가 Prisma 스키마 완료할 때까지 대기
- 환경 변수 준비
- SNS API 키 발급 (LinkedIn, Facebook 등)
- 폴더 구조 확인

#### 3. Week 2부터 본격 시작
- PostEditor 컴포넌트 작성
- SNS API 연동

---

### 🟢 Person B: Lead & Deal Manager

#### 1. 가이드 읽기
```bash
cat kpi-automation-platform/docs/PERSON_B_GUIDE.md
```

#### 2. Week 1 작업 (대기)
Person C가 Prisma 스키마 완료할 때까지 대기
- Google Calendar OAuth 앱 등록
- 환경 변수 준비
- 폴더 구조 확인

#### 3. Week 2부터 본격 시작
- LeadForm 컴포넌트 작성
- Lead CRUD API 작성

---

### 🟣 Person C: Analytics & Infrastructure

#### 1. 가이드 읽기
```bash
cat kpi-automation-platform/docs/PERSON_C_GUIDE.md
```

#### 2. **즉시 시작 (Week 1 최우선!)** ⚡

```bash
cd kpi-automation-platform/kpi-tracker

# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집하여 DATABASE_URL 설정

# 3. Prisma 생성
pnpm db:generate

# 4. DB 푸시 (개발용)
pnpm db:push

# 5. 초기 데이터 생성
npx tsx prisma/seed.ts

# 6. shadcn/ui 설치
npx shadcn@latest init
npx shadcn@latest add button card input label select

# 7. 개발 서버 실행
pnpm dev
```

#### 3. Person A, B에게 알림
Person C가 Week 1 완료 후:
```
✅ Prisma 스키마 완료
✅ shadcn/ui 설치 완료
✅ 공통 컴포넌트 준비 완료

→ Person A, B 시작 가능!
```

---

## 📝 환경 변수 설정

### Person C (우선)
```.env.local
# Database (Supabase)
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-32-chars-min"

# Redis (선택 - Week 6에 필요)
REDIS_URL="redis://localhost:6379"
```

### Person A (Week 2부터 필요)
```.env.local
# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token

# Facebook
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret

# SendGrid
SENDGRID_API_KEY=your_api_key
```

### Person B (Week 2부터 필요)
```.env.local
# Google Calendar
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
GOOGLE_ACCESS_TOKEN=your_access_token
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

---

## 🔧 데이터베이스 셋업 (Person C)

### Option 1: Supabase (추천)

1. https://supabase.com 가입
2. "New project" 클릭
3. Project name: `kpi-tracker`
4. Database password 설정
5. Region: `Northeast Asia (Seoul)`
6. "Create new project" 클릭
7. Settings → Database → Connection string 복사
8. `.env.local`에 붙여넣기

### Option 2: 로컬 PostgreSQL

```bash
# Docker로 PostgreSQL 실행
docker run -d \
  --name kpi-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=kpi_tracker \
  -p 5432:5432 \
  postgres:15

# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/kpi_tracker"
```

---

## 📊 Prisma 스키마 구조

### 11개 모델
1. **User** - 사용자
2. **BusinessLine** - 비즈니스 라인 (외주/B2B/ANYON)
3. **Platform** - 플랫폼 (LinkedIn, Facebook, 등)
4. **Post** - SNS 포스트
5. **Video** - 영상
6. **EmailCampaign** - 이메일 캠페인
7. **LandingVisit** - 랜딩페이지 방문
8. **Lead** - 리드/문의
9. **Meeting** - 미팅
10. **Deal** - 거래
11. **Subscription** - 구독 (ANYON)

### 초기 데이터 (Seed)
- 3개 비즈니스 라인
- 13개 플랫폼
- 관리자 계정 (`admin@kpi-tracker.com` / `admin123`)

---

## 🗂️ Git 브랜치 전략

### 브랜치 구조
```
main (프로덕션)
  └── develop (개발 메인)
      ├── feature/sns-manager (Person A)
      ├── feature/email-module (Person A)
      ├── feature/lead-manager (Person B)
      ├── feature/deal-manager (Person B)
      ├── feature/analytics-dashboard (Person C)
      └── feature/landing-tracker (Person C)
```

### 작업 흐름
```bash
# 1. develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 2. 자기 기능 브랜치 생성
git checkout -b feature/sns-manager  # Person A 예시

# 3. 작업 후 커밋
git add .
git commit -m "feat: PostEditor 컴포넌트 작성"

# 4. 푸시
git push origin feature/sns-manager

# 5. GitHub에서 PR 생성
# develop 브랜치로 PR
```

---

## ✅ Week 1 체크리스트

### Person C (최우선!) 🟣
- [ ] `pnpm install` 완료
- [ ] Supabase 프로젝트 생성
- [ ] `.env.local` 설정
- [ ] `pnpm db:push` 성공
- [ ] `npx tsx prisma/seed.ts` 실행
- [ ] shadcn/ui 설치
- [ ] `pnpm dev` 실행 → http://localhost:3000 접속 가능
- [ ] Person A, B에게 "시작 가능" 알림

### Person A 🔵
- [ ] Person C 알림 대기
- [ ] LinkedIn API 앱 등록
- [ ] Facebook API 앱 등록
- [ ] SendGrid 계정 생성

### Person B 🟢
- [ ] Person C 알림 대기
- [ ] Google Cloud Console에서 OAuth 앱 등록
- [ ] Calendar API 활성화

---

## 🚨 자주 발생하는 문제

### 1. Prisma 생성 오류
```bash
# 해결: Prisma Client 재생성
pnpm db:generate
```

### 2. DB 연결 오류
```bash
# 해결: DATABASE_URL 확인
echo $DATABASE_URL

# Supabase 연결 문자열 형식:
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3. pnpm install 느림
```bash
# 해결: 캐시 삭제 후 재설치
pnpm store prune
pnpm install
```

---

## 📚 참고 문서

| 문서 | 용도 |
|------|------|
| [NEW_ARCHITECTURE.md](kpi-automation-platform/docs/NEW_ARCHITECTURE.md) | 전체 아키텍처 설계 |
| [TEAM_STRUCTURE.md](kpi-automation-platform/docs/TEAM_STRUCTURE.md) | 팀 구조 & 협업 방식 |
| [TEAM_ROLES_SUMMARY.md](TEAM_ROLES_SUMMARY.md) | 역할 분담 요약 |
| [PERSON_A_GUIDE.md](kpi-automation-platform/docs/PERSON_A_GUIDE.md) | Person A 상세 가이드 |
| [PERSON_B_GUIDE.md](kpi-automation-platform/docs/PERSON_B_GUIDE.md) | Person B 상세 가이드 |
| [PERSON_C_GUIDE.md](kpi-automation-platform/docs/PERSON_C_GUIDE.md) | Person C 상세 가이드 |

---

## 🎯 목표

**6주 후:**
- ✅ SNS 포스팅 자동화
- ✅ 리드 자동 생성
- ✅ 미팅 Google Calendar 동기화
- ✅ 실시간 대시보드
- ✅ 매출 3,000만원 목표 트래킹

---

## 📞 문의

- **일반**: Slack #kpi-tracker-general
- **기술**: Slack #kpi-tracker-dev
- **긴급**: Person C에게 DM

---

**Let's Build! 🚀**

**현재 상태**: ✅ 프로젝트 초기화 완료
**다음 단계**: Person C가 Week 1 작업 시작
