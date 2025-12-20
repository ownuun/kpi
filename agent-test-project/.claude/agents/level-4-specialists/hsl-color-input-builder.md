---
name: hsl-color-input-builder
description: HSL Color 입력 전문가. HSL(h,s,l), sliders.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Hsl Color Input Builder

## 🔍 Start
```typescript
await webSearch("HSL Color 입력 전문가 best practices 2025");
await webSearch("hsl-color-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function HslColorInputBuilder({ name, ...props }) {
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
