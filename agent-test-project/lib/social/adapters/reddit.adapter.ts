/**
 * Reddit Adapter
 *
 * Implements OAuth 2.0 authentication and posting for Reddit.
 * API Documentation: https://www.reddit.com/dev/api/
 *
 * Note: Reddit requires a unique User-Agent header
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

const OAUTH_BASE_URL = 'https://www.reddit.com/api/v1/authorize';
const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const API_BASE_URL = 'https://oauth.reddit.com';

const USER_AGENT = 'KPI-Tracker/1.0.0 (https://github.com/yourusername/kpi-tracker)';

export class RedditAdapter extends BaseSocialAdapter {
  readonly platform = 'REDDIT';

  /**
   * Generate Reddit OAuth authorization URL
   */
  async generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }> {
    const state = this.generateState();
    const { clientId } = await getOAuthCredentials('REDDIT');

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      state,
      redirect_uri: redirectUri,
      duration: 'permanent', // Get refresh token
      scope: 'identity submit read mysubreddits',
    });

    const url = `${OAUTH_BASE_URL}?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code: string, redirectUri: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('REDDIT');

    try {
      // Reddit requires Basic Auth with client credentials
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const tokenResponse = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': USER_AGENT,
          },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Get user account info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in || 3600, // Usually 1 hour
        accountId: accountInfo.id,
        accountName: accountInfo.name,
        accountHandle: accountInfo.handle,
        accountPicture: accountInfo.picture,
      };
    } catch (error) {
      this.handleApiError(error, 'OAuth authentication');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('REDDIT');

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': USER_AGENT,
          },
        }
      );

      const { access_token, expires_in } = response.data;
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: refreshToken, // Refresh token doesn't change
        expiresIn: expires_in || 3600,
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
   * Publish post to Reddit
   *
   * Note: This posts to the user's profile. For posting to subreddits,
   * you would need to specify the subreddit name.
   */
  async publishPost(accessToken: string, post: PostData): Promise<PublishResponse> {
    try {
      // Get user info to post to their profile
      const accountInfo = await this.getAccountInfo(accessToken);
      const subreddit = `u_${accountInfo.handle}`; // User's profile

      const postData: any = {
        kind: 'self', // Text post
        sr: subreddit,
        title: post.title || post.content.substring(0, 100), // Reddit requires a title
        text: post.content,
      };

      // Add link if media URL provided
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        postData.kind = 'link';
        postData.url = post.mediaUrls[0];
        delete postData.text; // Link posts don't have text body
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/submit`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const postUrl = response.data.json?.data?.url || '';
      const postId = response.data.json?.data?.name || '';

      return {
        postId,
        url: postUrl,
        publishedAt: new Date(),
      };
    } catch (error) {
      this.handleApiError(error, 'Post publishing');
    }
  }

  /**
   * Delete a Reddit post
   */
  async deletePost(accessToken: string, postId: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/api/del`,
        new URLSearchParams({
          id: postId,
        }),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error) {
      this.handleApiError(error, 'Post deletion');
    }
  }

  /**
   * Get analytics for a Reddit post
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/info`, {
        params: {
          id: postId,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': USER_AGENT,
        },
      });

      const post = response.data.data?.children?.[0]?.data;

      if (!post) {
        throw new Error('Post not found');
      }

      return {
        views: post.view_count || 0,
        likes: post.ups || 0,
        shares: 0, // Reddit doesn't provide share count
        comments: post.num_comments || 0,
      };
    } catch (error) {
      console.warn('[Reddit] Failed to fetch analytics:', error);
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
      const response = await axios.get(`${API_BASE_URL}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': USER_AGENT,
        },
      });

      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        handle: data.name, // Reddit username
        picture: data.icon_img || data.snoovatar_img,
      };
    } catch (error) {
      this.handleApiError(error, 'Get account info');
    }
  }

  /**
   * Get platform limits for Reddit
   */
  getPlatformLimits(): PlatformLimits {
    return {
      maxContentLength: 40000, // Reddit has 40,000 character limit for text posts
      maxMediaCount: 1,
      maxTitleLength: 300,
      supportsVideo: true,
      supportsImages: true,
      supportsScheduling: false,
      allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    };
  }
}

// Export singleton instance
export const redditAdapter = new RedditAdapter();
