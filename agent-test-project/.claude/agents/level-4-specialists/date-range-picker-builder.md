---
name: date-range-picker-builder
description: Date Range Picker 전문가. 시작-종료일, 프리셋.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Date Range Picker Builder

## 🔍 Start
```typescript
await webSearch("Date Range Picker 전문가 best practices 2025");
await webSearch("date-range-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function DateRangePickerBuilder({ name, ...props }) {
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
