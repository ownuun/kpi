---
name: pie-chart-builder
description: Pie/Donut Chart 전문가. 비율 데이터, 라벨, 애니메이션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Pie Chart Builder

## 🔍 Start
```typescript
await webSearch("recharts pie chart best practices 2025");
await webSearch("donut chart accessibility 2025");
await webFetch("https://recharts.org/en-US/api/PieChart", "latest patterns");
```

## 🎯 Implementation
```tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function PieChartBuilder({ data, height = 400, donut = false, showLabels = true }) {
  const renderLabel = (entry) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${entry.name}: ${percent}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart role="img" aria-label="Pie chart visualization">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels}
          label={showLabels ? renderLabel : false}
          outerRadius={donut ? 120 : 140}
          innerRadius={donut ? 80 : 0}
          fill="#8884d8"
          dataKey="value"
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
```
