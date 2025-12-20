# 새로운 KPI 자동화 시스템 아키텍처

## 🎯 설계 철학

### 핵심 원칙
1. **"작업 = 트래킹"**: 모든 작업이 자동으로 KPI로 기록됨
2. **자동화 우선**: API 연동 가능한 모든 것은 자동화
3. **모노리틱 + 모듈화**: 빠른 개발을 위한 모노리틱, 향후 분리 가능한 모듈 구조
4. **오픈소스 참조**: 클론한 오픈소스의 좋은 패턴만 선택적으로 활용

---

## 🏗️ 기술 스택 (최종 확정)

```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Language: TypeScript
  Styling: Tailwind CSS + shadcn/ui
  State: Zustand (글로벌) + React Query (서버 상태)
  Forms: React Hook Form + Zod
  Charts: Recharts + Tremor

Backend:
  API: Next.js API Routes + Server Actions
  Validation: Zod
  Authentication: NextAuth.js (Credentials + OAuth)

Database:
  Primary: PostgreSQL (Supabase)
  ORM: Prisma
  Migration: Prisma Migrate
  Cache: Redis (Upstash)

Automation:
  Scheduler: Vercel Cron + BullMQ
  Workflows: Custom (TypeScript)
  Queue: BullMQ + Redis

External APIs:
  SNS: LinkedIn, Facebook, Instagram, YouTube, TikTok, Threads, Reddit
  Email: SendGrid
  Calendar: Google Calendar API
  Analytics: Custom tracking script

Deployment:
  Platform: Vercel
  Database: Supabase (PostgreSQL)
  Redis: Upstash
  Storage: Supabase Storage (for media)

DevOps:
  Version Control: Git
  CI/CD: Vercel (automatic)
  Monitoring: Sentry (errors) + Vercel Analytics
```

---

## 📐 새로운 프로젝트 구조

```
kpi-tracker/                          # 새 프로젝트 이름
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # 인증 관련 페이지
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/              # 대시보드 (인증 필요)
│   │   │   ├── layout.tsx           # 공통 레이아웃
│   │   │   ├── page.tsx             # 통합 대시보드
│   │   │   │
│   │   │   ├── outsource/           # 외주 대시보드
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── b2b/                 # B2B 대시보드
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── anyon/               # ANYON 대시보드
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── sns/                 # SNS Manager
│   │   │   │   ├── page.tsx         # 글 목록
│   │   │   │   ├── create/          # 글 작성
│   │   │   │   └── analytics/       # SNS 분석
│   │   │   │
│   │   │   ├── leads/               # Lead Manager
│   │   │   │   ├── page.tsx         # 리드 목록
│   │   │   │   ├── [id]/            # 리드 상세
│   │   │   │   └── pipeline/        # 파이프라인 뷰
│   │   │   │
│   │   │   ├── deals/               # Deal Manager
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │
│   │   │   ├── email/               # Email Module
│   │   │   │   ├── campaigns/
│   │   │   │   ├── templates/
│   │   │   │   └── analytics/
│   │   │   │
│   │   │   └── analytics/           # Analytics Engine
│   │   │       ├── funnel/
│   │   │       ├── roi/
│   │   │       └── reports/
│   │   │
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/
│   │   │   ├── sns/
│   │   │   ├── leads/
│   │   │   ├── deals/
│   │   │   ├── email/
│   │   │   ├── landing/
│   │   │   ├── webhooks/
│   │   │   └── cron/
│   │   │
│   │   └── tracking/                # 트래킹 스크립트 엔드포인트
│   │       └── script.js/route.ts
│   │
│   ├── components/                   # React 컴포넌트
│   │   ├── ui/                      # shadcn/ui 컴포넌트
│   │   ├── dashboard/               # 대시보드 컴포넌트
│   │   │   ├── MetricCard.tsx
│   │   │   ├── FunnelChart.tsx
│   │   │   └── RevenueProgress.tsx
│   │   │
│   │   ├── sns/                     # SNS 관련 컴포넌트
│   │   │   ├── PostEditor.tsx
│   │   │   ├── PlatformSelector.tsx
│   │   │   └── PostAnalytics.tsx
│   │   │
│   │   ├── leads/                   # Lead 관련 컴포넌트
│   │   │   ├── LeadCard.tsx
│   │   │   ├── PipelineBoard.tsx
│   │   │   └── LeadForm.tsx
│   │   │
│   │   └── email/                   # Email 관련 컴포넌트
│   │       ├── EmailEditor.tsx
│   │       └── CampaignStats.tsx
│   │
│   ├── lib/                         # 유틸리티 & 라이브러리
│   │   ├── db/
│   │   │   └── prisma.ts           # Prisma client
│   │   │
│   │   ├── integrations/           # 외부 API 클라이언트
│   │   │   ├── linkedin.ts
│   │   │   ├── facebook.ts
│   │   │   ├── youtube.ts
│   │   │   ├── sendgrid.ts
│   │   │   └── google-calendar.ts
│   │   │
│   │   ├── automation/             # 자동화 로직
│   │   │   ├── sns-collector.ts   # SNS 데이터 수집
│   │   │   ├── lead-processor.ts  # 리드 처리
│   │   │   └── report-generator.ts
│   │   │
│   │   ├── queue/                  # BullMQ 작업 큐
│   │   │   ├── sns-queue.ts
│   │   │   └── email-queue.ts
│   │   │
│   │   └── utils/                  # 헬퍼 함수
│   │       ├── date.ts
│   │       ├── format.ts
│   │       └── utm.ts
│   │
│   ├── types/                       # TypeScript 타입
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── integrations.ts
│   │
│   └── stores/                      # Zustand 스토어
│       ├── auth.ts
│       └── dashboard.ts
│
├── prisma/
│   ├── schema.prisma               # DB 스키마
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   └── tracking.js                 # 랜딩페이지 트래킹 스크립트
│
├── scripts/                         # 유틸리티 스크립트
│   ├── setup-db.ts
│   └── seed-data.ts
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ 데이터베이스 스키마 (Prisma)

### 핵심 모델

```prisma
// Users & Auth
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  leads     Lead[]
  deals     Deal[]
}

