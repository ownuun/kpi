# @kpi/integrations-n8n

n8n API client for workflow automation. This package provides a comprehensive TypeScript client for interacting with the n8n REST API.

## Features

- Complete TypeScript types for n8n workflows, executions, and credentials
- Full API client with all workflow management operations
- Execution monitoring and control
- Credential management
- Webhook utilities
- Workflow builder helpers
- Statistics and analytics utilities

## Installation

```bash
npm install @kpi/integrations-n8n
```

## Usage

### Basic Setup

```typescript
import { createN8nClient } from '@kpi/integrations-n8n';

const client = createN8nClient({
  apiUrl: 'https://your-n8n-instance.com/api/v1',
  apiKey: 'your-api-key',
  timeout: 30000, // optional
});
```

### Workflow Management

```typescript
// Get all workflows
const workflows = await client.getWorkflows();

// Get a specific workflow
const workflow = await client.getWorkflow('workflow-id');

// Create a new workflow
const newWorkflow = await client.createWorkflow({
  name: 'My Workflow',
  nodes: [
    // ... workflow nodes
  ],
  connections: {
    // ... node connections
  },
  active: false,
});

// Update a workflow
const updatedWorkflow = await client.updateWorkflow('workflow-id', {
  name: 'Updated Name',
  active: true,
});

// Delete a workflow
await client.deleteWorkflow('workflow-id');

// Activate/Deactivate a workflow
await client.activateWorkflow({
  workflowId: 'workflow-id',
  active: true,
});

// Duplicate a workflow
const duplicated = await client.duplicateWorkflow('workflow-id', 'Copy Name');
```

### Execution Management

```typescript
// Execute a workflow manually
const execution = await client.executeWorkflow({
  workflowId: 'workflow-id',
  data: {
    // input data
  },
});

// Get all executions
const executions = await client.getExecutions({
  workflowId: 'workflow-id',
  limit: 10,
  status: 'success',
});

// Get a specific execution
const execution = await client.getExecution('execution-id');

// Stop a running execution
await client.stopExecution('execution-id');

// Retry a failed execution
await client.retryExecution('execution-id');

// Wait for execution to complete
const completed = await client.waitForExecution('execution-id', {
  timeout: 60000,
  interval: 1000,
});

// Get latest execution for a workflow
const latest = await client.getLatestExecution('workflow-id');
```

### Credential Management

```typescript
// Get all credentials
const credentials = await client.getCredentials();

// Get a specific credential
const credential = await client.getCredential('credential-id');

// Create a credential
const newCredential = await client.createCredential({
  name: 'API Credentials',
  type: 'httpBasicAuth',
  data: {
    user: 'username',
    password: 'password',
  },
});

// Update a credential
await client.updateCredential('credential-id', {
  name: 'Updated Name',
  data: {
    // updated data
  },
});

// Delete a credential
await client.deleteCredential('credential-id');
```

### Webhook Operations

```typescript
// Get all webhooks
const webhooks = await client.getWebhooks();

// Get webhooks for a specific workflow
const workflowWebhooks = await client.getWorkflowWebhooks('workflow-id');

// Test a webhook
await client.testWebhook('workflow-id');
```

### Statistics

```typescript
// Get workflow statistics
const stats = await client.getWorkflowStatistics('workflow-id');
console.log(`Total executions: ${stats.totalExecutions}`);
console.log(`Success rate: ${stats.successfulExecutions / stats.totalExecutions * 100}%`);
console.log(`Average time: ${stats.averageExecutionTime}ms`);
```

## Utility Functions

### Workflow Builder

