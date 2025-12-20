import { prisma } from './db'

export interface DashboardMetrics {
  totalRevenue: number
  totalLeads: number
  totalDeals: number
  totalMeetings: number
  conversionRate: number
  averageDealSize: number
}

export interface FunnelData {
  promotion: number
  visits: number
  inquiries: number
  meetings: number
  deals: number
}

export async function getDashboardMetrics(
  businessLineId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardMetrics> {
  const whereClause = {
    ...(businessLineId && { businessLineId }),
    ...(startDate && endDate && {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }),
  }

  const [deals, leads, meetings] = await Promise.all([
    prisma.deal.findMany({
      where: {
        ...whereClause,
        status: 'won',
      },
      select: {
        amount: true,
      },
    }),
    prisma.lead.count({
      where: whereClause,
    }),
    prisma.meeting.count({
      where: {
        ...whereClause,
        status: 'completed',
      },
    }),
  ])

  const totalRevenue = deals.reduce((sum, deal) => sum + Number(deal.amount), 0)
  const totalDeals = deals.length
  const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0
  const conversionRate = leads > 0 ? (totalDeals / leads) * 100 : 0

  return {
    totalRevenue,
    totalLeads: leads,
    totalDeals,
    totalMeetings: meetings,
    conversionRate,
    averageDealSize,
  }
}

export async function getFunnelData(
  businessLineId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<FunnelData> {
  const whereClause = {
    ...(businessLineId && { businessLineId }),
    ...(startDate && endDate && {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }),
  }

  const [posts, visits, leads, meetings, deals] = await Promise.all([
    prisma.post.count({
      where: {
        status: 'published',
        ...(startDate && endDate && {
          publishedAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    }),
    prisma.landingVisit.count({
      where: {
        ...(businessLineId && {
          platform: {
            businessLineId,
          },
        }),
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    }),
    prisma.lead.count({
      where: whereClause,
    }),
    prisma.meeting.count({
      where: {
        ...whereClause,
        status: 'completed',
      },
    }),
    prisma.deal.count({
      where: {
        ...whereClause,
        status: 'won',
      },
    }),
  ])

  return {
    promotion: posts,
    visits,
    inquiries: leads,
    meetings,
    deals,
  }
}

export async function getRevenueByMonth(
  businessLineId?: string,
  months: number = 6
): Promise<{ date: string; revenue: number }[]> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(endDate.getMonth() - months)

  const deals = await prisma.deal.findMany({
    where: {
      ...(businessLineId && { businessLineId }),
      status: 'won',
      actualCloseDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      actualCloseDate: true,
    },
  })

  // Group by month
  const revenueByMonth = new Map<string, number>()

  deals.forEach((deal) => {
    if (!deal.actualCloseDate) return
    const month = deal.actualCloseDate.toISOString().slice(0, 7) // YYYY-MM
    const current = revenueByMonth.get(month) || 0
    revenueByMonth.set(month, current + Number(deal.amount))
  })

  // Generate all months in range
  const result: { date: string; revenue: number }[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const monthKey = current.toISOString().slice(0, 7)
    result.push({
      date: monthKey,
      revenue: revenueByMonth.get(monthKey) || 0,
    })
    current.setMonth(current.getMonth() + 1)
  }

  return result
}

export async function getPlatformStats(
  businessLineId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const platforms = await prisma.platform.findMany({
    where: {
      isActive: true,
      ...(businessLineId && { businessLineId }),
    },
    include: {
      posts: {
        where: {
          status: 'published',
          ...(startDate && endDate && {
            publishedAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
        },
        select: {
          views: true,
          likes: true,
          shares: true,
          comments: true,
        },
      },
      landingVisits: {
        where: {
          converted: true,
          ...(startDate && endDate && {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
        },
      },
    },
  })

  return platforms.map((platform) => {
    const totalEngagement = platform.posts.reduce(
      (sum, post) => sum + post.views + post.likes + post.shares + post.comments,
      0
    )

    return {
      platform: platform.name,
      posts: platform.posts.length,
      engagement: totalEngagement,
      leads: platform.landingVisits.length,
    }
  })
}

export async function getBusinessLines() {
  return prisma.businessLine.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}
