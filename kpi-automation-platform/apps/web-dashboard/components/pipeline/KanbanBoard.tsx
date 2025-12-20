'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Lead, PipelineStage, PIPELINE_STAGES, PipelineFilter, SortOption, SortDirection } from '@/types/pipeline';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';
import { LeadDetailModal } from './LeadDetailModal';
import { PipelineStats } from './PipelineStats';

interface KanbanBoardProps {
  leads: Lead[];
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  onAddLead: (lead: any) => void;
}

export function KanbanBoard({ leads, onUpdateLead, onDeleteLead, onAddLead }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<PipelineFilter>({});
  const [sortField, setSortField] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Apply filters
    if (filter.businessLine) {
      result = result.filter(l => l.businessLine === filter.businessLine);
    }
    if (filter.assignedTo) {
      result = result.filter(l => l.assignedTo === filter.assignedTo);
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(l =>
        l.firstName.toLowerCase().includes(search) ||
        l.lastName.toLowerCase().includes(search) ||
        l.email?.toLowerCase().includes(search) ||
        l.companyName?.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[sortField]).getTime();
          bValue = new Date(b[sortField]).getTime();
          break;
        case 'amount':
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [leads, filter, sortField, sortDirection]);

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Lead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      meeting_scheduled: [],
      proposal: [],
      won: [],
      lost: []
    };

    filteredAndSortedLeads.forEach(lead => {
      if (grouped[lead.stage]) {
        grouped[lead.stage].push(lead);
      }
    });

    return grouped;
  }, [filteredAndSortedLeads]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const leadId = active.id as string;
    const newStage = over.id as PipelineStage;

    // Find the lead and update its stage
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.stage !== newStage) {
      onUpdateLead(leadId, { stage: newStage });
    }

    setActiveId(null);
  };

  const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

  // Get unique values for filters
  const businessLines = useMemo(() => {
    const lines = new Set(leads.map(l => l.businessLine).filter(Boolean));
    return Array.from(lines) as string[];
  }, [leads]);

  const assignees = useMemo(() => {
    const people = new Set(leads.map(l => l.assignedTo).filter(Boolean));
    return Array.from(people) as string[];
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <PipelineStats leads={filteredAndSortedLeads} />

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="검색 (이름, 이메일, 회사)"
            value={filter.search || ''}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Business Line Filter */}
          <select
            value={filter.businessLine || ''}
            onChange={(e) => setFilter({ ...filter, businessLine: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">모든 비즈니스 라인</option>
            {businessLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={filter.assignedTo || ''}
            onChange={(e) => setFilter({ ...filter, assignedTo: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">모든 담당자</option>
            {assignees.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field as SortOption);
              setSortDirection(direction as SortDirection);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt-desc">최근 생성순</option>
            <option value="createdAt-asc">오래된순</option>
            <option value="amount-desc">금액 높은순</option>
            <option value="amount-asc">금액 낮은순</option>
            <option value="name-asc">이름순 (A-Z)</option>
            <option value="name-desc">이름순 (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                color={stage.color}
                leads={leadsByStage[stage.id]}
                onLeadClick={setSelectedLead}
                onAddLead={onAddLead}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeLead ? (
            <div className="opacity-80 rotate-3 scale-105">
              <LeadCard lead={activeLead} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={onUpdateLead}
        onDelete={onDeleteLead}
      />
    </div>
  );
}
