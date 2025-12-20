---
name: icon-picker-builder
description: Icon Picker 전문가. 아이콘 라이브러리, 검색.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Icon Picker Builder

## 🔍 Start
```typescript
await webSearch("Icon Picker 전문가 best practices 2025");
await webSearch("icon-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function IconPickerBuilder({ name, ...props }) {
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
