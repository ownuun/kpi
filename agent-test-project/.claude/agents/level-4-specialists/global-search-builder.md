---
name: global-search-builder
description: 전역 검색 전문가. 전체 콘텐츠 검색, 카테고리 필터.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Global Search Builder

## 🔍 Start
```typescript
await webSearch("전역 검색 전문가 best practices 2025");
await webSearch("global-search React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function GlobalSearchBuilder({ name, ...props }) {
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
