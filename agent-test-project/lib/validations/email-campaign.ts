import { z } from 'zod';

export const emailCampaignSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255),
  content: z.string().min(1, 'Content is required'),
  previewText: z.string().max(255).optional(),
  fromEmail: z.string().email('Invalid email address'),
  fromName: z.string().min(1, 'From name is required').max(100),
  replyToEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  scheduledAt: z.string().datetime().optional().or(z.literal('')),
});

export type EmailCampaignFormData = z.infer<typeof emailCampaignSchema>;
