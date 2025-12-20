---
name: color-picker-builder
description: Color Picker 전문가. HEX, RGB, HSL, 팔레트.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Color Picker Builder

## 🔍 Start
```typescript
await webSearch("color picker component best practices 2025");
await webSearch("react-colorful accessibility 2025");
```

## 🎯 Implementation
```tsx
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ColorPickerBuilder({ value, onChange, presets = [] }) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-12 p-0"
            style={{ backgroundColor: value }}
            aria-label="Pick color"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="mt-4 space-y-2">
            <HexColorInput
              color={value}
              onChange={onChange}
              className="w-full"
              prefixed
            />
            {presets.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset }}
                    onClick={() => onChange(preset)}
                    aria-label={`Select ${preset}`}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        maxLength={7}
      />
    </div>
  );
}
```
