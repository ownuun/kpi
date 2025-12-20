/**
 * Postiz API Client
 * Wrapper for Postiz REST API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  PostizConfig,
  CreatePostRequest,
  Post,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostStatsRequest,
  PostStats,
  SocialPlatform,
  PostizApiError,
} from '../types';

export class PostizClient {
  private client: AxiosInstance;
  private config: PostizConfig;

  constructor(config: PostizConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: PostizApiError = {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
    );
  }

  /**
   * Create and schedule a new post
   */
  async createPost(request: CreatePostRequest): Promise<Post> {
    const response = await this.client.post<Post>('/posts', {
      platforms: request.platforms,
      content: request.content.text,
      media: request.content.mediaUrls,
      hashtags: request.content.hashtags,
      mentions: request.content.mentions,
      scheduledAt: request.schedule?.scheduledAt?.toISOString(),
      publishNow: request.schedule?.publishNow ?? false,
      utm: {
        source: request.utmSource,
        medium: request.utmMedium,
        campaign: request.utmCampaign,
        content: request.utmContent,
        term: request.utmTerm,
      },
    });

    return response.data;
  }

  /**
   * Get posts with filters
   */
  async getPosts(request: GetPostsRequest = {}): Promise<GetPostsResponse> {
    const response = await this.client.get<GetPostsResponse>('/posts', {
      params: {
        limit: request.limit,
        offset: request.offset,
        status: request.status,
        platform: request.platform,
        dateFrom: request.dateFrom?.toISOString(),
        dateTo: request.dateTo?.toISOString(),
      },
    });

    return response.data;
  }

  /**
   * Get a single post by ID
   */
  async getPost(postId: string): Promise<Post> {
    const response = await this.client.get<Post>(`/posts/${postId}`);
    return response.data;
  }

  /**
   * Get post statistics for a specific platform
   */
  async getPostStats(postId: string, platform: SocialPlatform): Promise<PostStats> {
    const response = await this.client.get<PostStats>(
      `/posts/${postId}/stats/${platform}`
    );
    return response.data;
  }

  /**
   * Update post statistics (typically called by n8n automation)
   */
  async updatePostStats(request: UpdatePostStatsRequest): Promise<void> {
    await this.client.put(
      `/posts/${request.postId}/stats/${request.platform}`,
      request.stats
    );
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    await this.client.delete(`/posts/${postId}`);
  }

  /**
   * Get all published posts (for stats collection)
   */
  async getPublishedPosts(dateFrom?: Date, dateTo?: Date): Promise<Post[]> {
    const response = await this.getPosts({
      status: 'published',
      dateFrom,
      dateTo,
      limit: 100, // Adjust as needed
    });

    return response.posts;
  }

  /**
   * Bulk update stats for multiple posts
   * Used by n8n workflow for daily stats collection
   */
  async bulkUpdateStats(
    updates: Array<{
      postId: string;
      platform: SocialPlatform;
      stats: PostStats;
    }>
  ): Promise<void> {
    await this.client.post('/posts/stats/bulk', { updates });
  }

  /**
   * Get available platforms
   */
  async getPlatforms(): Promise<SocialPlatform[]> {
    const response = await this.client.get<{ platforms: SocialPlatform[] }>(
      '/platforms'
    );
    return response.data.platforms;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function to create Postiz client
 */
export function createPostizClient(config: PostizConfig): PostizClient {
  return new PostizClient(config);
}
