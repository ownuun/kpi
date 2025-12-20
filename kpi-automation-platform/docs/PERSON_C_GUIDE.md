# Person C 작업 가이드: Analytics & Infrastructure

## 🎯 담당 영역
- **Infrastructure**: Prisma 스키마, DB 마이그레이션, 공통 컴포넌트 (선행 작업)
- **Dashboard**: 통합 대시보드, 비즈니스 라인별 대시보드
- **Analytics**: 퍼널 분석, ROI 차트, 리포트
- **Landing Tracker**: UTM 생성기, 트래킹 스크립트
- **Automation**: BullMQ, Cron Jobs

---

## 📁 담당 파일 구조

```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx                ⭐ 통합 대시보드 (메인)
│   │   ├── layout.tsx              ⭐ 공통 레이아웃
│   │   │
│   │   ├── outsource/              ⭐ 외주 대시보드
│   │   │   └── page.tsx
│   │   ├── b2b/                    ⭐ B2B 대시보드
│   │   │   └── page.tsx
│   │   ├── anyon/                  ⭐ ANYON 대시보드
│   │   │   └── page.tsx
│   │   │
│   │   └── analytics/              ⭐ 분석 페이지
│   │       ├── page.tsx           # 분석 메인
│   │       ├── funnel/
│   │       │   └── page.tsx       # 퍼널 분석
│   │       ├── roi/
│   │       │   └── page.tsx       # ROI 분석
│   │       └── reports/
│   │           └── page.tsx       # 리포트
│   │
│   └── api/
│       ├── analytics/              ⭐ 분석 API
│       │   ├── funnel/
│       │   │   └── route.ts
│       │   ├── roi/
│       │   │   └── route.ts
│       │   └── metrics/
│       │       └── route.ts
│       │
│       ├── landing/                ⭐ 랜딩 트래킹 API
│       │   ├── track/
│       │   │   └── route.ts       # POST /api/landing/track
│       │   └── utm-generator/
│       │       └── route.ts       # GET /api/landing/utm-generator
│       │
│       └── cron/                   ⭐ Cron Jobs
│           ├── daily-summary/
│           │   └── route.ts       # 일일 요약
│           └── weekly-report/
│               └── route.ts       # 주간 리포트
│
├── components/
│   ├── ui/                         ⭐ shadcn/ui 컴포넌트 (공통)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── dashboard/                  ⭐ 대시보드 컴포넌트 (공통)
│   │   ├── MetricCard.tsx         # KPI 카드
│   │   ├── RevenueProgress.tsx    # 매출 진행 바
│   │   ├── FunnelChart.tsx        # 퍼널 차트
│   │   ├── ROIChart.tsx           # ROI 차트
│   │   └── BusinessLineSelector.tsx # 비즈니스 라인 선택
│   │
│   └── analytics/                  ⭐ 분석 컴포넌트
│       ├── ConversionFunnel.tsx   # 전환 퍼널
│       ├── PlatformComparison.tsx # 플랫폼 비교
│       └── TrendChart.tsx         # 트렌드 차트
│
├── prisma/
│   ├── schema.prisma               ⭐⭐⭐ DB 스키마 (독점!)
│   ├── migrations/
│   └── seed.ts                     ⭐ 초기 데이터
│
├── lib/
│   ├── db/
│   │   └── prisma.ts               ⭐ Prisma Client (공통)
│   │
│   ├── queue/                      ⭐ BullMQ 설정
│   │   ├── index.ts
│   │   ├── sns-queue.ts
│   │   └── email-queue.ts
│   │
│   ├── automation/
│   │   └── report-generator.ts    ⭐ 리포트 생성 로직
│   │
│   └── utils/                      ⭐ 유틸리티 (공통)
│       ├── date.ts
│       ├── format.ts
│       └── utm.ts
│
├── types/                          ⭐ TypeScript 타입 (공통)
│   ├── database.ts                # Prisma 타입
│   ├── api.ts                     # API 타입
│   └── analytics.ts               # 분석 타입
│
└── public/
    └── tracking.js                 ⭐ 랜딩페이지 트래킹 스크립트
```

---

## 🗓️ 개발 일정 (6주)

### Week 1: 인프라 구축 (선행 작업) ⚡
- [x] Prisma 스키마 작성 (11개 모델)
- [x] DB 마이그레이션
- [ ] shadcn/ui 설치
- [ ] 공통 UI 컴포넌트 (button, card, input 등)
- [ ] 공통 타입 정의
- [ ] Prisma Client 설정
- [ ] 기본 레이아웃 & 네비게이션

