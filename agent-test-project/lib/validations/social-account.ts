import { z } from 'zod';

export const SocialAccountSchema = z.object({
  platform: z.enum([
    'LINKEDIN',
    'TWITTER',
    'FACEBOOK',
    'INSTAGRAM',
    'YOUTUBE',
    'TIKTOK',
    'THREADS',
    'BLUESKY',
  ]),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  accountId: z.string().optional(),
  accountUsername: z.string().optional(),
  accountName: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const SocialAccountUpdateSchema = SocialAccountSchema.partial().omit({
  platform: true, // Platform cannot be changed
});

export type SocialAccountInput = z.infer<typeof SocialAccountSchema>;
export type SocialAccountUpdateInput = z.infer<typeof SocialAccountUpdateSchema>;
