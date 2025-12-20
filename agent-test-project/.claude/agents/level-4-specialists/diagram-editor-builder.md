---
name: diagram-editor-builder
description: Diagram Editor 전문가. Mermaid, 플로우차트, UML.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Diagram Editor Builder

## 🔍 Start
```typescript
await webSearch("Diagram Editor 전문가 best practices 2025");
await webSearch("diagram-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function DiagramEditorBuilder({ name, ...props }) {
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
