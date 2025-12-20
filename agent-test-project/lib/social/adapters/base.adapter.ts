/**
 * Base Social Media Adapter Interface
 *
 * All social media platform adapters must implement this interface
 * to ensure consistent behavior across different platforms.
 */

export interface TokenDetails {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds
  accountId: string;
  accountName: string;
  accountHandle?: string;
  accountPicture?: string;
}

export interface PostData {
  content: string;
  title?: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
}

export interface PublishResponse {
  postId: string;
  url: string;
  publishedAt: Date;
}

export interface AnalyticsData {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks?: number;
  impressions?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PlatformLimits {
  maxContentLength: number;
  maxMediaCount: number;
  maxTitleLength?: number;
  supportsVideo: boolean;
  supportsImages: boolean;
  supportsScheduling: boolean;
  allowedMediaTypes?: string[];
}

export interface ISocialAdapter {
  // Platform identifier
  readonly platform: string;

  // OAuth Authentication
  generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }>;
  authenticate(code: string, redirectUri: string): Promise<TokenDetails>;
  refreshToken(refreshToken: string): Promise<TokenDetails>;

  // Content Publishing
  publishPost(accessToken: string, post: PostData): Promise<PublishResponse>;
  deletePost(accessToken: string, postId: string): Promise<void>;

  // Analytics
  getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData>;

  // Validation
  validatePost(post: PostData): ValidationResult;
  getPlatformLimits(): PlatformLimits;

  // Account Info
  getAccountInfo(accessToken: string): Promise<{
    id: string;
    name: string;
    handle?: string;
    picture?: string;
  }>;
}

/**
 * Abstract base class with common functionality
 */
export abstract class BaseSocialAdapter implements ISocialAdapter {
  abstract readonly platform: string;

  abstract generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }>;
  abstract authenticate(code: string, redirectUri: string): Promise<TokenDetails>;
  abstract refreshToken(refreshToken: string): Promise<TokenDetails>;
  abstract publishPost(accessToken: string, post: PostData): Promise<PublishResponse>;
  abstract getAccountInfo(accessToken: string): Promise<{
    id: string;
    name: string;
    handle?: string;
    picture?: string;
  }>;
  abstract getPlatformLimits(): PlatformLimits;

  /**
   * Default implementation for post deletion
   * Override in specific adapters if platform supports deletion
   */
  async deletePost(accessToken: string, postId: string): Promise<void> {
    throw new Error(`Post deletion not implemented for ${this.platform}`);
  }

  /**
   * Default implementation for analytics
   * Override in specific adapters
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    return {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    };
  }

  /**
   * Default post validation
   * Override for platform-specific validation
   */
  validatePost(post: PostData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const limits = this.getPlatformLimits();

    // Check content length
    if (!post.content || post.content.trim().length === 0) {
      errors.push('Post content cannot be empty');
    } else if (post.content.length > limits.maxContentLength) {
      errors.push(
        `Content exceeds maximum length of ${limits.maxContentLength} characters`
      );
    }

    // Check title length if applicable
    if (post.title && limits.maxTitleLength) {
      if (post.title.length > limits.maxTitleLength) {
        errors.push(
          `Title exceeds maximum length of ${limits.maxTitleLength} characters`
        );
      }
    }

    // Check media count
    if (post.mediaUrls && post.mediaUrls.length > limits.maxMediaCount) {
      errors.push(
        `Too many media files. Maximum allowed: ${limits.maxMediaCount}`
      );
    }

    // Check if video is supported
    if (post.mediaUrls && !limits.supportsVideo) {
      const hasVideo = post.mediaUrls.some(url =>
        /\.(mp4|mov|avi|webm)$/i.test(url)
      );
      if (hasVideo) {
        errors.push('Video content is not supported on this platform');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Helper method to handle API errors
   */
  protected handleApiError(error: any, context: string): never {
    console.error(`[${this.platform}] ${context}:`, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 401) {
        throw new Error(`Authentication failed for ${this.platform}: ${message}`);
      } else if (status === 403) {
        throw new Error(`Permission denied for ${this.platform}: ${message}`);
      } else if (status === 429) {
        throw new Error(`Rate limit exceeded for ${this.platform}: ${message}`);
      }

      throw new Error(`${this.platform} API error (${status}): ${message}`);
    }

    throw new Error(`${this.platform} error: ${error.message || 'Unknown error'}`);
  }

  /**
   * Generate a random state for OAuth
   */
  protected generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}
