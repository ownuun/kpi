---
name: bar-chart-builder
description: Bar Chart 전문가. 비교 데이터, 스택 바, 반응형.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Bar Chart Builder

## 🔍 Start
```typescript
await webSearch("recharts bar chart best practices 2025");
await webSearch("stacked bar chart accessibility 2025");
await webFetch("https://recharts.org/en-US/api/BarChart", "latest patterns");
```

## 🎯 Implementation
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BarChartBuilder({ data, bars, height = 400, stacked = false, horizontal = false }) {
  const ChartComponent = horizontal ? BarChart : BarChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        role="img"
        aria-label="Bar chart visualization"
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        {horizontal ? (
          <>
            <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} />
            <YAxis type="category" dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color || `hsl(var(--chart-${index + 1}))`}
            name={bar.label}
            stackId={stacked ? 'stack' : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
```
