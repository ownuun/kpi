---
name: regex-validator-builder
description: Regex Validator 전문가. 정규식 검증, 패턴.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Regex Validator Builder

## 🔍 Start
```typescript
await webSearch("Regex Validator 전문가 best practices 2025");
await webSearch("regex-validator React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function RegexValidatorBuilder({ name, ...props }) {
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
