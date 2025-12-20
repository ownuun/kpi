/**
 * Register all available social media adapters
 *
 * Import this file to initialize all adapters in the factory
 */

import { adapterFactory } from './adapter-factory';
import { linkedInAdapter } from './linkedin.adapter';
import { twitterAdapter } from './twitter.adapter';
import { facebookAdapter } from './facebook.adapter';
import { threadsAdapter } from './threads.adapter';
import { redditAdapter } from './reddit.adapter';
import { SocialPlatform } from '@prisma/client';

// Register Tier 1 adapters (LinkedIn, Twitter)
adapterFactory.register(SocialPlatform.LINKEDIN, linkedInAdapter);
adapterFactory.register(SocialPlatform.TWITTER, twitterAdapter);

// Register Tier 2 adapters (Facebook, Reddit)
adapterFactory.register(SocialPlatform.FACEBOOK, facebookAdapter);

// Register Tier 3 adapters (Threads, Reddit)
adapterFactory.register(SocialPlatform.THREADS, threadsAdapter);

// Note: Reddit is not in the SocialPlatform enum yet
// We'll need to add it to the Prisma schema

// TODO: Register remaining adapters (Instagram, YouTube, TikTok, Bluesky)
// adapterFactory.register(SocialPlatform.INSTAGRAM, instagramAdapter);
// adapterFactory.register(SocialPlatform.YOUTUBE, youtubeAdapter);
// adapterFactory.register(SocialPlatform.TIKTOK, tiktokAdapter);
// adapterFactory.register(SocialPlatform.BLUESKY, blueskyAdapter);

console.log('[Adapters] Registered platforms:', adapterFactory.getAvailablePlatforms());
