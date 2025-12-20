/**
 * n8n API Client
 * Wrapper for n8n REST API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  N8nConfig,
  Workflow,
  CreateWorkflowInput,
  UpdateWorkflowInput,
  WorkflowExecution,
  GetExecutionsRequest,
  GetExecutionsResponse,
  ExecuteWorkflowRequest,
  ExecuteWorkflowResponse,
  Credential,
  CreateCredentialInput,
  UpdateCredentialInput,
  Webhook,
  ActivateWorkflowRequest,
  Tag,
  N8nApiError,
  WorkflowStatistics,
  ExecutionStatus,
} from '../types';

export class N8nClient {
  private client: AxiosInstance;
  private config: N8nConfig;

  constructor(config: N8nConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: N8nApiError = {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: error.response?.status || 500,
          details: error.response?.data,
        };
        throw apiError;
      }
    );
  }

  // ========================================
  // Workflow Operations
  // ========================================

  /**
   * Get all workflows
   */
  async getWorkflows(): Promise<Workflow[]> {
    const response = await this.client.get<{ data: Workflow[] }>('/workflows');
    return response.data.data;
  }

  /**
   * Get a single workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<Workflow> {
    const response = await this.client.get<Workflow>(`/workflows/${workflowId}`);
    return response.data;
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(input: CreateWorkflowInput): Promise<Workflow> {
    const response = await this.client.post<Workflow>('/workflows', input);
    return response.data;
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    workflowId: string,
    input: UpdateWorkflowInput
  ): Promise<Workflow> {
    const response = await this.client.patch<Workflow>(
      `/workflows/${workflowId}`,
      input
    );
    return response.data;
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    await this.client.delete(`/workflows/${workflowId}`);
  }

  /**
   * Activate or deactivate a workflow
   */
  async activateWorkflow(request: ActivateWorkflowRequest): Promise<Workflow> {
    const response = await this.client.patch<Workflow>(
      `/workflows/${request.workflowId}`,
      { active: request.active }
    );
    return response.data;
  }

  /**
   * Get active workflows
   */
  async getActiveWorkflows(): Promise<Workflow[]> {
    const workflows = await this.getWorkflows();
    return workflows.filter((w) => w.active);
  }

  /**
   * Duplicate a workflow
   */
  async duplicateWorkflow(workflowId: string, newName?: string): Promise<Workflow> {
    const workflow = await this.getWorkflow(workflowId);

    const duplicateInput: CreateWorkflowInput = {
      name: newName || `${workflow.name} (Copy)`,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings,
      staticData: workflow.staticData,
      tags: workflow.tags,
      active: false,
    };

    return this.createWorkflow(duplicateInput);
  }

  // ========================================
  // Execution Operations
  // ========================================

  /**
   * Execute a workflow manually
   */
  async executeWorkflow(request: ExecuteWorkflowRequest): Promise<ExecuteWorkflowResponse> {
    const response = await this.client.post<ExecuteWorkflowResponse>(
      `/workflows/${request.workflowId}/execute`,
      { data: request.data }
    );
    return response.data;
  }

  /**
   * Get executions with filters
   */
  async getExecutions(request: GetExecutionsRequest = {}): Promise<GetExecutionsResponse> {
    const params: any = {};

    if (request.workflowId) params.workflowId = request.workflowId;
    if (request.limit) params.limit = request.limit;
    if (request.offset) params.offset = request.offset;
    if (request.status) params.status = request.status;
    if (request.finished !== undefined) params.finished = request.finished;
    if (request.mode) params.mode = request.mode;

    const response = await this.client.get<GetExecutionsResponse>('/executions', {
      params,
    });
    return response.data;
  }

  /**
   * Get a single execution by ID
   */
  async getExecution(executionId: string): Promise<WorkflowExecution> {
    const response = await this.client.get<WorkflowExecution>(
      `/executions/${executionId}`
    );
    return response.data;
  }

  /**
   * Delete an execution
   */
  async deleteExecution(executionId: string): Promise<void> {
    await this.client.delete(`/executions/${executionId}`);
  }

  /**
   * Stop a running execution
   */
  async stopExecution(executionId: string): Promise<WorkflowExecution> {
    const response = await this.client.post<WorkflowExecution>(
      `/executions/${executionId}/stop`
    );
    return response.data;
  }

  /**
   * Retry a failed execution
   */
  async retryExecution(executionId: string): Promise<ExecuteWorkflowResponse> {
    const response = await this.client.post<ExecuteWorkflowResponse>(
      `/executions/${executionId}/retry`
    );
    return response.data;
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(executionId: string): Promise<ExecutionStatus> {
    const execution = await this.getExecution(executionId);
    return execution.status;
  }

  /**
   * Wait for execution to complete
   */
  async waitForExecution(
    executionId: string,
    options: {
      timeout?: number;
      interval?: number;
    } = {}
  ): Promise<WorkflowExecution> {
    const timeout = options.timeout || 60000; // 60 seconds default
    const interval = options.interval || 1000; // 1 second default
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const execution = await this.getExecution(executionId);

      if (execution.finished) {
        return execution;
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Execution ${executionId} timed out after ${timeout}ms`);
  }

  /**
   * Get workflow executions
   */
  async getWorkflowExecutions(
    workflowId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: ExecutionStatus;
    } = {}
  ): Promise<WorkflowExecution[]> {
    const response = await this.getExecutions({
      workflowId,
      ...options,
    });
    return response.data;
  }

  /**
   * Get latest execution for a workflow
   */
  async getLatestExecution(workflowId: string): Promise<WorkflowExecution | null> {
    const response = await this.getExecutions({
      workflowId,
      limit: 1,
    });
    return response.data[0] || null;
  }

  // ========================================
  // Credential Operations
  // ========================================

  /**
   * Get all credentials
   */
  async getCredentials(): Promise<Credential[]> {
    const response = await this.client.get<{ data: Credential[] }>('/credentials');
    return response.data.data;
  }

  /**
   * Get a single credential by ID
   */
  async getCredential(credentialId: string): Promise<Credential> {
    const response = await this.client.get<Credential>(`/credentials/${credentialId}`);
    return response.data;
  }

  /**
   * Create a new credential
   */
  async createCredential(input: CreateCredentialInput): Promise<Credential> {
    const response = await this.client.post<Credential>('/credentials', input);
    return response.data;
  }

  /**
   * Update a credential
   */
  async updateCredential(
    credentialId: string,
    input: UpdateCredentialInput
  ): Promise<Credential> {
    const response = await this.client.patch<Credential>(
      `/credentials/${credentialId}`,
      input
    );
    return response.data;
  }

  /**
   * Delete a credential
   */
  async deleteCredential(credentialId: string): Promise<void> {
    await this.client.delete(`/credentials/${credentialId}`);
  }

  // ========================================
  // Webhook Operations
  // ========================================

  /**
   * Get all webhooks
   */
  async getWebhooks(): Promise<Webhook[]> {
    const workflows = await this.getWorkflows();
    const webhooks: Webhook[] = [];

    for (const workflow of workflows) {
      for (const node of workflow.nodes) {
        if (node.type === 'n8n-nodes-base.webhook') {
          webhooks.push({
            id: node.id,
            workflowId: workflow.id,
            webhookPath: node.parameters.path as string,
            method: (node.parameters.httpMethod as any) || 'POST',
            node: node.name,
            webhookId: node.webhookId,
          });
        }
      }
    }

    return webhooks;
  }

  /**
   * Get webhooks for a specific workflow
   */
  async getWorkflowWebhooks(workflowId: string): Promise<Webhook[]> {
    const workflow = await this.getWorkflow(workflowId);
    const webhooks: Webhook[] = [];

    for (const node of workflow.nodes) {
      if (node.type === 'n8n-nodes-base.webhook') {
        webhooks.push({
          id: node.id,
          workflowId: workflow.id,
          webhookPath: node.parameters.path as string,
          method: (node.parameters.httpMethod as any) || 'POST',
          node: node.name,
          webhookId: node.webhookId,
        });
      }
    }

    return webhooks;
  }

  /**
   * Test a webhook
   */
  async testWebhook(workflowId: string): Promise<any> {
    const response = await this.client.post(`/workflows/${workflowId}/test`);
    return response.data;
  }

  // ========================================
  // Tag Operations
  // ========================================

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    const response = await this.client.get<{ data: Tag[] }>('/tags');
    return response.data.data;
  }

  /**
   * Create a tag
   */
  async createTag(name: string): Promise<Tag> {
    const response = await this.client.post<Tag>('/tags', { name });
    return response.data;
  }

  /**
   * Delete a tag
   */
  async deleteTag(tagId: string): Promise<void> {
    await this.client.delete(`/tags/${tagId}`);
  }

  // ========================================
  // Statistics and Analytics
  // ========================================

  /**
   * Get workflow statistics
   */
  async getWorkflowStatistics(workflowId: string): Promise<WorkflowStatistics> {
    const executions = await this.getWorkflowExecutions(workflowId, { limit: 100 });

    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(
      (e) => e.status === 'success'
    ).length;
    const failedExecutions = executions.filter(
      (e) => e.status === 'error'
    ).length;

    let totalExecutionTime = 0;
    executions.forEach((execution) => {
      if (execution.startedAt && execution.stoppedAt) {
        const start = new Date(execution.startedAt).getTime();
        const stop = new Date(execution.stoppedAt).getTime();
        totalExecutionTime += stop - start;
      }
    });

    const averageExecutionTime =
      totalExecutions > 0 ? totalExecutionTime / totalExecutions : 0;

    const latestExecution = executions[0];

    return {
      workflowId,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime,
      lastExecution: latestExecution?.startedAt,
    };
  }

  // ========================================
  // Utility Operations
  // ========================================

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get n8n instance info
   */
  async getInstanceInfo(): Promise<any> {
    try {
      const response = await this.client.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Factory function to create n8n client
 */
export function createN8nClient(config: N8nConfig): N8nClient {
  return new N8nClient(config);
}
