'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n/context';

interface EmailPerformanceData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
}

interface EmailPerformanceChartProps {
  data: EmailPerformanceData[];
}

export default function EmailPerformanceChart({ data }: EmailPerformanceChartProps) {
  const { t } = useI18n();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{t('emailPerformanceTitle')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sent" fill="#3b82f6" name={t('sent')} />
          <Bar dataKey="opened" fill="#10b981" name={t('opened')} />
          <Bar dataKey="clicked" fill="#f59e0b" name={t('clicked')} />
          <Bar dataKey="bounced" fill="#ef4444" name={t('bounced')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
