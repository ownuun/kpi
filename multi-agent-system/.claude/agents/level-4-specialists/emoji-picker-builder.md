---
name: emoji-picker-builder
description: Emoji Picker 전문가. 이모지 선택, 검색, 최근.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Emoji Picker Builder

## 🔍 Start
```typescript
await webSearch("Emoji Picker 전문가 best practices 2025");
await webSearch("emoji-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function EmojiPickerBuilder({ name, ...props }) {
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