enum Role {
  ADMIN
  MEMBER
}

// Business Lines
model BusinessLine {
  id          String   @id @default(cuid())
  name        String   @unique // "외주", "B2B", "ANYON"
  description String?
  landingUrl  String?
  revenueGoal Int      @default(10000000) // 1,000만원

  posts          Post[]
  videos         Video[]
  emails         Email[]
  landingVisits  LandingVisit[]
  leads          Lead[]
  deals          Deal[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Platforms
model Platform {
  id     String       @id @default(cuid())
  name   String       @unique
  type   PlatformType
  hasApi Boolean      @default(false)
  icon   String?

  posts         Post[]
  videos        Video[]
  landingVisits LandingVisit[]

  createdAt DateTime @default(now())
}

enum PlatformType {
  SNS
  EMAIL
  MARKETPLACE
  OTHER
}

// SNS Posts
model Post {
  id             String       @id @default(cuid())
  platformId     String
  platform       Platform     @relation(fields: [platformId], references: [id])
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])

  content        String       @db.Text
  externalId     String?      // 외부 플랫폼의 포스트 ID
  publishedAt    DateTime?
  scheduledAt    DateTime?

  // Analytics
  views          Int          @default(0)
  likes          Int          @default(0)
  comments       Int          @default(0)
  shares         Int          @default(0)
  lastSyncedAt   DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([platformId])
  @@index([businessLineId])
  @@index([publishedAt])
}

// Videos
model Video {
  id             String       @id @default(cuid())
  platformId     String
  platform       Platform     @relation(fields: [platformId], references: [id])
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])

  title          String
  description    String?      @db.Text
  url            String
  thumbnailUrl   String?
  externalId     String?

  views          Int          @default(0)
  likes          Int          @default(0)
  comments       Int          @default(0)

  publishedAt    DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([platformId])
  @@index([businessLineId])
}

