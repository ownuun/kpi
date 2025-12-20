---
name: passport-input-builder
description: Passport 입력 전문가. 여권번호, validation.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Passport Input Builder

## 🔍 Start
```typescript
await webSearch("Passport 입력 전문가 best practices 2025");
await webSearch("passport-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function PassportInputBuilder({ name, ...props }) {
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
