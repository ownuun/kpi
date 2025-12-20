---
name: email-autocomplete-builder
description: Email 자동완성 전문가. 도메인 제안, 최근 사용.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Email Autocomplete Builder

## 🔍 Start
```typescript
await webSearch("email autocomplete best practices 2025");
await webSearch("email domain suggestions UI/UX 2025");
```

## 🎯 Implementation
```tsx
import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const COMMON_DOMAINS = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'outlook.com', 'yahoo.com'];

export function EmailAutocompleteBuilder({ value, onChange, recentEmails = [] }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!value?.includes('@')) {
      const domainSuggestions = COMMON_DOMAINS.map(domain => `${value}@${domain}`);
      setSuggestions(domainSuggestions);
    } else {
      const [local, domain] = value.split('@');
      const filteredDomains = COMMON_DOMAINS.filter(d => d.startsWith(domain));
      setSuggestions(filteredDomains.map(d => `${local}@${d}`));
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No suggestions</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {suggestions.map((email) => (
                <CommandItem
                  key={email}
                  value={email}
                  onSelect={() => {
                    onChange(email);
                    setOpen(false);
                  }}
                >
                  {email}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```
