---
name: typescript-nextjs-dev
description: Expert in Next.js 14 App Router development with TypeScript. Use when building pages, layouts, Server Components, Client Components, or Next.js-specific features.
---

# TypeScript Next.js Development Skill

Expert guidance on Next.js 14 App Router with TypeScript.

## Purpose
- Next.js 14 App Router patterns
- Server vs Client Component decisions
- Server Actions
- Route handlers
- TypeScript best practices

## Key Patterns

### Server Component (Default)
```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Client Component
```typescript
// components/Interactive.tsx
'use client';
import { useState } from 'react';

export function Interactive() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Action
```typescript
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  // Save to database
  revalidatePath('/posts');
}
```

### API Route
```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await db.post.findMany();
  return Response.json(posts);
}
```

## When to Use What
- **Server Component**: Data fetching, SEO, static content
- **Client Component**: Interactivity, browser APIs, hooks
- **Server Action**: Form submissions, mutations
- **API Route**: External API, webhooks, non-form requests
