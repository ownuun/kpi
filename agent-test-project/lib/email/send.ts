import { resend } from './resend';
import { prisma } from '@/lib/db/prisma';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  campaignId?: string;
}

export interface BulkSendResult {
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

/**
 * Send a single email via Resend
 */
export async function sendEmail(params: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: params.fromName 
        ? `${params.fromName} <${params.fromEmail || 'noreply@example.com'}>`
        : params.fromEmail || 'noreply@example.com',
      to: params.to,
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Create SENT event
    if (params.campaignId) {
      await prisma.emailEvent.create({
        data: {
          type: 'SENT',
          emailId: data?.id || `email-${Date.now()}`,
          recipient: params.to,
          emailCampaignId: params.campaignId,
          timestamp: new Date(),
        },
      });
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    console.error('Error sending email:', error);

    // Create BOUNCED event for failed sends
    if (params.campaignId) {
      await prisma.emailEvent.create({
        data: {
          type: 'BOUNCED',
          emailId: `email-${Date.now()}-failed`,
          recipient: params.to,
          emailCampaignId: params.campaignId,
          timestamp: new Date(),
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send campaign emails to multiple recipients
 */
export async function sendCampaignEmails(
  campaignId: string,
  recipients: string[]
): Promise<BulkSendResult> {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const result: BulkSendResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

  // Send emails sequentially to avoid rate limiting
  // In production, you might want to use a queue system (BullMQ)
  for (const recipient of recipients) {
    const sendResult = await sendEmail({
      to: recipient,
      subject: campaign.subject,
      html: campaign.content,
      fromEmail: campaign.fromEmail,
      fromName: campaign.fromName,
      replyTo: campaign.replyToEmail || undefined,
      campaignId: campaign.id,
    });

    if (sendResult.success) {
      result.success++;
    } else {
      result.failed++;
      result.errors.push({
        email: recipient,
        error: sendResult.error || 'Unknown error',
      });
    }

    // Add a small delay to avoid rate limiting (100ms between emails)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update campaign metrics
  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      recipientCount: recipients.length,
      bouncedCount: result.failed,
    },
  });

  return result;
}
