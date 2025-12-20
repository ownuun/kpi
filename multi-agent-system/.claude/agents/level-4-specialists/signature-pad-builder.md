---
name: signature-pad-builder
description: Signature Pad 전문가. 서명 입력, Canvas, 저장.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Signature Pad Builder

## 🔍 Start
```typescript
await webSearch("Signature Pad 전문가 best practices 2025");
await webSearch("signature-pad React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function SignaturePadBuilder({ name, ...props }) {
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
