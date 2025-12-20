---
name: datetime-picker-builder
description: DateTime Picker 전문가. 날짜 + 시간, timezone.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Datetime Picker Builder

## 🔍 Start
```typescript
await webSearch("DateTime Picker 전문가 best practices 2025");
await webSearch("datetime-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function DatetimePickerBuilder({ name, ...props }) {
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
