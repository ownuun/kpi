/**
 * LinkedIn Adapter
 *
 * Implements OAuth 2.0 authentication and posting for LinkedIn.
 * API Documentation: https://learn.microsoft.com/en-us/linkedin/
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

const OAUTH_BASE_URL = 'https://www.linkedin.com/oauth/v2';
const API_BASE_URL = 'https://api.linkedin.com/v2';

export class LinkedInAdapter extends BaseSocialAdapter {
  readonly platform = 'LINKEDIN';

  /**
   * Generate LinkedIn OAuth authorization URL
   */
  async generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }> {
    const state = this.generateState();
    const { clientId } = await getOAuthCredentials('LINKEDIN');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope: 'openid profile email w_member_social',
    });

    const url = `${OAUTH_BASE_URL}/authorization?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code: string, redirectUri: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('LINKEDIN');

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        `${OAUTH_BASE_URL}/accessToken`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in, refresh_token } = tokenResponse.data;

      // Get user profile info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in || 5184000, // 60 days default
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
    const { clientId, clientSecret } = await getOAuthCredentials('LINKEDIN');

    try {
      const response = await axios.post(
        `${OAUTH_BASE_URL}/accessToken`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in, refresh_token: new_refresh_token } = response.data;

      // Get updated account info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: new_refresh_token || refreshToken,
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
   * Get account information
   */
  async getAccountInfo(accessToken: string): Promise<{
    id: string;
    name: string;
    handle?: string;
    picture?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { sub, name, email, picture } = response.data;

      return {
        id: sub,
        name: name || email,
        handle: email,
        picture,
      };
    } catch (error) {
      this.handleApiError(error, 'Get account info');
    }
  }

  /**
   * Publish a post to LinkedIn
   */
  async publishPost(accessToken: string, post: PostData): Promise<PublishResponse> {
    try {
      // Get user's LinkedIn ID (sub from userinfo)
      const userInfo = await axios.get(`${API_BASE_URL}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const authorId = `urn:li:person:${userInfo.data.sub}`;

      // Prepare post payload
      const payload: any = {
        author: authorId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // Add media if provided
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // LinkedIn supports images and articles
        // For simplicity, we'll handle images here
        payload.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        payload.specificContent['com.linkedin.ugc.ShareContent'].media = post.mediaUrls.map(
          (url) => ({
            status: 'READY',
            media: url,
          })
        );
      }

      // Create the post
      const response = await axios.post(`${API_BASE_URL}/ugcPosts`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      const postId = response.data.id;
      const postUrn = postId.replace('urn:li:share:', '');

      return {
        postId,
        url: `https://www.linkedin.com/feed/update/${postUrn}/`,
        publishedAt: new Date(),
      };
    } catch (error) {
      this.handleApiError(error, 'Publish post');
    }
  }

  /**
   * Get analytics for a LinkedIn post
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    try {
      // LinkedIn analytics requires additional API access
      // This is a simplified version
      const response = await axios.get(
        `${API_BASE_URL}/socialActions/${encodeURIComponent(postId)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      const { likesSummary, commentsSummary } = response.data;

      return {
        views: 0, // Requires LinkedIn Marketing Developer Platform
        likes: likesSummary?.totalLikes || 0,
        shares: 0, // Would need separate API call
        comments: commentsSummary?.totalComments || 0,
        impressions: 0, // Requires Marketing API
      };
    } catch (error) {
      console.warn('[LinkedIn] Analytics not available:', error);
      return {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      };
    }
  }

  /**
   * Get LinkedIn platform limits
   */
  getPlatformLimits(): PlatformLimits {
    return {
      maxContentLength: 3000,
      maxMediaCount: 9,
      supportsVideo: true,
      supportsImages: true,
      supportsScheduling: false, // LinkedIn doesn't support native scheduling via API
      allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    };
  }

  /**
   * Delete a LinkedIn post
   */
  async deletePost(accessToken: string, postId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/ugcPosts/${encodeURIComponent(postId)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
    } catch (error) {
      this.handleApiError(error, 'Delete post');
    }
  }
}

// Export singleton instance
export const linkedInAdapter = new LinkedInAdapter();
