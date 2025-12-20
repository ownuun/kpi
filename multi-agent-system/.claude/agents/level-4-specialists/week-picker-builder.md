---
name: week-picker-builder
description: Week Picker 전문가. 주 단위 선택, ISO week.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Week Picker Builder

## 🔍 Start
```typescript
await webSearch("Week Picker 전문가 best practices 2025");
await webSearch("week-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function WeekPickerBuilder({ name, ...props }) {
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
