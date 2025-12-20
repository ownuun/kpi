---
name: formula-editor-builder
description: Formula Editor 전문가. Excel-like 수식, 함수.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Formula Editor Builder

## 🔍 Start
```typescript
await webSearch("Formula Editor 전문가 best practices 2025");
await webSearch("formula-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function FormulaEditorBuilder({ name, ...props }) {
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
