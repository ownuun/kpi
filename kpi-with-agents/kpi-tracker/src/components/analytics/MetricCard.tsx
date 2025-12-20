import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-600">{title}</div>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>
      <div className="mb-1 flex items-baseline gap-2">
        <div className="text-3xl font-bold text-zinc-900">{value}</div>
        {trend && trendValue && (
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-zinc-600'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      {description && <div className="text-sm text-zinc-500">{description}</div>}
    </div>
  );
}
