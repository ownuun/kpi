'use client';

import type { Lead } from '@/types/lead';
import {
  getSourceLabel,
  getSourceIcon,
  formatCurrency,
  formatRelativeTime,
  calculateLeadScore,
} from '@/lib/lead-utils';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isDragging }: LeadCardProps) {
  const score = lead.score ?? calculateLeadScore(lead);

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{lead.name}</h3>
          {lead.jobTitle && (
            <p className="text-sm text-gray-600">{lead.jobTitle}</p>
          )}
          {lead.companyName && (
            <p className="text-sm text-gray-500">{lead.companyName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl" title={getSourceLabel(lead.source)}>
            {getSourceIcon(lead.source)}
          </span>
          {score >= 70 && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              Hot
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📧</span>
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📞</span>
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span>{lead.city}</span>
          </div>
        )}
      </div>

      {lead.dealValue && (
        <div className="mb-3">
          <div className="text-lg font-semibold text-green-600">
            {formatCurrency(lead.dealValue)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2 w-20">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{score}</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(new Date(lead.updatedAt))}
        </span>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lead);
              }}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this lead?')) {
                  onDelete(lead.id);
                }
              }}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
