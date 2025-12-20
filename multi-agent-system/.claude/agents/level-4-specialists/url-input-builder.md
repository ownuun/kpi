---
name: url-input-builder
description: URL 입력 전문가. Protocol 자동추가, 유효성 검증.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# URL Input Builder

## 🔍 Start
```typescript
await webSearch("URL validation best practices 2025");
await webSearch("URL input accessibility 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

const urlSchema = z.string().url('Invalid URL format');

export function UrlInputBuilder({ name, placeholder = 'https://example.com' }) {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const value = watch(name);

  const handleBlur = () => {
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      setValue(name, `https://${value}`);
    }
  };

  return (
    <div>
      <Input
        type="url"
        placeholder={placeholder}
        {...register(name, {
          validate: (v) => urlSchema.safeParse(v).success || 'Invalid URL',
        })}
        onBlur={handleBlur}
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
      />
      {errors[name] && (
        <p className="text-sm text-destructive mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}
```
