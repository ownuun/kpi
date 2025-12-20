import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/leads - List leads with filters
 * Query params:
 *   - businessLineId: Filter by business line
 *   - status: Filter by status (NEW, CONTACTED, QUALIFIED, UNQUALIFIED)
 *   - source: Filter by source
 *   - startDate: Filter leads created after this date
 *   - endDate: Filter leads created before this date
 *   - search: Search in name, email, company
 *   - limit: Number of leads to return (default: 50)
 *   - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLineId = searchParams.get('businessLineId');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    if (businessLineId) {
      where.businessLineId = businessLineId;
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    // Get leads with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          businessLine: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          landingVisit: {
            select: {
              id: true,
              utmSource: true,
              utmMedium: true,
              utmCampaign: true,
              visitedAt: true,
              snsPost: {
                select: {
                  id: true,
                  platform: true,
                  content: true,
                  publishedAt: true,
                },
              },
            },
          },
          meetings: {
            select: {
              id: true,
              title: true,
              scheduledAt: true,
              status: true,
            },
            orderBy: {
              scheduledAt: 'desc',
            },
          },
          deals: {
            select: {
              id: true,
              name: true,
              amount: true,
              stage: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.lead.count({ where }),
    ]);

    // Enrich with computed fields
    const leadsWithMetrics = leads.map(lead => ({
      ...lead,
      metrics: {
        totalMeetings: lead.meetings.length,
        completedMeetings: lead.meetings.filter(m => m.status === 'COMPLETED').length,
        totalDeals: lead.deals.length,
        totalDealValue: lead.deals.reduce((sum, d) => sum + d.amount, 0),
        hasOpenDeal: lead.deals.some(d => !['WON', 'LOST'].includes(d.stage)),
      },
    }));

    return NextResponse.json({
      success: true,
      data: leadsWithMetrics,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads - Create lead (from landing page form)
 * Body: {
 *   name: string,
 *   email: string,
 *   phone?: string,
 *   company?: string,
 *   jobTitle?: string,
 *   city?: string,
 *   status?: string,
 *   source?: string,
 *   businessLineId: string,
 *   landingVisitId?: string, // Optional: connect to landing visit
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.businessLineId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['name', 'email', 'businessLineId'],
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
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

    // Check if lead with same email already exists
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: body.email,
        businessLineId: body.businessLineId,
      },
    });

    if (existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead with this email already exists for this business line',
          existingLeadId: existingLead.id,
        },
        { status: 409 }
      );
    }

    // If landingVisitId is provided, verify and update the landing visit
    if (body.landingVisitId) {
      const landingVisit = await prisma.landingVisit.findUnique({
        where: { id: body.landingVisitId },
      });

      if (!landingVisit) {
        return NextResponse.json(
          { success: false, error: 'Landing visit not found' },
          { status: 404 }
        );
      }

      if (landingVisit.leadId && landingVisit.leadId !== '') {
        return NextResponse.json(
          { success: false, error: 'Landing visit already connected to a lead' },
          { status: 409 }
        );
      }
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        jobTitle: body.jobTitle,
        city: body.city,
        status: body.status || 'NEW',
        source: body.source,
        businessLineId: body.businessLineId,
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

    // Update landing visit if provided
    if (body.landingVisitId) {
      await prisma.landingVisit.update({
        where: { id: body.landingVisitId },
        data: {
          leadId: lead.id,
          convertedToLead: true,
        },
      });
    }

    return NextResponse.json(
      { success: true, data: lead },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
