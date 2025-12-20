---
name: bic-validator-builder
description: BIC Validator 전문가. BIC/SWIFT 코드 검증.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Bic Validator Builder

## 🔍 Start
```typescript
await webSearch("BIC Validator 전문가 best practices 2025");
await webSearch("bic-validator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function BicValidatorBuilder({ name, ...props }) {
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
