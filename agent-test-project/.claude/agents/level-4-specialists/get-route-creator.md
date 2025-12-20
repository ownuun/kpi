---
name: get-route-creator
description: GET API Route 전문가. 데이터 조회, 필터링, 페이지네이션.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# GET Route Creator

## 🔍 Start
```typescript
await webSearch("Next.js 15 App Router GET route best practices 2025");
await webSearch("REST API pagination filtering 2025");
await webFetch("https://nextjs.org/docs/app/building-your-application/routing/route-handlers", "latest patterns");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Query parameter validation
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const params = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      search: searchParams.get('search'),
    });

    const skip = (params.page - 1) * params.limit;

    // Build where clause
    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Fetch data with pagination
    const [data, total] = await Promise.all([
      prisma.model.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder } : { createdAt: 'desc' },
      }),
      prisma.model.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[GET_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
