import { z } from 'zod';

export const WorkflowSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  trigger: z.enum([
    'LEAD_CREATED',
    'EMAIL_OPENED',
    'FORM_SUBMITTED',
    'POST_PUBLISHED',
    'CAMPAIGN_STARTED',
    'SCHEDULE_BASED',
  ]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PAUSED', 'ERROR']).default('INACTIVE'),
  config: z.string().optional(), // JSON string
  n8nWorkflowId: z.string().optional(),
  webhookUrl: z.string().url().optional(),
});

export const WorkflowUpdateSchema = WorkflowSchema.partial();

export const WorkflowExecuteSchema = z.object({
  input: z.record(z.any()).optional(), // JSON object
});

export type WorkflowInput = z.infer<typeof WorkflowSchema>;
export type WorkflowUpdateInput = z.infer<typeof WorkflowUpdateSchema>;
export type WorkflowExecuteInput = z.infer<typeof WorkflowExecuteSchema>;
