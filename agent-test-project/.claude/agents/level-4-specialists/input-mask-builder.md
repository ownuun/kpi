---
name: input-mask-builder
description: Input Mask 전문가. 입력 마스크, placeholder.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Input Mask Builder

## 🔍 Start
```typescript
await webSearch("Input Mask 전문가 best practices 2025");
await webSearch("input-mask React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function InputMaskBuilder({ name, ...props }) {
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
