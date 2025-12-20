import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const UpdateCampaignSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  previewText: z.string().optional(),
  fromEmail: z.string().email().optional(),
  fromName: z.string().optional(),
  replyToEmail: z.string().email().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED']).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching email campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdateCampaignSchema.parse(body);

    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const updateData: any = { ...validated };

    if (validated.scheduledAt !== undefined) {
      updateData.scheduledAt = validated.scheduledAt ? new Date(validated.scheduledAt) : null;
    }

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating email campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    await prisma.emailCampaign.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting email campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