```typescript
import {
  createWebhookNode,
  createScheduleNode,
  createHttpRequestNode,
  createSetNode,
  createCodeNode,
  createConnection,
  mergeConnections,
} from '@kpi/integrations-n8n/utils';

// Create a webhook trigger
const webhookNode = createWebhookNode({
  name: 'Webhook',
  path: 'my-webhook',
  method: 'POST',
  position: [250, 300],
});

// Create a schedule trigger
const scheduleNode = createScheduleNode({
  name: 'Daily Trigger',
  cronExpression: '0 9 * * *', // Every day at 9 AM
  position: [250, 300],
});

// Create an HTTP request node
const httpNode = createHttpRequestNode({
  name: 'API Call',
  method: 'POST',
  url: 'https://api.example.com/endpoint',
  headers: {
    'Content-Type': 'application/json',
  },
  position: [450, 300],
});

// Create a Set node for data transformation
const setNode = createSetNode({
  name: 'Transform Data',
  values: {
    result: '{{ $json.data }}',
    timestamp: '{{ $now }}',
  },
  position: [650, 300],
});

// Create connections
const connections = mergeConnections(
  createConnection(webhookNode.name, httpNode.name),
  createConnection(httpNode.name, setNode.name)
);

// Create complete workflow
const workflow = await client.createWorkflow({
  name: 'My Automated Workflow',
  nodes: [webhookNode, httpNode, setNode],
  connections,
  active: true,
});
```

### Webhook Utilities

```typescript
import {
  buildWebhookUrl,
  parseWebhookPath,
  validateWebhookPath,
} from '@kpi/integrations-n8n/utils';

// Build webhook URL
const webhookUrl = buildWebhookUrl(
  'https://n8n.example.com',
  'my-webhook',
  false // test mode
);
// Result: https://n8n.example.com/webhook/my-webhook

// Parse webhook path from URL
const path = parseWebhookPath(webhookUrl);

// Validate webhook path
const validation = validateWebhookPath('my-webhook');
if (!validation.valid) {
  console.error(validation.error);
}
```

### Execution Utilities

```typescript
import {
  isExecutionSuccessful,
  isExecutionRunning,
  getExecutionDuration,
  formatExecutionDuration,
  getExecutionOutput,
  getExecutionError,
} from '@kpi/integrations-n8n/utils';

const execution = await client.getExecution('execution-id');

// Check execution status
if (isExecutionSuccessful(execution)) {
  console.log('Execution succeeded!');
}

if (isExecutionRunning(execution)) {
  console.log('Execution is still running...');
}

// Get execution duration
const duration = getExecutionDuration(execution);
const formatted = formatExecutionDuration(execution);
console.log(`Duration: ${formatted}`);

// Get output data
const output = getExecutionOutput(execution);
console.log('Results:', output);

// Get error details if failed
const error = getExecutionError(execution);
if (error) {
  console.error(`Error in node ${error.node}: ${error.message}`);
}
```

### Statistics Utilities

```typescript
import {
  calculateSuccessRate,
  calculateFailureRate,
  formatAverageTime,
} from '@kpi/integrations-n8n/utils';

const stats = await client.getWorkflowStatistics('workflow-id');

const successRate = calculateSuccessRate(stats);
const failureRate = calculateFailureRate(stats);
const avgTime = formatAverageTime(stats.averageExecutionTime);

console.log(`Success Rate: ${successRate.toFixed(2)}%`);
console.log(`Failure Rate: ${failureRate.toFixed(2)}%`);
console.log(`Average Time: ${avgTime}`);
```

### Workflow Validation

```typescript
import {
  validateWorkflow,
  hasTriggerNode,
  getTriggerNodes,
} from '@kpi/integrations-n8n/utils';

// Validate workflow structure
const validation = validateWorkflow(workflow);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Check if workflow has trigger
if (!hasTriggerNode(workflow)) {
  console.warn('Workflow has no trigger node');
}

// Get all trigger nodes
const triggers = getTriggerNodes(workflow);
console.log(`Found ${triggers.length} trigger nodes`);
```

### Cron Expressions

```typescript
import { cronExpressions, validateCronExpression } from '@kpi/integrations-n8n/utils';

// Use predefined cron expressions
const scheduleNode = createScheduleNode({
  cronExpression: cronExpressions.daily, // '0 0 * * *'
});

// Available expressions:
// - everyMinute: '* * * * *'
// - everyFiveMinutes: '*/5 * * * *'
// - everyTenMinutes: '*/10 * * * *'
// - everyFifteenMinutes: '*/15 * * * *'
// - everyThirtyMinutes: '*/30 * * * *'
// - hourly: '0 * * * *'
// - daily: '0 0 * * *'
// - dailyAt9AM: '0 9 * * *'
// - weeklyMonday: '0 0 * * 1'
// - monthly: '0 0 1 * *'

// Validate custom cron expression
const validation = validateCronExpression('0 */2 * * *');
if (!validation.valid) {
  console.error(validation.error);
}
```

