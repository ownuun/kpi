# n8n REST API Client

A comprehensive TypeScript client for n8n workflow automation platform. This package provides a type-safe interface for interacting with n8n's REST API, enabling seamless workflow automation integration with your KPI platform.

## Features

- Type-safe REST API client with Zod validation
- Workflow CRUD operations (Create, Read, Update, Delete, Activate/Deactivate)
- Execution management and monitoring
- Credential management and testing
- Webhook configuration and management
- Comprehensive error handling with retry logic
- Built-in API response validation
- Full TypeScript support

## Installation

```bash
npm install @kpi/integrations-n8n
# or
yarn add @kpi/integrations-n8n
```

## Quick Start

```typescript
import { N8nIntegration } from '@kpi/integrations-n8n';

const n8n = new N8nIntegration({
  baseUrl: 'https://n8n.example.com/api/v1',
  apiKey: 'your-api-key',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
});

// List workflows
const workflows = await n8n.workflows.listWorkflows();

// Get specific workflow
const workflow = await n8n.workflows.getWorkflow('workflow-id');

// Execute a workflow
const execution = await n8n.executions.executeWorkflow('workflow-id');

// Wait for execution to complete
const result = await n8n.executions.waitForExecution(execution.id);
```

## API Documentation

### N8nIntegration

Main client class that provides access to all API managers.

#### Constructor

```typescript
const n8n = new N8nIntegration({
  baseUrl: string;      // n8n API base URL
  apiKey: string;       // n8n API key for authentication
  timeout?: number;     // Request timeout in ms (default: 30000)
  retryAttempts?: number; // Number of retry attempts (default: 3)
  retryDelay?: number;  // Delay between retries in ms (default: 1000)
});
```

#### Methods

- `testConnection(): Promise<boolean>` - Test connection to n8n server
- `getServerInfo(): Promise<any>` - Get n8n server information
- `getApiVersion(): Promise<string>` - Get API version
- `updateConfig(config: Partial<ClientConfig>): void` - Update configuration
- `getConfig(): ClientConfig` - Get current configuration

### WorkflowManager

Manage n8n workflows.

```typescript
const workflows = n8n.workflows;

// List workflows
const list = await workflows.listWorkflows({
  limit: 50,
  skip: 0,
  active: true,
  tags: ['production']
});

// Get specific workflow
const workflow = await workflows.getWorkflow('workflow-id');

// Create workflow
const newWorkflow = await workflows.createWorkflow({
  name: 'My Workflow',
  active: false,
  nodes: [...],
  connections: {...}
});

// Update workflow
const updated = await workflows.updateWorkflow('workflow-id', {
  name: 'Updated Name',
  active: true
});

// Delete workflow
await workflows.deleteWorkflow('workflow-id');

// Activate/Deactivate workflow
await workflows.activateWorkflow('workflow-id');
await workflows.deactivateWorkflow('workflow-id');
await workflows.toggleWorkflow('workflow-id');

// Manage workflow tags
await workflows.addWorkflowTags('workflow-id', ['tag1', 'tag2']);
await workflows.removeWorkflowTags('workflow-id', ['tag1']);

// Search workflows
const results = await workflows.searchWorkflows('search-query', 'name');

// Export/Import workflows
const exported = await workflows.exportWorkflow('workflow-id');
const imported = await workflows.importWorkflow(workflowData);

// Duplicate workflow
const duplicated = await workflows.duplicateWorkflow('workflow-id', 'New Name');

// Get execution history
const history = await workflows.getWorkflowExecutionHistory('workflow-id', {
  limit: 100,
  skip: 0
});
```

### ExecutionManager

Manage workflow executions.

```typescript
const executions = n8n.executions;

// List executions
const list = await executions.listExecutions({
  workflowId: 'workflow-id',
  status: ExecutionStatus.SUCCESS,
  limit: 50,
  sort: 'desc'
});

// Get specific execution
const execution = await executions.getExecution('execution-id');

// Execute workflow
const newExecution = await executions.executeWorkflow('workflow-id', {
  // optional data
});

// Wait for execution completion
const result = await executions.waitForExecution('execution-id', {
  timeout: 120000,
  pollInterval: 1000
});

// Stop running execution
await executions.stopExecution('execution-id');

// Retry failed execution
const retry = await executions.retryExecution('execution-id');

// Delete execution
await executions.deleteExecution('execution-id');

// Delete all executions for workflow
const stats = await executions.deleteExecutionsByWorkflow('workflow-id');

// Get execution statistics
const stats = await executions.getExecutionStats('workflow-id');

// Get execution logs
const logs = await executions.getExecutionLogs('execution-id', {
  limit: 100,
  skip: 0
});

// Get node-specific data
const nodeData = await executions.getExecutionNodeData('execution-id', 'node-id');

// Get recent executions
const recent = await executions.getRecentExecutions(10);

// Get execution metrics
const metrics = await executions.getExecutionMetrics({
  workflowId: 'workflow-id',
  startTime: '2024-01-01T00:00:00Z',
  endTime: '2024-01-31T23:59:59Z'
});
```

### CredentialManager

Manage credentials.

