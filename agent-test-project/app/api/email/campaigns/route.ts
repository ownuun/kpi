import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const CampaignSchema = z.object({
  subject: z.string().min(1).max(200),
  content: z.string().min(1),
  previewText: z.string().optional(),
  fromEmail: z.string().email().default('noreply@example.com'),
  fromName: z.string().default('Marketing Team'),
  replyToEmail: z.string().email().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CampaignSchema.parse(body);

    const campaign = await prisma.emailCampaign.create({
      data: {
        subject: validated.subject,
        content: validated.content,
        previewText: validated.previewText,
        fromEmail: validated.fromEmail,
        fromName: validated.fromName,
        replyToEmail: validated.replyToEmail,
        scheduledAt: validated.scheduledAt
          ? new Date(validated.scheduledAt)
          : undefined,
        status: validated.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      }
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating email campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    const campaigns = await prisma.emailCampaign.findMany({
      where: {
        ...(status && { status: status as any }),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        events: {
          select: {
            id: true,
            type: true,
            timestamp: true,
          },
          take: 5,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
