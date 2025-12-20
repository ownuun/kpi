import { BaseRecord, Links, Currency, Address } from './common';
import { Person } from './person';

/**
 * Company entity from Twenty CRM
 * Represents a company/organization in the CRM system
 */
export interface Company extends BaseRecord {
  name: string | null;
  domainName: Links;
  employees: number | null;
  linkedinLink: Links | null;
  xLink: Links | null;
  annualRecurringRevenue: Currency | null;
  address: Address;
  idealCustomerProfile: boolean;

  // Relations
  accountOwnerId: string | null;
  people: Person[] | null;

  // System fields (read-only)
  searchVector: string | null;

  // Deprecated fields
  addressOld: string | null;
}

export interface CreateCompanyInput {
  name?: string;
  domainName?: Links;
  employees?: number;
  linkedinLink?: Links;
  xLink?: Links;
  annualRecurringRevenue?: Currency;
  address?: Address;
  idealCustomerProfile?: boolean;
  accountOwnerId?: string;
  position?: number;
}

export interface UpdateCompanyInput {
  name?: string;
  domainName?: Links;
  employees?: number;
  linkedinLink?: Links;
  xLink?: Links;
  annualRecurringRevenue?: Currency;
  address?: Address;
  idealCustomerProfile?: boolean;
  accountOwnerId?: string;
  position?: number;
}

export interface CompanyFilter {
  id?: { eq?: string; in?: string[] };
  name?: { eq?: string; like?: string; ilike?: string };
  domainName?: {
    primaryLinkUrl?: { eq?: string; like?: string; ilike?: string };
  };
  employees?: { eq?: number; gt?: number; gte?: number; lt?: number; lte?: number };
  idealCustomerProfile?: { eq?: boolean };
  accountOwnerId?: { eq?: string; in?: string[]; is?: 'NULL' | 'NOT_NULL' };
  createdAt?: { gt?: string; gte?: string; lt?: string; lte?: string };
  updatedAt?: { gt?: string; gte?: string; lt?: string; lte?: string };
  and?: CompanyFilter[];
  or?: CompanyFilter[];
  not?: CompanyFilter;
}