```typescript
const credentials = n8n.credentials;

// List credentials
const list = await credentials.listCredentials({
  limit: 50,
  type: CredentialType.BASIC_AUTH
});

// Get specific credential
const credential = await credentials.getCredential('credential-id');

// Get credential by name
const byName = await credentials.getCredentialByName('credential-name');

// Create credential
const newCredential = await credentials.createCredential({
  name: 'My Credential',
  type: CredentialType.BASIC_AUTH,
  data: {
    username: 'user',
    password: 'pass'
  }
});

// Update credential
const updated = await credentials.updateCredential('credential-id', {
  name: 'Updated Name',
  data: { ... }
});

// Delete credential
await credentials.deleteCredential('credential-id');

// Test credential validity
const test = await credentials.testCredential('credential-id');
const testData = await credentials.testCredentialWithData(credential);

// Get credential usage
const usage = await credentials.getCredentialUsage('credential-id');

// Search credentials
const results = await credentials.searchCredentials('search-query');

// Duplicate credential
const duplicated = await credentials.duplicateCredential('credential-id', 'New Name');

// Get credential statistics
const stats = await credentials.getCredentialStats();

// Validate credential data
const validation = credentials.validateCredentialData(credential);
```

### WebhookManager

Manage webhooks.

```typescript
const webhooks = n8n.webhooks;

// List webhooks
const list = await webhooks.listWebhooks({
  workflowId: 'workflow-id',
  limit: 50
});

// Get specific webhook
const webhook = await webhooks.getWebhook('webhook-id');

// Create webhook
const newWebhook = await webhooks.createWebhook({
  workflowId: 'workflow-id',
  path: 'my-webhook-path',
  method: 'POST',
  active: true
});

// Delete webhook
await webhooks.deleteWebhook('webhook-id');

// Get webhooks for workflow
const workflowWebhooks = await webhooks.getWorkflowWebhooks('workflow-id');

// Activate/Deactivate webhook
await webhooks.activateWebhook('webhook-id');
await webhooks.deactivateWebhook('webhook-id');

// Get webhook URLs
const url = await webhooks.getWebhookUrl('webhook-id');
const allUrls = await webhooks.getWorkflowWebhookUrls('workflow-id');
const testUrl = await webhooks.getWebhookTestUrl('webhook-id');

// Get webhooks by method
const postWebhooks = await webhooks.getWebhooksByMethod('POST');

// Get active webhooks count
const activeCount = await webhooks.getActiveWebhooksCount();

// Find webhook by path
const byPath = await webhooks.getWebhookByPath('path');

// Get webhook statistics
const stats = await webhooks.getWebhookStats();

// Get webhook event history
const history = await webhooks.getWebhookEventHistory('webhook-id', {
  limit: 100
});
```

## Error Handling

The client includes comprehensive error handling:

```typescript
import { N8nIntegration, ApiError } from '@kpi/integrations-n8n';

try {
  const workflow = await n8n.workflows.getWorkflow('id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.statusCode} - ${error.message}`);
    console.error(error.response);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Type Definitions

All major types are exported and available for use:

```typescript
import {
  Workflow,
  WorkflowCreate,
  WorkflowUpdate,
  Execution,
  ExecutionStatus,
  Credential,
  CredentialType,
  Webhook,
  WorkflowNode,
  WorkflowConnection,
  ClientConfig,
  ApiError
} from '@kpi/integrations-n8n';
```

## Configuration

### Retry Logic

The client automatically retries on:
- HTTP 429 (Too Many Requests)
- HTTP 503 (Service Unavailable)

Configure retry behavior:

```typescript
const n8n = new N8nIntegration({
  baseUrl: 'https://n8n.example.com/api/v1',
  apiKey: 'your-api-key',
  retryAttempts: 5,      // Number of retries
  retryDelay: 2000       // Initial delay in ms (increases exponentially)
});
```

### Timeout

Set request timeout:

```typescript
const n8n = new N8nIntegration({
  baseUrl: 'https://n8n.example.com/api/v1',
  apiKey: 'your-api-key',
  timeout: 60000  // 60 seconds
});
```

## Examples

### Execute and Monitor Workflow

```typescript
const n8n = new N8nIntegration({
  baseUrl: 'https://n8n.example.com/api/v1',
  apiKey: 'your-api-key'
});

async function executeAndMonitor() {
  // Execute workflow
  const execution = await n8n.executions.executeWorkflow('workflow-id');
  console.log('Execution started:', execution.id);

  // Wait for completion
  const result = await n8n.executions.waitForExecution(execution.id, {
    timeout: 300000  // 5 minutes
  });

  console.log('Execution completed:', result.status);
  return result;
}
```

### Manage Workflows with Tags

```typescript
async function organizeWorkflows() {
  // Create workflow
  const workflow = await n8n.workflows.createWorkflow({
    name: 'Data Processing',
    active: true,
    nodes: [...],
    connections: {...}
  });

  // Add tags
  await n8n.workflows.addWorkflowTags(workflow.id!, ['production', 'critical']);

  // Find workflows by tag
  const results = await n8n.workflows.listWorkflows({
    tags: ['production']
  });

  return results;
}
```

### Set Up Webhooks

```typescript
async function setupWebhooks() {
  // Create webhook
  const webhook = await n8n.webhooks.createWebhook({
    workflowId: 'workflow-id',
    path: 'webhook/data-sync',
    method: 'POST',
    active: true
  });

  const url = await n8n.webhooks.getWebhookUrl(webhook.id!);
  console.log('Webhook URL:', url);

  return url;
}
```

## Development

Build the package:

```bash
npm run build
```

Watch for changes:

```bash
npm run dev
```

Type checking:

```bash
npm run type-check
```

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are properly defined
- Zod validation schemas are used
- Error handling is comprehensive
- Code is well-documented
