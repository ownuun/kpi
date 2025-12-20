import { N8nClient } from './client';
import {
  Workflow,
  WorkflowCreate,
  WorkflowUpdate,
  WorkflowResponse,
  WorkflowSchema,
  WorkflowCreateSchema,
  WorkflowUpdateSchema
} from './types';

/**
 * Workflow Manager
 * Handles all workflow-related operations
 */
export class WorkflowManager {
  constructor(private client: N8nClient) {}

  /**
   * Get all workflows
   */
  async listWorkflows(options?: {
    limit?: number;
    skip?: number;
    active?: boolean;
    tags?: string[];
  }): Promise<WorkflowResponse[]> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());
    if (options?.active !== undefined) params.append('active', options.active.toString());
    if (options?.tags?.length) params.append('tags', options.tags.join(','));

    const queryString = params.toString();
    const url = queryString ? `/workflows?${queryString}` : '/workflows';

    const response = await this.client.get<{ data: WorkflowResponse[] }>(url);
    return response.data || [];
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const response = await this.client.get<WorkflowResponse>(`/workflows/${workflowId}`);
    return WorkflowSchema.parse(response);
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: WorkflowCreate): Promise<WorkflowResponse> {
    // Validate input
    const validatedData = WorkflowCreateSchema.parse(workflow);

    const response = await this.client.post<WorkflowResponse>('/workflows', validatedData);
    return WorkflowSchema.parse(response);
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    workflowId: string,
    updates: WorkflowUpdate
  ): Promise<WorkflowResponse> {
    // Validate input
    const validatedData = WorkflowUpdateSchema.parse(updates);

    const response = await this.client.put<WorkflowResponse>(
      `/workflows/${workflowId}`,
      validatedData
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    await this.client.delete(`/workflows/${workflowId}`);
  }

  /**
   * Activate a workflow
   */
  async activateWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const response = await this.client.patch<WorkflowResponse>(
      `/workflows/${workflowId}/activate`,
      {}
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Deactivate a workflow
   */
  async deactivateWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const response = await this.client.patch<WorkflowResponse>(
      `/workflows/${workflowId}/deactivate`,
      {}
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Toggle workflow active status
   */
  async toggleWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const workflow = await this.getWorkflow(workflowId);
    return workflow.active
      ? this.deactivateWorkflow(workflowId)
      : this.activateWorkflow(workflowId);
  }

  /**
   * Get workflow execution history
   */
  async getWorkflowExecutionHistory(
    workflowId: string,
    options?: {
      limit?: number;
      skip?: number;
    }
  ): Promise<any[]> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/workflows/${workflowId}/executions?${queryString}`
      : `/workflows/${workflowId}/executions`;

    const response = await this.client.get<{ data: any[] }>(url);
    return response.data || [];
  }

  /**
   * Export workflow
   */
  async exportWorkflow(workflowId: string): Promise<string> {
    const response = await this.client.get<string>(
      `/workflows/${workflowId}/export`
    );
    return response;
  }

  /**
   * Import workflow
   */
  async importWorkflow(workflowData: any): Promise<WorkflowResponse> {
    const response = await this.client.post<WorkflowResponse>(
      '/workflows/import',
      workflowData
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Duplicate a workflow
   */
  async duplicateWorkflow(
    workflowId: string,
    newName?: string
  ): Promise<WorkflowResponse> {
    const data = newName ? { name: newName } : {};
    const response = await this.client.post<WorkflowResponse>(
      `/workflows/${workflowId}/duplicate`,
      data
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Search workflows by name or tag
   */
  async searchWorkflows(query: string, searchIn: 'name' | 'tags' = 'name'): Promise<WorkflowResponse[]> {
    const params = new URLSearchParams([
      ['query', query],
      ['searchIn', searchIn]
    ]);

    const response = await this.client.get<{ data: WorkflowResponse[] }>(
      `/workflows/search?${params.toString()}`
    );
    return response.data || [];
  }

  /**
   * Add tags to a workflow
   */
  async addWorkflowTags(workflowId: string, tags: string[]): Promise<WorkflowResponse> {
    const response = await this.client.post<WorkflowResponse>(
      `/workflows/${workflowId}/tags`,
      { tags }
    );
    return WorkflowSchema.parse(response);
  }

  /**
   * Remove tags from a workflow
   */
  async removeWorkflowTags(workflowId: string, tags: string[]): Promise<WorkflowResponse> {
    const response = await this.client.delete<WorkflowResponse>(
      `/workflows/${workflowId}/tags?tags=${tags.join(',')}`
    );
    return WorkflowSchema.parse(response);
  }
}
