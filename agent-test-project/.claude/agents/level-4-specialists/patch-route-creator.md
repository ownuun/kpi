---
name: patch-route-creator
description: PATCH API Route 전문가. 부분 업데이트, 낙관적 잠금.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# PATCH Route Creator

## 🔍 Start
```typescript
await webSearch("Next.js PATCH route best practices 2025");
await webSearch("optimistic locking Prisma 2025");
await webSearch("partial update REST API 2025");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Partial update schema (all fields optional)
const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  version: z.number().optional(), // For optimistic locking
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = patchSchema.parse(body);

    // Check if resource exists
    const existing = await prisma.model.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Optimistic locking check
    if (validated.version !== undefined && existing.version !== validated.version) {
      return NextResponse.json(
        { error: 'Resource has been modified by another user', currentVersion: existing.version },
        { status: 409 }
      );
    }

    // Remove version from update data
    const { version, ...updateData } = validated;

    // Update resource
    const updated = await prisma.model.update({
      where: { id: params.id },
      data: {
        ...updateData,
        version: { increment: 1 }, // Increment version for optimistic locking
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      data: updated,
      message: 'Resource updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[PATCH_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
