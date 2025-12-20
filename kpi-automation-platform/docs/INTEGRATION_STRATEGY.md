# 오픈소스 통합 전략

## 개요

우리 프로젝트는 검증된 오픈소스를 활용하여 빠르게 구축하는 전략을 사용합니다. 각 오픈소스의 강점을 활용하면서도, 우리만의 커스텀 로직을 추가할 수 있도록 설계합니다.

---

## 🏗️ 아키텍처 패턴

### 1. Hybrid Architecture (하이브리드 아키텍처)

```
┌─────────────────────────────────────────────────────────────┐
│              Custom Frontend (Next.js)                      │
│     통합 대시보드 + 커스텀 비즈니스 로직 + UI               │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
│ Open Source  │  │ Open Source  │  │   Custom    │
│  (Embedded)  │  │ (API Only)   │  │  Services   │
│              │  │              │  │             │
│ - Postiz UI  │  │ - Twenty API │  │ - Analytics │
│ - Metabase   │  │ - n8n API    │  │ - Tracking  │
└──────────────┘  └──────────────┘  └─────────────┘
                          │
                ┌─────────▼──────────┐
                │   PostgreSQL       │
                │  (Unified Schema)  │
                └────────────────────┘
```

### 2. 통합 방식별 전략

#### A. Full Embedding (완전 임베드)
**적용 대상**: Postiz, Metabase
**이유**: UI가 우수하고, 독립 실행이 가능
**방법**: iframe 또는 reverse proxy로 임베드

```typescript
// apps/web-dashboard/components/PostizEmbed.tsx
export function PostizEmbed() {
  return (
    <iframe
      src="http://localhost:5000"
      className="w-full h-screen"
      title="SNS Manager"
    />
  );
}
```

#### B. API-Only Integration (API만 사용)
**적용 대상**: Twenty CRM, n8n
**이유**: 데이터는 필요하지만 UI는 커스텀
**방법**: REST API 또는 GraphQL로 연동

```typescript
// packages/integrations/twenty/client.ts
import { TwentyClient } from '@twenty/sdk';

export class TwentyIntegration {
  private client: TwentyClient;

  async createLead(data: LeadInput) {
    return this.client.leads.create(data);
  }

  async getLeadsByStage(stage: string) {
    return this.client.leads.findMany({
      where: { stage }
    });
  }
}
```

#### C. Hybrid Approach (하이브리드)
**적용 대상**: Mautic
**이유**: 이메일 에디터는 사용하되, 캠페인 목록은 커스텀
**방법**: 필요한 페이지만 임베드 + API 연동

---

## 📦 모듈별 통합 상세

### 1. Postiz (SNS Management)

#### 통합 방식
```
Custom UI ──(iframe)──> Postiz UI
     │
     └──(API)──> Postiz Backend ──> Social APIs
```

#### 구현 계획
1. **포스팅**: Postiz UI 임베드하여 사용
2. **데이터 수집**: Postiz API로 통계 가져오기
3. **자동화**: n8n에서 Postiz API 호출

#### API 활용 예시
```typescript
// services/sns-collector/postiz-collector.ts
import axios from 'axios';

export class PostizCollector {
  async collectDailyStats() {
    const posts = await axios.get(
      'http://localhost:5000/api/posts',
      { headers: { 'Authorization': `Bearer ${POSTIZ_API_KEY}` }}
    );

    // 각 포스트의 통계 수집
    for (const post of posts.data) {
      const stats = await axios.get(
        `http://localhost:5000/api/posts/${post.id}/analytics`
      );

      // 우리 DB에 저장
      await db.snsMetrics.create({
        platform: post.platform,
        views: stats.data.views,
        likes: stats.data.likes,
        comments: stats.data.comments,
        businessLine: post.tags.businessLine
      });
    }
  }
}
```

---

### 2. Twenty CRM (Lead & Deal Management)

#### 통합 방식
```
Custom Lead UI ──(GraphQL)──> Twenty API ──> Twenty DB
     │
     └──(Webhook)──> Twenty Events
```

#### 구현 계획
1. **리드 생성**: 랜딩폼 제출 시 Twenty API로 자동 생성
2. **파이프라인**: Twenty의 Kanban 뷰 사용 or 커스텀 UI
3. **자동화**: Twenty Webhook으로 이벤트 수신

#### GraphQL 활용 예시
```typescript
// packages/integrations/twenty/queries.ts
import { gql } from 'graphql-request';

export const CREATE_LEAD = gql`
  mutation CreateLead($input: LeadInput!) {
    createLead(input: $input) {
      id
      name
      email
      source
      stage
    }
  }
`;

export const GET_LEADS_BY_STAGE = gql`
  query GetLeadsByStage($stage: String!) {
    leads(where: { stage: { equals: $stage } }) {
      id
      name
      email
      createdAt
    }
  }
`;

