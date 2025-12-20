---
name: checkbox-builder
description: Checkbox/Switch 전문가. 단일/그룹 체크박스, 토글 스위치.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Checkbox Builder

## 🔍 Start
```typescript
await webSearch("checkbox accessibility WCAG 2025");
await webSearch("react hook form checkbox 2025");
```

## 🎯 Implementation
```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

export function CheckboxBuilder({ form, name, label }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="!mt-0">{label}</FormLabel>
        </FormItem>
      )}
    />
  );
}
```
