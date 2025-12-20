---
name: location-picker-builder
description: Location Picker 전문가. 지도, GPS, 주소 검색.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Location Picker Builder

## 🔍 Start
```typescript
await webSearch("Location Picker 전문가 best practices 2025");
await webSearch("location-picker React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function LocationPickerBuilder({ name, ...props }) {
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
