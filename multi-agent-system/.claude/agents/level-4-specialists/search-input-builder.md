---
name: search-input-builder
description: 검색 입력 전문가. 실시간 검색, 하이라이트, 키보드 네비게이션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Search Input Builder

## 🔍 Start
```typescript
await webSearch("검색 입력 전문가 best practices 2025");
await webSearch("search-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function SearchInputBuilder({ name, ...props }) {
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
