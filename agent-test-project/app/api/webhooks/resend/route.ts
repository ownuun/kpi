import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { EmailEventType } from '@prisma/client';

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    to?: string;
    subject?: string;
    from?: string;
    created_at?: string;
    // Additional fields based on event type
    click?: {
      link: string;
      timestamp: string;
    };
    bounce?: {
      reason: string;
      type: string;
    };
    complaint?: {
      feedback_type: string;
    };
  };
}

/**
 * Map Resend event types to EmailEventType enum
 */
function mapResendEventType(resendType: string): EmailEventType | null {
  const mapping: Record<string, EmailEventType> = {
    'email.sent': 'SENT',
    'email.delivered': 'DELIVERED',
    'email.opened': 'OPENED',
    'email.clicked': 'CLICKED',
    'email.bounced': 'BOUNCED',
    'email.complained': 'COMPLAINED',
    'email.delivery_delayed': 'BOUNCED', // Treat delayed as bounced
  };

  return mapping[resendType] || null;
}

/**
 * Resend Webhook Handler
 * 
 * Handles incoming webhook events from Resend:
 * - email.sent
 * - email.delivered
 * - email.opened
 * - email.clicked
 * - email.bounced
 * - email.complained
 * - email.delivery_delayed
 * 
 * Configure webhook URL in Resend dashboard:
 * https://resend.com/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const payload: ResendWebhookPayload = await request.json();

    console.log('Received Resend webhook:', payload.type);

    const eventType = mapResendEventType(payload.type);

    if (!eventType) {
      console.warn('Unknown Resend event type:', payload.type);
      return NextResponse.json({ received: true });
    }

    const { data } = payload;

    // Find the campaign associated with this email
    // We need to match by email_id or recipient
    const emailId = data.email_id || `email-${Date.now()}`;
    const recipient = data.to || '';

    // Try to find existing email event to get campaign ID
    let campaignId: string | null = null;
    
    if (emailId) {
      const existingEvent = await prisma.emailEvent.findFirst({
        where: { emailId },
        select: { emailCampaignId: true },
      });
      campaignId = existingEvent?.emailCampaignId || null;
    }

    // Create email event
    const emailEvent = await prisma.emailEvent.create({
      data: {
        type: eventType,
        emailId,
        recipient,
        emailCampaignId: campaignId,
        timestamp: new Date(payload.created_at),
        metadata: JSON.stringify({
          originalType: payload.type,
          subject: data.subject,
          from: data.from,
          clickLink: data.click?.link,
          bounceReason: data.bounce?.reason,
          bounceType: data.bounce?.type,
          complaintType: data.complaint?.feedback_type,
        }),
      },
    });

    // Update campaign metrics if campaign exists
    if (campaignId) {
      const updateData: any = {};

      switch (eventType) {
        case 'OPENED':
          // Increment openedCount
          const currentCampaign = await prisma.emailCampaign.findUnique({
            where: { id: campaignId },
            select: { openedCount: true },
          });
          updateData.openedCount = (currentCampaign?.openedCount || 0) + 1;
          break;

        case 'CLICKED':
          // Increment clickedCount
          const currentCampaignClicks = await prisma.emailCampaign.findUnique({
            where: { id: campaignId },
            select: { clickedCount: true },
          });
          updateData.clickedCount = (currentCampaignClicks?.clickedCount || 0) + 1;
          break;

        case 'BOUNCED':
          // Increment bouncedCount
          const currentCampaignBounces = await prisma.emailCampaign.findUnique({
            where: { id: campaignId },
            select: { bouncedCount: true },
          });
          updateData.bouncedCount = (currentCampaignBounces?.bouncedCount || 0) + 1;
          break;

        case 'UNSUBSCRIBED':
          // Increment unsubscribed count
          const currentCampaignUnsub = await prisma.emailCampaign.findUnique({
            where: { id: campaignId },
            select: { unsubscribed: true },
          });
          updateData.unsubscribed = (currentCampaignUnsub?.unsubscribed || 0) + 1;
          break;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: updateData,
        });
      }
    }

    console.log('Created email event:', {
      id: emailEvent.id,
      type: eventType,
      emailId,
      campaignId,
    });

    return NextResponse.json({
      received: true,
      eventId: emailEvent.id,
    });
  } catch (error) {
    console.error('Error processing Resend webhook:', error);
    
    // Return 200 to prevent Resend from retrying
    // Log the error for investigation
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 to acknowledge receipt
    );
  }
}
