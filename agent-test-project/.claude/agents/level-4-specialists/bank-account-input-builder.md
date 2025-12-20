---
name: bank-account-input-builder
description: Bank Account 입력 전문가. 계좌번호, 은행 선택.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Bank Account Input Builder

## 🔍 Start
```typescript
await webSearch("Bank Account 입력 전문가 best practices 2025");
await webSearch("bank-account-input React component 2025");
```

## 🎯 Implementation
```tsx
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function BankAccountInputBuilder({ name, ...props }) {
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