### Week 2: 통합 대시보드
- [ ] MetricCard 컴포넌트
- [ ] RevenueProgress 컴포넌트
- [ ] 통합 대시보드 페이지
- [ ] GET /api/analytics/metrics API
- [ ] 실시간 데이터 연동

### Week 3: 비즈니스 라인별 대시보드
- [ ] 외주 대시보드
- [ ] B2B 대시보드
- [ ] ANYON 대시보드
- [ ] 각 대시보드별 KPI 차트

### Week 4: 퍼널 분석
- [ ] ConversionFunnel 컴포넌트
- [ ] FunnelChart 컴포넌트
- [ ] GET /api/analytics/funnel API
- [ ] ROI 분석 페이지

### Week 5: Landing Tracker
- [ ] UTM 생성기 UI
- [ ] tracking.js 스크립트 작성
- [ ] POST /api/landing/track API
- [ ] 랜딩 유입 대시보드

### Week 6: 자동화 & 리포트
- [ ] BullMQ 설정
- [ ] Cron Jobs (일일/주간)
- [ ] 리포트 생성기
- [ ] Slack 알림 연동
- [ ] 최종 통합 테스트

---

## 📝 상세 작업 가이드

### 1. Prisma 스키마 작성 (Week 1, 최우선!)

Prisma 스키마는 이미 [NEW_ARCHITECTURE.md](NEW_ARCHITECTURE.md)에 정의되어 있습니다.

```bash
cd kpi-tracker
mkdir prisma
```

스키마 파일은 다음 섹션에서 작성합니다.

---

### 2. shadcn/ui 설치 (Week 1)

```bash
npx shadcn@latest init

# 프롬프트 응답:
# ✔ Would you like to use TypeScript? › yes
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Where is your global CSS file? › app/globals.css
# ✔ Would you like to use CSS variables for colors? › yes
# ✔ Where is your tailwind.config.js located? › tailwind.config.ts
# ✔ Configure the import alias for components: › @/components
# ✔ Configure the import alias for utils: › @/lib/utils
```

필수 컴포넌트 설치:
```bash
npx shadcn@latest add button card input label select textarea
npx shadcn@latest add dialog dropdown-menu tabs toast
npx shadcn@latest add table badge avatar
```

---

### 3. MetricCard 컴포넌트 (Week 2)

```tsx
// components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number; // 증감률 (%)
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple';
}

export default function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend === 'up' ? (
              <ArrowUpIcon className="inline h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="inline h-4 w-4 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {' '}지난주 대비
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 4. 통합 대시보드 페이지 (Week 2)

```tsx
// app/(dashboard)/page.tsx
import MetricCard from '@/components/dashboard/MetricCard';
import RevenueProgress from '@/components/dashboard/RevenueProgress';
import FunnelChart from '@/components/dashboard/FunnelChart';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

