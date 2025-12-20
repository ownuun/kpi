/**
 * @kpi/integrations-metabase
 * Metabase REST API integration for business intelligence and analytics
 */

// Export all types
export * from './types';

// Export client
export * from './client';

// Export utilities
export * from './utils';

// Re-export main client and types for convenience
export { createMetabaseClient, MetabaseClient } from './client';
export type {
  MetabaseConfig,
  Dashboard,
  Card,
  Collection,
  Database,
  Table,
  QueryResult,
  EmbedUrlOptions,
  SignedEmbedUrl,
} from './types';

// Re-export key utilities
export {
  generateSignedEmbedUrl,
  generateEmbedToken,
  generateIframeHtml,
  generateReactEmbedComponent,
  buildPublicUrl,
  extractResourceFromUrl,
  createDownloadUrl,
} from './utils';
