---
name: modal-builder
description: Modal/Dialog 전문가. Overlay, 접근성, ESC 닫기.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Modal Builder

## 🔍 Start
```typescript
await webSearch("modal accessibility best practices 2025");
await webSearch("react dialog focus trap 2025");
```

## 🎯 Implementation
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ModalBuilder({ trigger, title, description, children, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```
