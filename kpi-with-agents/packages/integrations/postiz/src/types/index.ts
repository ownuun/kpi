/**
 * Postiz API Types
 * Based on Postiz API documentation
 */

export interface PostizConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
}

export type SocialPlatform =
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
  | 'threads'
  | 'reddit'
  | 'pinterest'
  | 'medium'
  | 'bluesky'
  | 'mastodon';

export interface PostContent {
  text: string;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
}

export interface PostSchedule {
  scheduledAt?: Date;
  publishNow?: boolean;
}

export interface CreatePostRequest {
  platforms: SocialPlatform[];
  content: PostContent;
  schedule?: PostSchedule;

  // UTM parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

export interface Post {
  id: string;
  platforms: SocialPlatform[];
  content: PostContent;
  publishedAt?: Date;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  stats?: Partial<Record<SocialPlatform, PostStats>>;
  externalIds?: Partial<Record<SocialPlatform, string>>;
}

export interface GetPostsRequest {
  limit?: number;
  offset?: number;
  status?: Post['status'];
  platform?: SocialPlatform;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export interface UpdatePostStatsRequest {
  postId: string;
  platform: SocialPlatform;
  stats: PostStats;
}

export interface PostizApiError {
  message: string;
  code: string;
  statusCode: number;
}
