import { BaseRecord, FullName, Emails, Phones, Links, Address } from './common';
import { Company } from './company';

/**
 * Person entity from Twenty CRM
 * Represents a contact/person in the CRM system
 */
export interface Person extends BaseRecord {
  name: FullName;
  emails: Emails;
  phones: Phones | null;
  linkedinLink: Links | null;
  xLink: Links | null;
  avatarUrl: string | null;
  city: string | null;
  jobTitle: string | null;
  intro: string | null;
  whatsapp: Phones | null;

  // Relations
  companyId: string | null;
  company: Company | null;

  // System fields (read-only)
  searchVector: string | null;
}

export interface CreatePersonInput {
  name: FullName;
  emails?: Emails;
  phones?: Phones;
  linkedinLink?: Links;
  xLink?: Links;
  avatarUrl?: string;
  city?: string;
  jobTitle?: string;
  intro?: string;
  whatsapp?: Phones;
  companyId?: string;
  position?: number;
}

export interface UpdatePersonInput {
  name?: FullName;
  emails?: Emails;
  phones?: Phones;
  linkedinLink?: Links;
  xLink?: Links;
  avatarUrl?: string;
  city?: string;
  jobTitle?: string;
  intro?: string;
  whatsapp?: Phones;
  companyId?: string;
  position?: number;
}

export interface PersonFilter {
  id?: { eq?: string; in?: string[] };
  name?: {
    firstName?: { eq?: string; like?: string; ilike?: string };
    lastName?: { eq?: string; like?: string; ilike?: string };
  };
  emails?: {
    primaryEmail?: { eq?: string; like?: string; ilike?: string };
  };
  city?: { eq?: string; like?: string; ilike?: string };
  jobTitle?: { eq?: string; like?: string; ilike?: string };
  companyId?: { eq?: string; in?: string[]; is?: 'NULL' | 'NOT_NULL' };
  createdAt?: { gt?: string; gte?: string; lt?: string; lte?: string };
  updatedAt?: { gt?: string; gte?: string; lt?: string; lte?: string };
  and?: PersonFilter[];
  or?: PersonFilter[];
  not?: PersonFilter;
}
