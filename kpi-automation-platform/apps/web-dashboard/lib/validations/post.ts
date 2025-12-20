import { z } from 'zod';
import { Platform, MediaType } from '@/types/posts';

/**
 * Platform character limits
 */
export const PLATFORM_LIMITS: Record<Platform, number> = {
  [Platform.TWITTER]: 280,
  [Platform.FACEBOOK]: 63206,
  [Platform.INSTAGRAM]: 2200,
  [Platform.LINKEDIN]: 3000,
  [Platform.YOUTUBE]: 5000,
  [Platform.PINTEREST]: 500,
  [Platform.TIKTOK]: 2200,
  [Platform.THREADS]: 500,
  [Platform.REDDIT]: 40000,
  [Platform.DISCORD]: 2000,
  [Platform.TELEGRAM]: 4096,
  [Platform.MASTODON]: 500,
  [Platform.BLUESKY]: 300,
  [Platform.MEDIUM]: 100000,
  [Platform.WORDPRESS]: 100000,
  [Platform.GHOST]: 100000,
  [Platform.DRUPAL]: 100000,
};

/**
 * Validation schema for creating a post
 */
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(100000, 'Content is too long'),
  platforms: z
    .array(z.nativeEnum(Platform))
    .min(1, 'At least one platform must be selected')
    .max(17, 'Maximum 17 platforms allowed'),
  scheduledAt: z
    .string()
    .datetime()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const scheduledDate = new Date(date);
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
        return scheduledDate >= now;
      },
      {
        message: 'Scheduled time must be at least 5 minutes in the future',
      }
    ),
  media: z
    .array(
      z.object({
        type: z.nativeEnum(MediaType),
        url: z.string().url('Invalid media URL'),
      })
    )
    .max(10, 'Maximum 10 media files allowed')
    .optional(),
  tags: z.array(z.string()).max(30, 'Maximum 30 tags allowed').optional(),
  mentions: z.array(z.string()).max(20, 'Maximum 20 mentions allowed').optional(),
  isDraft: z.boolean().optional(),
});

/**
 * Validation schema for updating a post
 */
export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(100000, 'Content is too long')
    .optional(),
  platforms: z
    .array(z.nativeEnum(Platform))
    .min(1, 'At least one platform must be selected')
    .max(17, 'Maximum 17 platforms allowed')
    .optional(),
  scheduledAt: z
    .string()
    .datetime()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const scheduledDate = new Date(date);
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        return scheduledDate >= now;
      },
      {
        message: 'Scheduled time must be at least 5 minutes in the future',
      }
    ),
  media: z
    .array(
      z.object({
        type: z.nativeEnum(MediaType),
        url: z.string().url('Invalid media URL'),
      })
    )
    .max(10, 'Maximum 10 media files allowed')
    .optional(),
  tags: z.array(z.string()).max(30, 'Maximum 30 tags allowed').optional(),
  mentions: z.array(z.string()).max(20, 'Maximum 20 mentions allowed').optional(),
});

/**
 * Validate post content against platform character limits
 */
export function validatePlatformLimits(
  content: string,
  platforms: Platform[]
): { valid: boolean; errors: Array<{ platform: Platform; message: string }> } {
  const errors: Array<{ platform: Platform; message: string }> = [];

  for (const platform of platforms) {
    const limit = PLATFORM_LIMITS[platform];
    if (content.length > limit) {
      errors.push({
        platform,
        message: `Content exceeds ${platform} character limit (${content.length}/${limit})`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type inference from schemas
 */
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
