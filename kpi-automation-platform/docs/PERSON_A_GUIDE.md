# Person A 작업 가이드: SNS & Email Module

## 🎯 담당 영역
- **SNS Manager**: LinkedIn, Facebook, Instagram, YouTube, TikTok 포스팅 및 통계 수집
- **Email Module**: SendGrid 이메일 캠페인 관리

---

## 📁 담당 파일 구조

```
kpi-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── sns/                    ⭐ 전체 담당
│   │   │   ├── page.tsx           # SNS 포스트 목록
│   │   │   ├── create/
│   │   │   │   └── page.tsx       # 포스트 작성
│   │   │   └── analytics/
│   │   │       └── page.tsx       # SNS 통계
│   │   │
│   │   └── email/                  ⭐ 전체 담당
│   │       ├── page.tsx           # 캠페인 목록
│   │       ├── campaigns/
│   │       │   ├── page.tsx
│   │       │   └── [id]/
│   │       └── templates/
│   │           └── page.tsx
│   │
│   └── api/
│       ├── sns/                    ⭐ 전체 담당
│       │   ├── posts/
│       │   │   ├── route.ts       # POST /api/sns/posts (포스트 생성)
│       │   │   └── [id]/
│       │   │       └── route.ts   # GET/PUT/DELETE
│       │   ├── platforms/
│       │   │   └── route.ts       # GET /api/sns/platforms
│       │   └── analytics/
│       │       └── route.ts       # GET /api/sns/analytics
│       │
│       ├── email/                  ⭐ 전체 담당
│       │   ├── campaigns/
│       │   │   └── route.ts
│       │   ├── send/
│       │   │   └── route.ts
│       │   └── templates/
│       │       └── route.ts
│       │
│       └── cron/
│           └── sns-collect/
│               └── route.ts        ⭐ SNS 데이터 수집 Cron
│
├── components/
│   ├── sns/                        ⭐ 전체 담당
│   │   ├── PostEditor.tsx         # 글 작성 에디터
│   │   ├── PlatformSelector.tsx   # 플랫폼 선택
│   │   ├── PostCard.tsx           # 포스트 카드
│   │   ├── PostAnalytics.tsx      # 통계 차트
│   │   └── VideoUploader.tsx      # 영상 업로드
│   │
│   └── email/                      ⭐ 전체 담당
│       ├── EmailEditor.tsx        # 이메일 에디터
│       ├── CampaignCard.tsx       # 캠페인 카드
│       └── CampaignStats.tsx      # 캠페인 통계
│
└── lib/
    ├── integrations/               ⭐ 전체 담당
    │   ├── linkedin.ts            # LinkedIn API 클라이언트
    │   ├── facebook.ts            # Facebook API 클라이언트
    │   ├── instagram.ts           # Instagram API 클라이언트
    │   ├── youtube.ts             # YouTube API 클라이언트
    │   ├── tiktok.ts              # TikTok API 클라이언트
    │   ├── threads.ts             # Threads API 클라이언트
    │   ├── reddit.ts              # Reddit API 클라이언트
    │   └── sendgrid.ts            # SendGrid API 클라이언트
    │
    └── automation/
        └── sns-collector.ts        ⭐ SNS 데이터 수집 로직
```

---

## 🗓️ 개발 일정 (6주)

### Week 1: 환경 설정 & 기본 구조
- [ ] Person C의 Prisma 스키마 완료 대기
- [ ] 로컬 환경 셋업 (`pnpm install`)
- [ ] SNS 폴더 구조 생성
- [ ] 기본 레이아웃 확인

### Week 2: SNS Manager - 기본 CRUD
- [ ] PostEditor 컴포넌트 작성
- [ ] PlatformSelector 컴포넌트
- [ ] POST /api/sns/posts API (포스트 DB 저장)
- [ ] 포스트 목록 페이지

### Week 3: SNS Manager - API 연동
- [ ] LinkedIn API 연동
- [ ] Facebook API 연동
- [ ] Instagram API 연동
- [ ] YouTube API 연동 (선택)

