import { N8nClient } from './client';
import {
  Webhook,
  WebhookCreate,
  WebhookResponse,
  WebhookSchema,
  WebhookCreateSchema
} from './types';

/**
 * Webhook Manager
 * Handles all webhook-related operations
 */
export class WebhookManager {
  constructor(private client: N8nClient) {}

  /**
   * Get all webhooks
   */
  async listWebhooks(options?: {
    workflowId?: string;
    limit?: number;
    skip?: number;
  }): Promise<WebhookResponse[]> {
    const params = new URLSearchParams();

    if (options?.workflowId) params.append('workflowId', options.workflowId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());

    const queryString = params.toString();
    const url = queryString ? `/webhooks?${queryString}` : '/webhooks';

    const response = await this.client.get<{ data: WebhookResponse[] }>(url);
    return response.data || [];
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(webhookId: string): Promise<WebhookResponse> {
    const response = await this.client.get<WebhookResponse>(
      `/webhooks/${webhookId}`
    );
    return WebhookSchema.parse(response);
  }

  /**
   * Create a new webhook
   */
  async createWebhook(webhook: WebhookCreate): Promise<WebhookResponse> {
    // Validate input
    const validatedData = WebhookCreateSchema.parse(webhook);

    const response = await this.client.post<WebhookResponse>(
      '/webhooks',
      validatedData
    );
    return WebhookSchema.parse(response);
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}`);
  }

  /**
   * Get webhooks by workflow ID
   */
  async getWorkflowWebhooks(workflowId: string): Promise<WebhookResponse[]> {
    const response = await this.client.get<{ data: WebhookResponse[] }>(
      `/workflows/${workflowId}/webhooks`
    );
    return response.data || [];
  }

  /**
   * Activate a webhook
   */
  async activateWebhook(webhookId: string): Promise<WebhookResponse> {
    const response = await this.client.patch<WebhookResponse>(
      `/webhooks/${webhookId}/activate`,
      {}
    );
    return WebhookSchema.parse(response);
  }

  /**
   * Deactivate a webhook
   */
  async deactivateWebhook(webhookId: string): Promise<WebhookResponse> {
    const response = await this.client.patch<WebhookResponse>(
      `/webhooks/${webhookId}/deactivate`,
      {}
    );
    return WebhookSchema.parse(response);
  }

  /**
   * Get webhook URL
   */
  async getWebhookUrl(webhookId: string): Promise<string> {
    const webhook = await this.getWebhook(webhookId);
    return `${this.client.getConfig().baseUrl}/webhook/${webhook.path}`;
  }

  /**
   * Get all webhook URLs for a workflow
   */
  async getWorkflowWebhookUrls(workflowId: string): Promise<Record<string, string>> {
    const webhooks = await this.getWorkflowWebhooks(workflowId);
    const baseUrl = this.client.getConfig().baseUrl;

    const urls: Record<string, string> = {};
    for (const webhook of webhooks) {
      urls[webhook.id!] = `${baseUrl}/webhook/${webhook.path}`;
    }

    return urls;
  }

  /**
   * Get webhook test URL
   */
  async getWebhookTestUrl(webhookId: string): Promise<string> {
    const webhook = await this.getWebhook(webhookId);
    return `${this.client.getConfig().baseUrl}/webhook/test/${webhook.path}`;
  }

  /**
   * List webhooks by method
   */
  async getWebhooksByMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'): Promise<WebhookResponse[]> {
    const response = await this.client.get<{ data: WebhookResponse[] }>(
      `/webhooks?method=${method}`
    );
    return response.data || [];
  }

  /**
   * Get active webhooks count
   */
  async getActiveWebhooksCount(): Promise<number> {
    const webhooks = await this.listWebhooks();
    return webhooks.filter((w) => w.active).length;
  }

  /**
   * Find webhook by path
   */
  async getWebhookByPath(path: string): Promise<WebhookResponse | null> {
    try {
      const response = await this.client.get<WebhookResponse>(
        `/webhooks/path/${path}`
      );
      return WebhookSchema.parse(response);
    } catch {
      return null;
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byMethod: Record<string, number>;
  }> {
    const response = await this.client.get<any>('/webhooks/stats');
    return response;
  }

  /**
   * Get webhook event history
   */
  async getWebhookEventHistory(
    webhookId: string,
    options?: {
      limit?: number;
      skip?: number;
    }
  ): Promise<Array<{
    id: string;
    timestamp: string;
    method: string;
    statusCode: number;
    payload?: any;
  }>> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/webhooks/${webhookId}/events?${queryString}`
      : `/webhooks/${webhookId}/events`;

    const response = await this.client.get<{ data: any[] }>(url);
    return response.data || [];
  }
}
