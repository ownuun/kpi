---
name: uuid-generator-builder
description: UUID Generator 전문가. UUID v4 생성.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Uuid Generator Builder

## 🔍 Start
```typescript
await webSearch("UUID Generator 전문가 best practices 2025");
await webSearch("uuid-generator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function UuidGeneratorBuilder({ name, ...props }) {
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
