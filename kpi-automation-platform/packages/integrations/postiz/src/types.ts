import { z } from 'zod';

/**
 * Postiz Platform Types
 */
export enum Platform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  PINTEREST = 'pinterest',
  TIKTOK = 'tiktok',
  THREADS = 'threads',
  REDDIT = 'reddit',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  MASTODON = 'mastodon',
  BLUESKY = 'bluesky',
  MEDIUM = 'medium',
  WORDPRESS = 'wordpress',
  GHOST = 'ghost',
  DRUPAL = 'drupal'
}

/**
 * Post Status
 */
export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Media Type
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif'
}

/**
 * Zod Schemas
 */
export const MediaSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(MediaType),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional()
});

export const PostSchema = z.object({
  id: z.string(),
  content: z.string(),
  platforms: z.array(z.nativeEnum(Platform)),
  status: z.nativeEnum(PostStatus),
  scheduledAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
  media: z.array(MediaSchema).optional(),
  tags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const AnalyticsSchema = z.object({
  postId: z.string(),
  platform: z.nativeEnum(Platform),
  views: z.number(),
  likes: z.number(),
  shares: z.number(),
  comments: z.number(),
  clicks: z.number(),
  reach: z.number(),
  impressions: z.number(),
  engagement: z.number(),
  engagementRate: z.number(),
  collectedAt: z.string().datetime()
});

export const PlatformConnectionSchema = z.object({
  id: z.string(),
  platform: z.nativeEnum(Platform),
  accountId: z.string(),
  accountName: z.string(),
  isActive: z.boolean(),
  connectedAt: z.string().datetime(),
  lastSyncAt: z.string().datetime().optional()
});

/**
 * TypeScript Types
 */
export type Media = z.infer<typeof MediaSchema>;
export type Post = z.infer<typeof PostSchema>;
export type Analytics = z.infer<typeof AnalyticsSchema>;
export type PlatformConnection = z.infer<typeof PlatformConnectionSchema>;

/**
 * API Request Types
 */
export interface CreatePostRequest {
  content: string;
  platforms: Platform[];
  scheduledAt?: string;
  media?: {
    type: MediaType;
    url: string;
  }[];
  tags?: string[];
  mentions?: string[];
}

export interface UpdatePostRequest {
  content?: string;
  platforms?: Platform[];
  scheduledAt?: string;
  media?: {
    type: MediaType;
    url: string;
  }[];
  tags?: string[];
  mentions?: string[];
}

export interface ListPostsParams {
  status?: PostStatus;
  platforms?: Platform[];
  limit?: number;
  offset?: number;
  sort?: 'createdAt' | 'scheduledAt' | 'publishedAt';
  order?: 'asc' | 'desc';
}

export interface SchedulePostRequest {
  scheduledAt: string;
  timezone?: string;
}

export interface UploadMediaRequest {
  file: Buffer | File;
  type: MediaType;
  filename: string;
}

export interface GetAnalyticsParams {
  postId: string;
  platforms?: Platform[];
  startDate?: string;
  endDate?: string;
}

export interface ConnectPlatformRequest {
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  accountId?: string;
  accountName?: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Client Configuration
 */
export interface PostizConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Error Types
 */
export class PostizError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'PostizError';
  }
}
