---
name: year-picker-builder
description: Year Picker 전문가. 연도 선택, 범위.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Year Picker Builder

## 🔍 Start
```typescript
await webSearch("Year Picker 전문가 best practices 2025");
await webSearch("year-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function YearPickerBuilder({ name, ...props }) {
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
