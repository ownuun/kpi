/**
 * Twitter/X Adapter
 *
 * Implements OAuth 2.0 authentication and posting for Twitter (X).
 * API Documentation: https://developer.twitter.com/en/docs/twitter-api
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

const OAUTH_BASE_URL = 'https://twitter.com/i/oauth2';
const API_BASE_URL = 'https://api.twitter.com/2';

export class TwitterAdapter extends BaseSocialAdapter {
  readonly platform = 'TWITTER';

  /**
   * Generate Twitter OAuth authorization URL
   */
  async generateAuthUrl(redirectUri: string): Promise<{ url: string; state: string }> {
    const state = this.generateState();
    const { clientId } = await getOAuthCredentials('TWITTER');

    // Twitter OAuth 2.0 with PKCE
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store code_verifier in Redis/session for later use
    // TODO: Store codeVerifier with state for verification

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const url = `${OAUTH_BASE_URL}/authorize?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code: string, redirectUri: string): Promise<TokenDetails> {
    const { clientId, clientSecret } = await getOAuthCredentials('TWITTER');

    try {
      // TODO: Retrieve code_verifier from Redis/session using state
      const codeVerifier = 'stored_code_verifier'; // Placeholder

      // Exchange code for access token
      const tokenResponse = await axios.post(
        `${OAUTH_BASE_URL}/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Get user info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in || 7200, // 2 hours default
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
    const { clientId, clientSecret } = await getOAuthCredentials('TWITTER');

    try {
      const response = await axios.post(
        `${OAUTH_BASE_URL}/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        }
      );

      const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

      // Get updated account info
      const accountInfo = await this.getAccountInfo(access_token);

      return {
        accessToken: access_token,
        refreshToken: new_refresh_token || refreshToken,
        expiresIn: expires_in || 7200,
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
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          'user.fields': 'id,name,username,profile_image_url',
        },
      });

      const { id, name, username, profile_image_url } = response.data.data;

      return {
        id,
        name,
        handle: `@${username}`,
        picture: profile_image_url,
      };
    } catch (error) {
      this.handleApiError(error, 'Get account info');
    }
  }

  /**
   * Publish a tweet
   */
  async publishPost(accessToken: string, post: PostData): Promise<PublishResponse> {
    try {
      const payload: any = {
        text: post.content,
      };

      // Add media if provided
      // Note: Media must be uploaded separately to Twitter's media upload endpoint
      // This is a simplified version
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // TODO: Upload media first and get media IDs
        // payload.media = { media_ids: uploadedMediaIds };
        console.warn('[Twitter] Media upload not yet implemented');
      }

      const response = await axios.post(`${API_BASE_URL}/tweets`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const { id: tweetId } = response.data.data;

      // Get user info to construct URL
      const userInfo = await this.getAccountInfo(accessToken);
      const username = userInfo.handle?.replace('@', '') || 'unknown';

      return {
        postId: tweetId,
        url: `https://twitter.com/${username}/status/${tweetId}`,
        publishedAt: new Date(),
      };
    } catch (error) {
      this.handleApiError(error, 'Publish tweet');
    }
  }

  /**
   * Get analytics for a tweet
   */
  async getAnalytics(accessToken: string, postId: string): Promise<AnalyticsData> {
    try {
      // Get tweet metrics
      const response = await axios.get(`${API_BASE_URL}/tweets/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          'tweet.fields': 'public_metrics',
        },
      });

      const metrics = response.data.data.public_metrics;

      return {
        views: metrics.impression_count || 0,
        likes: metrics.like_count || 0,
        shares: metrics.retweet_count || 0,
        comments: metrics.reply_count || 0,
        impressions: metrics.impression_count || 0,
      };
    } catch (error) {
      console.warn('[Twitter] Analytics not available:', error);
      return {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
      };
    }
  }

  /**
   * Get Twitter platform limits
   */
  getPlatformLimits(): PlatformLimits {
    return {
      maxContentLength: 280, // Standard tweets (up to 25,000 for Twitter Blue)
      maxMediaCount: 4,
      supportsVideo: true,
      supportsImages: true,
      supportsScheduling: false, // Not supported via API v2
      allowedMediaTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
      ],
    };
  }

  /**
   * Delete a tweet
   */
  async deletePost(accessToken: string, postId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/tweets/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      this.handleApiError(error, 'Delete tweet');
    }
  }

  /**
   * Generate code verifier for PKCE
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64url');
  }

  /**
   * Generate code challenge from verifier
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(digest).toString('base64url');
  }
}

// Export singleton instance
export const twitterAdapter = new TwitterAdapter();
