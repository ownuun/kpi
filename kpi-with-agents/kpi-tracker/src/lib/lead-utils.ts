/**
 * Lead management utility functions
 */

import type { Lead, LeadStatus, LeadSource, KanbanColumn } from '@/types/lead';

/**
 * Get display label for lead status
 */
export function getStatusLabel(status: LeadStatus): string {
  const labels: Record<LeadStatus, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    MEETING: 'Meeting',
    PROPOSAL: 'Proposal',
    WON: 'Won',
    LOST: 'Lost',
  };
  return labels[status];
}

/**
 * Get color for lead status
 */
export function getStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-500',
    CONTACTED: 'bg-purple-500',
    QUALIFIED: 'bg-indigo-500',
    MEETING: 'bg-yellow-500',
    PROPOSAL: 'bg-orange-500',
    WON: 'bg-green-500',
    LOST: 'bg-red-500',
  };
  return colors[status];
}

/**
 * Get display label for lead source
 */
export function getSourceLabel(source: LeadSource): string {
  const labels: Record<LeadSource, string> = {
    WEBSITE: 'Website',
    REFERRAL: 'Referral',
    COLD_CALL: 'Cold Call',
    EMAIL_CAMPAIGN: 'Email Campaign',
    SOCIAL_MEDIA: 'Social Media',
    EVENT: 'Event',
    PARTNER: 'Partner',
    OTHER: 'Other',
  };
  return labels[source];
}

/**
 * Get icon for lead source
 */
export function getSourceIcon(source: LeadSource): string {
  const icons: Record<LeadSource, string> = {
    WEBSITE: '🌐',
    REFERRAL: '👥',
    COLD_CALL: '📞',
    EMAIL_CAMPAIGN: '📧',
    SOCIAL_MEDIA: '📱',
    EVENT: '🎉',
    PARTNER: '🤝',
    OTHER: '📋',
  };
  return icons[source];
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format date to short format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Group leads by status for Kanban board
 */
export function groupLeadsByStatus(leads: Lead[]): KanbanColumn[] {
  const statuses: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'MEETING',
    'PROPOSAL',
    'WON',
    'LOST',
  ];

  return statuses.map((status) => {
    const statusLeads = leads.filter((lead) => lead.status === status);
    return {
      id: status,
      title: getStatusLabel(status),
      color: getStatusColor(status),
      leads: statusLeads,
      count: statusLeads.length,
    };
  });
}

/**
 * Calculate lead score based on various factors
 */
export function calculateLeadScore(lead: Lead): number {
  let score = 0;

  // Email and phone presence
  if (lead.email) score += 10;
  if (lead.phone) score += 10;

  // Company information
  if (lead.companyId || lead.companyName) score += 15;

  // Job title indicates decision-making power
  if (lead.jobTitle) {
    const title = lead.jobTitle.toLowerCase();
    if (title.includes('ceo') || title.includes('founder')) score += 25;
    else if (title.includes('cto') || title.includes('vp')) score += 20;
    else if (title.includes('director') || title.includes('manager')) score += 15;
    else score += 10;
  }

  // Deal value indicates potential
  if (lead.dealValue) {
    if (lead.dealValue >= 100000) score += 20;
    else if (lead.dealValue >= 50000) score += 15;
    else if (lead.dealValue >= 10000) score += 10;
    else score += 5;
  }

  // Status progression
  const statusScores: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 5,
    QUALIFIED: 10,
    MEETING: 15,
    PROPOSAL: 20,
    WON: 0,
    LOST: 0,
  };
  score += statusScores[lead.status];

  return Math.min(score, 100);
}

/**
 * Get next status in the pipeline
 */
export function getNextStatus(currentStatus: LeadStatus): LeadStatus | null {
  const progression: Record<LeadStatus, LeadStatus | null> = {
    NEW: 'CONTACTED',
    CONTACTED: 'QUALIFIED',
    QUALIFIED: 'MEETING',
    MEETING: 'PROPOSAL',
    PROPOSAL: 'WON',
    WON: null,
    LOST: null,
  };
  return progression[currentStatus];
}

/**
 * Get previous status in the pipeline
 */
export function getPreviousStatus(currentStatus: LeadStatus): LeadStatus | null {
  const regression: Record<LeadStatus, LeadStatus | null> = {
    NEW: null,
    CONTACTED: 'NEW',
    QUALIFIED: 'CONTACTED',
    MEETING: 'QUALIFIED',
    PROPOSAL: 'MEETING',
    WON: 'PROPOSAL',
    LOST: null,
  };
  return regression[currentStatus];
}