## Example: Complete Workflow Creation

```typescript
import { createN8nClient } from '@kpi/integrations-n8n';
import {
  createWebhookNode,
  createHttpRequestNode,
  createSetNode,
  createConnection,
  mergeConnections,
} from '@kpi/integrations-n8n/utils';

const client = createN8nClient({
  apiUrl: process.env.N8N_API_URL!,
  apiKey: process.env.N8N_API_KEY!,
});

async function createDataProcessingWorkflow() {
  // Define nodes
  const webhook = createWebhookNode({
    name: 'Webhook Trigger',
    path: 'process-data',
    method: 'POST',
    position: [250, 300],
  });

  const httpRequest = createHttpRequestNode({
    name: 'Fetch Additional Data',
    method: 'GET',
    url: 'https://api.example.com/data',
    position: [450, 300],
  });

  const transform = createSetNode({
    name: 'Transform Results',
    values: {
      originalData: '{{ $json.body }}',
      additionalData: '{{ $json.data }}',
      processedAt: '{{ $now }}',
    },
    position: [650, 300],
  });

  // Create connections
  const connections = mergeConnections(
    createConnection(webhook.name, httpRequest.name),
    createConnection(httpRequest.name, transform.name)
  );

  // Create workflow
  const workflow = await client.createWorkflow({
    name: 'Data Processing Pipeline',
    nodes: [webhook, httpRequest, transform],
    connections,
    active: true,
    settings: {
      saveManualExecutions: true,
      saveDataSuccessExecution: 'all',
      executionTimeout: 300,
    },
  });

  console.log(`Workflow created: ${workflow.id}`);
  console.log(`Webhook URL: https://your-n8n.com/webhook/process-data`);

  return workflow;
}

createDataProcessingWorkflow();
```

## TypeScript Types

All types are exported and can be imported:

```typescript
import type {
  N8nConfig,
  Workflow,
  WorkflowNode,
  WorkflowExecution,
  ExecutionStatus,
  Credential,
  Webhook,
  WorkflowStatistics,
} from '@kpi/integrations-n8n';
```

## API Reference

### N8nClient

The main client class for interacting with the n8n API.

#### Workflow Methods
- `getWorkflows()`: Get all workflows
- `getWorkflow(id)`: Get a specific workflow
- `createWorkflow(input)`: Create a new workflow
- `updateWorkflow(id, input)`: Update a workflow
- `deleteWorkflow(id)`: Delete a workflow
- `activateWorkflow(request)`: Activate/deactivate a workflow
- `getActiveWorkflows()`: Get all active workflows
- `duplicateWorkflow(id, name?)`: Duplicate a workflow

#### Execution Methods
- `executeWorkflow(request)`: Execute a workflow manually
- `getExecutions(request)`: Get executions with filters
- `getExecution(id)`: Get a specific execution
- `deleteExecution(id)`: Delete an execution
- `stopExecution(id)`: Stop a running execution
- `retryExecution(id)`: Retry a failed execution
- `getExecutionStatus(id)`: Get execution status
- `waitForExecution(id, options)`: Wait for execution to complete
- `getWorkflowExecutions(workflowId, options)`: Get workflow executions
- `getLatestExecution(workflowId)`: Get latest execution

#### Credential Methods
- `getCredentials()`: Get all credentials
- `getCredential(id)`: Get a specific credential
- `createCredential(input)`: Create a new credential
- `updateCredential(id, input)`: Update a credential
- `deleteCredential(id)`: Delete a credential

#### Webhook Methods
- `getWebhooks()`: Get all webhooks
- `getWorkflowWebhooks(workflowId)`: Get workflow webhooks
- `testWebhook(workflowId)`: Test a webhook

#### Tag Methods
- `getTags()`: Get all tags
- `createTag(name)`: Create a tag
- `deleteTag(id)`: Delete a tag

#### Statistics Methods
- `getWorkflowStatistics(workflowId)`: Get workflow statistics

#### Utility Methods
- `healthCheck()`: Check API health
- `getInstanceInfo()`: Get n8n instance info

## License

MIT
