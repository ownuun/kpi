/**
 * @kpi/integrations-twenty-crm
 * Twenty CRM GraphQL API integration
 */

export * from './types';
export * from './client';

// Re-export main client for convenience
export { createTwentyClient, TwentyClient } from './client';
export type { TwentyConfig } from './types';
