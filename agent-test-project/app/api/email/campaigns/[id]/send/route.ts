import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const SendCampaignSchema = z.object({
  recipients: z.array(z.string().email()).min(1).max(1000),
  sendNow: z.boolean().default(true),
  useQueue: z.boolean().default(true), // Use BullMQ queue by default
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = SendCampaignSchema.parse(body);

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: params.id }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status === 'SENT') {
      return NextResponse.json(
        { error: 'Campaign has already been sent' },
        { status: 400 }
      );
    }

    // Update campaign status to SENDING
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id: params.id },
      data: {
        status: validated.sendNow ? 'SENDING' : 'SCHEDULED',
        recipientCount: validated.recipients.length,
        sentAt: validated.sendNow ? new Date() : undefined,
      }
    });

    // Queue emails with BullMQ or send immediately
    if (validated.useQueue) {
      // Use BullMQ queue for async processing
      const { queueBulkEmails } = await import('@/lib/queue/email-queue');
      
      await queueBulkEmails({
        campaignId: params.id,
        recipients: validated.recipients,
      });

      // Campaign will be marked as SENT by workers
      return NextResponse.json({
        campaign: updatedCampaign,
        message: `Campaign queued for ${validated.recipients.length} recipients`,
        recipients: validated.recipients.length,
        queued: true,
      });
    } else {
      // Send immediately without queue (for testing)
      const { sendCampaignEmails } = await import('@/lib/email/send');
      
      const sendResult = await sendCampaignEmails(
        params.id,
        validated.recipients
      );

      if (sendResult.failed > 0) {
        console.warn(`Failed to send ${sendResult.failed} emails:`, sendResult.errors);
      }

      // Update campaign to SENT status
      const finalCampaign = await prisma.emailCampaign.update({
        where: { id: params.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        }
      });

      return NextResponse.json({
        campaign: finalCampaign,
        message: `Campaign sent to ${validated.recipients.length} recipients`,
        recipients: validated.recipients.length,
        success: sendResult.success,
        failed: sendResult.failed,
      });
    }


  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error sending email campaign:', error);

    // Update campaign status to FAILED
    try {
      await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'FAILED' }
      });
    } catch (updateError) {
      console.error('Error updating campaign status to FAILED:', updateError);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
