import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendCampaignEmails } from '@/lib/email/send';

/**
 * POST /api/email/campaigns/send
 * Send an email campaign immediately
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        events: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be sent' },
        { status: 400 }
      );
    }

    // Check recipient count from events
    const recipientCount = campaign.events?.length || 0;

    if (recipientCount === 0) {
      return NextResponse.json(
        { error: 'Campaign has no recipients' },
        { status: 400 }
      );
    }

    // Update campaign status to SENDING
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'SENDING',
        sentAt: new Date(),
      },
    });

    // Send emails via queue
    try {
      await sendCampaignEmails(campaignId);

      return NextResponse.json({
        success: true,
        message: `Campaign queued for sending to ${recipientCount} recipients`,
        recipientCount: recipientCount,
      });
    } catch (error) {
      // Rollback status if queueing fails
      await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: 'DRAFT',
          sentAt: null,
        },
      });
      throw error;
    }
  } catch (error: any) {
    console.error('[Email Campaign Send] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
