---
name: drawing-canvas-builder
description: Drawing Canvas 전문가. 드로잉, 펜, 색상.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Drawing Canvas Builder

## 🔍 Start
```typescript
await webSearch("Drawing Canvas 전문가 best practices 2025");
await webSearch("drawing-canvas React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function DrawingCanvasBuilder({ name, ...props }) {
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
