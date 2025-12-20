'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Lead } from '@/types/pipeline';
import Navigation from '@/components/layout/Navigation';
import BusinessLineTabs, { BusinessLine } from '@/components/BusinessLineTabs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PipelinePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [businessLine, setBusinessLine] = useState<BusinessLine>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/pipeline');
      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
      } else {
        setError(result.error || 'Failed to fetch leads');
      }
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await fetch(`/api/pipeline/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (result.success) {
        // Optimistically update the local state
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead.id === id ? { ...lead, ...updates } : lead
          )
        );
      } else {
        alert(`Failed to update lead: ${result.error}`);
        // Refresh to get the correct state
        fetchLeads();
      }
    } catch (err: any) {
      console.error('Failed to update lead:', err);
      alert(`Failed to update lead: ${err.message}`);
      fetchLeads();
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    try {
      const response = await fetch(`/api/pipeline/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      } else {
        alert(`Failed to delete lead: ${result.error}`);
      }
    } catch (err: any) {
      console.error('Failed to delete lead:', err);
      alert(`Failed to delete lead: ${err.message}`);
    }
  };

  // Add lead
  const handleAddLead = async (leadData: any) => {
    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();

      if (result.success) {
        // Add to local state with stage
        const newLead = { ...result.data, stage: leadData.stage };
        setLeads(prevLeads => [...prevLeads, newLead]);
      } else {
        alert(`Failed to add lead: ${result.error}`);
      }
    } catch (err: any) {
      console.error('Failed to add lead:', err);
      alert(`Failed to add lead: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">리드 파이프라인 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">오류 발생</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // Filter leads by business line
  const filteredLeads = businessLine === 'all' 
    ? leads 
    : leads.filter(lead => (lead as any).businessLine === businessLine);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('리드 파이프라인', 'Lead Pipeline')}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {t('Twenty CRM 데이터 기반 영업 파이프라인 관리', 'Sales pipeline management based on Twenty CRM data')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/leads/new')}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  {t('+ 새 리드 추가', '+ Add New Lead')}
                </button>
                <button
                  onClick={fetchLeads}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('새로고침', 'Refresh')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Business Line Tabs */}
          <div className="container mx-auto px-4 -mb-px">
            <BusinessLineTabs onTabChange={setBusinessLine} />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <KanbanBoard
            leads={filteredLeads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onAddLead={handleAddLead}
          />
        </div>
      </div>
    </>
  );
}
