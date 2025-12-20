---
name: select-builder
description: Select/Dropdown 전문가. 검색 가능, 다중 선택, 그룹화 지원.
tools: Write, Edit, Read, WebSearch, WebFetch
model: haiku
permissionMode: acceptEdits
---

# Select Builder

## 🔍 시작 검색
```typescript
await webSearch("react select best practices 2025");
await webFetch("https://ui.shadcn.com/docs/components/select", "latest");
await webSearch("accessible dropdown WCAG 2025");
```

## 🎯 구현
```tsx
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectBuilderProps {
  form: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  required?: boolean;
}

export function SelectBuilder({
  form,
  name,
  label,
  placeholder = "선택하세요",
  description,
  options,
  required = false,
}: SelectBuilderProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage role="alert" aria-live="polite" />}
        </FormItem>
      )}
    />
  );
}
```
