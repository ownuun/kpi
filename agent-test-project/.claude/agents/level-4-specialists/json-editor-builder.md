---
name: json-editor-builder
description: JSON Editor 전문가. 구조 편집, validation, format.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Json Editor Builder

## 🔍 Start
```typescript
await webSearch("JSON Editor 전문가 best practices 2025");
await webSearch("json-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function JsonEditorBuilder({ name, ...props }) {
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
