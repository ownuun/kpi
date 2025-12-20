---
name: duration-picker-builder
description: Duration Picker 전문가. 시간 간격, HH:MM:SS.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Duration Picker Builder

## 🔍 Start
```typescript
await webSearch("Duration Picker 전문가 best practices 2025");
await webSearch("duration-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function DurationPickerBuilder({ name, ...props }) {
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
