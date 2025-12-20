/**
 * OAuth Configuration Helper
 *
 * Retrieves OAuth credentials from database with fallback to environment variables.
 * This allows UI-based configuration while maintaining backward compatibility.
 */

import { prisma } from '@/lib/db/prisma';
import { SocialPlatform } from '@prisma/client';
import { decryptToken } from './encryption';

interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  source: 'database' | 'environment';
}

/**
 * Cache for OAuth credentials to avoid repeated database queries
 */
const credentialCache = new Map<SocialPlatform, { credentials: OAuthCredentials; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get OAuth credentials for a platform
 * Priority: Database (if configured) > Environment Variables
 */
export async function getOAuthCredentials(platform: SocialPlatform): Promise<OAuthCredentials> {
  // Check cache first
  const cached = credentialCache.get(platform);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.credentials;
  }

  try {
    // Try to get from database first
    const config = await prisma.oAuthConfig.findUnique({
      where: {
        platform,
        isActive: true,
      },
    });

    if (config) {
      const credentials: OAuthCredentials = {
        clientId: decryptToken(config.clientId),
        clientSecret: decryptToken(config.clientSecret),
        source: 'database',
      };

      // Cache the result
      credentialCache.set(platform, { credentials, timestamp: Date.now() });
      return credentials;
    }
  } catch (error) {
    console.warn(`[OAuth Config] Failed to fetch from database for ${platform}:`, error);
    // Fall through to environment variables
  }

  // Fallback to environment variables
  const envMap: Record<SocialPlatform, { idKey: string; secretKey: string }> = {
    LINKEDIN: {
      idKey: 'LINKEDIN_CLIENT_ID',
      secretKey: 'LINKEDIN_CLIENT_SECRET',
    },
    TWITTER: {
      idKey: 'TWITTER_CLIENT_ID',
      secretKey: 'TWITTER_CLIENT_SECRET',
    },
    FACEBOOK: {
      idKey: 'FACEBOOK_APP_ID',
      secretKey: 'FACEBOOK_APP_SECRET',
    },
    INSTAGRAM: {
      idKey: 'INSTAGRAM_CLIENT_ID',
      secretKey: 'INSTAGRAM_CLIENT_SECRET',
    },
    YOUTUBE: {
      idKey: 'YOUTUBE_CLIENT_ID',
      secretKey: 'YOUTUBE_CLIENT_SECRET',
    },
    TIKTOK: {
      idKey: 'TIKTOK_CLIENT_KEY',
      secretKey: 'TIKTOK_CLIENT_SECRET',
    },
    THREADS: {
      idKey: 'THREADS_CLIENT_ID',
      secretKey: 'THREADS_CLIENT_SECRET',
    },
    BLUESKY: {
      idKey: 'BLUESKY_CLIENT_ID',
      secretKey: 'BLUESKY_CLIENT_SECRET',
    },
  };

  const envKeys = envMap[platform];
  const clientId = process.env[envKeys.idKey];
  const clientSecret = process.env[envKeys.secretKey];

  if (!clientId || !clientSecret) {
    throw new Error(
      `${platform} OAuth credentials not configured. Please configure via Settings > OAuth Configuration or set ${envKeys.idKey} and ${envKeys.secretKey} in .env file.`
    );
  }

  const credentials: OAuthCredentials = {
    clientId,
    clientSecret,
    source: 'environment',
  };

  // Cache the result
  credentialCache.set(platform, { credentials, timestamp: Date.now() });
  return credentials;
}

/**
 * Clear credential cache (useful after updating configurations)
 */
export function clearCredentialCache(platform?: SocialPlatform) {
  if (platform) {
    credentialCache.delete(platform);
  } else {
    credentialCache.clear();
  }
}

/**
 * Check if OAuth credentials are configured for a platform
 */
export async function hasOAuthCredentials(platform: SocialPlatform): Promise<boolean> {
  try {
    await getOAuthCredentials(platform);
    return true;
  } catch {
    return false;
  }
}
