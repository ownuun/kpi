import { N8nClient } from './client';
import { WorkflowManager } from './workflows';
import { ExecutionManager } from './executions';
import { CredentialManager } from './credentials';
import { WebhookManager } from './webhooks';
import { ClientConfig } from './types';

/**
 * N8n Automation Integration Client
 * Main entry point for interacting with n8n REST API
 */
export class N8nIntegration {
  private client: N8nClient;
  public workflows: WorkflowManager;
  public executions: ExecutionManager;
  public credentials: CredentialManager;
  public webhooks: WebhookManager;

  constructor(config: ClientConfig) {
    this.client = new N8nClient(config);
    this.workflows = new WorkflowManager(this.client);
    this.executions = new ExecutionManager(this.client);
    this.credentials = new CredentialManager(this.client);
    this.webhooks = new WebhookManager(this.client);
  }

  /**
   * Get the underlying axios client
   */
  getClient(): N8nClient {
    return this.client;
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<ClientConfig>): void {
    this.client.updateConfig(config);
  }

  /**
   * Get current configuration
   */
  getConfig(): ClientConfig {
    return this.client.getConfig();
  }

  /**
   * Test connection to n8n server
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return !!response;
    } catch {
      return false;
    }
  }

  /**
   * Get n8n server information
   */
  async getServerInfo(): Promise<any> {
    try {
      const response = await this.client.get('/info');
      return response;
    } catch {
      return null;
    }
  }

  /**
   * Get API version
   */
  async getApiVersion(): Promise<string> {
    try {
      const response = await this.client.get('/version');
      return response.version || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

// Export types
export * from './types';

// Export managers
export { N8nClient } from './client';
export { WorkflowManager } from './workflows';
export { ExecutionManager } from './executions';
export { CredentialManager } from './credentials';
export { WebhookManager } from './webhooks';

// Default export
export default N8nIntegration;
