---
name: async-validator-builder
description: Async Validator 전문가. API 검증, 중복 체크.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Async Validator Builder

## 🔍 Start
```typescript
await webSearch("Async Validator 전문가 best practices 2025");
await webSearch("async-validator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AsyncValidatorBuilder({ name, ...props }) {
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
