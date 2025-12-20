---
name: timezone-picker-builder
description: Timezone Picker 전문가. Timezone 선택, UTC offset.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Timezone Picker Builder

## 🔍 Start
```typescript
await webSearch("Timezone Picker 전문가 best practices 2025");
await webSearch("timezone-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function TimezonePickerBuilder({ name, ...props }) {
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
