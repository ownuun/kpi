# @kpi/integrations-postiz

Postiz SNS 관리 플랫폼 통합 패키지

## 기능

- **포스트 관리**: 생성, 수정, 삭제, 조회, 예약
- **플랫폼 연동**: 17개 소셜 미디어 플랫폼 지원
- **미디어 관리**: 이미지/비디오 업로드 및 관리
- **통계 분석**: 상세한 포스트 성과 분석
- **일괄 작업**: 대량 포스트 생성/삭제

## 지원 플랫폼

Facebook, Instagram, Twitter, LinkedIn, YouTube, Pinterest, TikTok, Threads, Reddit, Discord, Telegram, Mastodon, Bluesky, Medium, WordPress, Ghost, Drupal

## 설치

```bash
npm install @kpi/integrations-postiz
```

## 사용법

### 초기화

```typescript
import { PostizSDK } from '@kpi/integrations-postiz';

const postiz = new PostizSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.postiz.com/v1' // optional
});
```

### 포스트 생성

```typescript
const post = await postiz.posts.createPost({
  content: 'Hello World!',
  platforms: ['facebook', 'twitter', 'instagram'],
  scheduledAt: '2025-12-25T10:00:00Z',
  tags: ['greeting', 'hello'],
  media: [
    {
      type: 'image',
      url: 'https://example.com/image.jpg'
    }
  ]
});
```

### 포스트 목록 조회

```typescript
const posts = await postiz.posts.listPosts({
  status: 'published',
  platforms: ['facebook'],
  limit: 20,
  offset: 0,
  sort: 'createdAt',
  order: 'desc'
});
```

### 플랫폼 연결

```typescript
const connection = await postiz.platforms.connectPlatform({
  platform: 'facebook',
  accessToken: 'your-access-token',
  accountId: 'account-id',
  accountName: 'My Page'
});
```

### 통계 조회

```typescript
const analytics = await postiz.analytics.getPostAnalytics({
  postId: 'post-id',
  platforms: ['facebook', 'twitter'],
  startDate: '2025-01-01',
  endDate: '2025-12-31'
});
```

### 미디어 업로드

```typescript
const media = await postiz.platforms.uploadMedia(
  'connection-id',
  {
    file: fileBuffer,
    type: 'image',
    filename: 'photo.jpg'
  }
);
```

## API 레퍼런스

### PostsService

- `createPost(request)` - 새 포스트 생성
- `getPost(postId)` - 포스트 조회
- `updatePost(postId, request)` - 포스트 수정
- `deletePost(postId)` - 포스트 삭제
- `listPosts(params)` - 포스트 목록 조회
- `schedulePost(postId, request)` - 포스트 예약
- `publishPost(postId)` - 즉시 발행
- `cancelScheduledPost(postId)` - 예약 취소
- `duplicatePost(postId)` - 포스트 복제
- `validatePost(request)` - 포스트 유효성 검사
- `bulkCreatePosts(requests)` - 일괄 생성
- `bulkDeletePosts(postIds)` - 일괄 삭제

### PlatformsService

- `connectPlatform(request)` - 플랫폼 연결
- `disconnectPlatform(connectionId)` - 플랫폼 연결 해제
- `getPlatformConnection(connectionId)` - 연결 정보 조회
- `listPlatformConnections(params)` - 연결 목록 조회
- `refreshPlatformToken(connectionId)` - 토큰 갱신
- `syncPlatform(connectionId)` - 데이터 동기화
- `uploadMedia(connectionId, request)` - 미디어 업로드
- `deleteMedia(connectionId, mediaId)` - 미디어 삭제
- `testConnection(connectionId)` - 연결 테스트
- `getPlatformAccountInfo(connectionId)` - 계정 정보 조회

### AnalyticsService

- `getPostAnalytics(params)` - 포스트 통계 조회
- `getAggregatedAnalytics(params)` - 집계 통계 조회
- `getAnalyticsTimeSeries(params)` - 시계열 통계 조회
- `getTopPosts(params)` - 인기 포스트 조회
- `getPlatformComparison(params)` - 플랫폼 비교 분석
- `getAudienceDemographics(params)` - 오디언스 인구통계
- `getEngagementInsights(params)` - 참여도 인사이트
- `getContentPerformance(params)` - 콘텐츠 성과 분석
- `exportReport(params)` - 리포트 내보내기

## 타입

```typescript
enum Platform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  // ... 17 platforms
}

enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  media?: Media[];
  tags?: string[];
  mentions?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 에러 처리

```typescript
import { PostizError } from '@kpi/integrations-postiz';

try {
  await postiz.posts.createPost(request);
} catch (error) {
  if (error instanceof PostizError) {
    console.error('Postiz Error:', error.code, error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Details:', error.details);
  }
}
```

## 라이선스

MIT
