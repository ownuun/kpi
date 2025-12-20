---
name: area-chart-builder
description: Area Chart 전문가. 누적 영역, 그라디언트, 트렌드.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Area Chart Builder

## 🔍 Start
```typescript
await webSearch("recharts area chart best practices 2025");
await webSearch("stacked area chart gradient 2025");
await webFetch("https://recharts.org/en-US/api/AreaChart", "latest patterns");
```

## 🎯 Implementation
```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AreaChartBuilder({ data, areas, height = 400, stacked = false, gradient = true }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        role="img"
        aria-label="Area chart visualization"
      >
        {gradient && (
          <defs>
            {areas.map((area, index) => (
              <linearGradient key={`gradient-${index}`} id={`color-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color || `hsl(var(--chart-${index + 1}))`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={area.color || `hsl(var(--chart-${index + 1}))`} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        )}
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend />
        {areas.map((area, index) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stackId={stacked ? 'stack' : undefined}
            stroke={area.color || `hsl(var(--chart-${index + 1}))`}
            fill={gradient ? `url(#color-${area.dataKey})` : area.color || `hsl(var(--chart-${index + 1}))`}
            fillOpacity={gradient ? 1 : 0.6}
            name={area.label}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
```