### Week 4: SNS Analytics
- [ ] SNS 통계 수집 Cron Job
- [ ] PostAnalytics 컴포넌트
- [ ] 플랫폼별 통계 페이지

### Week 5: Email Module
- [ ] EmailEditor 컴포넌트 (Mautic 참조)
- [ ] SendGrid 연동
- [ ] 캠페인 생성 API
- [ ] 캠페인 목록 & 통계

### Week 6: 통합 & 최적화
- [ ] SNS + Email 통합 테스트
- [ ] 성능 최적화
- [ ] 에러 핸들링

---

## 📝 상세 작업 가이드

### 1. PostEditor 컴포넌트 작성

**참고**: `clones/postiz-app/packages/editor/`

#### 기본 구조
```tsx
// components/sns/PostEditor.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PlatformSelector from './PlatformSelector';

const postSchema = z.object({
  content: z.string().min(1, '내용을 입력하세요').max(5000),
  platforms: z.array(z.string()).min(1, '최소 1개 플랫폼 선택'),
  businessLineId: z.string(),
  scheduledAt: z.date().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostEditor() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      platforms: [],
      businessLineId: '', // 외주/B2B/ANYON
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sns/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('포스트 생성 실패');

      const post = await res.json();
      // 성공 처리
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        placeholder="무엇을 공유하시겠습니까?"
        {...form.register('content')}
        rows={6}
      />

      <PlatformSelector
        selected={form.watch('platforms')}
        onChange={(platforms) => form.setValue('platforms', platforms)}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? '발행 중...' : '발행'}
      </Button>
    </form>
  );
}
```

---

### 2. LinkedIn API 연동

**참고**: `clones/postiz-app/packages/social/src/linkedin/`

