---
name: latex-editor-builder
description: LaTeX Editor 전문가. 수식 편집, live preview.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Latex Editor Builder

## 🔍 Start
```typescript
await webSearch("LaTeX Editor 전문가 best practices 2025");
await webSearch("latex-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function LatexEditorBuilder({ name, ...props }) {
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
