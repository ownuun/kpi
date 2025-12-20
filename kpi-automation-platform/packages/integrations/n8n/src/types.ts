import { z } from 'zod';

/**
 * Execution Status enum
 */
export enum ExecutionStatus {
  WAITING = 'waiting',
  RUNNING = 'running',
  ERROR = 'error',
  SUCCESS = 'success',
  CANCELED = 'canceled'
}

/**
 * Workflow Node Position
 */
export const WorkflowNodePositionSchema = z.object({
  x: z.number(),
  y: z.number()
});
export type WorkflowNodePosition = z.infer<typeof WorkflowNodePositionSchema>;

/**
 * Workflow Node
 */
export const WorkflowNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  typeVersion: z.number().optional(),
  position: WorkflowNodePositionSchema,
  parameters: z.record(z.any()).optional(),
  disabled: z.boolean().optional()
});
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

/**
 * Workflow Connection
 */
export const WorkflowConnectionSchema = z.object({
  source: z.string(),
  sourceIndex: z.number().optional(),
  target: z.string(),
  targetIndex: z.number().optional()
});
export type WorkflowConnection = z.infer<typeof WorkflowConnectionSchema>;

/**
 * Workflow
 */
export const WorkflowSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  active: z.boolean().optional(),
  nodes: z.array(WorkflowNodeSchema),
  connections: z.record(z.array(WorkflowConnectionSchema)),
  settings: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional()
});
export type Workflow = z.infer<typeof WorkflowSchema>;

/**
 * Workflow Create Request
 */
export const WorkflowCreateSchema = WorkflowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type WorkflowCreate = z.infer<typeof WorkflowCreateSchema>;

/**
 * Workflow Update Request
 */
export const WorkflowUpdateSchema = WorkflowSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type WorkflowUpdate = z.infer<typeof WorkflowUpdateSchema>;

/**
 * Workflow Response
 */
export const WorkflowResponseSchema = WorkflowSchema;
export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;

/**
 * Execution Data
 */
export const ExecutionDataSchema = z.object({
  nodeExecutionData: z.record(z.array(z.any())).optional(),
  runData: z.record(z.array(z.any())).optional(),
  waitingExecution: z.record(z.any()).optional()
});
export type ExecutionData = z.infer<typeof ExecutionDataSchema>;

/**
 * Execution
 */
export const ExecutionSchema = z.object({
  id: z.string().optional(),
  workflowId: z.string(),
  workflowName: z.string().optional(),
  status: z.nativeEnum(ExecutionStatus),
  startTime: z.string().optional(),
  stopTime: z.string().optional(),
  executionTime: z.number().optional(),
  data: ExecutionDataSchema.optional(),
  error: z.string().optional(),
  mode: z.enum(['manual', 'trigger']).optional(),
  retryOf: z.string().optional(),
  retryCount: z.number().optional()
});
export type Execution = z.infer<typeof ExecutionSchema>;

/**
 * Execution Create Request
 */
export const ExecutionCreateSchema = z.object({
  workflowId: z.string()
});
export type ExecutionCreate = z.infer<typeof ExecutionCreateSchema>;

/**
 * Execution Response
 */
export const ExecutionResponseSchema = ExecutionSchema;
export type ExecutionResponse = z.infer<typeof ExecutionResponseSchema>;

/**
 * Credential Type
 */
export enum CredentialType {
  GENERIC = 'genericCredential',
  OAUTH2 = 'oAuth2Credential',
  BASIC_AUTH = 'basicAuth',
  BEARER_TOKEN = 'bearerToken',
  CUSTOM = 'custom'
}

/**
 * Credential
 */
export const CredentialSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.nativeEnum(CredentialType),
  data: z.record(z.any()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type Credential = z.infer<typeof CredentialSchema>;

/**
 * Credential Create Request
 */
export const CredentialCreateSchema = CredentialSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type CredentialCreate = z.infer<typeof CredentialCreateSchema>;

/**
 * Credential Update Request
 */
export const CredentialUpdateSchema = CredentialSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type CredentialUpdate = z.infer<typeof CredentialUpdateSchema>;

/**
 * Credential Response
 */
export const CredentialResponseSchema = CredentialSchema;
export type CredentialResponse = z.infer<typeof CredentialResponseSchema>;

/**
 * Webhook
 */
export const WebhookSchema = z.object({
  id: z.string().optional(),
  workflowId: z.string(),
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  active: z.boolean().optional(),
  createdAt: z.string().optional()
});
export type Webhook = z.infer<typeof WebhookSchema>;

/**
 * Webhook Create Request
 */
export const WebhookCreateSchema = WebhookSchema.omit({
  id: true,
  createdAt: true
});
export type WebhookCreate = z.infer<typeof WebhookCreateSchema>;

/**
 * Webhook Response
 */
export const WebhookResponseSchema = WebhookSchema;
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

/**
 * API Response
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  statusCode: z.number().optional()
});
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Client Configuration
 */
export const ClientConfigSchema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string(),
  timeout: z.number().optional(),
  retryAttempts: z.number().optional(),
  retryDelay: z.number().optional()
});
export type ClientConfig = z.infer<typeof ClientConfigSchema>;