#### API 클라이언트 작성
```typescript
// lib/integrations/linkedin.ts
import axios from 'axios';

export class LinkedInClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * LinkedIn에 텍스트 포스트 발행
   */
  async createPost(content: string, authorId: string) {
    const url = 'https://api.linkedin.com/v2/ugcPosts';

    const body = {
      author: `urn:li:person:${authorId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    return response.data;
  }

  /**
   * 포스트 통계 조회
   */
  async getPostAnalytics(postId: string) {
    const url = `https://api.linkedin.com/v2/socialActions/${postId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return {
      likes: response.data.likesSummary?.totalLikes || 0,
      comments: response.data.commentsSummary?.totalComments || 0,
      shares: response.data.sharesSummary?.totalShares || 0,
    };
  }
}

// 사용 예시
export async function publishToLinkedIn(content: string) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const authorId = process.env.LINKEDIN_AUTHOR_ID!;

  const client = new LinkedInClient(accessToken);
  const result = await client.createPost(content, authorId);

  return result;
}
```

---

### 3. API Route 작성

```typescript
// app/api/sns/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { publishToLinkedIn } from '@/lib/integrations/linkedin';
import { publishToFacebook } from '@/lib/integrations/facebook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platforms, businessLineId, scheduledAt } = body;

    // 1. DB에 포스트 저장
    const post = await prisma.post.create({
      data: {
        content,
        businessLineId,
        userId: 'current-user-id', // NextAuth에서 가져오기
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    // 2. 각 플랫폼에 발행
    const publishPromises = platforms.map(async (platformId: string) => {
      const platform = await prisma.platform.findUnique({
        where: { id: platformId },
      });

      if (!platform) return null;

      let externalId = null;

      if (platform.name === 'LinkedIn') {
        const result = await publishToLinkedIn(content);
        externalId = result.id;
      } else if (platform.name === 'Facebook') {
        const result = await publishToFacebook(content);
        externalId = result.id;
      }

      // DB에 플랫폼별 포스트 기록
      return prisma.post.update({
        where: { id: post.id },
        data: {
          externalId,
          publishedAt: new Date(),
        },
      });
    });

    await Promise.all(publishPromises);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('포스트 생성 오류:', error);
    return NextResponse.json(
      { error: '포스트 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessLineId = searchParams.get('businessLineId');

    const posts = await prisma.post.findMany({
      where: businessLineId ? { businessLineId } : undefined,
      include: {
        platform: true,
        businessLine: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
```

---

### 4. SNS 데이터 수집 Cron Job

**Vercel Cron 설정**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sns-collect",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Cron 엔드포인트**
```typescript
// app/api/cron/sns-collect/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { LinkedInClient } from '@/lib/integrations/linkedin';

export async function GET() {
  try {
    // 최근 30일 포스트만 업데이트
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        externalId: { not: null },
      },
      include: { platform: true },
    });

    for (const post of posts) {
      if (post.platform.name === 'LinkedIn' && post.externalId) {
        const client = new LinkedInClient(process.env.LINKEDIN_ACCESS_TOKEN!);
        const analytics = await client.getPostAnalytics(post.externalId);

        await prisma.post.update({
          where: { id: post.id },
          data: {
            likes: analytics.likes,
            comments: analytics.comments,
            shares: analytics.shares,
            lastSyncedAt: new Date(),
          },
        });
      }
      // Facebook, Instagram 등 추가
    }

    return NextResponse.json({ success: true, count: posts.length });
  } catch (error) {
    console.error('SNS 데이터 수집 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🔧 로컬 개발 환경 설정

### 1. 환경 변수
```.env.local
# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_AUTHOR_ID=your_author_id

# Facebook
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_access_token

# Instagram
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id

# YouTube
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# SendGrid
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=your@email.com
```

### 2. API 키 발급 가이드

**LinkedIn**
1. https://www.linkedin.com/developers/ 접속
2. "Create app" 클릭
3. OAuth 2.0 설정
4. Redirect URL: `http://localhost:3000/api/auth/callback/linkedin`
5. Scopes: `w_member_social`, `r_basicprofile`

**Facebook**
1. https://developers.facebook.com/ 접속
2. 앱 생성
3. Facebook Login 추가
4. Access Token 발급

**SendGrid**
1. https://app.sendgrid.com/ 접속
2. Settings → API Keys
3. "Create API Key" 클릭

---

## 📚 참고할 오픈소스 코드

### Postiz 코드 위치
```
clones/postiz-app/
├── packages/
│   ├── editor/              ⭐ 에디터 컴포넌트 참조
│   │   └── src/
│   │       └── Editor.tsx
│   │
│   └── social/              ⭐ SNS API 연동 참조
│       └── src/
│           ├── linkedin/
│           ├── facebook/
│           └── instagram/
```

### Mautic 코드 위치
```
clones/mautic/
├── app/bundles/EmailBundle/  ⭐ 이메일 관리 참조
└── app/bundles/CampaignBundle/  ⭐ 캠페인 관리 참조
```

---

## ✅ 체크리스트

### Week 2
- [ ] PostEditor 컴포넌트 완성
- [ ] POST /api/sns/posts 작동
- [ ] 포스트 목록 페이지 완성

### Week 3
- [ ] LinkedIn 포스팅 작동
- [ ] Facebook 포스팅 작동
- [ ] 포스트에 externalId 저장

### Week 4
- [ ] Cron Job 작동 (매일 자정)
- [ ] 통계 자동 업데이트
- [ ] PostAnalytics 컴포넌트 완성

### Week 5
- [ ] SendGrid 이메일 발송 가능
- [ ] 캠페인 목록 페이지 완성
- [ ] 오픈율/클릭율 트래킹

---

## 🚨 주의사항

1. **API Rate Limit**: LinkedIn, Facebook은 요청 제한이 있으므로 주의
2. **Access Token 갱신**: 일부 플랫폼은 토큰이 만료되므로 갱신 로직 필요
3. **에러 핸들링**: 각 API 호출에 try-catch 추가

---

**담당자**: Person A
**예상 기간**: 6주
**문의**: Person C (인프라 관련), Person B (리드 연동 시)
