import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/leads/[id] - Update lead
 * Body: Partial lead data
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Check for duplicate email in same business line
      if (body.email !== existingLead.email) {
        const duplicateLead = await prisma.lead.findFirst({
          where: {
            email: body.email,
            businessLineId: body.businessLineId || existingLead.businessLineId,
            id: { not: id },
          },
        });

        if (duplicateLead) {
          return NextResponse.json(
            { success: false, error: 'Lead with this email already exists for this business line' },
            { status: 409 }
          );
        }
      }
    }

    // If businessLineId is being updated, verify it exists
    if (body.businessLineId && body.businessLineId !== existingLead.businessLineId) {
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

    // Prepare update data
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.source !== undefined) updateData.source = body.source;
    if (body.businessLineId !== undefined) updateData.businessLineId = body.businessLineId;

    // Update lead
    const lead = await prisma.lead.update({
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
        landingVisit: {
          select: {
            id: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
            visitedAt: true,
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
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads/[id] - Delete lead
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
      include: {
        meetings: true,
        deals: true,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Check if lead has active deals
    const hasActiveDeal = existingLead.deals.some(
      deal => !['WON', 'LOST'].includes(deal.stage)
    );

    if (hasActiveDeal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete lead with active deals. Close or delete deals first.',
        },
        { status: 409 }
      );
    }

    // Delete lead (cascade will handle related records)
    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
