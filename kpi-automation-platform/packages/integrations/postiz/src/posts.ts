import { PostizClient } from './client';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ListPostsParams,
  SchedulePostRequest,
  PaginatedResponse,
  PostSchema
} from './types';

/**
 * Post Management Service
 */
export class PostsService {
  constructor(private client: PostizClient) {}

  /**
   * Create a new post
   */
  async createPost(request: CreatePostRequest): Promise<Post> {
    const response = await this.client.post<Post>('/posts', request);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create post');
    }

    // Validate response data
    return PostSchema.parse(response.data);
  }

  /**
   * Get a post by ID
   */
  async getPost(postId: string): Promise<Post> {
    const response = await this.client.get<Post>(`/posts/${postId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Update an existing post
   */
  async updatePost(postId: string, request: UpdatePostRequest): Promise<Post> {
    const response = await this.client.put<Post>(`/posts/${postId}`, request);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    const response = await this.client.delete(`/posts/${postId}`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete post');
    }
  }

  /**
   * List posts with filtering and pagination
   */
  async listPosts(params?: ListPostsParams): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/posts', params);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to list posts');
    }

    // Validate each post
    const validatedPosts = response.data.items.map(post => PostSchema.parse(post));

    return {
      ...response.data,
      items: validatedPosts
    };
  }

  /**
   * Schedule a post for later publishing
   */
  async schedulePost(postId: string, request: SchedulePostRequest): Promise<Post> {
    const response = await this.client.post<Post>(
      `/posts/${postId}/schedule`,
      request
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to schedule post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Publish a post immediately
   */
  async publishPost(postId: string): Promise<Post> {
    const response = await this.client.post<Post>(`/posts/${postId}/publish`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to publish post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Cancel a scheduled post
   */
  async cancelScheduledPost(postId: string): Promise<Post> {
    const response = await this.client.post<Post>(`/posts/${postId}/cancel`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to cancel scheduled post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Duplicate a post
   */
  async duplicatePost(postId: string): Promise<Post> {
    const response = await this.client.post<Post>(`/posts/${postId}/duplicate`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to duplicate post');
    }

    return PostSchema.parse(response.data);
  }

  /**
   * Get post preview for specific platform
   */
  async getPostPreview(postId: string, platform: string): Promise<{
    preview: string;
    characterCount: number;
    mediaPreview?: string[];
  }> {
    const response = await this.client.get<any>(
      `/posts/${postId}/preview`,
      { platform }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get post preview');
    }

    return response.data;
  }

  /**
   * Validate post content for platforms
   */
  async validatePost(request: CreatePostRequest): Promise<{
    valid: boolean;
    errors?: Array<{
      platform: string;
      message: string;
    }>;
  }> {
    const response = await this.client.post<any>('/posts/validate', request);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to validate post');
    }

    return response.data;
  }

  /**
   * Bulk create posts
   */
  async bulkCreatePosts(requests: CreatePostRequest[]): Promise<Post[]> {
    const response = await this.client.post<Post[]>('/posts/bulk', {
      posts: requests
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to bulk create posts');
    }

    return response.data.map(post => PostSchema.parse(post));
  }

  /**
   * Bulk delete posts
   */
  async bulkDeletePosts(postIds: string[]): Promise<void> {
    const response = await this.client.post('/posts/bulk-delete', {
      postIds
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to bulk delete posts');
    }
  }

  /**
   * Get post statistics summary
   */
  async getPostsSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    total: number;
    published: number;
    scheduled: number;
    draft: number;
    failed: number;
  }> {
    const response = await this.client.get<any>('/posts/summary', params);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get posts summary');
    }

    return response.data;
  }

  /**
   * Search posts by content
   */
  async searchPosts(query: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get<PaginatedResponse<Post>>('/posts/search', {
      q: query,
      ...params
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to search posts');
    }

    const validatedPosts = response.data.items.map(post => PostSchema.parse(post));

    return {
      ...response.data,
      items: validatedPosts
    };
  }
}
