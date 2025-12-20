---
name: rich-text-editor-builder
description: Rich Text Editor 전문가. TipTap, formatting, 이미지.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Rich Text Editor Builder

## 🔍 Start
```typescript
await webSearch("Rich Text Editor 전문가 best practices 2025");
await webSearch("rich-text-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function RichTextEditorBuilder({ name, ...props }) {
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
