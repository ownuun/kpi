---
name: gauge-chart-builder
description: Gauge/Radial Chart 전문가. KPI 진행도, 목표 달성률.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Gauge Chart Builder

## 🔍 Start
```typescript
await webSearch("react gauge chart best practices 2025");
await webSearch("radial progress chart recharts 2025");
await webFetch("https://recharts.org/en-US/api/RadialBarChart", "latest patterns");
```

## 🎯 Implementation
```tsx
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export function GaugeChartBuilder({
  value,
  max = 100,
  label,
  height = 300,
  colors = {
    low: '#ef4444',
    medium: '#f59e0b',
    high: '#10b981'
  }
}) {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage < 33) return colors.low;
    if (percentage < 66) return colors.medium;
    return colors.high;
  };

  const data = [
    {
      name: label || 'Progress',
      value: percentage,
      fill: getColor(),
    },
  ];

  return (
    <div className="relative" role="img" aria-label={`Gauge chart showing ${percentage.toFixed(1)}% progress`}>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold">{percentage.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">{value} / {max}</div>
        </div>
      </div>
    </div>
  );
}
```
