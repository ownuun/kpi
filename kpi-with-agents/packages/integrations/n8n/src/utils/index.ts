/**
 * n8n Utility Functions
 */

import type {
  Workflow,
  WorkflowNode,
  WorkflowExecution,
  Webhook,
  WorkflowStatistics,
  ExecutionStatus,
} from '../types';

/**
 * Workflow Builder Utilities
 */

/**
 * Create a webhook trigger node
 */
export function createWebhookNode(options: {
  name?: string;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  responseMode?: 'onReceived' | 'lastNode';
  responseData?: 'allEntries' | 'firstEntryJson' | 'noData';
  position?: [number, number];
}): WorkflowNode {
  return {
    id: generateNodeId(),
    name: options.name || 'Webhook',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 1,
    position: options.position || [250, 300],
    parameters: {
      path: options.path,
      httpMethod: options.method || 'POST',
      responseMode: options.responseMode || 'onReceived',
      responseData: options.responseData || 'firstEntryJson',
    },
    webhookId: generateWebhookId(),
  };
}

/**
 * Create a schedule trigger node (cron)
 */
export function createScheduleNode(options: {
  name?: string;
  cronExpression: string;
  position?: [number, number];
}): WorkflowNode {
  return {
    id: generateNodeId(),
    name: options.name || 'Schedule Trigger',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1,
    position: options.position || [250, 300],
    parameters: {
      rule: {
        interval: [
          {
            field: 'cronExpression',
            expression: options.cronExpression,
          },
        ],
      },
    },
  };
}

/**
 * Create an HTTP Request node
 */
export function createHttpRequestNode(options: {
  name?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  authentication?: string;
  headers?: Record<string, string>;
  body?: any;
  position?: [number, number];
}): WorkflowNode {
  return {
    id: generateNodeId(),
    name: options.name || 'HTTP Request',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 3,
    position: options.position || [450, 300],
    parameters: {
      method: options.method,
      url: options.url,
      authentication: options.authentication || 'none',
      sendHeaders: !!options.headers,
      headerParameters: options.headers
        ? {
            parameters: Object.entries(options.headers).map(([name, value]) => ({
              name,
              value,
            })),
          }
        : undefined,
      sendBody: !!options.body,
      bodyParameters: options.body,
    },
  };
}

/**
 * Create a Set node for data transformation
 */
export function createSetNode(options: {
  name?: string;
  values: Record<string, any>;
  position?: [number, number];
}): WorkflowNode {
  return {
    id: generateNodeId(),
    name: options.name || 'Set',
    type: 'n8n-nodes-base.set',
    typeVersion: 2,
    position: options.position || [650, 300],
    parameters: {
      values: {
        string: Object.entries(options.values).map(([name, value]) => ({
          name,
          value,
        })),
      },
    },
  };
}

/**
 * Create a Code node for custom logic
 */
export function createCodeNode(options: {
  name?: string;
  code: string;
  position?: [number, number];
}): WorkflowNode {
  return {
    id: generateNodeId(),
    name: options.name || 'Code',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: options.position || [850, 300],
    parameters: {
      jsCode: options.code,
    },
  };
}

/**
 * Create a simple connection between two nodes
 */
export function createConnection(
  sourceNode: string,
  targetNode: string,
  sourceOutput = 'main',
  targetInput = 'main',
  outputIndex = 0,
  inputIndex = 0
) {
  return {
    [sourceNode]: {
      [sourceOutput]: [
        {
          node: targetNode,
          type: targetInput,
          index: inputIndex,
        },
      ],
    },
  };
}

/**
 * Merge multiple connection objects
 */
export function mergeConnections(...connections: any[]) {
  const merged: any = {};

  for (const conn of connections) {
    for (const [node, outputs] of Object.entries(conn)) {
      if (!merged[node]) {
        merged[node] = {};
      }

      for (const [output, targets] of Object.entries(outputs as any)) {
        if (!merged[node][output]) {
          merged[node][output] = [];
        }

        merged[node][output].push(...(targets as any));
      }
    }
  }

  return merged;
}

/**
 * Webhook Utilities
 */

/**
 * Build full webhook URL
 */
export function buildWebhookUrl(
  baseUrl: string,
  webhookPath: string,
  testMode = false
): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = webhookPath.replace(/^\//, '');
  const prefix = testMode ? 'webhook-test' : 'webhook';

  return `${cleanBaseUrl}/${prefix}/${cleanPath}`;
}

/**
 * Parse webhook path from full URL
 */
export function parseWebhookPath(webhookUrl: string): string {
  const match = webhookUrl.match(/\/webhook(?:-test)?\/(.+)$/);
  return match ? match[1] : '';
}

/**
 * Validate webhook path
 */
export function validateWebhookPath(path: string): { valid: boolean; error?: string } {
  if (!path || path.trim() === '') {
    return { valid: false, error: 'Webhook path cannot be empty' };
  }

  if (path.includes('//')) {
    return { valid: false, error: 'Webhook path cannot contain double slashes' };
  }

  if (path.includes(' ')) {
    return { valid: false, error: 'Webhook path cannot contain spaces' };
  }

  return { valid: true };
}

/**
 * Execution Utilities
 */

/**
 * Check if execution was successful
 */
export function isExecutionSuccessful(execution: WorkflowExecution): boolean {
  return execution.finished && execution.status === 'success';
}

/**
 * Check if execution is still running
 */
