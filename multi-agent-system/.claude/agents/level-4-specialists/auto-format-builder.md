---
name: auto-format-builder
description: Auto Format 전문가. 자동 포맷팅, 정리.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Auto Format Builder

## 🔍 Start
```typescript
await webSearch("Auto Format 전문가 best practices 2025");
await webSearch("auto-format React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AutoFormatBuilder({ name, ...props }) {
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
