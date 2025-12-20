import React from 'react';

interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  title?: string;
  showValues?: boolean;
  showPercentages?: boolean;
  height?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function BarChart({
  data,
  title,
  showValues = true,
  showPercentages = false,
  height = 'md',
  orientation = 'horizontal',
  className = '',
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const heightClasses = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
  };

  if (orientation === 'vertical') {
    return (
      <div className={`rounded-lg border border-zinc-200 bg-white p-6 shadow-sm ${className}`}>
        {title && <h3 className="mb-4 text-lg font-semibold text-zinc-900">{title}</h3>}
        <div className="flex items-end justify-around gap-4" style={{ height: '300px' }}>
          {data.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100;
            const percentage = (item.value / total) * 100;

            return (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end justify-center">
                  {showValues && (
                    <div className="absolute -top-6 text-sm font-semibold text-zinc-900">
                      {item.value.toLocaleString()}
                      {showPercentages && (
                        <span className="text-xs text-zinc-500 ml-1">
                          ({percentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${heightPercentage}%`,
                      backgroundColor: item.color || '#3b82f6',
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-zinc-700">{item.label}</div>
                  {item.metadata && (
                    <div className="text-xs text-zinc-500">{item.metadata}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal bars
  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-6 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-lg font-semibold text-zinc-900">{title}</h3>}
      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercentage = (item.value / maxValue) * 100;
          const percentage = (item.value / total) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.metadata && (
                    <span className="text-zinc-500">{item.metadata}</span>
                  )}
                  {showValues && (
                    <span className="font-semibold text-zinc-900">
                      {item.value.toLocaleString()}
                      {showPercentages && (
                        <span className="text-xs text-zinc-500 ml-1">
                          ({percentage.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-full overflow-hidden rounded-lg bg-zinc-100 ${heightClasses[height]}`}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: item.color || '#3b82f6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
