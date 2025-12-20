'use client';

import { Lead, PipelineStats as PipelineStatsType } from '@/types/pipeline';
import { useMemo } from 'react';

interface PipelineStatsProps {
  leads: Lead[];
}

export function PipelineStats({ leads }: PipelineStatsProps) {
  const stats: PipelineStatsType = useMemo(() => {
    const wonLeads = leads.filter(l => l.stage === 'won');
    const totalLeads = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length;
    const totalValue = leads
      .filter(l => l.stage !== 'won' && l.stage !== 'lost')
      .reduce((sum, l) => sum + (l.amount || 0), 0);

    const wonValue = wonLeads.reduce((sum, l) => sum + (l.amount || 0), 0);
    const conversionRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
    const averageDealSize = wonLeads.length > 0 ? wonValue / wonLeads.length : 0;

    return {
      totalLeads,
      totalValue,
      wonDeals: wonLeads.length,
      wonValue,
      conversionRate,
      averageDealSize
    };
  }, [leads]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard
        title="총 리드"
        value={stats.totalLeads.toString()}
        subtitle="진행 중"
        color="blue"
      />
      <StatCard
        title="파이프라인 가치"
        value={formatCurrency(stats.totalValue)}
        subtitle="예상 금액"
        color="purple"
      />
      <StatCard
        title="성사된 거래"
        value={stats.wonDeals.toString()}
        subtitle="계약 완료"
        color="green"
      />
      <StatCard
        title="성사 금액"
        value={formatCurrency(stats.wonValue)}
        subtitle="총 수익"
        color="green"
      />
      <StatCard
        title="전환율"
        value={formatPercent(stats.conversionRate)}
        subtitle="성사 비율"
        color="orange"
      />
      <StatCard
        title="평균 거래액"
        value={formatCurrency(stats.averageDealSize)}
        subtitle="거래당"
        color="indigo"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'indigo';
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-75 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </div>
  );
}
