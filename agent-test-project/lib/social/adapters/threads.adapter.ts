/**
 * Threads Adapter
 *
 * Implements OAuth 2.0 authentication and posting for Threads (by Meta).
 * API Documentation: https://developers.facebook.com/docs/threads
 *
 * Note: Threads uses Meta's Graph API infrastructure
 */

import axios from 'axios';
import {
  BaseSocialAdapter,
  type TokenDetails,
  type PostData,
  type PublishResponse,
  type PlatformLimits,
  type AnalyticsData,
} from './base.adapter';
import { getOAuthCredentials } from '../oauth/config';

const OAUTH_BASE_URL = 'https://www.threads.net/oauth';
const API_BASE_URL = 'https://graph.threads.net/v1.0';

export class ThreadsAdapter extends BaseSocialAdapter {
  readonly platform = 'THREADS';

  /**
   * Generate Threads OAuth authorization URL
   */
  async generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }> {
    const state = this.generateState();
    const { clientId } = await getOAuthCredentials('THREADS');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope: 'threads_basic,threads_content_publish,threads_manage_insights',
      response_type: 'code',
    });

    const url = `${OAUTH_BASE_URL}/authorize?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code: string, redirectUri: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('THREADS');

    try {
      // Exchange code for access token
      const tokenResponse = await axios.get(`${OAUTH_BASE_URL}/access_token`, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        },
      });

      const { access_token, user_id } = tokenResponse.data;

      // Get user profile info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        expiresIn: 5184000, // 60 days
        accountId: user_id || accountInfo.id,
        accountName: accountInfo.name,
        accountHandle: accountInfo.handle,
        accountPicture: accountInfo.picture,
      };
    } catch (error) {
      this.handleApiError(error, 'OAuth authentication');
    }
  }

  /**
   * Refresh access token (Threads uses long-lived tokens)
   */
  async refreshToken(refreshToken: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('THREADS');

    try {
      const response = await axios.get(`${API_BASE_URL}/refresh_access_token`, {
        params: {
          grant_type: 'th_refresh_token',
          access_token: refreshToken,
        },
      });

      const { access_token, expires_in } = response.data;
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        expiresIn: expires_in || 5184000,
        accountId: accountInfo.id,
        accountName: accountInfo.name,
        accountHandle: accountInfo.handle,
        accountPicture: accountInfo.picture,
      };
    } catch (error) {
      this.handleApiError(error, 'Token refresh');
    }
  }

  /**
   * Publish post to Threads
   */
  async publishPost(accessToken: string, post: PostData): Promise<PublishResponse> {
    try {
      // Step 1: Create media container
      const createResponse = await axios.post(
        `${API_BASE_URL}/me/threads`,
        {
          media_type: 'TEXT',
          text: post.content,
          access_token: accessToken,
        }
      );

      const creationId = createResponse.data.id;

      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `${API_BASE_URL}/me/threads_publish`,
        {
          creation_id: creationId,
          access_token: accessToken,
        }
      );

      const postId = publishResponse.data.id;

      return {
        postId,
        url: `https://www.threads.net/@username/post/${postId}`,
        publishedAt: new Date(),
      };
    } catch (error) {
      this.handleApiError(error, 'Post publishing');
    }
  }

  /**
   * Get analytics for a Threads post
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${postId}`, {
        params: {
          fields: 'like_count,reply_count,repost_count,quote_count,views',
          access_token: accessToken,
        },
      });

      const data = response.data;

      return {
        views: data.views || 0,
        likes: data.like_count || 0,
        shares: (data.repost_count || 0) + (data.quote_count || 0),
        comments: data.reply_count || 0,
      };
    } catch (error) {
      console.warn('[Threads] Failed to fetch analytics:', error);
      return {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      };
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(accessToken: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, {
        params: {
          fields: 'id,username,name,threads_profile_picture_url',
          access_token: accessToken,
        },
      });

      const data = response.data;

      return {
        id: data.id,
        name: data.name || data.username,
        handle: data.username,
        picture: data.threads_profile_picture_url,
      };
    } catch (error) {
      this.handleApiError(error, 'Get account info');
    }
  }

  /**
   * Get platform limits for Threads
   */
  getPlatformLimits(): PlatformLimits {
    return {
      maxContentLength: 500, // Threads has 500 character limit
      maxMediaCount: 1,
      supportsVideo: true,
      supportsImages: true,
      supportsScheduling: false, // Threads doesn't support scheduling yet
      allowedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    };
  }
}

// Export singleton instance
export const threadsAdapter = new ThreadsAdapter();
