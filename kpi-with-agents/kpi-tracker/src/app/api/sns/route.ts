import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sns - List posts with filters
 * Query params:
 *   - businessLineId: Filter by business line
 *   - platform: Filter by platform (linkedin, facebook, instagram, youtube)
 *   - startDate: Filter posts published after this date
 *   - endDate: Filter posts published before this date
 *   - limit: Number of posts to return (default: 50)
 *   - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLineId = searchParams.get('businessLineId');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    if (businessLineId) {
      where.businessLineId = businessLineId;
    }

    if (platform) {
      where.platform = platform;
    }

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      prisma.snsPost.findMany({
        where,
        include: {
          businessLine: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          landingVisits: {
            select: {
              id: true,
              convertedToLead: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.snsPost.count({ where }),
    ]);

    // Calculate engagement metrics
    const postsWithMetrics = posts.map(post => ({
      ...post,
      engagement: {
        total: post.views + post.likes + post.comments + post.shares + post.clicks,
        engagementRate: post.views > 0 ? ((post.likes + post.comments + post.shares) / post.views) * 100 : 0,
        clickThroughRate: post.views > 0 ? (post.clicks / post.views) * 100 : 0,
        visitsGenerated: post.landingVisits.length,
        leadsGenerated: post.landingVisits.filter(v => v.convertedToLead).length,
      },
    }));

    return NextResponse.json({
      success: true,
      data: postsWithMetrics,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching SNS posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SNS posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sns - Create new post
 * Body: {
 *   platform: string,
 *   postId?: string,
 *   content: string,
 *   mediaUrls?: string[],
 *   publishedAt: string (ISO date),
 *   utmSource?: string,
 *   utmMedium?: string,
 *   utmCampaign?: string,
 *   businessLineId: string,
 *   views?: number,
 *   likes?: number,
 *   comments?: number,
 *   shares?: number,
 *   clicks?: number,
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.platform || !body.content || !body.publishedAt || !body.businessLineId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['platform', 'content', 'publishedAt', 'businessLineId'],
        },
        { status: 400 }
      );
    }

    // Verify business line exists
    const businessLine = await prisma.businessLine.findUnique({
      where: { id: body.businessLineId },
    });

    if (!businessLine) {
      return NextResponse.json(
        { success: false, error: 'Business line not found' },
        { status: 404 }
      );
    }

    // Create post
    const post = await prisma.snsPost.create({
      data: {
        platform: body.platform,
        postId: body.postId,
        content: body.content,
        mediaUrls: body.mediaUrls ? JSON.stringify(body.mediaUrls) : null,
        publishedAt: new Date(body.publishedAt),
        utmSource: body.utmSource || body.platform,
        utmMedium: body.utmMedium || 'social',
        utmCampaign: body.utmCampaign,
        businessLineId: body.businessLineId,
        views: body.views || 0,
        likes: body.likes || 0,
        comments: body.comments || 0,
        shares: body.shares || 0,
        clicks: body.clicks || 0,
      },
      include: {
        businessLine: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating SNS post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create SNS post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
