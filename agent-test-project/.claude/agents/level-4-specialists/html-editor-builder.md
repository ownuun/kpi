---
name: html-editor-builder
description: HTML Editor 전문가. HTML/CSS 편집, live preview.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Html Editor Builder

## 🔍 Start
```typescript
await webSearch("HTML Editor 전문가 best practices 2025");
await webSearch("html-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function HtmlEditorBuilder({ name, ...props }) {
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
