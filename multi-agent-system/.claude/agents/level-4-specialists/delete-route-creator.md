---
name: delete-route-creator
description: DELETE API Route 전문가. 안전한 삭제, Soft delete, Cascade.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# DELETE Route Creator

## 🔍 Start
```typescript
await webSearch("Next.js DELETE route best practices 2025");
await webSearch("soft delete vs hard delete 2025");
await webSearch("cascade delete Prisma 2025");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Query params for soft delete option
const querySchema = z.object({
  soft: z.coerce.boolean().default(true), // Default to soft delete
  cascade: z.coerce.boolean().default(false),
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const options = querySchema.parse({
      soft: searchParams.get('soft'),
      cascade: searchParams.get('cascade'),
    });

    // Check if resource exists
    const existing = await prisma.model.findUnique({
      where: { id: params.id },
      include: {
        relatedItems: options.cascade, // Only fetch if cascade delete
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check for dependencies if not cascade
    if (!options.cascade && existing.relatedItems?.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete resource with dependencies',
          dependencies: existing.relatedItems.length,
        },
        { status: 409 }
      );
    }

    if (options.soft) {
      // Soft delete (mark as deleted)
      const deleted = await prisma.model.update({
        where: { id: params.id },
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
      });

      return NextResponse.json({
        message: 'Resource soft deleted successfully',
        data: deleted,
      });
    } else {
      // Hard delete (permanent)
      await prisma.model.delete({
        where: { id: params.id },
      });

      return NextResponse.json({
        message: 'Resource permanently deleted',
      }, { status: 204 });
    }
  } catch (error) {
    if (error.code === 'P2003') {
      // Prisma foreign key constraint error
      return NextResponse.json(
        { error: 'Cannot delete resource due to foreign key constraints' },
        { status: 409 }
      );
    }

    console.error('[DELETE_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
