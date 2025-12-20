---
name: multi-select-builder
description: 다중 선택 전문가. Chips, 전체선택, 검색 필터.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Multi Select Builder

## 🔍 Start
```typescript
await webSearch("다중 선택 전문가 best practices 2025");
await webSearch("multi-select React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function MultiSelectBuilder({ name, ...props }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <Input
        {...register(name)}
        {...props}
        aria-invalid={errors[name] ? 'true' : 'false'}
      />
      {errors[name] && (
        <p className="text-sm text-destructive mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}
```
