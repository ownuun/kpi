/**
 * Postiz Utility Functions
 */

import type { Post, PostStats, SocialPlatform } from '../types';

/**
 * Calculate total engagement across all platforms
 */
export function calculateTotalEngagement(post: Post): number {
  if (!post.stats) return 0;

  let total = 0;
  Object.values(post.stats).forEach((platformStats) => {
    if (platformStats) {
      total += platformStats.likes + platformStats.comments + platformStats.shares;
    }
  });

  return total;
}

/**
 * Calculate total reach across all platforms
 */
export function calculateTotalReach(post: Post): number {
  if (!post.stats) return 0;

  let total = 0;
  Object.values(post.stats).forEach((platformStats) => {
    if (platformStats) {
      total += platformStats.views;
    }
  });

  return total;
}

/**
 * Calculate engagement rate
 */
export function calculateEngagementRate(stats: PostStats): number {
  if (stats.views === 0) return 0;
  const engagement = stats.likes + stats.comments + stats.shares;
  return (engagement / stats.views) * 100;
}

/**
 * Calculate click-through rate
 */
export function calculateCTR(stats: PostStats): number {
  if (stats.views === 0) return 0;
  return (stats.clicks / stats.views) * 100;
}

/**
 * Get best performing platform for a post
 */
export function getBestPlatform(post: Post): {
  platform: SocialPlatform;
  stats: PostStats;
} | null {
  if (!post.stats) return null;

  let bestPlatform: SocialPlatform | null = null;
  let bestEngagement = 0;

  (Object.entries(post.stats) as [SocialPlatform, PostStats][]).forEach(
    ([platform, stats]) => {
      const engagement = stats.likes + stats.comments + stats.shares;
      if (engagement > bestEngagement) {
        bestEngagement = engagement;
        bestPlatform = platform;
      }
    }
  );

  if (!bestPlatform) return null;

  return {
    platform: bestPlatform,
    stats: post.stats[bestPlatform]!,
  };
}

/**
 * Format stats for display
 */
export function formatStats(stats: PostStats): {
  views: string;
  likes: string;
  comments: string;
  shares: string;
  clicks: string;
  engagementRate: string;
  ctr: string;
} {
  return {
    views: formatNumber(stats.views),
    likes: formatNumber(stats.likes),
    comments: formatNumber(stats.comments),
    shares: formatNumber(stats.shares),
    clicks: formatNumber(stats.clicks),
    engagementRate: `${calculateEngagementRate(stats).toFixed(2)}%`,
    ctr: `${calculateCTR(stats).toFixed(2)}%`,
  };
}

/**
 * Format large numbers (1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Generate UTM parameters for tracking
 */
export function generateUTMParams(params: {
  source: SocialPlatform;
  campaign: string;
  content?: string;
}): {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
} {
  return {
    utmSource: params.source,
    utmMedium: 'social',
    utmCampaign: params.campaign,
    utmContent: params.content,
  };
}

/**
 * Build trackable link with UTM parameters
 */
export function buildTrackableLink(
  baseUrl: string,
  utmParams: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    utmTerm?: string;
  }
): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', utmParams.utmSource);
  url.searchParams.set('utm_medium', utmParams.utmMedium);
  url.searchParams.set('utm_campaign', utmParams.utmCampaign);

  if (utmParams.utmContent) {
    url.searchParams.set('utm_content', utmParams.utmContent);
  }
  if (utmParams.utmTerm) {
    url.searchParams.set('utm_term', utmParams.utmTerm);
  }

  return url.toString();
}

/**
 * Validate post content
 */
export function validatePostContent(
  content: string,
  platform: SocialPlatform
): { valid: boolean; error?: string } {
  // Platform-specific character limits
  const limits: Record<SocialPlatform, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
    youtube: 5000,
    tiktok: 2200,
    threads: 500,
    reddit: 40000,
    pinterest: 500,
    medium: 100000,
    bluesky: 300,
    mastodon: 500,
  };

  const limit = limits[platform];
  if (content.length > limit) {
    return {
      valid: false,
      error: `Content exceeds ${platform} character limit of ${limit}`,
    };
  }

  return { valid: true };
}
