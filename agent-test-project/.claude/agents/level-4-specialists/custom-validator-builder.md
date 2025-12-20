---
name: custom-validator-builder
description: Custom Validator 전문가. 커스텀 validation 로직.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Custom Validator Builder

## 🔍 Start
```typescript
await webSearch("Custom Validator 전문가 best practices 2025");
await webSearch("custom-validator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function CustomValidatorBuilder({ name, ...props }) {
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
