/**
 * Twenty CRM GraphQL Types
 * Based on Twenty CRM API documentation
 */

export interface TwentyConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
}

/**
 * Person entity (Lead)
 */
export interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
}

export interface UpdatePersonInput {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
}

/**
 * Company entity
 */
export interface Company {
  id: string;
  name: string;
  domainName?: string;
  address?: string;
  employees?: number;
  linkedinLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  domainName?: string;
  address?: string;
  employees?: number;
  linkedinLink?: string;
}

/**
 * Opportunity entity (Deal)
 */
export interface Opportunity {
  id: string;
  name: string;
  amount: number;
  stage: OpportunityStage;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  personId?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OpportunityStage =
  | 'QUALIFICATION'
  | 'MEETING'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export interface CreateOpportunityInput {
  name: string;
  amount: number;
  stage?: OpportunityStage;
  probability?: number;
  expectedCloseDate?: Date;
  personId?: string;
  companyId?: string;
}

export interface UpdateOpportunityInput {
  name?: string;
  amount?: number;
  stage?: OpportunityStage;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
}

/**
 * Activity entity (Meeting/Call/Email)
 */
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  body?: string;
  dueAt?: Date;
  completedAt?: Date;
  assignedToId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'TASK';

export interface CreateActivityInput {
  type: ActivityType;
  title: string;
  body?: string;
  dueAt?: Date;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
}

/**
 * GraphQL Query/Mutation results
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}

export interface PaginatedResponse<T> {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface FilterInput {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface SortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  filters?: FilterInput[];
  sort?: SortInput[];
}

export interface TwentyApiError {
  message: string;
  code: string;
  statusCode: number;
}
