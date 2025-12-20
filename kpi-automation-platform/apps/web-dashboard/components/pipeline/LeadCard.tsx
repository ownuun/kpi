'use client';

import { Lead } from '@/types/pipeline';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const formatCurrency = (value?: number) => {
    if (!value) return null;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Header with Avatar */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          {lead.avatarUrl ? (
            <img
              src={lead.avatarUrl}
              alt={`${lead.firstName} ${lead.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(lead.firstName, lead.lastName)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {lead.firstName} {lead.lastName}
          </h4>
          {lead.jobTitle && (
            <p className="text-xs text-gray-500 truncate">{lead.jobTitle}</p>
          )}
        </div>
      </div>

      {/* Company */}
      {lead.companyName && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 truncate">
            {lead.companyName}
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        {lead.email && (
          <p className="text-xs text-gray-600 truncate flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {lead.email}
          </p>
        )}
        {lead.phone && (
          <p className="text-xs text-gray-600 truncate flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {lead.phone}
          </p>
        )}
      </div>

      {/* Amount and Probability */}
      {lead.amount && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-semibold text-green-600">
            {formatCurrency(lead.amount)}
          </span>
          {lead.probability !== undefined && (
            <span className="text-xs text-gray-500">
              {lead.probability}% 확률
            </span>
          )}
        </div>
      )}

      {/* Business Line & Assigned */}
      <div className="flex items-center gap-2 mt-2">
        {lead.businessLine && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {lead.businessLine}
          </span>
        )}
        {lead.assignedTo && (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {lead.assignedTo}
          </span>
        )}
      </div>
    </div>
  );
}
