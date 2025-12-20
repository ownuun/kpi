# Metabase 설정 가이드

## 1. Metabase 설치 및 실행

### Docker로 실행 (권장)

```bash
docker run -d -p 3001:3000 \
  -e "MB_DB_TYPE=postgres" \
  -e "MB_DB_DBNAME=metabase" \
  -e "MB_DB_PORT=5432" \
  -e "MB_DB_USER=metabase" \
  -e "MB_DB_PASS=your-password" \
  -e "MB_DB_HOST=postgres" \
  --name metabase \
  metabase/metabase:latest
```

### 로컬 실행

```bash
# JAR 파일 다운로드
wget https://downloads.metabase.com/latest/metabase.jar

# 실행
java -jar metabase.jar
```

Metabase는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 2. 초기 설정

1. 브라우저에서 `http://localhost:3001` 접속
2. 관리자 계정 생성
3. PostgreSQL 데이터베이스 연결 설정:
   - Host: `localhost` (또는 DB 서버 주소)
   - Port: `5432`
   - Database name: `kpi_automation`
   - Username: `postgres`
   - Password: (설정한 비밀번호)

## 3. 대시보드 생성

### 3.1 퍼널 분석 대시보드 (ID: 1)

1. **새 대시보드 생성**: "퍼널 분석"
2. **SQL 쿼리 작성**:
   - Settings → Admin → Data Model → Database 선택
   - "New Question" → "Native Query"
   - 아래 SQL 붙여넣기:

```sql
WITH funnel_data AS (
  SELECT
    bl.name as business_line,
    COUNT(DISTINCT p.id) as promotion_count,
    COUNT(DISTINCT lv.id) as landing_visits,
    COUNT(DISTINCT l.id) as leads,
    COUNT(DISTINCT m.id) as meetings,
    COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_won,
    SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue
  FROM business_lines bl
  LEFT JOIN posts p ON p.business_line_id = bl.id
  LEFT JOIN landing_visits lv ON lv.business_line_id = bl.id
  LEFT JOIN leads l ON l.business_line_id = bl.id
  LEFT JOIN meetings m ON m.business_line_id = bl.id
  LEFT JOIN deals d ON d.business_line_id = bl.id
  WHERE
    p.created_at >= {{date_from}}
    AND p.created_at <= {{date_to}}
  GROUP BY bl.id, bl.name
)
SELECT
  business_line,
  promotion_count,
  landing_visits,
  leads,
  meetings,
  deals_won,
  total_revenue,
  ROUND(100.0 * landing_visits / NULLIF(promotion_count, 0), 2) as visit_rate,
  ROUND(100.0 * leads / NULLIF(landing_visits, 0), 2) as lead_conversion_rate,
  ROUND(100.0 * meetings / NULLIF(leads, 0), 2) as meeting_rate,
  ROUND(100.0 * deals_won / NULLIF(meetings, 0), 2) as close_rate,
  ROUND(100.0 * deals_won / NULLIF(landing_visits, 0), 2) as overall_conversion_rate
FROM funnel_data
ORDER BY total_revenue DESC
```

3. **변수 설정**:
   - `date_from`: Date 타입, 기본값: 90일 전
   - `date_to`: Date 타입, 기본값: 오늘

4. **시각화 선택**: Funnel Chart
5. **대시보드에 추가**

### 3.2 플랫폼 ROI 대시보드 (ID: 2)

동일한 방식으로 플랫폼 ROI 쿼리를 생성:

```sql
WITH platform_metrics AS (
  SELECT
    pl.name as platform_name,
    pl.category,
    COUNT(DISTINCT p.id) as post_count,
    SUM(p.likes) as total_likes,
    SUM(p.comments) as total_comments,
    SUM(p.shares) as total_shares,
    SUM(p.views) as total_views,
    COUNT(DISTINCT lv.id) as generated_visits,
    COUNT(DISTINCT l.id) as generated_leads,
    COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as generated_deals,
    SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as generated_revenue
  FROM platforms pl
  LEFT JOIN posts p ON p.platform_id = pl.id
  LEFT JOIN landing_visits lv ON lv.utm_source = pl.name
  LEFT JOIN leads l ON l.id = lv.lead_id
  LEFT JOIN deals d ON d.lead_id = l.id
  WHERE
    p.created_at >= {{date_from}}
    AND p.created_at <= {{date_to}}
  GROUP BY pl.id, pl.name, pl.category
)
SELECT
  platform_name,
  category,
  post_count,
  total_views,
  total_likes + total_comments + total_shares as total_engagement,
  generated_visits,
  generated_leads,
  generated_deals,
  generated_revenue,
  ROUND(generated_revenue / NULLIF(post_count, 0), 2) as revenue_per_post,
  ROUND(100.0 * generated_leads / NULLIF(generated_visits, 0), 2) as visit_to_lead_rate,
  ROUND(100.0 * generated_deals / NULLIF(generated_leads, 0), 2) as lead_to_deal_rate,
  ROUND(generated_revenue / NULLIF(generated_visits, 0), 2) as revenue_per_visit
FROM platform_metrics
WHERE post_count > 0
ORDER BY generated_revenue DESC
```

