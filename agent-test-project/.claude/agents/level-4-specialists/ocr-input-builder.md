---
name: ocr-input-builder
description: OCR 입력 전문가. 이미지에서 텍스트 추출.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Ocr Input Builder

## 🔍 Start
```typescript
await webSearch("OCR 입력 전문가 best practices 2025");
await webSearch("ocr-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function OcrInputBuilder({ name, ...props }) {
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
