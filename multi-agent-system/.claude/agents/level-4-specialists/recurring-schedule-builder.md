---
name: recurring-schedule-builder
description: Recurring Schedule 전문가. 반복 일정, RRULE.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Recurring Schedule Builder

## 🔍 Start
```typescript
await webSearch("Recurring Schedule 전문가 best practices 2025");
await webSearch("recurring-schedule React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function RecurringScheduleBuilder({ name, ...props }) {
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