시각화: Bar Chart (revenue_per_post)

### 3.3 주간 추이 대시보드 (ID: 3)

```sql
SELECT
  DATE_TRUNC('week', p.created_at) as week_start,
  COUNT(DISTINCT p.id) as posts,
  COUNT(DISTINCT lv.id) as visits,
  COUNT(DISTINCT l.id) as leads,
  COUNT(DISTINCT m.id) as meetings,
  COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals,
  SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as revenue,
  ROUND(100.0 * COUNT(DISTINCT l.id) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as conversion_rate
FROM posts p
LEFT JOIN landing_visits lv ON DATE_TRUNC('week', lv.visited_at) = DATE_TRUNC('week', p.created_at)
LEFT JOIN leads l ON l.id = lv.lead_id
LEFT JOIN meetings m ON m.lead_id = l.id AND DATE_TRUNC('week', m.scheduled_at) = DATE_TRUNC('week', p.created_at)
LEFT JOIN deals d ON d.lead_id = l.id AND DATE_TRUNC('week', d.created_at) = DATE_TRUNC('week', p.created_at)
WHERE
  p.created_at >= {{date_from}}
  AND p.created_at <= {{date_to}}
GROUP BY week_start
ORDER BY week_start DESC
```

시각화: Line Chart (week_start vs revenue)

### 3.4 리드 소스 분석 대시보드 (ID: 4)

```sql
SELECT
  lv.utm_source,
  lv.utm_medium,
  lv.utm_campaign,
  COUNT(DISTINCT lv.id) as total_visits,
  COUNT(DISTINCT l.id) as leads_generated,
  COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_closed,
  SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue,
  ROUND(100.0 * COUNT(DISTINCT l.id) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as visit_to_lead_rate,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) / NULLIF(COUNT(DISTINCT l.id), 0), 2) as lead_to_deal_rate,
  ROUND(SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as revenue_per_visit
FROM landing_visits lv
LEFT JOIN leads l ON l.id = lv.lead_id
LEFT JOIN deals d ON d.lead_id = l.id
WHERE
  lv.visited_at >= {{date_from}}
  AND lv.visited_at <= {{date_to}}
GROUP BY lv.utm_source, lv.utm_medium, lv.utm_campaign
HAVING COUNT(DISTINCT lv.id) > 0
ORDER BY total_revenue DESC, leads_generated DESC
```

시각화: Table

### 3.5 사업 부문 비교 대시보드 (ID: 5)

```sql
SELECT
  bl.name as business_line,
  COUNT(DISTINCT p.id) as total_posts,
  COUNT(DISTINCT lv.id) as total_visits,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT m.id) as total_meetings,
  COUNT(DISTINCT d.id) as total_deals,
  COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_won,
  COUNT(DISTINCT CASE WHEN d.status = 'lost' THEN d.id END) as deals_lost,
  SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue,
  ROUND(AVG(CASE WHEN d.status = 'won' THEN d.amount END), 2) as avg_deal_size,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) / NULLIF(COUNT(DISTINCT m.id), 0), 2) as win_rate
FROM business_lines bl
LEFT JOIN posts p ON p.business_line_id = bl.id
LEFT JOIN landing_visits lv ON lv.business_line_id = bl.id
LEFT JOIN leads l ON l.business_line_id = bl.id
LEFT JOIN meetings m ON m.business_line_id = bl.id
LEFT JOIN deals d ON d.business_line_id = bl.id
WHERE
  bl.created_at >= {{date_from}}
GROUP BY bl.id, bl.name
ORDER BY total_revenue DESC
```

시각화: Bar Chart (business_line vs total_revenue)

