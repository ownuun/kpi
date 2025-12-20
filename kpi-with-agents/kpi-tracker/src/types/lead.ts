/**
 * Lead management types
 * Based on Twenty CRM Person entity with additional lead-specific fields
 */

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'MEETING'
  | 'PROPOSAL'
  | 'WON'
  | 'LOST';

export type LeadSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'COLD_CALL'
  | 'EMAIL_CAMPAIGN'
  | 'SOCIAL_MEDIA'
  | 'EVENT'
  | 'PARTNER'
  | 'OTHER';

/**
 * Lead entity extending Twenty CRM Person
 */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  status: LeadStatus;
  source: LeadSource;
  score?: number;
  notes?: string;
  dealValue?: number;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
  status?: LeadStatus;
  source: LeadSource;
  score?: number;
  notes?: string;
  dealValue?: number;
  expectedCloseDate?: Date;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
  companyId?: string;
  status?: LeadStatus;
  source?: LeadSource;
  score?: number;
  notes?: string;
  dealValue?: number;
  expectedCloseDate?: Date;
}

/**
 * Lead activity for timeline
 */
export interface LeadActivity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'STATUS_CHANGE';
  title: string;
  description?: string;
  createdAt: Date;
  createdBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Kanban column configuration
 */
export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
  count: number;
}

/**
 * Lead filters for querying
 */
export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minScore?: number;
  maxScore?: number;
}

/**
 * Lead statistics
 */
export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  avgScore: number;
  totalDealValue: number;
  conversionRate: number;
}
