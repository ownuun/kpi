/**
 * Postiz Integration Package
 *
 * SNS 관리 플랫폼 Postiz API 클라이언트
 * 17개 소셜 미디어 플랫폼 통합 지원
 */

import { PostizClient } from './client';
import { PostsService } from './posts';
import { PlatformsService } from './platforms';
import { AnalyticsService } from './analytics';
import { PostizConfig } from './types';

export * from './types';
export { PostizClient } from './client';
export { PostsService } from './posts';
export { PlatformsService } from './platforms';
export { AnalyticsService } from './analytics';

/**
 * Main Postiz SDK Class
 */
export class PostizSDK {
  public readonly client: PostizClient;
  public readonly posts: PostsService;
  public readonly platforms: PlatformsService;
  public readonly analytics: AnalyticsService;

  constructor(config: PostizConfig) {
    this.client = new PostizClient(config);
    this.posts = new PostsService(this.client);
    this.platforms = new PlatformsService(this.client);
    this.analytics = new AnalyticsService(this.client);
  }

  /**
   * Check if SDK is properly configured
   */
  async healthCheck(): Promise<boolean> {
    return await this.client.healthCheck();
  }

  /**
   * Get SDK version
   */
  getVersion(): string {
    return '0.1.0';
  }
}

/**
 * Create Postiz SDK instance
 */
export function createPostizSDK(config: PostizConfig): PostizSDK {
  return new PostizSDK(config);
}

/**
 * Default export
 */
export default PostizSDK;
