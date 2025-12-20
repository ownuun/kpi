---
name: code-editor-builder
description: Code Editor 전문가. Monaco Editor, syntax, autocomplete.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Code Editor Builder

## 🔍 Start
```typescript
await webSearch("Code Editor 전문가 best practices 2025");
await webSearch("code-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function CodeEditorBuilder({ name, ...props }) {
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
