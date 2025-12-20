# SNS Posting Interface - User Guide

## Overview

The SNS Posting Interface allows you to create, schedule, and manage social media posts across 17 different platforms simultaneously using Postiz integration.

## Supported Platforms

### Social Media Platforms (10)
- Facebook
- Instagram
- Twitter/X
- LinkedIn
- Threads
- Mastodon
- Bluesky
- Reddit
- Discord
- Telegram
- Pinterest

### Video Platforms (2)
- YouTube
- TikTok

### Blog Platforms (4)
- Medium
- WordPress
- Ghost
- Drupal

## Features

### 1. Multi-Platform Posting
- Select multiple platforms with a single click
- Quick selection by category (Social, Video, Blog)
- Platform-specific validation and character limits

### 2. Rich Text Editor
- Simple formatting (bold, italic, lists, links)
- Real-time character count
- Platform-specific character limit warnings
- Hashtag management
- Auto-validation against platform limits

### 3. Media Upload
- Drag and drop interface
- Support for images and videos
- File size validation (max 50MB)
- Preview before posting
- Multiple file upload (up to 10 files)

### 4. Post Scheduling
- Schedule posts for future publishing
- Quick schedule presets (1 hour, 3 hours, tomorrow)
- Best time suggestions
- Timezone support
- Minimum 5-minute advance scheduling

### 5. Live Preview
- Platform-specific previews
- See how your post will look on each platform
- Switch between platforms instantly
- Media preview included

### 6. Post Analytics
- View statistics for published posts
- Metrics per platform:
  - Views
  - Likes
  - Shares
  - Comments
  - Clicks
  - Reach
  - Impressions
  - Engagement rate
- Total aggregated statistics

### 7. Post Management
- List all posts with filtering
- Filter by status (Published, Scheduled, Draft, Failed)
- Filter by platform
- Search posts by content
- Sort by date (Created, Scheduled, Published)
- Pagination support

## Usage

### Creating a New Post

1. Navigate to `/posts/new`
2. Select target platforms
3. Write your content
4. Add hashtags (optional)
5. Upload media (optional)
6. Schedule or publish immediately
7. Review preview before submitting

### Editing a Post

1. Navigate to `/posts/[id]`
2. Click "Edit" button
3. Modify content, platforms, or schedule
4. Save changes
5. Posts can only be edited if status is Draft or Scheduled

### Viewing Analytics

1. Navigate to published post detail page
2. Scroll to Analytics section
3. Filter by platform if needed
4. Refresh to get latest data

## Character Limits by Platform

| Platform | Character Limit |
|----------|----------------|
| Twitter/X | 280 |
| Bluesky | 300 |
| Threads | 500 |
| Mastodon | 500 |
| Pinterest | 500 |
| Discord | 2,000 |
| Instagram | 2,200 |
| TikTok | 2,200 |
| LinkedIn | 3,000 |
| Telegram | 4,096 |
| YouTube | 5,000 |
| Reddit | 40,000 |
| Facebook | 63,206 |
| Medium | 100,000 |
| WordPress | 100,000 |
| Ghost | 100,000 |
| Drupal | 100,000 |

## API Endpoints

### Posts
- `GET /api/posts` - List posts with filtering
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get post details
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/publish` - Publish post immediately

### Analytics
- `GET /api/posts/[id]/analytics` - Get post analytics

### Media
- `POST /api/media/upload` - Upload media files

## Environment Variables

Required environment variables for Postiz integration:

```env
POSTIZ_API_KEY=your_postiz_api_key_here
POSTIZ_API_URL=http://localhost:5000
```

## File Structure

```
apps/web-dashboard/
├── app/
│   ├── posts/
│   │   ├── page.tsx              # Post list page
│   │   ├── new/
│   │   │   └── page.tsx          # New post creation
│   │   └── [id]/
│   │       └── page.tsx          # Post detail/edit
│   └── api/
│       ├── posts/
│       │   ├── route.ts          # List & Create
│       │   └── [id]/
│       │       ├── route.ts      # Get, Update, Delete
│       │       ├── publish/
│       │       │   └── route.ts  # Publish
│       │       └── analytics/
│       │           └── route.ts  # Analytics
│       └── media/
│           └── upload/
│               └── route.ts      # Media upload
├── components/
│   └── posts/
│       ├── PostEditor.tsx        # Rich text editor
│       ├── PlatformSelector.tsx  # Platform selection
│       ├── MediaUploader.tsx     # Drag & drop upload
│       ├── SchedulePicker.tsx    # Date/time picker
│       ├── PostPreview.tsx       # Platform previews
│       ├── PostList.tsx          # Post listing
│       └── PostAnalytics.tsx     # Analytics display
├── lib/
│   ├── postiz.ts                 # Postiz SDK client
│   └── validations/
│       └── post.ts               # Validation schemas
```

## Best Practices

1. **Content Strategy**
   - Write platform-appropriate content
   - Check character limits before posting
   - Use relevant hashtags
   - Include engaging media

2. **Scheduling**
   - Post during peak engagement times
   - Use best time suggestions
   - Schedule in advance for consistency

3. **Platform Selection**
   - Choose relevant platforms for your audience
   - Consider platform-specific features
   - Test content on different platforms

4. **Analytics Monitoring**
   - Review analytics regularly
   - Track engagement metrics
   - Optimize based on performance

## Troubleshooting

### Post Creation Fails
- Check API key configuration
- Verify platform connections
- Validate content length
- Check media file size

### Media Upload Issues
- Ensure file size is under 50MB
- Use supported formats (images/videos)
- Check internet connection

### Analytics Not Loading
- Wait for post to be published
- Refresh analytics data
- Check Postiz API connection

## Support

For issues or questions:
1. Check environment configuration
2. Verify Postiz API status
3. Review console logs
4. Contact system administrator
