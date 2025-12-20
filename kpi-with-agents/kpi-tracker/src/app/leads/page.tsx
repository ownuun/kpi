'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lead, LeadStatus, LeadSource } from '@/types/lead';
import { KanbanBoard } from '@/components/leads/KanbanBoard';
import { groupLeadsByStatus } from '@/lib/lead-utils';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');
  const [filterSource, setFilterSource] = useState<LeadSource | 'ALL'>('ALL');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    router.push(`/leads/${lead.id}`);
  };

  const handleCreateLead = () => {
    router.push('/leads/new');
  };

  const handleLeadStatusChange = async (
    leadId: string,
    newStatus: LeadStatus
  ) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }

      const updatedLead = await response.json();
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === leadId ? updatedLead : lead))
      );
    } catch (err) {
      console.error('Error updating lead status:', err);
      alert('Failed to update lead status. Please try again.');
    }
  };

  const handleLeadDelete = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const handleLeadEdit = (lead: Lead) => {
    router.push(`/leads/${lead.id}/edit`);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;
    const matchesSource = filterSource === 'ALL' || lead.source === filterSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const columns = groupLeadsByStatus(filteredLeads);

  const totalDealValue = filteredLeads.reduce(
    (sum, lead) => sum + (lead.dealValue || 0),
    0
  );

  const leadStatuses: (LeadStatus | 'ALL')[] = [
    'ALL',
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'MEETING',
    'PROPOSAL',
    'WON',
    'LOST',
  ];

  const leadSources: (LeadSource | 'ALL')[] = [
    'ALL',
    'WEBSITE',
    'REFERRAL',
    'COLD_CALL',
    'EMAIL_CAMPAIGN',
    'SOCIAL_MEDIA',
    'EVENT',
    'PARTNER',
    'OTHER',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLeads}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Pipeline</h1>
              <p className="text-gray-600 mt-1">
                Manage your leads through the sales pipeline
              </p>
            </div>
            <button
              onClick={handleCreateLead}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              + New Lead
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium">Total Leads</div>
              <div className="text-2xl font-bold text-blue-900">
                {filteredLeads.length}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">
                Pipeline Value
              </div>
              <div className="text-2xl font-bold text-green-900">
                ${totalDealValue.toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Won Deals</div>
              <div className="text-2xl font-bold text-purple-900">
                {leads.filter((l) => l.status === 'WON').length}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-orange-600 font-medium">
                Conversion Rate
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {leads.length > 0
                  ? Math.round(
                      (leads.filter((l) => l.status === 'WON').length /
                        leads.length) *
                        100
                    )
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as LeadStatus | 'ALL')
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'ALL' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={filterSource}
                onChange={(e) =>
                  setFilterSource(e.target.value as LeadSource | 'ALL')
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {leadSources.map((source) => (
                  <option key={source} value={source}>
                    {source === 'ALL'
                      ? 'All Sources'
                      : source.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchLeads}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh leads"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <KanbanBoard
          columns={columns}
          onLeadClick={handleLeadClick}
          onLeadStatusChange={handleLeadStatusChange}
          onLeadEdit={handleLeadEdit}
          onLeadDelete={handleLeadDelete}
        />
      </div>
    </div>
  );
}
