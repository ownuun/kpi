/**
 * @kpi/integrations-postiz
 * Postiz API integration for social media management
 */

export * from './types';
export * from './client';
export * from './utils';

// Re-export main client for convenience
export { createPostizClient, PostizClient } from './client';
export type { PostizConfig } from './types';
