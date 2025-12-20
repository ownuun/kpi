---
name: command-palette-builder
description: Command Palette 전문가. ⌘K 단축키, 명령 검색, 실행.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Command Palette Builder

## 🔍 Start
```typescript
await webSearch("Command Palette 전문가 best practices 2025");
await webSearch("command-palette React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function CommandPaletteBuilder({ name, ...props }) {
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
