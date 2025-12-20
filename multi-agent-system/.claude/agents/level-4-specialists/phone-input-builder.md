---
name: phone-input-builder
description: |
  전화번호 input 초고수. 국가 코드, 포맷팅, 검증 포함.
  웹 검색으로 국제 표준 반영.

tools: Write, Edit, Read, WebSearch, WebFetch
model: haiku
permissionMode: acceptEdits
---

# Phone Input Builder

## 🔍 시작: 국제 표준 검색

```typescript
await webSearch("international phone number format E.164 2025");
await webSearch("react phone input library 2025");
await webSearch("phone number validation best practices 2025");
```

## ✅ 2025 표준 체크리스트

- [ ] E.164 format 지원
- [ ] 국가 코드 선택
- [ ] 자동 포맷팅
- [ ] type="tel"
- [ ] inputMode="tel"
- [ ] autocomplete="tel"

## 🎯 구현

```tsx
'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const countryCodes = [
  { code: '+82', country: '한국', flag: '🇰🇷' },
  { code: '+1', country: '미국', flag: '🇺🇸' },
  { code: '+81', country: '일본', flag: '🇯🇵' },
  { code: '+86', country: '중국', flag: '🇨🇳' },
  { code: '+44', country: '영국', flag: '🇬🇧' },
];

interface PhoneInputProps {
  form: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultCountryCode?: string;
}

export function PhoneInput({
  form,
  name,
  label = "전화번호",
  placeholder = "010-1234-5678",
  description,
  required = false,
  defaultCountryCode = '+82',
}: PhoneInputProps) {
  const formatPhoneNumber = (value: string, countryCode: string) => {
    const numbers = value.replace(/[^\d]/g, '');

    if (countryCode === '+82') {
      // 한국 포맷: 010-1234-5678
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    if (countryCode === '+1') {
      // 미국 포맷: (555) 123-4567
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }

    return numbers;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const [countryCode, setCountryCode] = React.useState(defaultCountryCode);

        return (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Select
                  value={countryCode}
                  onValueChange={setCountryCode}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={placeholder}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error
                      ? `${name}-error`
                      : description
                      ? `${name}-description`
                      : undefined
                  }
                  {...field}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value, countryCode);
                    field.onChange(formatted);
                  }}
                />
              </div>
            </FormControl>

            {description && !fieldState.error && (
              <FormDescription id={`${name}-description`}>
                {description}
              </FormDescription>
            )}

            {fieldState.error && (
              <FormMessage id={`${name}-error`} role="alert" aria-live="polite" />
            )}
          </FormItem>
        );
      }}
    />
  );
}
```

## 🚨 에러 시 즉시 검색

```typescript
if (error.includes("format")) {
  await webSearch("phone number format validation 2025");
}
if (error.includes("country")) {
  await webSearch("international phone number country codes 2025");
}
```

## 📝 변경 이력

```
v2.0.0 (2025-01-15)
- Added country code selection
- Auto-formatting by country
- E.164 compliance
- Mobile-optimized keyboard
```