// Email Campaigns
model EmailCampaign {
  id             String       @id @default(cuid())
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id], name: "EmailCampaigns")

  name           String
  subject        String
  content        String       @db.Text

  sentCount      Int          @default(0)
  openCount      Int          @default(0)
  clickCount     Int          @default(0)
  replyCount     Int          @default(0)

  sentAt         DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([businessLineId])
}

// Landing Page Visits
model LandingVisit {
  id             String       @id @default(cuid())
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])
  platformId     String?
  platform       Platform?    @relation(fields: [platformId], references: [id])

  utmSource      String?
  utmMedium      String?
  utmCampaign    String?
  utmContent     String?

  ipAddress      String?
  userAgent      String?

  visitedAt      DateTime     @default(now())

  @@index([businessLineId])
  @@index([platformId])
  @@index([visitedAt])
}

// Leads
model Lead {
  id             String       @id @default(cuid())
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])
  userId         String?
  user           User?        @relation(fields: [userId], references: [id])

  // Contact Info
  name           String
  email          String
  phone          String?
  company        String?
  industry       String?

  // Source
  source         String?      // UTM source
  medium         String?      // UTM medium
  campaign       String?      // UTM campaign

  // Status
  status         LeadStatus   @default(NEW)

  // Notes
  notes          String?      @db.Text

  meetings       Meeting[]
  deals          Deal[]

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([businessLineId])
  @@index([status])
  @@index([createdAt])
}

enum LeadStatus {
  NEW
  CONTACTED
  MEETING_SCHEDULED
  MEETING_COMPLETED
  PROPOSAL_SENT
  NEGOTIATING
  WON
  LOST
}

// Meetings
model Meeting {
  id                    String    @id @default(cuid())
  leadId                String
  lead                  Lead      @relation(fields: [leadId], references: [id])

  title                 String
  scheduledAt           DateTime
  duration              Int       @default(60) // minutes
  location              String?
  notes                 String?   @db.Text

  googleCalendarEventId String?   @unique

  completed             Boolean   @default(false)
  completedAt           DateTime?

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([leadId])
  @@index([scheduledAt])
}

// Deals
model Deal {
  id             String       @id @default(cuid())
  leadId         String
  lead           Lead         @relation(fields: [leadId], references: [id])
  businessLineId String
  businessLine   BusinessLine @relation(fields: [businessLineId], references: [id])
  userId         String?
  user           User?        @relation(fields: [userId], references: [id])

  title          String
  amount         Int          // 금액 (원)
  probability    Int          @default(50) // 성사 확률 (%)

  status         DealStatus   @default(PROPOSAL)

  contractedAt   DateTime?
  expectedCloseAt DateTime?

  // Payment
  paidAmount     Int          @default(0)
  paidAt         DateTime?

  notes          String?      @db.Text

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([leadId])
  @@index([businessLineId])
  @@index([status])
}

enum DealStatus {
  PROPOSAL
  NEGOTIATING
  WON
  LOST
  PAID
}

// Subscriptions (ANYON B2C)
model Subscription {
  id          String             @id @default(cuid())
  userEmail   String
  plan        SubscriptionPlan
  status      SubscriptionStatus @default(ACTIVE)

  amount      Int                // 월 구독료
  startedAt   DateTime           @default(now())
  canceledAt  DateTime?

  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  @@index([userEmail])
  @@index([status])
}

enum SubscriptionPlan {
  BASIC
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  EXPIRED
}
```

---

## 🔄 데이터 플로우

### 1. SNS 포스팅 플로우
```
[사용자]
  ↓ 글 작성 (PostEditor 컴포넌트)
  ↓ 플랫폼 선택 (LinkedIn, Facebook, etc.)
  ↓
[Next.js API] /api/sns/posts
  ↓ 1. DB에 저장 (Post 레코드)
  ↓ 2. BullMQ 큐에 작업 추가
  ↓
[BullMQ Worker]
  ↓ LinkedIn API 호출
  ↓ Facebook API 호출
  ↓ 발행 결과 업데이트
  ↓
[Cron Job] (매일 자정)
  ↓ 각 플랫폼 API에서 통계 수집
  ↓ Post 레코드 업데이트 (views, likes, etc.)