async function getDashboardData() {
  const res = await fetch('http://localhost:3000/api/analytics/metrics', {
    cache: 'no-store',
  });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="p-8 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">통합 대시보드</h1>
        <p className="text-muted-foreground">
          매출 3,000만원 달성을 위한 KPI 트래킹
        </p>
      </div>

      {/* 매출 진행 바 */}
      <RevenueProgress
        current={data.totalRevenue}
        goal={30000000}
        breakdown={data.revenueBreakdown}
      />

      {/* 주요 지표 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="이번 주 SNS 글"
          value={data.thisWeekPosts}
          change={data.postsChange}
          trend={data.postsChange > 0 ? 'up' : 'down'}
          icon={<TrendingUp className="h-4 w-4" />}
          color="blue"
        />
        <MetricCard
          title="이번 주 문의"
          value={data.thisWeekLeads}
          change={data.leadsChange}
          trend={data.leadsChange > 0 ? 'up' : 'down'}
          icon={<Users className="h-4 w-4" />}
          color="green"
        />
        <MetricCard
          title="이번 주 미팅"
          value={data.thisWeekMeetings}
          change={data.meetingsChange}
          trend={data.meetingsChange > 0 ? 'up' : 'down'}
          icon={<Calendar className="h-4 w-4" />}
          color="purple"
        />
        <MetricCard
          title="이번 주 거래"
          value={data.thisWeekDeals}
          change={data.dealsChange}
          trend={data.dealsChange > 0 ? 'up' : 'down'}
          icon={<DollarSign className="h-4 w-4" />}
          color="green"
        />
      </div>

      {/* 퍼널 차트 */}
      <FunnelChart data={data.funnelData} />

      {/* 비즈니스 라인별 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-outsource">외주</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.revenueBreakdown.outsource / 10000).toFixed(0)}만원
            </div>
            <p className="text-sm text-muted-foreground">
              목표: 1,000만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-b2b">B2B</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.revenueBreakdown.b2b / 10000).toFixed(0)}만원
            </div>
            <p className="text-sm text-muted-foreground">
              목표: 1,000만원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-anyon">ANYON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.revenueBreakdown.anyon / 10000).toFixed(0)}만원
            </div>
            <p className="text-sm text-muted-foreground">
              목표: 1,000만원
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

### 5. Analytics API (Week 2)

```typescript
// app/api/analytics/metrics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { subWeeks, startOfWeek, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = endOfWeek(now);
    const lastWeekStart = startOfWeek(subWeeks(now, 1));
    const lastWeekEnd = endOfWeek(subWeeks(now, 1));

    // 이번 주 SNS 글
    const thisWeekPosts = await prisma.post.count({
      where: {
        createdAt: { gte: thisWeekStart, lte: thisWeekEnd },
      },
    });

    const lastWeekPosts = await prisma.post.count({
      where: {
        createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    // 이번 주 문의
    const thisWeekLeads = await prisma.lead.count({
      where: {
        createdAt: { gte: thisWeekStart, lte: thisWeekEnd },
      },
    });

    const lastWeekLeads = await prisma.lead.count({
      where: {
        createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    // 이번 주 미팅
    const thisWeekMeetings = await prisma.meeting.count({
      where: {
        scheduledAt: { gte: thisWeekStart, lte: thisWeekEnd },
      },
    });

    const lastWeekMeetings = await prisma.meeting.count({
      where: {
        scheduledAt: { gte: lastWeekStart, lte: lastWeekEnd },
      },
    });

    // 이번 주 거래
    const thisWeekDeals = await prisma.deal.count({
      where: {
        createdAt: { gte: thisWeekStart, lte: thisWeekEnd },
        status: 'WON',
      },
    });

    const lastWeekDeals = await prisma.deal.count({
      where: {
        createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
        status: 'WON',
      },
    });

    // 총 매출 (실제 입금된 금액)
    const totalRevenue = await prisma.deal.aggregate({
      _sum: { paidAmount: true },
      where: { status: 'PAID' },
    });

    // 비즈니스 라인별 매출
    const businessLines = await prisma.businessLine.findMany();
    const revenueBreakdown: any = {};

    for (const bl of businessLines) {
      const revenue = await prisma.deal.aggregate({
        _sum: { paidAmount: true },
        where: {
          businessLineId: bl.id,
          status: 'PAID',
        },
      });
      revenueBreakdown[bl.name.toLowerCase()] = revenue._sum.paidAmount || 0;
    }

    // 퍼널 데이터
    const totalPosts = await prisma.post.count();
    const totalLandingVisits = await prisma.landingVisit.count();
    const totalLeads = await prisma.lead.count();
    const totalMeetings = await prisma.meeting.count();
    const totalWonDeals = await prisma.deal.count({ where: { status: 'WON' } });

    return NextResponse.json({
      thisWeekPosts,
      postsChange: calculateChange(thisWeekPosts, lastWeekPosts),
      thisWeekLeads,
      leadsChange: calculateChange(thisWeekLeads, lastWeekLeads),
      thisWeekMeetings,
      meetingsChange: calculateChange(thisWeekMeetings, lastWeekMeetings),
      thisWeekDeals,
      dealsChange: calculateChange(thisWeekDeals, lastWeekDeals),
      totalRevenue: totalRevenue._sum.paidAmount || 0,
      revenueBreakdown,
      funnelData: {
        posts: totalPosts,
        landingVisits: totalLandingVisits,
        leads: totalLeads,
        meetings: totalMeetings,
        deals: totalWonDeals,
      },
    });
  } catch (error) {
    console.error('Analytics 조회 오류:', error);
    return NextResponse.json({ error: 'Analytics 조회 실패' }, { status: 500 });
  }
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
```

---

### 6. Landing Tracker (Week 5)

#### tracking.js 스크립트
```javascript
// public/tracking.js
(function() {
  'use strict';

  // UTM 파라미터 파싱
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
    };
  }

  // 방문 기록
  function trackVisit() {
    const utm = getUTMParams();

    // UTM이 없으면 기록 안 함
    if (!utm.utm_source && !utm.utm_medium) return;

    fetch('/api/landing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...utm,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Tracking failed:', err));
  }

  // 페이지 로드 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisit);
  } else {
    trackVisit();
  }

  // 폼 제출 이벤트 트래킹
  window.trackFormSubmit = function(formData) {
    const utm = getUTMParams();

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        source: utm.utm_source,
        medium: utm.utm_medium,
        campaign: utm.utm_campaign,
      }),
    });
  };
})();
```

#### 트래킹 API
```typescript
// app/api/landing/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 비즈니스 라인 식별 (URL 기반)
    const referrer = body.referrer || '';
    let businessLineId = null;

    if (referrer.includes('outsource')) {
      businessLineId = 'outsource-id'; // 실제 ID로 변경
    } else if (referrer.includes('b2b')) {
      businessLineId = 'b2b-id';
    } else if (referrer.includes('anyon')) {
      businessLineId = 'anyon-id';
    }

    // 플랫폼 식별 (UTM source 기반)
    let platformId = null;
    if (body.utm_source) {
      const platform = await prisma.platform.findFirst({
        where: { name: { contains: body.utm_source, mode: 'insensitive' } },
      });
      platformId = platform?.id;
    }

    // 방문 기록
    await prisma.landingVisit.create({
      data: {
        businessLineId,
        platformId,
        utmSource: body.utm_source,
        utmMedium: body.utm_medium,
        utmCampaign: body.utm_campaign,
        utmContent: body.utm_content,
        ipAddress: request.headers.get('x-forwarded-for') || request.ip,
        userAgent: body.userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking 오류:', error);
    return NextResponse.json({ error: 'Tracking 실패' }, { status: 500 });
  }
}
```

---

### 7. BullMQ 자동화 (Week 6)

```typescript
// lib/queue/index.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// SNS 데이터 수집 큐
export const snsQueue = new Queue('sns-collection', { connection });

// Worker
new Worker(
  'sns-collection',
  async (job) => {
    console.log(`Processing job ${job.id}`);
    // SNS 데이터 수집 로직 (Person A가 작성)
  },
  { connection }
);

// 매일 자정에 작업 추가
export async function scheduleSNSCollection() {
  await snsQueue.add(
    'daily-collection',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', // 매일 자정
      },
    }
  );
}
```

---

## 🔧 로컬 개발 환경 설정

### 1. 환경 변수
```.env.local
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kpi_tracker"

# Redis (Upstash or local)
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Slack (알림용)
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

### 2. Supabase 셋업

1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. `.env.local`에 `DATABASE_URL` 설정

### 3. Redis 셋업 (로컬 개발)

```bash
# Docker로 Redis 실행
docker run -d -p 6379:6379 redis:alpine
```

또는 Upstash 사용 (무료):
1. https://upstash.com 가입
2. Redis 데이터베이스 생성
3. Connection string 복사

---

## ✅ 체크리스트

### Week 1 (최우선!)
- [ ] Prisma 스키마 작성
- [ ] `pnpm db:push` 실행
- [ ] shadcn/ui 설치
- [ ] 공통 UI 컴포넌트 설치
- [ ] 공통 타입 정의
- [ ] Person A, B에게 알림 (시작 가능)

### Week 2
- [ ] MetricCard 컴포넌트 완성
- [ ] RevenueProgress 컴포넌트 완성
- [ ] GET /api/analytics/metrics 작동
- [ ] 통합 대시보드 페이지 완성

### Week 3
- [ ] 외주/B2B/ANYON 대시보드 완성
- [ ] 각 대시보드별 KPI 표시

### Week 4
- [ ] FunnelChart 컴포넌트 완성
- [ ] GET /api/analytics/funnel 작동
- [ ] ROI 분석 페이지 완성

### Week 5
- [ ] tracking.js 스크립트 완성
- [ ] POST /api/landing/track 작동
- [ ] UTM 생성기 UI 완성

### Week 6
- [ ] BullMQ 설정 완료
- [ ] Cron Jobs 작동
- [ ] 리포트 생성기 완성
- [ ] 전체 통합 테스트

---

## 🚨 주의사항

1. **Week 1 우선 완료 필수**: Person A, B가 대기 중
2. **schema.prisma 독점 관리**: 다른 사람이 수정하면 충돌 발생
3. **공통 컴포넌트 먼저**: Person A, B가 사용할 컴포넌트 우선 작성

---

## 📚 참고할 오픈소스 코드

### Metabase (분석 쿼리)
```
clones/metabase/
└── src/
    └── metabase/
        └── query_processor/  ⭐ 퍼널 분석 쿼리 참조
```

### n8n (BullMQ)
```
clones/n8n/
└── packages/
    └── cli/
        └── src/
            └── Queue.ts      ⭐ BullMQ 설정 참조
```

---

**담당자**: Person C
**예상 기간**: 6주
**중요도**: ⭐⭐⭐ (다른 팀원이 의존)
**문의**: Person A, B에게 공통 컴포넌트 요청 받기
