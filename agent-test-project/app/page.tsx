import { prisma } from '@/lib/db/prisma'
import ClientHomePage from '@/app/ClientHomePage'

async function getDashboardStats() {
  try {
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Lead statistics
    const [totalLeads, leadsByStatus, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.lead.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Email campaign statistics
    const [emailCampaigns, emailMetrics] = await Promise.all([
      prisma.emailCampaign.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          subject: true,
          status: true,
          recipientCount: true,
          openedCount: true,
          clickedCount: true,
          bouncedCount: true,
          sentAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emailCampaign.aggregate({
        _sum: {
          recipientCount: true,
          openedCount: true,
          clickedCount: true,
          bouncedCount: true,
        },
        _count: { id: true },
      }),
    ]);

    // Social post statistics
    const [socialPosts, socialMetrics] = await Promise.all([
      prisma.socialPost.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          platform: true,
          status: true,
          views: true,
          likes: true,
          shares: true,
          comments: true,
          publishedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.socialPost.aggregate({
        _sum: {
          views: true,
          likes: true,
          shares: true,
          comments: true,
        },
        _count: { id: true },
      }),
    ]);

    // Campaign statistics
    const campaigns = await prisma.campaign.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        leadsGenerated: true,
        revenue: true,
        budget: true,
        startDate: true,
        endDate: true,
      },
    });

    // Calculate conversion rates
    const openRate = emailMetrics._sum.recipientCount
      ? ((emailMetrics._sum.openedCount || 0) / emailMetrics._sum.recipientCount) * 100
      : 0;

    const clickRate = emailMetrics._sum.recipientCount
      ? ((emailMetrics._sum.clickedCount || 0) / emailMetrics._sum.recipientCount) * 100
      : 0;

    const bounceRate = emailMetrics._sum.recipientCount
      ? ((emailMetrics._sum.bouncedCount || 0) / emailMetrics._sum.recipientCount) * 100
      : 0;

    // Format lead funnel data
    const leadFunnel = leadsByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
    }));

    // Format email performance data
    const emailPerformance = emailCampaigns.slice(0, 10).map(campaign => ({
      name: campaign.subject.substring(0, 30) + (campaign.subject.length > 30 ? '...' : ''),
      sent: campaign.recipientCount,
      opened: campaign.openedCount,
      clicked: campaign.clickedCount,
      bounced: campaign.bouncedCount,
    }));

    // Format social performance data by platform
    const socialByPlatform = socialPosts.reduce((acc: any, post) => {
      const platform = post.platform;
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          posts: 0,
        };
      }
      acc[platform].views += post.views;
      acc[platform].likes += post.likes;
      acc[platform].shares += post.shares;
      acc[platform].comments += post.comments;
      acc[platform].posts += 1;
      return acc;
    }, {});

    const socialPerformance = Object.values(socialByPlatform);

    return {
      leads: {
        total: totalLeads,
        byStatus: leadFunnel,
        recent: recentLeads,
      },
      email: {
        total: emailMetrics._count.id,
        sent: emailMetrics._sum.recipientCount || 0,
        opened: emailMetrics._sum.openedCount || 0,
        clicked: emailMetrics._sum.clickedCount || 0,
        bounced: emailMetrics._sum.bouncedCount || 0,
        openRate: openRate.toFixed(2),
        clickRate: clickRate.toFixed(2),
        bounceRate: bounceRate.toFixed(2),
        campaigns: emailPerformance,
      },
      social: {
        total: socialMetrics._count.id,
        views: socialMetrics._sum.views || 0,
        likes: socialMetrics._sum.likes || 0,
        shares: socialMetrics._sum.shares || 0,
        comments: socialMetrics._sum.comments || 0,
        byPlatform: socialPerformance,
      },
      campaigns: {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'ACTIVE').length,
        completed: campaigns.filter(c => c.status === 'COMPLETED').length,
        list: campaigns,
      },
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default async function HomePage() {
  const stats = await getDashboardStats();
  return <ClientHomePage stats={stats} />;
}