```

### 2. 리드 생성 플로우
```
[랜딩페이지]
  ↓ 사용자가 폼 제출
  ↓ tracking.js가 UTM 파라미터 포함하여 전송
  ↓
[Next.js API] /api/leads/create
  ↓ 1. Lead 레코드 생성
  ↓ 2. LandingVisit 기록
  ↓ 3. Slack 알림 발송
  ↓
[Dashboard]
  ↓ 실시간으로 새 리드 표시
  ↓ 파이프라인 보드에 추가
```

### 3. 미팅 동기화 플로우
```
[Google Calendar]
  ↓ 이벤트 생성
  ↓ Webhook → /api/webhooks/google-calendar
  ↓
[Next.js API]
  ↓ Lead와 연결
  ↓ Meeting 레코드 생성
  ↓ 통계 업데이트
  ↓
[Dashboard]
  ↓ 미팅 횟수 자동 반영
```

---

## 🎨 UI/UX 설계 원칙

### 1. 대시보드 레이아웃
```
┌──────────────────────────────────────────────────────────┐
│  [로고]  외주 │ B2B │ ANYON │ 통합 │ SNS │ 리드 │ 거래  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  총 매출 현황                        목표: 3,000만원     │
│  ██████████░░░░░░░░░░░░  1,200만원 (40%)                 │
│                                                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │ 이번 주    │ │ 이번 주    │ │ 이번 주    │           │
│  │ SNS 글     │ │ 문의       │ │ 미팅       │           │
│  │   12건     │ │   5건      │ │   3건      │           │
│  └────────────┘ └────────────┘ └────────────┘           │
│                                                           │
│  퍼널 분석                                                │
│  홍보 → 유입 → 문의 → 미팅 → 계약                       │
│   500   75     15     8      3                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 2. 색상 시스템
- **외주**: Blue (#3B82F6)
- **B2B**: Green (#10B981)
- **ANYON**: Purple (#8B5CF6)

---

## 🔌 클론 오픈소스 활용 전략

### Postiz에서 가져올 것
```
clones/postiz-app/packages/
  ├── editor/         → SNS 글 작성 에디터 로직
  ├── social/         → 각 플랫폼 API 연동 코드
  └── scheduler/      → 예약 발행 로직
```

**활용 방법:**
- 에디터 컴포넌트 참조하여 우리 PostEditor 구현
- LinkedIn, Facebook API 클라이언트 코드 참조

### Twenty에서 가져올 것
```
clones/twenty/packages/
  ├── ui/            → Kanban 보드 컴포넌트
  └── server/        → GraphQL 스키마 구조 참조
```

**활용 방법:**
- 파이프라인 보드 UI 참조
- Lead 상태 관리 로직 참조

### n8n에서 가져올 것
```
clones/n8n/packages/
  ├── workflow/      → 워크플로우 실행 엔진
  └── nodes/         → 각종 통합 노드 (Gmail, Calendar 등)
```

**활용 방법:**
- BullMQ 작업 정의 시 참조
- Google Calendar 연동 코드 참조

---

## 📅 개발 순서

### Week 1: 프로젝트 초기화
- [ ] Next.js 14 프로젝트 생성
- [ ] Prisma 스키마 작성 & 마이그레이션
- [ ] shadcn/ui 컴포넌트 설치
- [ ] 기본 레이아웃 & 인증

### Week 2: SNS Manager
- [ ] PostEditor 컴포넌트 (Postiz 참조)
- [ ] LinkedIn API 연동
- [ ] Facebook API 연동
- [ ] 포스트 목록 & 분석

### Week 3: Lead Manager
- [ ] Lead 폼 & 생성 API
- [ ] 파이프라인 보드 (Twenty 참조)
- [ ] Google Calendar 연동

### Week 4: Deal & Analytics
- [ ] Deal 관리 UI
- [ ] 대시보드 차트
- [ ] 퍼널 분석

### Week 5-6: Email & 자동화
- [ ] SendGrid 연동
- [ ] BullMQ 자동화 작업
- [ ] Cron jobs

---

**다음 단계: Next.js 프로젝트 초기화** ✨
