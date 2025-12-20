---
name: barcode-scanner-builder
description: Barcode Scanner 전문가. 1D/2D 바코드 스캔.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Barcode Scanner Builder

## 🔍 Start
```typescript
await webSearch("Barcode Scanner 전문가 best practices 2025");
await webSearch("barcode-scanner React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function BarcodeScannerBuilder({ name, ...props }) {
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
