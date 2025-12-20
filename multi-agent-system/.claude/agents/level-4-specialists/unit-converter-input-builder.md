---
name: unit-converter-input-builder
description: Unit Converter 입력 전문가. 단위 변환, 환율.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Unit Converter Input Builder

## 🔍 Start
```typescript
await webSearch("Unit Converter 입력 전문가 best practices 2025");
await webSearch("unit-converter-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function UnitConverterInputBuilder({ name, ...props }) {
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