## 4. Embedding 설정

### 4.1 API Key 생성

1. Settings → Admin → Settings → Authentication
2. "Generate API Key" 클릭
3. 생성된 키를 `.env` 파일에 저장:

```env
METABASE_API_KEY=mb_xxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Secret Key 생성

1. Settings → Admin → Settings → Embedding
2. "Enable" 클릭
3. Secret Key 복사
4. `.env` 파일에 저장:

```env
METABASE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.3 각 대시보드에 Embedding 활성화

각 대시보드에 대해:
1. 대시보드 열기
2. 우측 상단 "..." 메뉴 → "Sharing and embedding"
3. "Embedding" 탭 선택
4. "Enable" 클릭
5. Parameters 설정:
   - `date_from`: Editable
   - `date_to`: Editable
6. "Publish" 클릭

## 5. 환경변수 설정

`apps/web-dashboard/.env.local` 파일 생성:

```env
# Metabase Configuration
METABASE_BASE_URL=http://localhost:3001
METABASE_API_KEY=mb_xxxxxxxxxxxxxxxxxxxxx
METABASE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 6. 대시보드 ID 확인 및 매핑

생성한 대시보드의 ID를 확인하고 `apps/web-dashboard/lib/metabase.ts`에서 업데이트:

```typescript
export const METABASE_DASHBOARDS = {
  FUNNEL_ANALYSIS: 1,          // 실제 대시보드 ID로 변경
  PLATFORM_ROI: 2,             // 실제 대시보드 ID로 변경
  WEEKLY_TREND: 3,             // 실제 대시보드 ID로 변경
  LEAD_SOURCE_ATTRIBUTION: 4,  // 실제 대시보드 ID로 변경
  BUSINESS_LINE_COMPARISON: 5, // 실제 대시보드 ID로 변경
} as const;
```

대시보드 ID는 URL에서 확인 가능: `http://localhost:3001/dashboard/[ID]`

## 7. 테스트

```bash
cd apps/web-dashboard
pnpm dev
```

브라우저에서 `http://localhost:3000/analytics` 접속하여 모든 대시보드가 정상적으로 임베딩되는지 확인

## 8. 프로덕션 배포

### 8.1 Metabase 프로덕션 설정

```bash
# PostgreSQL 백업 설정
docker exec metabase pg_dump -U metabase metabase > metabase_backup.sql

# 프로덕션 환경변수
METABASE_BASE_URL=https://metabase.yourdomain.com
METABASE_API_KEY=[프로덕션 API 키]
METABASE_SECRET_KEY=[프로덕션 Secret 키]
```

### 8.2 HTTPS 설정 (Nginx)

```nginx
server {
  listen 443 ssl;
  server_name metabase.yourdomain.com;

  location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 8.3 성능 최적화

```bash
# Metabase 메모리 증가
java -Xmx2g -jar metabase.jar

# 또는 Docker
docker run -d -p 3001:3000 \
  -e "JAVA_OPTS=-Xmx2g" \
  metabase/metabase:latest
```

## 트러블슈팅

### 임베딩이 안 보일 때

1. Metabase에서 Embedding이 활성화되어 있는지 확인
2. Secret Key가 올바른지 확인
3. 브라우저 콘솔에서 CORS 에러 확인
4. JWT 토큰이 만료되지 않았는지 확인 (1시간 유효)

### 쿼리가 느릴 때

1. PostgreSQL 인덱스 추가:
```sql
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_landing_visits_visited_at ON landing_visits(visited_at);
CREATE INDEX idx_deals_status ON deals(status);
```

2. Metabase 쿼리 캐싱 설정:
   - Settings → Admin → Caching
   - "Enable caching" 체크
   - TTL: 60분

### API 호출 제한

Metabase API는 rate limiting이 있습니다. 프로덕션에서는:
- 임베딩 URL을 서버 사이드에서 캐싱
- Redis로 토큰 캐싱 구현 권장

```typescript
// 예시: Redis 캐싱
import { Redis } from 'ioredis';
const redis = new Redis();

async function getEmbedUrl(dashboardId: number) {
  const cacheKey = `metabase:embed:${dashboardId}`;
  const cached = await redis.get(cacheKey);

  if (cached) return cached;

  const url = metabase.getEmbedDashboardUrl(dashboardId, params);
  await redis.setex(cacheKey, 3000, url); // 50분 캐싱

  return url;
}
```