export function isExecutionRunning(execution: WorkflowExecution): boolean {
  return !execution.finished && execution.status === 'running';
}

/**
 * Get execution duration in milliseconds
 */
export function getExecutionDuration(execution: WorkflowExecution): number {
  if (!execution.startedAt) return 0;

  const startTime = new Date(execution.startedAt).getTime();
  const endTime = execution.stoppedAt
    ? new Date(execution.stoppedAt).getTime()
    : Date.now();

  return endTime - startTime;
}

/**
 * Format execution duration for display
 */
export function formatExecutionDuration(execution: WorkflowExecution): string {
  const duration = getExecutionDuration(execution);

  if (duration < 1000) {
    return `${duration}ms`;
  } else if (duration < 60000) {
    return `${(duration / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Get execution output data
 */
export function getExecutionOutput(execution: WorkflowExecution): any[] {
  if (!execution.data?.resultData?.runData) {
    return [];
  }

  const runData = execution.data.resultData.runData;
  const lastNode = execution.data.resultData.lastNodeExecuted;

  if (!lastNode || !runData[lastNode]) {
    return [];
  }

  const nodeData = runData[lastNode][0];
  if (!nodeData?.data?.main?.[0]) {
    return [];
  }

  return nodeData.data.main[0].map((item: any) => item.json);
}

/**
 * Get execution error details
 */
export function getExecutionError(execution: WorkflowExecution): {
  message: string;
  node?: string;
  details?: string;
} | null {
  if (!execution.data?.resultData?.error) {
    return null;
  }

  const error = execution.data.resultData.error;
  return {
    message: error.message,
    node: error.node,
    details: error.description || error.stack,
  };
}

/**
 * Statistics Utilities
 */

/**
 * Calculate success rate
 */
export function calculateSuccessRate(stats: WorkflowStatistics): number {
  if (stats.totalExecutions === 0) return 0;
  return (stats.successfulExecutions / stats.totalExecutions) * 100;
}

/**
 * Calculate failure rate
 */
export function calculateFailureRate(stats: WorkflowStatistics): number {
  if (stats.totalExecutions === 0) return 0;
  return (stats.failedExecutions / stats.totalExecutions) * 100;
}

/**
 * Format average execution time
 */
export function formatAverageTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Workflow Validation
 */

/**
 * Validate workflow structure
 */
export function validateWorkflow(workflow: Partial<Workflow>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!workflow.name || workflow.name.trim() === '') {
    errors.push('Workflow name is required');
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  if (workflow.nodes) {
    const nodeIds = new Set<string>();
    const nodeNames = new Set<string>();

    for (const node of workflow.nodes) {
      if (nodeIds.has(node.id)) {
        errors.push(`Duplicate node ID: ${node.id}`);
      }
      nodeIds.add(node.id);

      if (nodeNames.has(node.name)) {
        errors.push(`Duplicate node name: ${node.name}`);
      }
      nodeNames.add(node.name);

      if (!node.type) {
        errors.push(`Node ${node.name} is missing type`);
      }
    }

    // Validate connections reference existing nodes
    if (workflow.connections) {
      for (const [sourceNode, outputs] of Object.entries(workflow.connections)) {
        if (!nodeIds.has(sourceNode)) {
          errors.push(`Connection references non-existent source node: ${sourceNode}`);
        }

        for (const targets of Object.values(outputs)) {
          for (const target of targets as any) {
            const nodeExists = workflow.nodes.some((n) => n.name === target.node);
            if (!nodeExists) {
              errors.push(`Connection references non-existent target node: ${target.node}`);
            }
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if workflow has trigger node
 */
export function hasTriggerNode(workflow: Workflow): boolean {
  return workflow.nodes.some(
    (node) =>
      node.type.includes('Trigger') ||
      node.type === 'n8n-nodes-base.webhook' ||
      node.type === 'n8n-nodes-base.scheduleTrigger'
  );
}

/**
 * Get trigger nodes from workflow
 */
export function getTriggerNodes(workflow: Workflow): WorkflowNode[] {
  return workflow.nodes.filter(
    (node) =>
      node.type.includes('Trigger') ||
      node.type === 'n8n-nodes-base.webhook' ||
      node.type === 'n8n-nodes-base.scheduleTrigger'
  );
}

/**
 * ID Generation
 */

/**
 * Generate a unique node ID
 */
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique webhook ID
 */
export function generateWebhookId(): string {
  return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cron Expression Helpers
 */

/**
 * Create cron expression for common schedules
 */
export const cronExpressions = {
  everyMinute: '* * * * *',
  everyFiveMinutes: '*/5 * * * *',
  everyTenMinutes: '*/10 * * * *',
  everyFifteenMinutes: '*/15 * * * *',
  everyThirtyMinutes: '*/30 * * * *',
  hourly: '0 * * * *',
  daily: '0 0 * * *',
  dailyAt9AM: '0 9 * * *',
  weeklyMonday: '0 0 * * 1',
  monthly: '0 0 1 * *',
};

/**
 * Validate cron expression
 */
export function validateCronExpression(cron: string): {
  valid: boolean;
  error?: string;
} {
  const parts = cron.trim().split(/\s+/);

  if (parts.length !== 5) {
    return {
      valid: false,
      error: 'Cron expression must have 5 parts (minute hour day month weekday)',
    };
  }

  return { valid: true };
}
