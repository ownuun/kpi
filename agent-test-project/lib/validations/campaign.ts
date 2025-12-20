import { z } from 'zod';

export const CampaignSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['EMAIL', 'SOCIAL', 'ADS', 'CONTENT', 'WEBINAR', 'EVENT']),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  targetLeads: z.number().int().positive().optional(),
  targetRevenue: z.number().positive().optional(),
});

export const CampaignUpdateSchema = CampaignSchema.partial();

export const CampaignQuerySchema = z.object({
  type: z.enum(['EMAIL', 'SOCIAL', 'ADS', 'CONTENT', 'WEBINAR', 'EVENT']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export type CampaignInput = z.infer<typeof CampaignSchema>;
export type CampaignUpdateInput = z.infer<typeof CampaignUpdateSchema>;
export type CampaignQuery = z.infer<typeof CampaignQuerySchema>;
