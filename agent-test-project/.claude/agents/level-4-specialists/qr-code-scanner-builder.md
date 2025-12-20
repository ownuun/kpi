---
name: qr-code-scanner-builder
description: QR Scanner 전문가. QR/바코드 스캔, 카메라.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Qr Code Scanner Builder

## 🔍 Start
```typescript
await webSearch("QR Scanner 전문가 best practices 2025");
await webSearch("qr-code-scanner React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function QrCodeScannerBuilder({ name, ...props }) {
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
