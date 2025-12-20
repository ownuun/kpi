import { z } from 'zod';

/**
 * Twenty CRM Object Types
 */

/**
 * Person Schema
 */
export const PersonSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyId: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional()
});

/**
 * Company Schema
 */
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  domainName: z.string().optional(),
  address: z.string().optional(),
  employees: z.number().optional(),
  industry: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  annualRecurringRevenue: z.number().optional(),
  idealCustomerProfile: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional()
});

/**
 * Opportunity Schema
 */
export const OpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  stage: z.enum([
    'NEW',
    'SCREENING',
    'MEETING',
    'PROPOSAL',
    'CUSTOMER'
  ]),
  probability: z.number().min(0).max(100),
  closeDate: z.string().datetime().optional(),
  companyId: z.string().optional(),
  personId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional()
});

/**
 * TypeScript Types
 */
export type Person = z.infer<typeof PersonSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Opportunity = z.infer<typeof OpportunitySchema>;

/**
 * Create/Update Request Types
 */
export interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
}

export interface UpdatePersonInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
}

export interface CreateCompanyInput {
  name: string;
  domainName?: string;
  address?: string;
  employees?: number;
  industry?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  annualRecurringRevenue?: number;
  idealCustomerProfile?: boolean;
}

export interface UpdateCompanyInput {
  name?: string;
  domainName?: string;
  address?: string;
  employees?: number;
  industry?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  annualRecurringRevenue?: number;
  idealCustomerProfile?: boolean;
}

export interface CreateOpportunityInput {
  name: string;
  amount: number;
  stage: 'NEW' | 'SCREENING' | 'MEETING' | 'PROPOSAL' | 'CUSTOMER';
  probability: number;
  closeDate?: string;
  companyId?: string;
  personId?: string;
}

export interface UpdateOpportunityInput {
  name?: string;
  amount?: number;
  stage?: 'NEW' | 'SCREENING' | 'MEETING' | 'PROPOSAL' | 'CUSTOMER';
  probability?: number;
  closeDate?: string;
  companyId?: string;
  personId?: string;
}

/**
 * Query Parameters
 */
export interface ListParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
}

export interface PersonFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyId?: string;
  city?: string;
  country?: string;
}

export interface CompanyFilters {
  name?: string;
  domainName?: string;
  industry?: string;
  idealCustomerProfile?: boolean;
}

export interface OpportunityFilters {
  stage?: string;
  companyId?: string;
  personId?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}

/**
 * GraphQL Response Types
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
    extensions?: any;
  }>;
}

/**
 * Client Configuration
 */
export interface TwentyConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Field Selection
 */
export interface FieldSelection {
  id?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  phone?: boolean;
  jobTitle?: boolean;
  companyId?: boolean;
  linkedinUrl?: boolean;
  avatarUrl?: boolean;
  city?: boolean;
  country?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  deletedAt?: boolean;
}

export interface CompanyFieldSelection {
  id?: boolean;
  name?: boolean;
  domainName?: boolean;
  address?: boolean;
  employees?: boolean;
  industry?: boolean;
  linkedinUrl?: boolean;
  logoUrl?: boolean;
  annualRecurringRevenue?: boolean;
  idealCustomerProfile?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  deletedAt?: boolean;
}

/**
 * Error Types
 */
export class TwentyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public graphQLErrors?: any[]
  ) {
    super(message);
    this.name = 'TwentyError';
  }
}

/**
 * Sort Options
 */
export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Batch Operations
 */
export interface BatchCreateResult<T> {
  created: T[];
  failed: Array<{
    input: any;
    error: string;
  }>;
}

export interface BatchUpdateResult<T> {
  updated: T[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}

export interface BatchDeleteResult {
  deleted: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}
