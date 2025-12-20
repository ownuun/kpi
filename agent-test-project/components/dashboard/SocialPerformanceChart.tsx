'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n/context';

interface SocialPerformanceData {
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  posts: number;
}

interface SocialPerformanceChartProps {
  data: SocialPerformanceData[];
}

export default function SocialPerformanceChart({ data }: SocialPerformanceChartProps) {
  const { t } = useI18n();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{t('socialPerformanceTitle')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="views" stroke="#3b82f6" name={t('views')} strokeWidth={2} />
          <Line type="monotone" dataKey="likes" stroke="#10b981" name={t('likes')} strokeWidth={2} />
          <Line type="monotone" dataKey="shares" stroke="#f59e0b" name={t('shares')} strokeWidth={2} />
          <Line type="monotone" dataKey="comments" stroke="#8b5cf6" name={t('comments')} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