// services/lead-manager/twenty-service.ts
export class TwentyLeadService {
  async createLeadFromLanding(formData: any) {
    const lead = await this.graphqlClient.request(CREATE_LEAD, {
      input: {
        name: formData.name,
        email: formData.email,
        source: formData.utm_source,
        stage: 'NEW',
        customFields: {
          businessLine: formData.businessLine,
          industry: formData.industry
        }
      }
    });

    return lead;
  }
}
```

---

### 3. n8n (Workflow Automation)

#### 통합 방식
```
Trigger (Webhook/Cron) ──> n8n Workflow ──> External APIs
                                 │
                                 └──> Our Database
```

#### 주요 워크플로우

**워크플로우 1: SNS 데이터 자동 수집**
```
[Cron: 매일 자정]
    │
    ├──> Postiz API: 모든 포스트 조회
    │       │
    │       └──> 각 포스트의 통계 조회
    │               │
    │               └──> PostgreSQL에 저장
    │
    └──> Slack 알림: "오늘의 SNS 통계 수집 완료"
```

**워크플로우 2: 랜딩 → 리드 자동화**
```
[Webhook: 랜딩폼 제출]
    │
    ├──> Twenty API: 리드 생성
    │       │
    │       └──> UTM 파라미터 파싱하여 태그 추가
    │
    ├──> PostgreSQL: 랜딩 유입 기록
    │
    └──> Slack 알림: "새 문의: {이름} ({출처})"
```

**워크플로우 3: 미팅 일정 동기화**
```
[Webhook: Google Calendar 이벤트 생성]
    │
    ├──> Twenty API: 미팅 기록 생성
    │
    └──> PostgreSQL: 미팅 통계 업데이트
```

#### n8n 노드 구성 예시 (JSON)
```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.cron",
      "name": "Daily at Midnight",
      "parameters": {
        "triggerTimes": {
          "item": [
            { "hour": 0, "minute": 0 }
          ]
        }
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Postiz: Get Posts",
      "parameters": {
        "url": "http://postiz:3000/api/posts",
        "authentication": "headerAuth",
        "method": "GET"
      }
    },
    {
      "type": "n8n-nodes-base.postgres",
      "name": "Save to Database",
      "parameters": {
        "operation": "insert",
        "table": "sns_metrics"
      }
    }
  ]
}
```

---

### 4. Metabase (Analytics Dashboard)

#### 통합 방식
```
Custom Dashboard ──(iframe)──> Metabase Dashboard
       │
       └──(API)──> Metabase API (임베드 URL 생성)
```

#### 구현 계획
1. **대시보드 구축**: Metabase에서 쿼리 & 차트 생성
2. **임베드**: 서명된 임베드 URL 생성하여 Next.js에 표시
3. **권한**: JWT로 사용자별 필터링

#### 임베드 예시
```typescript
// packages/integrations/metabase/embed.ts
import jwt from 'jsonwebtoken';

export class MetabaseEmbed {
  generateEmbedUrl(dashboardId: number, params?: any) {
    const payload = {
      resource: { dashboard: dashboardId },
      params: params || {},
      exp: Math.round(Date.now() / 1000) + (10 * 60) // 10분 유효
    };

    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    return `http://localhost:3002/embed/dashboard/${token}`;
  }
}

// apps/web-dashboard/components/MetabaseDashboard.tsx
export function MetabaseDashboard({ businessLine }: Props) {
  const embedUrl = useMetabaseEmbed(DASHBOARD_ID, {
    business_line: businessLine
  });

  return <iframe src={embedUrl} className="w-full h-screen" />;
}
```

---

### 5. Mautic (Email Marketing)

#### 통합 방식
```
Custom Campaign List ──(REST API)──> Mautic API
       │
       └──(iframe)──> Mautic Email Builder (필요시)
```

#### 구현 계획
1. **캠페인 목록**: 커스텀 UI로 구현
2. **이메일 작성**: Mautic UI 사용
3. **통계**: Mautic API로 오픈율/클릭율 가져오기

#### API 활용 예시
```typescript
// packages/integrations/mautic/client.ts
import { MauticConnector } from 'node-mautic';

export class MauticIntegration {
  private client: MauticConnector;

  async createCampaign(name: string, emailIds: number[]) {
    return this.client.campaigns.createCampaign({
      name,
      description: `${name} campaign`,
      isPublished: true
    });
  }

