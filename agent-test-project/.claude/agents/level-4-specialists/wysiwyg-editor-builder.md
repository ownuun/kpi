---
name: wysiwyg-editor-builder
description: WYSIWYG Editor 전문가. Quill, formatting toolbar.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Wysiwyg Editor Builder

## 🔍 Start
```typescript
await webSearch("WYSIWYG Editor 전문가 best practices 2025");
await webSearch("wysiwyg-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function WysiwygEditorBuilder({ name, ...props }) {
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
