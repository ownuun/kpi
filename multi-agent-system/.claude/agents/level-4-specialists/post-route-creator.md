---
name: post-route-creator
description: POST API Route 전문가. 데이터 생성, 유효성 검증, 트랜잭션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# POST Route Creator

## 🔍 Start
```typescript
await webSearch("Next.js 15 POST route best practices 2025");
await webSearch("API request validation zod 2025");
await webFetch("https://nextjs.org/docs/app/building-your-application/routing/route-handlers", "POST methods");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Request body validation schema
const bodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = bodySchema.parse(body);

    // Check for duplicates
    const existing = await prisma.model.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Resource already exists', field: 'email' },
        { status: 409 }
      );
    }

    // Create resource
    const created = await prisma.model.create({
      data: validated,
    });

    return NextResponse.json(
      { data: created, message: 'Resource created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    console.error('[POST_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
