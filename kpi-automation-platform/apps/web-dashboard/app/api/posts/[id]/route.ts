import { NextRequest, NextResponse } from 'next/server';
import { getPostizClient } from '@/lib/postiz';
import { UpdatePostRequest } from '@/types/posts';

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postiz = getPostizClient();
    const post = await postiz.posts.getPost(id);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch post',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Update an existing post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateRequest: UpdatePostRequest = {
      content: body.content,
      platforms: body.platforms,
      scheduledAt: body.scheduledAt,
      media: body.media,
      tags: body.tags,
      mentions: body.mentions,
    };

    const postiz = getPostizClient();
    const post = await postiz.posts.updatePost(id, updateRequest);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update post',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postiz = getPostizClient();
    await postiz.posts.deletePost(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete post',
        },
      },
      { status: 500 }
    );
  }
}
