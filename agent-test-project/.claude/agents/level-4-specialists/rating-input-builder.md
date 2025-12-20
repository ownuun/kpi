---
name: rating-input-builder
description: Rating 입력 전문가. 별점, 하트, 이모지.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Rating Input Builder

## 🔍 Start
```typescript
await webSearch("Rating 입력 전문가 best practices 2025");
await webSearch("rating-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function RatingInputBuilder({ name, ...props }) {
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
