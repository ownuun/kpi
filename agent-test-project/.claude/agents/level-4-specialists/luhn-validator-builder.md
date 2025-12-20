---
name: luhn-validator-builder
description: Luhn Validator 전문가. Luhn algorithm, 카드번호.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Luhn Validator Builder

## 🔍 Start
```typescript
await webSearch("Luhn Validator 전문가 best practices 2025");
await webSearch("luhn-validator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function LuhnValidatorBuilder({ name, ...props }) {
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
