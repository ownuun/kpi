---
name: slider-builder
description: Slider 전문가. Range slider, 단계, 레이블.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Slider Builder

## 🔍 Start
```typescript
await webSearch("Slider 전문가 best practices 2025");
await webSearch("slider React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function SliderBuilder({ name, ...props }) {
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
