/**
 * Pipeline and Lead Types
 */

export type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_scheduled'
  | 'proposal'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyName?: string;
  companyId?: string;
  stage: PipelineStage;
  amount?: number;
  probability?: number;
  businessLine?: string;
  assignedTo?: string;
  notes?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  linkedinUrl?: string;
}

export interface PipelineColumn {
  id: PipelineStage;
  title: string;
  leads: Lead[];
  count: number;
  totalAmount: number;
  color: string;
}

export interface PipelineStats {
  totalLeads: number;
  totalValue: number;
  wonDeals: number;
  wonValue: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface PipelineFilter {
  businessLine?: string;
  assignedTo?: string;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type SortOption = 'createdAt' | 'amount' | 'updatedAt' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface PipelineSort {
  field: SortOption;
  direction: SortDirection;
}

export const PIPELINE_STAGES: Array<{
  id: PipelineStage;
  title: string;
  color: string;
  description: string;
}> = [
  {
    id: 'new',
    title: '새 문의',
    color: 'bg-gray-500',
    description: '신규 리드 접수'
  },
  {
    id: 'contacted',
    title: '연락됨',
    color: 'bg-blue-500',
    description: '첫 연락 완료'
  },
  {
    id: 'qualified',
    title: '자격 검증',
    color: 'bg-purple-500',
    description: '리드 자격 확인'
  },
  {
    id: 'meeting_scheduled',
    title: '미팅 예정',
    color: 'bg-yellow-500',
    description: '미팅 일정 잡힘'
  },
  {
    id: 'proposal',
    title: '제안 중',
    color: 'bg-orange-500',
    description: '제안서 전달됨'
  },
  {
    id: 'won',
    title: '거래 성사',
    color: 'bg-green-500',
    description: '계약 체결'
  },
  {
    id: 'lost',
    title: '손실',
    color: 'bg-red-500',
    description: '거래 실패'
  }
];
