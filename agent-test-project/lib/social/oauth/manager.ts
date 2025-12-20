/**
 * OAuth Manager
 *
 * Centralized OAuth authentication and token management for all social media platforms.
 * Handles the complete OAuth flow: authorization URL generation, token exchange,
 * token storage, and automatic refresh.
 */

import { SocialPlatform } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { encryptToken, decryptToken } from './encryption';
import type { ISocialAdapter, TokenDetails } from '../adapters/base.adapter';

/**
 * OAuth state stored in Redis during authentication flow
 */
export interface OAuthState {
  platform: SocialPlatform;
  userId: string;
  redirectUri: string;
  createdAt: number;
}

/**
 * Result of OAuth authentication
 */
export interface OAuthResult {
  success: boolean;
  accountId?: string;
  error?: string;
}

/**
 * OAuth Manager class
 */
export class OAuthManager {
  /**
   * Generate OAuth authorization URL for a platform
   *
   * @param adapter - The platform adapter
   * @param redirectUri - The callback URL
   * @param userId - The user ID (default: "system")
   * @returns Authorization URL and state
   */
  async generateAuthUrl(
    adapter: ISocialAdapter,
    redirectUri: string,
    userId: string = 'system'
  ): Promise<{ url: string; state: string }> {
    const { url, state } = await adapter.generateAuthUrl(redirectUri);

    // Store state in memory/Redis for validation
    // In production, you should store this in Redis with expiry
    const stateData: OAuthState = {
      platform: adapter.platform as SocialPlatform,
      userId,
      redirectUri,
      createdAt: Date.now(),
    };

    // TODO: Store in Redis
    // await redis.setex(`oauth:state:${state}`, 600, JSON.stringify(stateData));

    return { url, state };
  }

  /**
   * Complete OAuth authentication flow
   *
   * @param adapter - The platform adapter
   * @param code - Authorization code from callback
   * @param state - State parameter from callback
   * @param redirectUri - The callback URL used in authorization
   * @param userId - The user ID (default: "system")
   * @returns OAuth result with account ID or error
   */
  async authenticate(
    adapter: ISocialAdapter,
    code: string,
    state: string,
    redirectUri: string,
    userId: string = 'system'
  ): Promise<OAuthResult> {
    try {
      // TODO: Validate state from Redis
      // const storedState = await redis.get(`oauth:state:${state}`);
      // if (!storedState) {
      //   throw new Error('Invalid or expired OAuth state');
      // }

      // Exchange code for tokens
      const tokenDetails = await adapter.authenticate(code, redirectUri);

      // Store account in database with encrypted tokens
      await this.saveAccount(adapter.platform as SocialPlatform, tokenDetails, userId);

      return {
        success: true,
        accountId: tokenDetails.accountId,
      };
    } catch (error: any) {
      console.error(`[OAuth] Authentication failed for ${adapter.platform}:`, error);
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    }
  }

  /**
   * Save or update social account with encrypted tokens
   *
   * @param platform - The social media platform
   * @param tokenDetails - Token details from OAuth flow
   * @param userId - The user ID
   */
  async saveAccount(
    platform: SocialPlatform,
    tokenDetails: TokenDetails,
    userId: string = 'system'
  ): Promise<void> {
    const encryptedAccessToken = encryptToken(tokenDetails.accessToken);
    const encryptedRefreshToken = tokenDetails.refreshToken
      ? encryptToken(tokenDetails.refreshToken)
      : null;

    const tokenExpiresAt = tokenDetails.expiresIn
      ? new Date(Date.now() + tokenDetails.expiresIn * 1000)
      : null;

    await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformId: {
          userId,
          platform,
          platformId: tokenDetails.accountId,
        },
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt,
        accountName: tokenDetails.accountName,
        accountHandle: tokenDetails.accountHandle,
        accountPicture: tokenDetails.accountPicture,
        isActive: true,
        lastError: null,
        lastErrorAt: null,
        retryCount: 0,
        updatedAt: new Date(),
      },
      create: {
        userId,
        platform,
        platformId: tokenDetails.accountId,
        accountName: tokenDetails.accountName,
        accountHandle: tokenDetails.accountHandle,
        accountPicture: tokenDetails.accountPicture,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt,
        isActive: true,
      },
    });
  }

  /**
   * Get decrypted access token for a platform
   *
   * @param platform - The social media platform
   * @param userId - The user ID (default: "system")
   * @returns Decrypted access token or null if not found
   */
  async getAccessToken(
    platform: SocialPlatform,
    userId: string = 'system'
  ): Promise<string | null> {
    const account = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform,
        isActive: true,
      },
    });

    if (!account) {
      return null;
    }

    // Check if token needs refresh
    if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
      // Token expired, needs refresh
      console.warn(`[OAuth] Access token expired for ${platform}`);
      return null;
    }

    return decryptToken(account.accessToken);
  }

  /**
   * Get social account with decrypted tokens
   *
   * @param accountId - The social account database ID
   * @returns Account with decrypted tokens
   */
  async getAccount(accountId: string) {
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return null;
    }

    return {
      ...account,
      accessToken: decryptToken(account.accessToken),
      refreshToken: account.refreshToken ? decryptToken(account.refreshToken) : null,
    };
  }

  /**
   * Refresh access token for a platform
   *
   * @param adapter - The platform adapter
   * @param platform - The social media platform
   * @param userId - The user ID (default: "system")
   * @returns Success status
   */
  async refreshAccessToken(
    adapter: ISocialAdapter,
    platform: SocialPlatform,
    userId: string = 'system'
  ): Promise<boolean> {
    try {
      const account = await prisma.socialAccount.findFirst({
        where: {
          userId,
          platform,
          isActive: true,
        },
      });

      if (!account || !account.refreshToken) {
        console.error(`[OAuth] No refresh token found for ${platform}`);
        return false;
      }

      const decryptedRefreshToken = decryptToken(account.refreshToken);
      const newTokenDetails = await adapter.refreshToken(decryptedRefreshToken);

      // Update account with new tokens
      await this.saveAccount(platform, newTokenDetails, userId);

      console.log(`[OAuth] Successfully refreshed token for ${platform}`);
      return true;
    } catch (error: any) {
      console.error(`[OAuth] Failed to refresh token for ${platform}:`, error);

      // Mark account with error
      await prisma.socialAccount.updateMany({
        where: {
          userId,
          platform,
        },
        data: {
          lastError: error.message,
          lastErrorAt: new Date(),
          retryCount: {
            increment: 1,
          },
        },
      });

      return false;
    }
  }

  /**
   * Disconnect a social account
   *
   * @param accountId - The social account database ID
   */
  async disconnectAccount(accountId: string): Promise<void> {
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get all active accounts for a user
   *
   * @param userId - The user ID (default: "system")
   * @returns List of active social accounts
   */
  async getActiveAccounts(userId: string = 'system') {
    return await prisma.socialAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        platform: true,
        platformId: true,
        accountName: true,
        accountHandle: true,
        accountPicture: true,
        tokenExpiresAt: true,
        lastSyncedAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Check if a platform is connected for a user
   *
   * @param platform - The social media platform
   * @param userId - The user ID (default: "system")
   * @returns True if connected and active
   */
  async isPlatformConnected(
    platform: SocialPlatform,
    userId: string = 'system'
  ): Promise<boolean> {
    const account = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform,
        isActive: true,
      },
    });

    return !!account;
  }
}

// Export singleton instance
export const oauthManager = new OAuthManager();
