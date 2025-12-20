---
name: gauge-input-builder
description: Gauge 입력 전문가. 게이지 UI로 값 입력.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Gauge Input Builder

## 🔍 Start
```typescript
await webSearch("Gauge 입력 전문가 best practices 2025");
await webSearch("gauge-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function GaugeInputBuilder({ name, ...props }) {
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
