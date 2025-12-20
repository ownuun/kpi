import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const UpdatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  platform: z.enum(['LINKEDIN', 'TWITTER', 'FACEBOOK', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'THREADS', 'BLUESKY']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ERROR', 'FAILED']).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        socialAccount: {
          select: {
            id: true,
            platform: true,
            accountUsername: true,
            accountName: true,
            isActive: true,
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching social post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdatePostSchema.parse(body);

    const existingPost = await prisma.socialPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const updateData: any = { ...validated };

    if (validated.scheduledAt !== undefined) {
      updateData.scheduledAt = validated.scheduledAt ? new Date(validated.scheduledAt) : null;
    }

    const post = await prisma.socialPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating social post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingPost = await prisma.socialPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.socialPost.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting social post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
