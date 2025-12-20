---
name: ip-address-input-builder
description: IP Address 입력 전문가. IPv4/IPv6, validation.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Ip Address Input Builder

## 🔍 Start
```typescript
await webSearch("IP Address 입력 전문가 best practices 2025");
await webSearch("ip-address-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function IpAddressInputBuilder({ name, ...props }) {
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
