---
name: bulk-operations-creator
description: Bulk API 전문가. 일괄 생성/수정/삭제, 트랜잭션, 배치 처리.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Bulk Operations Creator

## 🔍 Start
```typescript
await webSearch("bulk operations REST API best practices 2025");
await webSearch("Prisma batch operations transaction 2025");
await webSearch("bulk insert performance optimization 2025");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bulkOperationSchema = z.object({
  operation: z.enum(['create', 'update', 'delete']),
  data: z.array(z.record(z.unknown())).max(1000), // Limit to 1000 items
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = bulkOperationSchema.parse(body);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    let results;

    // Execute bulk operation in transaction
    await prisma.$transaction(async (tx) => {
      switch (operation) {
        case 'create':
          results = await tx.model.createMany({
            data,
            skipDuplicates: true, // Skip duplicates instead of failing
          });
          break;

        case 'update':
          // Bulk update using multiple update operations
          results = await Promise.all(
            data.map((item: any) =>
              tx.model.update({
                where: { id: item.id },
                data: item,
              })
            )
          );
          break;

        case 'delete':
          // Bulk delete using deleteMany
          const ids = data.map((item: any) => item.id);
          results = await tx.model.deleteMany({
            where: {
              id: { in: ids },
            },
          });
          break;
      }
    });

    return NextResponse.json({
      message: `Bulk ${operation} completed successfully`,
      count: Array.isArray(results) ? results.length : results.count,
      data: results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Unique constraint violation in bulk operation' },
        { status: 409 }
      );
    }

    console.error('[BULK_OPERATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
