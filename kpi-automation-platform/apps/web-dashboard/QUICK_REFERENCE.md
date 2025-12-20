# SNS Posting Interface - Quick Reference

## File Structure

```
apps/web-dashboard/
├── app/
│   ├── posts/
│   │   ├── page.tsx                    # Post list (filtering, search, pagination)
│   │   ├── new/page.tsx                # Create new post
│   │   └── [id]/page.tsx               # View/Edit post + Analytics
│   └── api/
│       ├── posts/
│       │   ├── route.ts                # GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts            # GET, PUT, DELETE
│       │       ├── publish/route.ts    # POST publish
│       │       └── analytics/route.ts  # GET analytics
│       └── media/upload/route.ts       # POST media upload
├── components/posts/
│   ├── PostEditor.tsx                  # Rich text editor (9.5KB)
│   ├── PlatformSelector.tsx            # 17 platforms selector (9.5KB)
│   ├── MediaUploader.tsx               # Drag & drop upload (10.8KB)
│   ├── SchedulePicker.tsx              # Date/time picker (10.6KB)
│   ├── PostPreview.tsx                 # Platform previews (10.1KB)
│   ├── PostList.tsx                    # Post listing (13KB)
│   └── PostAnalytics.tsx               # Analytics display (8.8KB)
├── lib/
│   ├── postiz.ts                       # SDK client singleton
│   └── validations/post.ts             # Zod schemas
└── Documentation/
    ├── SNS_POSTING_GUIDE.md            # User guide
    ├── SNS_POSTING_SUMMARY.md          # Implementation details
    └── QUICK_REFERENCE.md              # This file
```

## Component Usage

### PostEditor
```tsx
import PostEditor from '@/components/posts/PostEditor';

<PostEditor
  content={content}
  onChange={setContent}
  platforms={selectedPlatforms}
  tags={tags}
  onTagsChange={setTags}
/>
```

### PlatformSelector
```tsx
import PlatformSelector from '@/components/posts/PlatformSelector';

<PlatformSelector
  selected={selectedPlatforms}
  onChange={setSelectedPlatforms}
/>
```

### MediaUploader
```tsx
import MediaUploader from '@/components/posts/MediaUploader';

<MediaUploader
  media={media}
  onChange={setMedia}
  maxFiles={10}
  maxFileSize={50}
/>
```

### SchedulePicker
```tsx
import SchedulePicker from '@/components/posts/SchedulePicker';

<SchedulePicker
  scheduledAt={scheduledAt}
  onChange={setScheduledAt}
/>
```

### PostPreview
```tsx
import PostPreview from '@/components/posts/PostPreview';

<PostPreview
  content={content}
  platforms={selectedPlatforms}
  media={media}
/>
```

### PostList
```tsx
import PostList from '@/components/posts/PostList';

<PostList />
```

### PostAnalytics
```tsx
import PostAnalytics from '@/components/posts/PostAnalytics';

<PostAnalytics
  postId={postId}
  platforms={platforms}
/>
```

## API Routes

### List Posts
```bash
GET /api/posts?status=published&limit=10&offset=0&sort=createdAt&order=desc
```

### Create Post
```bash
POST /api/posts
Content-Type: application/json

{
  "content": "Post content",
  "platforms": ["facebook", "twitter"],
  "scheduledAt": "2024-12-19T10:00:00Z",
  "media": [{"type": "image", "url": "..."}],
  "tags": ["marketing", "social"],
  "isDraft": false
}
```

### Get Post
```bash
GET /api/posts/{id}
```

### Update Post
```bash
PUT /api/posts/{id}
Content-Type: application/json

{
  "content": "Updated content",
  "platforms": ["facebook"]
}
```

### Delete Post
```bash
DELETE /api/posts/{id}
```

### Publish Post
```bash
POST /api/posts/{id}/publish
```

### Get Analytics
```bash
GET /api/posts/{id}/analytics?platforms=twitter
```

### Upload Media
```bash
POST /api/media/upload
Content-Type: multipart/form-data

file: [binary]
type: "image"
```

## Postiz SDK Usage

### Initialize Client
```typescript
import { getPostizClient } from '@/lib/postiz';

const postiz = getPostizClient();
```

### Create Post
```typescript
const post = await postiz.posts.createPost({
  content: "Hello world!",
  platforms: [Platform.TWITTER, Platform.FACEBOOK],
  scheduledAt: "2024-12-19T10:00:00Z"
});
```

### List Posts
```typescript
const result = await postiz.posts.listPosts({
  status: PostStatus.PUBLISHED,
  limit: 10,
  offset: 0
});
```

### Get Analytics
```typescript
const analytics = await postiz.analytics.getPostAnalytics({
  postId: "post-123",
  platforms: [Platform.TWITTER]
});
```

## Validation

### Create Post Schema
```typescript
import { createPostSchema } from '@/lib/validations/post';

const result = createPostSchema.safeParse(data);
if (!result.success) {
  // Handle validation errors
  console.error(result.error);
}
```

### Platform Limits Validation
```typescript
import { validatePlatformLimits } from '@/lib/validations/post';

const validation = validatePlatformLimits(content, platforms);
if (!validation.valid) {
  validation.errors.forEach(error => {
    console.log(`${error.platform}: ${error.message}`);
  });
}
```

