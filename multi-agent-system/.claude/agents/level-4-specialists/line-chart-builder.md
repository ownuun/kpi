---
name: line-chart-builder
description: Line Chart 전문가. 시계열 데이터, 다중 라인, 반응형.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Line Chart Builder

## 🔍 Start
```typescript
await webSearch("recharts line chart best practices 2025");
await webSearch("responsive line chart react 2025");
await webFetch("https://recharts.org/en-US/api/LineChart", "latest patterns");
await webSearch("line chart accessibility WCAG 2025");
```

## 🎯 Implementation
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function LineChartBuilder({ data, lines, height = 400, showGrid = true, showLegend = true }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        role="img"
        aria-label="Line chart visualization"
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
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
        {showLegend && <Legend />}
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color || `hsl(var(--chart-${index + 1}))`}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name={line.label}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```
