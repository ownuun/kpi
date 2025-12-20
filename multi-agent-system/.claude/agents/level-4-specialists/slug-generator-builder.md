---
name: slug-generator-builder
description: Slug Generator 전문가. URL-safe slug 생성.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Slug Generator Builder

## 🔍 Start
```typescript
await webSearch("Slug Generator 전문가 best practices 2025");
await webSearch("slug-generator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function SlugGeneratorBuilder({ name, ...props }) {
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
