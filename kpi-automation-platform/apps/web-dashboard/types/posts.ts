// Post-related type definitions

export enum Platform {
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TWITTER = 'TWITTER',
  YOUTUBE = 'YOUTUBE',
  PINTEREST = 'PINTEREST',
  TIKTOK = 'TIKTOK',
  THREADS = 'THREADS',
  REDDIT = 'REDDIT',
  DISCORD = 'DISCORD',
  TELEGRAM = 'TELEGRAM',
  MASTODON = 'MASTODON',
  BLUESKY = 'BLUESKY',
  MEDIUM = 'MEDIUM',
  WORDPRESS = 'WORDPRESS',
  GHOST = 'GHOST',
  DRUPAL = 'DRUPAL',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

export interface MediaItem {
  type: MediaType;
  url: string;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  media?: MediaItem[];
  scheduledAt?: string;
  tags?: string[];
  status: PostStatus;
  createdAt?: string;
  publishedAt?: string;
}

export interface CreatePostRequest {
  content: string;
  platforms: Platform[];
  media?: MediaItem[];
  scheduledAt?: string;
  tags?: string[];
  mentions?: string[];
}

export interface UpdatePostRequest {
  content?: string;
  platforms?: Platform[];
  media?: MediaItem[];
  scheduledAt?: string;
  tags?: string[];
  mentions?: string[];
  status?: PostStatus;
}

export interface PostAnalytics {
  platform: Platform;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  reach: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  collectedAt: string;
}

export interface ListPostsParams {
  page?: number;
  limit?: number;
  offset?: number;
  status?: PostStatus;
  platform?: Platform;
  platforms?: Platform[];
  search?: string;
  sort?: 'createdAt' | 'scheduledAt' | 'publishedAt';
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
