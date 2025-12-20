# KPI Tracker - 자동화 트래킹 시스템

매출 3,000만원 달성을 위한 3개 비즈니스 라인의 전체 퍼널 KPI 자동 트래킹 시스템

## 🎯 프로젝트 개요

### 비즈니스 라인
- **외주** (아웃소싱 서비스) - 목표: 1,000만원
- **B2B** (컨설팅 기업 대상) - 목표: 1,000만원
- **ANYON B2C** (프로덕트) - 목표: 1,000만원

### 핵심 원칙
- **"작업 = 트래킹"**: 플랫폼에서 작업하면 자동으로 KPI 집계
- **자동화 우선**: API 연동 가능한 모든 것은 자동화
- **모듈화 설계**: 독립적인 모듈로 구성하여 향후 확장 용이

## 🏗️ 기술 스택

```yaml
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Next.js API Routes + Server Actions
Database: PostgreSQL (Supabase) + Prisma ORM
State: Zustand + React Query
Forms: React Hook Form + Zod
Charts: Recharts + Tremor
Auth: NextAuth.js
```

## 📁 프로젝트 구조

```
kpi-tracker/
├── app/                  # Next.js App Router
│   ├── (auth)/          # 인증 페이지
│   ├── (dashboard)/     # 대시보드 (인증 필요)
│   │   ├── outsource/   # 외주 대시보드
│   │   ├── b2b/         # B2B 대시보드
│   │   ├── anyon/       # ANYON 대시보드
│   │   ├── sns/         # SNS Manager
│   │   ├── leads/       # Lead Manager
│   │   ├── deals/       # Deal Manager
│   │   ├── email/       # Email Module
│   │   └── analytics/   # Analytics Engine
│   └── api/             # API Routes
│
├── components/           # React 컴포넌트
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── dashboard/       # 대시보드 컴포넌트
│   ├── sns/             # SNS 컴포넌트
│   ├── leads/           # Lead 컴포넌트
│   └── email/           # Email 컴포넌트
│
├── lib/                  # 유틸리티 & 라이브러리
│   ├── db/              # Prisma client
│   ├── integrations/    # 외부 API 클라이언트
│   ├── automation/      # 자동화 로직
│   └── utils/           # 헬퍼 함수
│
├── prisma/               # Database
│   └── schema.prisma    # DB 스키마
│
├── types/                # TypeScript 타입
└── stores/               # Zustand 스토어
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
```.env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Social Media APIs
LINKEDIN_CLIENT_ID=...
FACEBOOK_APP_ID=...
YOUTUBE_API_KEY=...

# Email
SENDGRID_API_KEY=...

# Calendar
GOOGLE_CALENDAR_CLIENT_ID=...
```

### 3. 데이터베이스 설정
```bash
pnpm db:generate
pnpm db:push
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

http://localhost:3000 접속

## 📊 주요 기능

### 1. SNS Manager
- 17개 플랫폼 동시 포스팅
- 자동 통계 수집 (조회수, 좋아요, 댓글)
- 영상 업로드 자동화

### 2. Lead Manager
- 랜딩폼 → 자동 리드 생성
- 파이프라인 보드
- Google Calendar 미팅 동기화

### 3. Deal Manager
- 거래 금액 관리
- 입금 추적
- 구독 관리 (ANYON B2C)

### 4. Email Module
- SendGrid 대량 발송
- 오픈율/클릭율 트래킹
- 템플릿 관리

### 5. Analytics Engine
- 비즈니스 라인별 매출 현황
- 퍼널 분석
- 플랫폼별 ROI 분석

## 🔄 자동화 워크플로우

### SNS 데이터 수집
```
매일 자정 → 각 플랫폼 API 호출 → 통계 업데이트
```

### 리드 생성
```
랜딩폼 제출 → Lead 자동 생성 → Slack 알림
```

### 미팅 동기화
```
Google Calendar 이벤트 → Meeting 기록 → 통계 업데이트
```

## 📚 참고 문서

- [아키텍처 설계](../docs/NEW_ARCHITECTURE.md)
- [통합 전략](../docs/INTEGRATION_STRATEGY.md)
- [프로젝트 요약](../../PROJECT_SUMMARY.md)

## 🛠️ 개발 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # ESLint 실행

pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # DB 스키마 푸시 (개발용)
pnpm db:migrate   # DB 마이그레이션
pnpm db:studio    # Prisma Studio 실행
```

## 📅 개발 로드맵

- [x] 프로젝트 초기화
- [ ] Prisma 스키마 작성
- [ ] 기본 UI 컴포넌트
- [ ] SNS Manager 구현
- [ ] Lead Manager 구현
- [ ] Analytics Dashboard 구현
- [ ] 자동화 워크플로우 구축

---

**현재 상태**: 프로젝트 초기화 완료 ✅
**다음 단계**: Prisma 스키마 작성 및 DB 셋업
