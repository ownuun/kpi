---
name: normalize-unicode-builder
description: Unicode Normalizer 전문가. 유니코드 정규화.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Normalize Unicode Builder

## 🔍 Start
```typescript
await webSearch("Unicode Normalizer 전문가 best practices 2025");
await webSearch("normalize-unicode React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function NormalizeUnicodeBuilder({ name, ...props }) {
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
