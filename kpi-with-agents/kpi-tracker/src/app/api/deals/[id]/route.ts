import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/deals/[id] - Update deal
 * Body: Partial deal data
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if deal exists
    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Validate amount if provided
    if (body.amount !== undefined && body.amount < 0) {
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

    // If businessLineId is being updated, verify it exists
    if (body.businessLineId && body.businessLineId !== existingDeal.businessLineId) {
      const businessLine = await prisma.businessLine.findUnique({
        where: { id: body.businessLineId },
      });

      if (!businessLine) {
        return NextResponse.json(
          { success: false, error: 'Business line not found' },
          { status: 404 }
        );
      }
    }

    // If leadId is being updated, verify it exists
    if (body.leadId && body.leadId !== existingDeal.leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: body.leadId },
      });

      if (!lead) {
        return NextResponse.json(
          { success: false, error: 'Lead not found' },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.stage !== undefined) {
      updateData.stage = body.stage;
      // Set actualCloseDate when deal is won or lost
      if (['WON', 'LOST'].includes(body.stage) && !existingDeal.actualCloseDate) {
        updateData.actualCloseDate = new Date();
      }
    }
    if (body.probability !== undefined) updateData.probability = body.probability;
    if (body.expectedCloseDate !== undefined) {
      updateData.expectedCloseDate = body.expectedCloseDate ? new Date(body.expectedCloseDate) : null;
    }
    if (body.actualCloseDate !== undefined) {
      updateData.actualCloseDate = body.actualCloseDate ? new Date(body.actualCloseDate) : null;
    }
    if (body.depositExpectedAt !== undefined) {
      updateData.depositExpectedAt = body.depositExpectedAt ? new Date(body.depositExpectedAt) : null;
    }
    if (body.depositConfirmed !== undefined) updateData.depositConfirmed = body.depositConfirmed;
    if (body.depositAmount !== undefined) updateData.depositAmount = body.depositAmount;
    if (body.depositedAt !== undefined) {
      updateData.depositedAt = body.depositedAt ? new Date(body.depositedAt) : null;
      // Auto-confirm deposit when depositedAt is set
      if (body.depositedAt) {
        updateData.depositConfirmed = true;
      }
    }
    if (body.hasPoc !== undefined) updateData.hasPoc = body.hasPoc;
    if (body.pocStartDate !== undefined) {
      updateData.pocStartDate = body.pocStartDate ? new Date(body.pocStartDate) : null;
    }
    if (body.pocEndDate !== undefined) {
      updateData.pocEndDate = body.pocEndDate ? new Date(body.pocEndDate) : null;
    }
    if (body.pocStatus !== undefined) updateData.pocStatus = body.pocStatus;
    if (body.isSubscription !== undefined) updateData.isSubscription = body.isSubscription;
    if (body.subscriptionStart !== undefined) {
      updateData.subscriptionStart = body.subscriptionStart ? new Date(body.subscriptionStart) : null;
    }
    if (body.subscriptionEnd !== undefined) {
      updateData.subscriptionEnd = body.subscriptionEnd ? new Date(body.subscriptionEnd) : null;
    }
    if (body.leadId !== undefined) updateData.leadId = body.leadId;
    if (body.businessLineId !== undefined) updateData.businessLineId = body.businessLineId;

    // Update deal
    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update deal',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/deals/[id] - Delete deal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if deal exists
    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Delete deal
    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete deal',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
