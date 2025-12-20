import { N8nClient } from './client';
import {
  Execution,
  ExecutionCreate,
  ExecutionStatus,
  ExecutionResponse,
  ExecutionSchema,
  ExecutionCreateSchema
} from './types';

/**
 * Execution Manager
 * Handles all execution-related operations
 */
export class ExecutionManager {
  constructor(private client: N8nClient) {}

  /**
   * Get all executions
   */
  async listExecutions(options?: {
    workflowId?: string;
    status?: ExecutionStatus;
    limit?: number;
    skip?: number;
    sort?: 'asc' | 'desc';
  }): Promise<ExecutionResponse[]> {
    const params = new URLSearchParams();

    if (options?.workflowId) params.append('workflowId', options.workflowId);
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());
    if (options?.sort) params.append('sort', options.sort);

    const queryString = params.toString();
    const url = queryString ? `/executions?${queryString}` : '/executions';

    const response = await this.client.get<{ data: ExecutionResponse[] }>(url);
    return response.data || [];
  }

  /**
   * Get execution by ID
   */
  async getExecution(executionId: string): Promise<ExecutionResponse> {
    const response = await this.client.get<ExecutionResponse>(
      `/executions/${executionId}`
    );
    return ExecutionSchema.parse(response);
  }

  /**
   * Execute a workflow immediately
   */
  async executeWorkflow(workflowId: string, data?: any): Promise<ExecutionResponse> {
    const payload = {
      workflowId,
      ...data
    };

    const response = await this.client.post<ExecutionResponse>(
      '/executions',
      payload
    );
    return ExecutionSchema.parse(response);
  }

  /**
   * Stop a running execution
   */
  async stopExecution(executionId: string): Promise<ExecutionResponse> {
    const response = await this.client.post<ExecutionResponse>(
      `/executions/${executionId}/stop`,
      {}
    );
    return ExecutionSchema.parse(response);
  }

  /**
   * Delete an execution
   */
  async deleteExecution(executionId: string): Promise<void> {
    await this.client.delete(`/executions/${executionId}`);
  }

  /**
   * Delete multiple executions by workflow ID
   */
  async deleteExecutionsByWorkflow(workflowId: string): Promise<{ deleted: number }> {
    const response = await this.client.delete<{ deleted: number }>(
      `/executions/workflow/${workflowId}`
    );
    return response;
  }

  /**
   * Get execution count by status
   */
  async getExecutionStats(workflowId?: string): Promise<{
    total: number;
    running: number;
    success: number;
    error: number;
    canceled: number;
    waiting: number;
  }> {
    let url = '/executions/stats';
    if (workflowId) {
      url = `/workflows/${workflowId}/executions/stats`;
    }

    const response = await this.client.get<any>(url);
    return response;
  }

  /**
   * Retry a failed execution
   */
  async retryExecution(executionId: string): Promise<ExecutionResponse> {
    const response = await this.client.post<ExecutionResponse>(
      `/executions/${executionId}/retry`,
      {}
    );
    return ExecutionSchema.parse(response);
  }

  /**
   * Get execution logs
   */
  async getExecutionLogs(
    executionId: string,
    options?: {
      limit?: number;
      skip?: number;
    }
  ): Promise<Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    nodeId?: string;
  }>> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/executions/${executionId}/logs?${queryString}`
      : `/executions/${executionId}/logs`;

    const response = await this.client.get<{ data: any[] }>(url);
    return response.data || [];
  }

  /**
   * Get execution node data
   */
  async getExecutionNodeData(
    executionId: string,
    nodeId: string
  ): Promise<any> {
    const response = await this.client.get<any>(
      `/executions/${executionId}/nodes/${nodeId}`
    );
    return response;
  }

  /**
   * Wait for execution to complete
   */
  async waitForExecution(
    executionId: string,
    options?: {
      timeout?: number;
      pollInterval?: number;
    }
  ): Promise<ExecutionResponse> {
    const timeout = options?.timeout || 60000; // 60 seconds default
    const pollInterval = options?.pollInterval || 1000; // 1 second default

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const execution = await this.getExecution(executionId);

      if (
        execution.status === ExecutionStatus.SUCCESS ||
        execution.status === ExecutionStatus.ERROR ||
        execution.status === ExecutionStatus.CANCELED
      ) {
        return execution;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Execution ${executionId} did not complete within ${timeout}ms`);
  }

  /**
   * Get recently executed workflows
   */
  async getRecentExecutions(
    limit: number = 10
  ): Promise<ExecutionResponse[]> {
    const response = await this.client.get<{ data: ExecutionResponse[] }>(
      `/executions/recent?limit=${limit}`
    );
    return response.data || [];
  }

  /**
   * Get execution statistics by status for a time period
   */
  async getExecutionMetrics(options?: {
    workflowId?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<{
    totalExecutions: number;
    successCount: number;
    errorCount: number;
    averageExecutionTime: number;
    peakExecutionsPerHour: number;
  }> {
    const params = new URLSearchParams();

    if (options?.workflowId) params.append('workflowId', options.workflowId);
    if (options?.startTime) params.append('startTime', options.startTime);
    if (options?.endTime) params.append('endTime', options.endTime);

    const queryString = params.toString();
    const url = queryString
      ? `/executions/metrics?${queryString}`
      : '/executions/metrics';

    const response = await this.client.get<any>(url);
    return response;
  }
}
