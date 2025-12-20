---
name: address-input-builder
description: Address 입력 전문가. 주소 자동완성, 우편번호.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Address Input Builder

## 🔍 Start
```typescript
await webSearch("Address 입력 전문가 best practices 2025");
await webSearch("address-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AddressInputBuilder({ name, ...props }) {
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
