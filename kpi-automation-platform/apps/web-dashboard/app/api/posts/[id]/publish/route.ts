import { NextRequest, NextResponse } from 'next/server';
import { getPostizClient } from '@/lib/postiz';
import { formatErrorResponse } from '@/lib/api-utils';

/**
 * POST /api/posts/[id]/publish
 * Publish a post immediately
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postiz = getPostizClient();
    const post = await postiz.posts.publishPost(id);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    const { success, error: errorData, statusCode } = formatErrorResponse(
      error,
      'Failed to publish post'
    );
    return NextResponse.json({ success, error: errorData }, { status: statusCode });
  }
}
