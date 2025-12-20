---
name: table-builder
description: Table 전문가. 정렬, 필터, 페이지네이션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Table Builder

## 🔍 Start
```typescript
await webSearch("react table best practices 2025");
await webSearch("@tanstack/react-table v8 2025");
```

## 🎯 Implementation
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function TableBuilder({ columns, data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col.key}>{row[col.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```
