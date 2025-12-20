---
name: credit-card-input-builder
description: Credit Card 입력 전문가. 카드번호, CVV, 만료일.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Credit Card Input Builder

## 🔍 Start
```typescript
await webSearch("Credit Card 입력 전문가 best practices 2025");
await webSearch("credit-card-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function CreditCardInputBuilder({ name, ...props }) {
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
