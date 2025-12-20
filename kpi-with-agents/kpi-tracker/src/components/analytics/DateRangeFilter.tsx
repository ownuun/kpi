import React from 'react';

interface DateRangeOption {
  value: string;
  label: string;
}

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: DateRangeOption[];
  label?: string;
  className?: string;
}

const defaultOptions: DateRangeOption[] = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last year' },
];

export function DateRangeFilter({
  value,
  onChange,
  options = defaultOptions,
  label = 'Date Range',
  className = '',
}: DateRangeFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="dateRange" className="text-sm font-medium text-zinc-700">
        {label}:
      </label>
      <select
        id="dateRange"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
