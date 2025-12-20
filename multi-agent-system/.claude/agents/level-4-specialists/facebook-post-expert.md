---
name: facebook-post-expert
description: Facebook Graph API 전문가. 포스팅, 이미지, 스케줄링.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Facebook Post Expert

## 🔍 Start
```typescript
await webSearch("Facebook Graph API posting best practices 2025");
await webSearch("Facebook Pages API v19 2025");
await webFetch("https://developers.facebook.com/docs/graph-api/reference/page/feed/", "latest docs");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface FacebookPostOptions {
  pageId: string;
  accessToken: string;
  message: string;
  link?: string;
  imageUrl?: string;
  scheduledPublishTime?: number; // Unix timestamp
  published?: boolean; // false = draft
}

export async function POST(request: NextRequest) {
  try {
    const {
      pageId,
      accessToken,
      message,
      link,
      imageUrl,
      scheduledPublishTime,
      published = true,
    }: FacebookPostOptions = await request.json();

    let postData: any = {
      message,
      access_token: accessToken,
      published: published.toString(),
    };

    // Add optional fields
    if (link) postData.link = link;
    if (scheduledPublishTime) {
      postData.scheduled_publish_time = scheduledPublishTime;
      postData.published = 'false'; // Must be false for scheduled posts
    }

    let endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;

    // If image is provided, use photo endpoint
    if (imageUrl) {
      endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      postData.url = imageUrl;
      postData.caption = message;
      delete postData.message;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[FACEBOOK_POST_ERROR]', error);

      // Handle specific errors
      if (error.error?.code === 190) {
        return NextResponse.json(
          { error: 'Access token expired or invalid' },
          { status: 401 }
        );
      }

      if (error.error?.code === 368) {
        return NextResponse.json(
          { error: 'Temporarily blocked for posting too frequently' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: error.error?.message || 'Failed to create post' },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Save to database
    await prisma.socialPost.create({
      data: {
        platform: 'FACEBOOK',
        postId: result.id,
        message,
        link,
        imageUrl,
        scheduledAt: scheduledPublishTime ? new Date(scheduledPublishTime * 1000) : null,
        publishedAt: published ? new Date() : null,
        status: published ? 'PUBLISHED' : scheduledPublishTime ? 'SCHEDULED' : 'DRAFT',
      },
    });

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('[FACEBOOK_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create Facebook post' },
      { status: 500 }
    );
  }
}

// Delete post
export async function DELETE(request: NextRequest) {
  const { postId, accessToken } = await request.json();

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${postId}?access_token=${accessToken}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }

  await prisma.socialPost.update({
    where: { postId },
    data: { status: 'DELETED', deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
```
