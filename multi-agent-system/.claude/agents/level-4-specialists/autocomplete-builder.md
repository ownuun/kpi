---
name: autocomplete-builder
description: 자동완성 전문가. Fuzzy search, 최근 검색, 인기 검색어.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Autocomplete Builder

## 🔍 Start
```typescript
await webSearch("자동완성 전문가 best practices 2025");
await webSearch("autocomplete React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AutocompleteBuilder({ name, ...props }) {
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
