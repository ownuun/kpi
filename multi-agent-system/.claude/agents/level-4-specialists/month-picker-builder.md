---
name: month-picker-builder
description: Month Picker 전문가. 월 선택, 연/월 조합.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Month Picker Builder

## 🔍 Start
```typescript
await webSearch("Month Picker 전문가 best practices 2025");
await webSearch("month-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function MonthPickerBuilder({ name, ...props }) {
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
