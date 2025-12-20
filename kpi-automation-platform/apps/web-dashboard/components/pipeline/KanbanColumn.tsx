'use client';

import { Lead, PipelineStage } from '@/types/pipeline';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LeadCard } from './LeadCard';
import { LeadQuickAdd } from './LeadQuickAdd';

interface KanbanColumnProps {
  id: PipelineStage;
  title: string;
  color: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onAddLead: (lead: any) => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  leads,
  onLeadClick,
  onAddLead
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalAmount = leads.reduce((sum, lead) => sum + (lead.amount || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">({leads.length})</span>
          </div>
        </div>
        {totalAmount > 0 && (
          <div className="text-sm font-medium text-gray-600">
            {formatCurrency(totalAmount)}
          </div>
        )}
      </div>

      {/* Quick Add */}
      <div className="mb-4">
        <LeadQuickAdd stage={id} onAdd={onAddLead} />
      </div>

      {/* Lead Cards */}
      <SortableContext
        items={leads.map(l => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-0 min-h-[200px]">
          {leads.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              리드가 없습니다
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => onLeadClick(lead)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
