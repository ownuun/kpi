---
name: sql-editor-builder
description: SQL Editor 전문가. Syntax highlight, 쿼리 실행.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Sql Editor Builder

## 🔍 Start
```typescript
await webSearch("SQL Editor 전문가 best practices 2025");
await webSearch("sql-editor React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function SqlEditorBuilder({ name, ...props }) {
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
