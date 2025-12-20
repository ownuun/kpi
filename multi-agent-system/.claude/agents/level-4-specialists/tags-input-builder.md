---
name: tags-input-builder
description: Tags 입력 전문가. 태그 추가/삭제, 중복 방지, 자동완성.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Tags Input Builder

## 🔍 Start
```typescript
await webSearch("Tags 입력 전문가 best practices 2025");
await webSearch("tags-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function TagsInputBuilder({ name, ...props }) {
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
