import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sns/stats - Get aggregated statistics
 * Query params:
 *   - businessLineId: Filter by business line
 *   - platform: Filter by platform
 *   - startDate: Filter posts published after this date
 *   - endDate: Filter posts published before this date
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLineId = searchParams.get('businessLineId');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Get all posts matching the criteria
    const posts = await prisma.snsPost.findMany({
      where,
      include: {
        landingVisits: {
          select: {
            convertedToLead: true,
          },
        },
      },
    });

    // Calculate aggregated statistics
    const stats = {
      totalPosts: posts.length,
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
      totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
      totalShares: posts.reduce((sum, p) => sum + p.shares, 0),
      totalClicks: posts.reduce((sum, p) => sum + p.clicks, 0),
      totalLandingVisits: posts.reduce((sum, p) => sum + p.landingVisits.length, 0),
      totalLeadsGenerated: posts.reduce(
        (sum, p) => sum + p.landingVisits.filter(v => v.convertedToLead).length,
        0
      ),
    };

    // Calculate averages
    const avgStats = {
      avgViews: stats.totalPosts > 0 ? stats.totalViews / stats.totalPosts : 0,
      avgLikes: stats.totalPosts > 0 ? stats.totalLikes / stats.totalPosts : 0,
      avgComments: stats.totalPosts > 0 ? stats.totalComments / stats.totalPosts : 0,
      avgShares: stats.totalPosts > 0 ? stats.totalShares / stats.totalPosts : 0,
      avgClicks: stats.totalPosts > 0 ? stats.totalClicks / stats.totalPosts : 0,
      avgEngagementRate:
        stats.totalViews > 0
          ? ((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalViews) * 100
          : 0,
      avgClickThroughRate: stats.totalViews > 0 ? (stats.totalClicks / stats.totalViews) * 100 : 0,
      avgVisitsPerPost: stats.totalPosts > 0 ? stats.totalLandingVisits / stats.totalPosts : 0,
      avgLeadsPerPost: stats.totalPosts > 0 ? stats.totalLeadsGenerated / stats.totalPosts : 0,
    };

    // Calculate conversion rate
    const conversionRate =
      stats.totalLandingVisits > 0
        ? (stats.totalLeadsGenerated / stats.totalLandingVisits) * 100
        : 0;

    // Group by platform
    const platformStats = posts.reduce((acc, post) => {
      if (!acc[post.platform]) {
        acc[post.platform] = {
          count: 0,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
          visits: 0,
          leads: 0,
        };
      }

      acc[post.platform].count += 1;
      acc[post.platform].views += post.views;
      acc[post.platform].likes += post.likes;
      acc[post.platform].comments += post.comments;
      acc[post.platform].shares += post.shares;
      acc[post.platform].clicks += post.clicks;
      acc[post.platform].visits += post.landingVisits.length;
      acc[post.platform].leads += post.landingVisits.filter(v => v.convertedToLead).length;

      return acc;
    }, {} as Record<string, any>);

    // Calculate platform-specific rates
    Object.keys(platformStats).forEach(platform => {
      const p = platformStats[platform];
      p.engagementRate = p.views > 0 ? ((p.likes + p.comments + p.shares) / p.views) * 100 : 0;
      p.clickThroughRate = p.views > 0 ? (p.clicks / p.views) * 100 : 0;
      p.conversionRate = p.visits > 0 ? (p.leads / p.visits) * 100 : 0;
    });

    // Time series data (posts per day)
    const postsPerDay = posts.reduce((acc, post) => {
      const date = new Date(post.publishedAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          views: 0,
          engagement: 0,
          clicks: 0,
        };
      }

      acc[date].count += 1;
      acc[date].views += post.views;
      acc[date].engagement += post.likes + post.comments + post.shares;
      acc[date].clicks += post.clicks;

      return acc;
    }, {} as Record<string, any>);

    const timeSeriesData = Object.values(postsPerDay).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    // Top performing posts
    const topPosts = posts
      .map(post => ({
        id: post.id,
        platform: post.platform,
        content: post.content.substring(0, 100),
        publishedAt: post.publishedAt,
        views: post.views,
        totalEngagement: post.likes + post.comments + post.shares + post.clicks,
        engagementRate:
          post.views > 0 ? ((post.likes + post.comments + post.shares) / post.views) * 100 : 0,
        leadsGenerated: post.landingVisits.filter(v => v.convertedToLead).length,
      }))
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...stats,
          ...avgStats,
          conversionRate,
        },
        byPlatform: platformStats,
        timeSeries: timeSeriesData,
        topPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching SNS stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SNS statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
