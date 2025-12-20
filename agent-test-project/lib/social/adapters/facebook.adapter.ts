/**
 * Facebook Adapter
 *
 * Implements OAuth 2.0 authentication and posting for Facebook Pages.
 * API Documentation: https://developers.facebook.com/docs/graph-api
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

const OAUTH_BASE_URL = 'https://www.facebook.com/v19.0/dialog/oauth';
const TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token';
const API_BASE_URL = 'https://graph.facebook.com/v19.0';

export class FacebookAdapter extends BaseSocialAdapter {
  readonly platform = 'FACEBOOK';

  /**
   * Generate Facebook OAuth authorization URL
   */
  async generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }> {
    const state = this.generateState();
    const { clientId } = await getOAuthCredentials('FACEBOOK');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,public_profile',
      response_type: 'code',
    });

    const url = `${OAUTH_BASE_URL}?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code: string, redirectUri: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('FACEBOOK');

    try {
      // Step 1: Exchange code for short-lived user access token
      const tokenResponse = await axios.get(TOKEN_URL, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      const { access_token } = tokenResponse.data;

      // Step 2: Exchange for long-lived token
      const longLivedResponse = await axios.get(TOKEN_URL, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: clientId,
          client_secret: clientSecret,
          fb_exchange_token: access_token,
        },
      });

      const longLivedToken = longLivedResponse.data.access_token;
      const expiresIn = longLivedResponse.data.expires_in || 5184000; // 60 days

      // Get user account info
      const accountInfo = await this.getAccountInfo(longLivedToken);

      return {
        accessToken: longLivedToken,
        expiresIn,
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
   * Refresh access token (extend long-lived token)
   */
  async refreshToken(refreshToken: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('FACEBOOK');

    try {
      const response = await axios.get(TOKEN_URL, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: clientId,
          client_secret: clientSecret,
          fb_exchange_token: refreshToken,
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
   * Publish post to Facebook Page
   */
  async publishPost(accessToken: string, post: PostData): Promise<PublishResponse> {
    try {
      // First, get the user's pages
      const pagesResponse = await axios.get(`${API_BASE_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
        },
      });

      if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
        throw new Error('No Facebook Pages found. You need to manage at least one Page to post.');
      }

      // Use the first page for posting
      const page = pagesResponse.data.data[0];
      const pageId = page.id;
      const pageAccessToken = page.access_token;

      // Create the post
      const postData: any = {
        message: post.content,
        access_token: pageAccessToken,
      };

      // Add media if provided
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        postData.link = post.mediaUrls[0]; // Facebook will preview the first link
      }

      const response = await axios.post(
        `${API_BASE_URL}/${pageId}/feed`,
        postData
      );

      const postId = response.data.id;

      return {
        postId,
        url: `https://www.facebook.com/${postId}`,
        publishedAt: new Date(),
      };
    } catch (error) {
      this.handleApiError(error, 'Post publishing');
    }
  }

  /**
   * Delete a Facebook post
   */
  async deletePost(accessToken: string, postId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${postId}`, {
        params: {
          access_token: accessToken,
        },
      });
    } catch (error) {
      this.handleApiError(error, 'Post deletion');
    }
  }

  /**
   * Get analytics for a Facebook post
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${postId}`, {
        params: {
          fields: 'insights.metric(post_impressions,post_engaged_users,post_reactions_like_total,post_clicks)',
          access_token: accessToken,
        },
      });

      const insights = response.data.insights?.data || [];
      const metrics: any = {};

      insights.forEach((insight: any) => {
        const value = insight.values?.[0]?.value || 0;
        metrics[insight.name] = value;
      });

      return {
        views: metrics.post_impressions || 0,
        likes: metrics.post_reactions_like_total || 0,
        shares: 0, // Would need separate API call
        comments: 0, // Would need separate API call
        clicks: metrics.post_clicks || 0,
        impressions: metrics.post_impressions || 0,
      };
    } catch (error) {
      console.warn('[Facebook] Failed to fetch analytics:', error);
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
          fields: 'id,name,picture',
          access_token: accessToken,
        },
      });

      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        handle: data.id, // Facebook doesn't have handles like @ username
        picture: data.picture?.data?.url,
      };
    } catch (error) {
      this.handleApiError(error, 'Get account info');
    }
  }

  /**
   * Get platform limits for Facebook
   */
  getPlatformLimits(): PlatformLimits {
    return {
      maxContentLength: 63206, // Facebook has very high limit
      maxMediaCount: 10,
      supportsVideo: true,
      supportsImages: true,
      supportsScheduling: true,
      allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    };
  }
}

// Export singleton instance
export const facebookAdapter = new FacebookAdapter();
