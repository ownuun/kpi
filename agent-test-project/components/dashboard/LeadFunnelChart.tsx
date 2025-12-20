'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useI18n } from '@/lib/i18n/context';

interface LeadFunnelData {
  status: string;
  count: number;
}

interface LeadFunnelChartProps {
  data: LeadFunnelData[];
}

const STATUS_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  CONTACTED: '#10b981',
  QUALIFIED: '#f59e0b',
  CONVERTED: '#8b5cf6',
  LOST: '#ef4444',
};

export default function LeadFunnelChart({ data }: LeadFunnelChartProps) {
  const { t } = useI18n();
  
  // Sort data by funnel order
  const sortOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];
  const sortedData = [...data].sort((a, b) => {
    return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status);
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{t('leadFunnelTitle')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="status" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="count" name={t('leads')}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-5 gap-2 text-sm">
        {sortedData.map((item) => (
          <div key={item.status} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: STATUS_COLORS[item.status] }}
            />
            <span className="font-medium">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
