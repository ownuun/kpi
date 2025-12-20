import { NextRequest, NextResponse } from 'next/server';
import { getPostizClient } from '@/lib/postiz';
import { Platform } from '@/types/posts';

/**
 * GET /api/posts/[id]/analytics
 * Get analytics for a specific post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    const analyticsParams = {
      postId: id,
      platforms: searchParams.get('platforms')
        ? [searchParams.get('platforms') as Platform]
        : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    };

    const postiz = getPostizClient();
    const analytics = await postiz.analytics.getPostAnalytics(analyticsParams);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ANALYTICS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch analytics',
        },
      },
      { status: 500 }
    );
  }
}
