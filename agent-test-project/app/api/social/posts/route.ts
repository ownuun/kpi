import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/social/posts
 * Fetch all social posts
 */
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.socialPost.findMany({
      include: {
        socialAccount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('[Social Posts] GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/posts
 * Create a new social post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platform,
      content,
      title,
      scheduledAt,
      status = 'DRAFT',
      socialAccountId,
      mediaUrls,
    } = body;

    // Validate required fields
    if (!platform || !content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      );
    }

    // Create post
    const post = await prisma.socialPost.create({
      data: {
        platform,
        content,
        title,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        socialAccountId,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null,
      },
      include: {
        socialAccount: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('[Social Posts] POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/posts?id={postId}
 * Delete a social post
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await prisma.socialPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Social Posts] DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
