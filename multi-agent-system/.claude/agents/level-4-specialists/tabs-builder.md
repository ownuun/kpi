---
name: tabs-builder
description: Tabs 전문가. 탭 전환, 키보드 네비게이션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Tabs Builder

## 🔍 Start
```typescript
await webSearch("tabs accessibility keyboard navigation 2025");
await webSearch("react tabs best practices 2025");
```

## 🎯 Implementation
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsBuilder({ tabs, defaultValue }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
```
