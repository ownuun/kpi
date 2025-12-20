/**
 * Common types used across the Twenty CRM client
 */

export interface Address {
  addressStreet1: string | null;
  addressStreet2: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostcode: string | null;
  addressCountry: string | null;
  addressLat: number | null;
  addressLng: number | null;
}

export interface Links {
  primaryLinkUrl: string | null;
  primaryLinkLabel: string | null;
  secondaryLinks: Array<{
    url: string;
    label: string;
  }> | null;
}

export interface FullName {
  firstName: string;
  lastName: string;
}

export interface Emails {
  primaryEmail: string | null;
  additionalEmails: string[] | null;
}

export interface Phones {
  primaryPhoneNumber: string | null;
  primaryPhoneCountryCode: string | null;
  additionalPhones: Array<{
    phoneNumber: string;
    countryCode: string;
  }> | null;
}

export interface Currency {
  amountMicros: number | null;
  currencyCode: string | null;
}

export interface Actor {
  source: 'MANUAL' | 'API' | 'IMPORT' | 'WORKFLOW';
  workspaceMemberId: string | null;
  name: string | null;
}

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  position: number;
  createdBy: Actor;
}

export interface FilterOperator {
  eq?: any;
  neq?: any;
  in?: any[];
  is?: 'NULL' | 'NOT_NULL';
  gt?: number | string;
  gte?: number | string;
  lt?: number | string;
  lte?: number | string;
  like?: string;
  ilike?: string;
  startsWith?: string;
  endsWith?: string;
}

export interface RecordFilter {
  and?: RecordFilter[];
  or?: RecordFilter[];
  not?: RecordFilter;
  [field: string]: FilterOperator | RecordFilter[] | RecordFilter | undefined;
}

export interface OrderBy {
  [field: string]: 'AscNullsFirst' | 'AscNullsLast' | 'DescNullsFirst' | 'DescNullsLast';
}

export interface PaginationParams {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}
