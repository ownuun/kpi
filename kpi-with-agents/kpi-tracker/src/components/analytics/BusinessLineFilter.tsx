import React from 'react';

interface BusinessLine {
  id: string;
  name: string;
  color?: string;
}

interface BusinessLineFilterProps {
  value: string;
  onChange: (value: string) => void;
  businessLines: BusinessLine[];
  label?: string;
  showAll?: boolean;
  className?: string;
}

export function BusinessLineFilter({
  value,
  onChange,
  businessLines,
  label = 'Business Line',
  showAll = true,
  className = '',
}: BusinessLineFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="businessLine" className="text-sm font-medium text-zinc-700">
        {label}:
      </label>
      <select
        id="businessLine"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {showAll && <option value="all">All</option>}
        {businessLines.map((bl) => (
          <option key={bl.id} value={bl.id}>
            {bl.name}
          </option>
        ))}
      </select>
    </div>
  );
}
