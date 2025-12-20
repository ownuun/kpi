---
name: input-sanitizer-builder
description: Input Sanitizer 전문가. XSS 방지, sanitize.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Input Sanitizer Builder

## 🔍 Start
```typescript
await webSearch("Input Sanitizer 전문가 best practices 2025");
await webSearch("input-sanitizer React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function InputSanitizerBuilder({ name, ...props }) {
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
