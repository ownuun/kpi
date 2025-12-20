---
name: calendar-builder
description: Calendar 전문가. 월간 달력, 이벤트 표시, 선택.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Calendar Builder

## 🔍 Start
```typescript
await webSearch("Calendar 전문가 best practices 2025");
await webSearch("calendar React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function CalendarBuilder({ name, ...props }) {
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
