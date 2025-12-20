---
name: markdown-editor-builder
description: Markdown Editor 전문가. Live preview, syntax highlight.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Markdown Editor Builder

## 🔍 Start
```typescript
await webSearch("Markdown Editor 전문가 best practices 2025");
await webSearch("markdown-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function MarkdownEditorBuilder({ name, ...props }) {
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
