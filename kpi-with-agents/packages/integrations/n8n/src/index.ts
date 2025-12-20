/**
 * @kpi/integrations-n8n
 * n8n API integration for workflow automation
 */

export * from './types';
export * from './client';
export * from './utils';

// Re-export main client for convenience
export { createN8nClient, N8nClient } from './client';
export type { N8nConfig } from './types';
