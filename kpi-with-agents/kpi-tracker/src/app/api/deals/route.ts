import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/deals - List deals
 * Query params:
 *   - businessLineId: Filter by business line
 *   - stage: Filter by stage (PROPOSAL, NEGOTIATION, CONTRACT, WON, LOST)
 *   - leadId: Filter by lead
 *   - startDate: Filter deals created after this date
 *   - endDate: Filter deals created before this date
 *   - minAmount: Minimum deal amount
 *   - maxAmount: Maximum deal amount
 *   - limit: Number of deals to return (default: 50)
 *   - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLineId = searchParams.get('businessLineId');
    const stage = searchParams.get('stage');
    const leadId = searchParams.get('leadId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    if (businessLineId) {
      where.businessLineId = businessLineId;
    }

    if (stage) {
      where.stage = stage;
    }

    if (leadId) {
      where.leadId = leadId;
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

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = parseFloat(maxAmount);
      }
    }

    // Get deals with pagination
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: {
          businessLine: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          lead: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              phone: true,
            },
          },
        },
        orderBy: [
          { stage: 'asc' }, // Active deals first
          { expectedCloseDate: 'asc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.deal.count({ where }),
    ]);

    // Enrich with computed fields
    const dealsWithMetrics = deals.map(deal => {
      const daysUntilClose = deal.expectedCloseDate
        ? Math.ceil(
            (new Date(deal.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : null;

      const isOverdue = daysUntilClose !== null && daysUntilClose < 0;
      const isActive = !['WON', 'LOST'].includes(deal.stage);

      return {
        ...deal,
        metrics: {
          daysUntilClose,
          isOverdue,
          isActive,
          depositPending: !deal.depositConfirmed && deal.depositExpectedAt !== null,
          pocActive: deal.hasPoc && deal.pocStatus === 'IN_PROGRESS',
          subscriptionActive:
            deal.isSubscription &&
            deal.subscriptionStart &&
            deal.subscriptionEnd &&
            new Date(deal.subscriptionStart) <= new Date() &&
            new Date(deal.subscriptionEnd) >= new Date(),
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: dealsWithMetrics,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch deals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deals - Create deal
 * Body: {
 *   name: string,
 *   description?: string,
 *   amount: number,
 *   currency?: string,
 *   stage?: string,
 *   probability?: number,
 *   expectedCloseDate?: string (ISO date),
 *   actualCloseDate?: string (ISO date),
 *   depositExpectedAt?: string (ISO date),
 *   depositConfirmed?: boolean,
 *   depositAmount?: number,
 *   depositedAt?: string (ISO date),
 *   hasPoc?: boolean,
 *   pocStartDate?: string (ISO date),
 *   pocEndDate?: string (ISO date),
 *   pocStatus?: string,
 *   isSubscription?: boolean,
 *   subscriptionStart?: string (ISO date),
 *   subscriptionEnd?: string (ISO date),
 *   leadId: string,
 *   businessLineId: string,
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || body.amount === undefined || !body.leadId || !body.businessLineId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['name', 'amount', 'leadId', 'businessLineId'],
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (body.amount < 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate probability if provided
    if (body.probability !== undefined && (body.probability < 0 || body.probability > 100)) {
      return NextResponse.json(
        { success: false, error: 'Probability must be between 0 and 100' },
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

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: body.leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        name: body.name,
        description: body.description,
        amount: body.amount,
        currency: body.currency || 'KRW',
        stage: body.stage || 'PROPOSAL',
        probability: body.probability,
        expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : null,
        actualCloseDate: body.actualCloseDate ? new Date(body.actualCloseDate) : null,
        depositExpectedAt: body.depositExpectedAt ? new Date(body.depositExpectedAt) : null,
        depositConfirmed: body.depositConfirmed || false,
        depositAmount: body.depositAmount,
        depositedAt: body.depositedAt ? new Date(body.depositedAt) : null,
        hasPoc: body.hasPoc || false,
        pocStartDate: body.pocStartDate ? new Date(body.pocStartDate) : null,
        pocEndDate: body.pocEndDate ? new Date(body.pocEndDate) : null,
        pocStatus: body.pocStatus,
        isSubscription: body.isSubscription || false,
        subscriptionStart: body.subscriptionStart ? new Date(body.subscriptionStart) : null,
        subscriptionEnd: body.subscriptionEnd ? new Date(body.subscriptionEnd) : null,
        leadId: body.leadId,
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
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            phone: true,
          },
        },
      },
    });

    // Update lead status to QUALIFIED if still NEW
    if (lead.status === 'NEW') {
      await prisma.lead.update({
        where: { id: body.leadId },
        data: { status: 'QUALIFIED' },
      });
    }

    return NextResponse.json(
      { success: true, data: deal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create deal',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