  async getCampaignStats(campaignId: number) {
    const stats = await this.client.campaigns.getCampaign(campaignId);

    return {
      sent: stats.stats.sent_count,
      opened: stats.stats.read_count,
      clicked: stats.stats.clicked_count,
      openRate: (stats.stats.read_count / stats.stats.sent_count) * 100
    };
  }
}
```

---

## 🗄️ 데이터베이스 전략

### Unified Schema (통합 스키마)

우리는 **단일 PostgreSQL 인스턴스**에 모든 데이터를 저장합니다.

```
PostgreSQL
├── kpi_platform (우리 메인 DB)
│   ├── business_lines
│   ├── platforms
│   ├── sns_metrics
│   ├── landing_visits
│   ├── leads (Twenty와 동기화)
│   ├── deals (Twenty와 동기화)
│   └── email_campaigns (Mautic과 동기화)
│
├── postiz (Postiz 전용)
├── twenty (Twenty 전용)
├── n8n (n8n 전용)
├── metabase (Metabase 전용)
└── mautic (Mautic 전용)
```

### 데이터 동기화 전략

#### 1. Event-Driven Sync (이벤트 기반)
```typescript
// services/sync/twenty-sync.ts
export class TwentySync {
  // Twenty Webhook 수신
  async handleLeadCreated(webhook: TwentyWebhook) {
    // 우리 DB에도 복사
    await db.leads.upsert({
      where: { twentyId: webhook.data.id },
      update: webhook.data,
      create: { ...webhook.data, twentyId: webhook.data.id }
    });
  }
}
```

#### 2. Scheduled Sync (스케줄 동기화)
```typescript
// services/sync/postiz-sync.ts
export class PostizSync {
  // 매일 자정에 실행
  @Cron('0 0 * * *')
  async syncDailyStats() {
    const posts = await postizClient.getAllPosts();

    for (const post of posts) {
      await db.snsMetrics.upsert({
        where: { postizId: post.id },
        update: {
          views: post.analytics.views,
          likes: post.analytics.likes,
          updatedAt: new Date()
        }
      });
    }
  }
}
```

---

## 🔄 자동화 시나리오

### 시나리오 1: 신규 리드 처리

```
1. 사용자가 랜딩페이지 폼 작성
   ↓
2. Next.js API Route: /api/leads/create
   ↓
3. Twenty API: 리드 생성 (CRM에 기록)
   ↓
4. n8n Webhook 트리거
   ↓
5. PostgreSQL: landing_visits 테이블에 유입 기록
   ↓
6. Slack 알림: "새 문의: 홍길동 (LinkedIn)"
```

### 시나리오 2: 주간 리포트 자동 발송

```
1. n8n Cron: 매주 월요일 9시
   ↓
2. Metabase API: 주간 리포트 생성 (PDF)
   ↓
3. Mautic API: 이메일 발송
   ↓
4. Slack Webhook: "#weekly-report 채널에 요약 전송"
```

---

## 🚀 실행 가이드

### 1. 로컬 개발 환경 셋업

```bash
# 1. PostgreSQL + 오픈소스 서비스 실행
cd kpi-automation-platform
docker-compose up -d

# 2. 데이터베이스 마이그레이션
pnpm prisma migrate dev

# 3. 개발 서버 실행
pnpm dev
```

### 2. 각 서비스 초기 설정

#### Postiz
1. http://localhost:5000 접속
2. 계정 생성
3. Settings > API Keys > 새 API 키 발급
4. `.env`에 `POSTIZ_API_KEY` 추가

#### Twenty CRM
1. http://localhost:3001 접속
2. Workspace 생성
3. Settings > API > GraphQL API 키 발급
4. `.env`에 `TWENTY_API_KEY` 추가

#### n8n
1. http://localhost:5678 접속
2. 로그인 (admin / admin)
3. Credentials > PostgreSQL 연결 설정
4. Credentials > Postiz, Twenty API 추가

#### Metabase
1. http://localhost:3002 접속
2. 초기 설정 (계정 생성)
3. Add Database > PostgreSQL 연결
4. Settings > Embedding > Secret Key 복사
5. `.env`에 `METABASE_SECRET_KEY` 추가

#### Mautic
1. http://localhost:8080 접속
2. 설치 마법사 진행
3. Configuration > API Settings > OAuth2 활성화
4. API Credentials 생성
5. `.env`에 클라이언트 ID/Secret 추가

---

## 📊 성공 지표

### 통합 완료 체크리스트

- [ ] Postiz에서 SNS 포스팅 가능
- [ ] 포스팅 통계가 우리 DB에 자동 저장
- [ ] 랜딩폼 제출 시 Twenty에 리드 자동 생성
- [ ] n8n 워크플로우 정상 작동
- [ ] Metabase 대시보드에서 실시간 데이터 확인
- [ ] Mautic에서 이메일 캠페인 발송 가능
- [ ] 통합 대시보드에서 모든 지표 확인 가능

---

## 🔐 보안 고려사항

1. **API 키 관리**: 환경 변수로만 관리, Git에 커밋 금지
2. **CORS 설정**: 프론트엔드에서만 API 호출 허용
3. **Webhook 검증**: 서명 확인으로 위조 방지
4. **Database 접근**: 서비스별 권한 분리
5. **Embed 보안**: iframe sandbox 적용

---

## 📚 참고 자료

- [Postiz API Docs](https://docs.postiz.com)
- [Twenty CRM GraphQL API](https://twenty.com/developers)
- [n8n Workflow Examples](https://n8n.io/workflows)
- [Metabase Embedding](https://www.metabase.com/docs/latest/embedding/introduction)
- [Mautic API Reference](https://developer.mautic.org)

---

**작성일**: 2024년
**버전**: 1.0
**작성자**: KPI Automation Team
