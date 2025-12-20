'use client';

import { useState } from 'react';
import type { KanbanColumn, Lead, LeadStatus } from '@/types/lead';
import { LeadCard } from './LeadCard';

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onLeadClick?: (lead: Lead) => void;
  onLeadStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onLeadEdit?: (lead: Lead) => void;
  onLeadDelete?: (leadId: string) => Promise<void>;
}

export function KanbanBoard({
  columns,
  onLeadClick,
  onLeadStatusChange,
  onLeadEdit,
  onLeadDelete,
}: KanbanBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<LeadStatus | null>(null);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: LeadStatus) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== newStatus && onLeadStatusChange) {
      try {
        await onLeadStatusChange(draggedLead.id, newStatus);
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    }
    setDraggedLead(null);
    setDraggedOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className={`${column.color} text-white rounded-lg p-3 mb-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="bg-white/20 px-2 py-1 rounded text-sm font-medium">
                {column.count}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div
            className={`space-y-3 min-h-[200px] p-3 rounded-lg transition-colors ${
              draggedOverColumn === column.id
                ? 'bg-blue-50 border-2 border-blue-300 border-dashed'
                : 'bg-gray-50'
            }`}
          >
            {column.leads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={() => handleDragStart(lead)}
                onDragEnd={handleDragEnd}
                onClick={() => onLeadClick?.(lead)}
              >
                <LeadCard
                  lead={lead}
                  onEdit={onLeadEdit}
                  onDelete={onLeadDelete}
                  isDragging={draggedLead?.id === lead.id}
                />
              </div>
            ))}

            {column.leads.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No leads in this stage
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
