/**
 * n8n API Types
 * Based on n8n API documentation
 */

export interface N8nConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
}

/**
 * Workflow entity
 */
export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  settings?: WorkflowSettings;
  staticData?: Record<string, any>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, string>;
  webhookId?: string;
  disabled?: boolean;
}

export interface WorkflowConnections {
  [key: string]: {
    [key: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

export interface WorkflowSettings {
  executionOrder?: 'v0' | 'v1';
  saveManualExecutions?: boolean;
  saveExecutionProgress?: boolean;
  saveDataErrorExecution?: 'all' | 'none';
  saveDataSuccessExecution?: 'all' | 'none';
  executionTimeout?: number;
  timezone?: string;
}

/**
 * Workflow creation/update input
 */
export interface CreateWorkflowInput {
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  active?: boolean;
  settings?: WorkflowSettings;
  staticData?: Record<string, any>;
  tags?: string[];
}

export interface UpdateWorkflowInput {
  name?: string;
  nodes?: WorkflowNode[];
  connections?: WorkflowConnections;
  active?: boolean;
  settings?: WorkflowSettings;
  staticData?: Record<string, any>;
  tags?: string[];
}

/**
 * Workflow execution
 */
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  finished: boolean;
  mode: ExecutionMode;
  startedAt: string;
  stoppedAt?: string;
  status: ExecutionStatus;
  data?: ExecutionData;
  error?: ExecutionError;
}

export type ExecutionMode =
  | 'manual'
  | 'trigger'
  | 'webhook'
  | 'internal'
  | 'cli'
  | 'error'
  | 'retry';

export type ExecutionStatus =
  | 'running'
  | 'success'
  | 'error'
  | 'waiting'
  | 'canceled'
  | 'crashed';

export interface ExecutionData {
  resultData: {
    runData: Record<string, NodeExecutionData[]>;
    lastNodeExecuted?: string;
    error?: ExecutionError;
  };
  executionData?: {
    contextData: Record<string, any>;
    nodeExecutionStack: any[];
    waitingExecution: Record<string, any>;
  };
}

export interface NodeExecutionData {
  startTime: number;
  executionTime: number;
  source: Array<{ previousNode: string }> | null;
  data: {
    main: Array<Array<{
      json: Record<string, any>;
      binary?: Record<string, any>;
      pairedItem?: { item: number };
    }>>;
  };
}

export interface ExecutionError {
  message: string;
  node?: string;
  stack?: string;
  description?: string;
  cause?: any;
}

/**
 * Execution filters and queries
 */
export interface GetExecutionsRequest {
  workflowId?: string;
  limit?: number;
  offset?: number;
  status?: ExecutionStatus;
  finished?: boolean;
  mode?: ExecutionMode;
}

export interface GetExecutionsResponse {
  data: WorkflowExecution[];
  count: number;
}

/**
 * Workflow execution trigger
 */
export interface ExecuteWorkflowRequest {
  workflowId: string;
  data?: Record<string, any>;
}

export interface ExecuteWorkflowResponse {
  executionId: string;
  status: ExecutionStatus;
  data?: any;
}

/**
 * Credentials
 */
export interface Credential {
  id: string;
  name: string;
  type: string;
  data?: Record<string, any>;
  nodesAccess?: Array<{
    nodeType: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCredentialInput {
  name: string;
  type: string;
  data: Record<string, any>;
  nodesAccess?: Array<{
    nodeType: string;
  }>;
}

export interface UpdateCredentialInput {
  name?: string;
  data?: Record<string, any>;
  nodesAccess?: Array<{
    nodeType: string;
  }>;
}

/**
 * Webhook
 */
export interface Webhook {
  id: string;
  workflowId: string;
  webhookPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  node: string;
  webhookId?: string;
  pathLength?: number;
}

export interface WebhookTestRequest {
  workflowId: string;
  webhookPath: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

/**
 * Workflow activation
 */
export interface ActivateWorkflowRequest {
  workflowId: string;
  active: boolean;
}

/**
 * Tag
 */
export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Error
 */
export interface N8nApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

/**
 * Pagination
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Workflow statistics
 */
export interface WorkflowStatistics {
  workflowId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecution?: string;
}
