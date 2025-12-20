---
name: rgb-color-input-builder
description: RGB Color 입력 전문가. RGB(r,g,b), sliders.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Rgb Color Input Builder

## 🔍 Start
```typescript
await webSearch("RGB Color 입력 전문가 best practices 2025");
await webSearch("rgb-color-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function RgbColorInputBuilder({ name, ...props }) {
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
