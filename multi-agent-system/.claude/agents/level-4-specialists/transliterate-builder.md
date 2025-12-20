---
name: transliterate-builder
description: Transliterate 전문가. 한글↔영문 변환.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Transliterate Builder

## 🔍 Start
```typescript
await webSearch("Transliterate 전문가 best practices 2025");
await webSearch("transliterate React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function TransliterateBuilder({ name, ...props }) {
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