## Types

### Import Types
```typescript
import {
  Platform,
  PostStatus,
  MediaType,
  Post,
  Analytics,
  CreatePostRequest,
  UpdatePostRequest
} from '@kpi/integrations-postiz';
```

### Platform Enum
```typescript
Platform.FACEBOOK
Platform.INSTAGRAM
Platform.TWITTER
Platform.LINKEDIN
Platform.YOUTUBE
Platform.PINTEREST
Platform.TIKTOK
Platform.THREADS
Platform.REDDIT
Platform.DISCORD
Platform.TELEGRAM
Platform.MASTODON
Platform.BLUESKY
Platform.MEDIUM
Platform.WORDPRESS
Platform.GHOST
Platform.DRUPAL
```

### Post Status Enum
```typescript
PostStatus.DRAFT
PostStatus.SCHEDULED
PostStatus.PUBLISHED
PostStatus.FAILED
PostStatus.CANCELLED
```

### Media Type Enum
```typescript
MediaType.IMAGE
MediaType.VIDEO
MediaType.GIF
```

## Environment Variables

```env
# Required
POSTIZ_API_KEY=your_api_key_here
POSTIZ_API_URL=http://localhost:5000

# Optional (for production)
NEXT_PUBLIC_POSTIZ_API_KEY=your_public_api_key
```

## Character Limits

```typescript
Twitter:    280
Bluesky:    300
Threads:    500
Mastodon:   500
Pinterest:  500
Discord:    2,000
Instagram:  2,200
TikTok:     2,200
LinkedIn:   3,000
Telegram:   4,096
YouTube:    5,000
Reddit:     40,000
Facebook:   63,206
Medium:     100,000
WordPress:  100,000
Ghost:      100,000
Drupal:     100,000
```

## Common Patterns

### Create & Publish Post
```typescript
// Create post
const post = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: "My post",
    platforms: [Platform.TWITTER],
    isDraft: false
  })
});

// Publish immediately
const published = await fetch(`/api/posts/${post.id}/publish`, {
  method: 'POST'
});
```

### Load & Filter Posts
```typescript
const params = new URLSearchParams({
  status: PostStatus.PUBLISHED,
  platforms: Platform.TWITTER,
  limit: '10',
  offset: '0',
  sort: 'createdAt',
  order: 'desc'
});

const response = await fetch(`/api/posts?${params}`);
const { data } = await response.json();
```

### Upload & Attach Media
```typescript
// Upload
const formData = new FormData();
formData.append('file', file);
formData.append('type', MediaType.IMAGE);

const upload = await fetch('/api/media/upload', {
  method: 'POST',
  body: formData
});

const { url } = await upload.json();

// Attach to post
const post = await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({
    content: "Check this out!",
    platforms: [Platform.INSTAGRAM],
    media: [{ type: MediaType.IMAGE, url }]
  })
});
```

## Error Handling

### API Errors
```typescript
try {
  const response = await fetch('/api/posts', { method: 'POST', ... });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.error.message);
    // Handle error
  }

  const result = await response.json();
  // Handle success
} catch (error) {
  console.error('Network error:', error);
  // Handle network error
}
```

### Validation Errors
```typescript
const result = createPostSchema.safeParse(data);

if (!result.success) {
  const errors = result.error.flatten();
  // errors.fieldErrors contains validation errors per field
  console.log(errors.fieldErrors.content);
  console.log(errors.fieldErrors.platforms);
}
```

## Testing Checklist

- [ ] Create post with single platform
- [ ] Create post with multiple platforms
- [ ] Upload image
- [ ] Upload video
- [ ] Schedule post for future
- [ ] Save as draft
- [ ] Edit draft post
- [ ] Publish draft post
- [ ] Delete post
- [ ] Filter posts by status
- [ ] Search posts
- [ ] View analytics
- [ ] Test character limits
- [ ] Test media validation
- [ ] Test schedule validation

## Performance Tips

1. **Lazy load images** in PostList
2. **Debounce search** input (300ms)
3. **Cache API responses** for analytics
4. **Optimize images** before upload
5. **Use pagination** for large lists
6. **Implement virtual scrolling** for 100+ posts

## Security Notes

1. **Validate API keys** server-side only
2. **Sanitize user input** before saving
3. **Check file types** on upload
4. **Limit file sizes** (50MB max)
5. **Rate limit** API endpoints
6. **Authenticate** all routes in production

## Troubleshooting

### "Post creation failed"
- Check POSTIZ_API_KEY is set
- Verify API connection
- Check content length
- Validate platforms array

### "Media upload failed"
- Check file size (<50MB)
- Verify file type (image/video)
- Check network connection
- Verify upload endpoint

### "Character limit exceeded"
- Check platform limits
- Reduce content length
- Remove excess platforms

### "Invalid schedule time"
- Set time >5 minutes future
- Check timezone
- Verify date format (ISO 8601)

## Support Resources

- **User Guide**: SNS_POSTING_GUIDE.md
- **Implementation**: SNS_POSTING_SUMMARY.md
- **Postiz Docs**: https://docs.postiz.com
- **API Reference**: /api/posts (OpenAPI)
