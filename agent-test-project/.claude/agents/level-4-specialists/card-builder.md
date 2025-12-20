---
name: card-builder
description: Card 레이아웃 전문가. Header, Content, Footer 구조.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Card Builder

## 🔍 Start
```typescript
await webSearch("card component design patterns 2025");
await webFetch("https://ui.shadcn.com/docs/components/card", "latest");
```

## 🎯 Implementation
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function CardBuilder({ title, description, children, footer }) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
```
