---
name: mention-input-builder
description: Mention 입력 전문가. @mentions, # hashtags, 사용자 검색.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Mention Input Builder

## 🔍 Start
```typescript
await webSearch("Mention 입력 전문가 best practices 2025");
await webSearch("mention-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function MentionInputBuilder({ name, ...props }) {
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
