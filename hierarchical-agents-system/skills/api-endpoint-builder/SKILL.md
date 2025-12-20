---
name: api-endpoint-builder
description: Next.js API routes and Server Actions specialist. Use for building REST endpoints with validation and error handling.
---

# API Endpoint Builder Skill

Expert in building Next.js API routes and Server Actions.

## Standard API Route Pattern

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';

const Schema = z.object({
  field: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = Schema.parse(body);
    
    const result = await prisma.model.create({ data });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  
  const results = await prisma.model.findMany({
    where: filter ? { field: filter } : undefined,
  });
  
  return NextResponse.json(results);
}
```

## Server Action Pattern

```typescript
// app/actions/resource.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const Schema = z.object({
  field: z.string(),
});

export async function createResource(formData: FormData) {
  const validated = Schema.safeParse({
    field: formData.get('field'),
  });
  
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  
  await prisma.model.create({ data: validated.data });
  
  revalidatePath('/resources');
  return { success: true };
}
```
