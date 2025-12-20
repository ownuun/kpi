import axios, { AxiosInstance } from 'axios';

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings?: any;
  staticData?: any;
  tags?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface N8nExecution {
  id: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  data: any;
}

class N8nClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: N8N_API_URL,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Get all workflows
   */
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await this.client.get('/workflows');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw new Error('Failed to fetch workflows from n8n');
    }
  }

  /**
   * Get a single workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<N8nWorkflow> {
    try {
      const response = await this.client.get(`/workflows/${workflowId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching workflow ${workflowId}:`, error);
      throw new Error('Failed to fetch workflow from n8n');
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(data: {
    name: string;
    nodes: any[];
    connections: any;
    active?: boolean;
    settings?: any;
  }): Promise<N8nWorkflow> {
    try {
      const response = await this.client.post('/workflows', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw new Error('Failed to create workflow in n8n');
    }
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(
    workflowId: string,
    data: Partial<{
      name: string;
      nodes: any[];
      connections: any;
      active: boolean;
      settings: any;
    }>
  ): Promise<N8nWorkflow> {
    try {
      const response = await this.client.patch(`/workflows/${workflowId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating workflow ${workflowId}:`, error);
      throw new Error('Failed to update workflow in n8n');
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      await this.client.delete(`/workflows/${workflowId}`);
    } catch (error) {
      console.error(`Error deleting workflow ${workflowId}:`, error);
      throw new Error('Failed to delete workflow in n8n');
    }
  }

  /**
   * Activate a workflow
   */
  async activateWorkflow(workflowId: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(workflowId, { active: true });
  }

  /**
   * Deactivate a workflow
   */
  async deactivateWorkflow(workflowId: string): Promise<N8nWorkflow> {
    return this.updateWorkflow(workflowId, { active: false });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, data?: any): Promise<N8nExecution> {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        data,
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error executing workflow ${workflowId}:`, error);
      throw new Error('Failed to execute workflow in n8n');
    }
  }

  /**
   * Get workflow executions
   */
  async getExecutions(workflowId?: string): Promise<N8nExecution[]> {
    try {
      const url = workflowId
        ? `/executions?workflowId=${workflowId}`
        : '/executions';
      const response = await this.client.get(url);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching executions:', error);
      throw new Error('Failed to fetch executions from n8n');
    }
  }

  /**
   * Get a single execution
   */
  async getExecution(executionId: string): Promise<N8nExecution> {
    try {
      const response = await this.client.get(`/executions/${executionId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching execution ${executionId}:`, error);
      throw new Error('Failed to fetch execution from n8n');
    }
  }

  /**
   * Test connection to n8n
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/workflows');
      return true;
    } catch (error) {
      console.error('n8n connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const n8nClient = new N8nClient();
