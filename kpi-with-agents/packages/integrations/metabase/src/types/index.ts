/**
 * Metabase API Types
 * Based on Metabase REST API documentation
 */

export interface MetabaseConfig {
  apiUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
  timeout?: number;
}

/**
 * Session token response
 */
export interface SessionToken {
  id: string;
}

/**
 * Dashboard entity
 */
export interface Dashboard {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  collection_id?: number;
  parameters?: DashboardParameter[];
  ordered_cards?: DashboardCard[];
  enable_embedding?: boolean;
  embedding_params?: Record<string, EmbeddingParamType>;
  archived?: boolean;
}

export interface DashboardParameter {
  id: string;
  name: string;
  slug: string;
  type: string;
  default?: any;
  required?: boolean;
}

export interface DashboardCard {
  id: number;
  dashboard_id: number;
  card_id: number;
  card: Card;
  parameter_mappings?: ParameterMapping[];
  visualization_settings?: Record<string, any>;
  row: number;
  col: number;
  size_x: number;
  size_y: number;
}

export interface ParameterMapping {
  parameter_id: string;
  card_id: number;
  target: any;
}

export type EmbeddingParamType = 'enabled' | 'disabled' | 'locked';

/**
 * Question/Card entity
 */
export interface Card {
  id: number;
  name: string;
  description?: string;
  display: CardDisplayType;
  visualization_settings?: Record<string, any>;
  dataset_query: DatasetQuery;
  database_id?: number;
  table_id?: number;
  collection_id?: number;
  created_at: string;
  updated_at: string;
  creator_id: number;
  enable_embedding?: boolean;
  embedding_params?: Record<string, EmbeddingParamType>;
  archived?: boolean;
}

export type CardDisplayType =
  | 'table'
  | 'bar'
  | 'line'
  | 'row'
  | 'area'
  | 'pie'
  | 'funnel'
  | 'scatter'
  | 'scalar'
  | 'smartscalar'
  | 'progress'
  | 'gauge'
  | 'combo'
  | 'waterfall'
  | 'map';

export interface DatasetQuery {
  type: 'query' | 'native' | 'internal';
  database?: number;
  query?: StructuredQuery;
  native?: NativeQuery;
}

export interface StructuredQuery {
  'source-table'?: number;
  'source-query'?: StructuredQuery;
  aggregation?: any[];
  breakout?: any[];
  filter?: any[];
  'order-by'?: any[];
  limit?: number;
  expressions?: Record<string, any>;
}

export interface NativeQuery {
  query: string;
  'template-tags'?: Record<string, TemplateTag>;
  collection?: string;
}

export interface TemplateTag {
  id: string;
  name: string;
  'display-name': string;
  type: 'text' | 'number' | 'date' | 'dimension' | 'card';
  dimension?: any[];
  'widget-type'?: string;
  required?: boolean;
  default?: any;
}

/**
 * Collection entity
 */
export interface Collection {
  id: number;
  name: string;
  description?: string;
  color?: string;
  archived?: boolean;
  location?: string;
  personal_owner_id?: number;
}

/**
 * Database entity
 */
export interface Database {
  id: number;
  name: string;
  description?: string;
  engine: string;
  created_at: string;
  updated_at: string;
  is_full_sync: boolean;
  is_on_demand: boolean;
  features?: string[];
}

/**
 * Table entity
 */
export interface Table {
  id: number;
  db_id: number;
  schema?: string;
  name: string;
  display_name: string;
  description?: string;
  active: boolean;
  fields?: Field[];
}

export interface Field {
  id: number;
  table_id: number;
  name: string;
  display_name: string;
  description?: string;
  base_type: string;
  semantic_type?: string;
  active: boolean;
  visibility_type: string;
}

/**
 * Query execution result
 */
export interface QueryResult {
  data: {
    rows: any[][];
    cols: Column[];
    native_form?: {
      query: string;
      params?: any[];
    };
  };
  database_id: number;
  started_at: string;
  json_query: any;
  average_execution_time?: number;
  status: 'completed' | 'failed' | 'running';
  context: string;
  row_count: number;
  running_time: number;
}

export interface Column {
  name: string;
  display_name: string;
  base_type: string;
  semantic_type?: string;
  field_ref?: any[];
  source: string;
}

/**
 * Dashboard creation/update inputs
 */
export interface CreateDashboardInput {
  name: string;
  description?: string;
  collection_id?: number;
  parameters?: DashboardParameter[];
}

export interface UpdateDashboardInput {
  name?: string;
  description?: string;
  collection_id?: number;
  parameters?: DashboardParameter[];
  archived?: boolean;
}

/**
 * Card/Question creation inputs
 */
export interface CreateCardInput {
  name: string;
  description?: string;
  display: CardDisplayType;
  visualization_settings?: Record<string, any>;
  dataset_query: DatasetQuery;
  database_id?: number;
  table_id?: number;
  collection_id?: number;
}

export interface UpdateCardInput {
  name?: string;
  description?: string;
  display?: CardDisplayType;
  visualization_settings?: Record<string, any>;
  dataset_query?: DatasetQuery;
  collection_id?: number;
  archived?: boolean;
}

/**
 * Embedding configuration
 */
export interface EmbeddingConfig {
  resource: {
    dashboard?: number;
    question?: number;
  };
  params?: Record<string, any>;
  exp?: number; // Expiration time (Unix timestamp)
}

export interface EmbedUrlOptions {
  dashboardId?: number;
  questionId?: number;
  params?: Record<string, any>;
  theme?: 'light' | 'dark' | 'transparent';
  bordered?: boolean;
  titled?: boolean;
  hideParameters?: boolean | string; // true, false, or comma-separated list
  hideDownloadButton?: boolean;
  expiresIn?: number; // Expiration time in seconds (default: 600)
}

export interface SignedEmbedUrl {
  url: string;
  token: string;
  expiresAt: Date;
}

/**
 * List query options
 */
export interface ListOptions {
  limit?: number;
  offset?: number;
  archived?: boolean;
  collection_id?: number;
}

/**
 * API Error response
 */
export interface MetabaseApiError {
  message: string;
  code?: string;
  statusCode: number;
  errors?: Record<string, string>;
}

/**
 * User entity
 */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  common_name?: string;
  is_superuser: boolean;
  is_qbnewb: boolean;
  date_joined: string;
  last_login?: string;
  group_ids?: number[];
}

/**
 * Public sharing link
 */
export interface PublicLink {
  uuid: string;
  public_url: string;
}
