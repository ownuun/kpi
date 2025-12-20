import { Worker, Job } from 'bullmq';
import { connection } from './redis';
import { EmailJobData } from './email-queue';
import { SocialPostJobData } from './social-queue';
import { sendEmail } from '@/lib/email/send';
import { prisma } from '@/lib/db/prisma';

/**
 * Email Worker
 * Processes email sending jobs
 */
export function createEmailWorker() {
  const worker = new Worker<EmailJobData>(
    'emails',
    async (job: Job<EmailJobData>) => {
      console.log(`📧 Processing email job ${job.id}`);

      const { campaignId, recipient, subject, html, fromEmail, fromName, replyTo } = job.data;

      // Get campaign details if not provided
      let emailSubject = subject;
      let emailHtml = html;
      let emailFromEmail = fromEmail;
      let emailFromName = fromName;
      let emailReplyTo = replyTo;

      if (!emailSubject || !emailHtml) {
        const campaign = await prisma.emailCampaign.findUnique({
          where: { id: campaignId },
        });

        if (!campaign) {
          throw new Error(`Campaign ${campaignId} not found`);
        }

        emailSubject = campaign.subject;
        emailHtml = campaign.content;
        emailFromEmail = campaign.fromEmail;
        emailFromName = campaign.fromName;
        emailReplyTo = campaign.replyToEmail || undefined;
      }

      // Send email via Resend
      const result = await sendEmail({
        to: recipient,
        subject: emailSubject,
        html: emailHtml,
        fromEmail: emailFromEmail,
        fromName: emailFromName,
        replyTo: emailReplyTo,
        campaignId,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      // Update job progress
      await job.updateProgress(100);

      return {
        success: true,
        emailId: result.emailId,
        recipient,
      };
    },
    {
      connection,
      concurrency: 5, // Process 5 emails concurrently
      limiter: {
        max: 10, // Max 10 jobs per duration
        duration: 1000, // 1 second (10 emails per second max)
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Email job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Email job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('❌ Email worker error:', err);
  });

  return worker;
}

/**
 * Social Post Worker
 * Processes social post publishing jobs
 */
export function createSocialWorker() {
  // Import adapters dynamically to avoid circular dependencies
  const getAdapter = require('@/lib/social/adapters').getAdapter;
  const oauthManager = require('@/lib/social/oauth').oauthManager;
  require('@/lib/social/adapters/register'); // Initialize adapters

  const worker = new Worker<SocialPostJobData>(
    'social-posts',
    async (job: Job<SocialPostJobData>) => {
      console.log(`📱 Processing social post job ${job.id}`);

      const { postId, platform, content } = job.data;

      // Get post from database
      const post = await prisma.socialPost.findUnique({
        where: { id: postId },
        include: {
          socialAccount: true,
        },
      });

      if (!post) {
        throw new Error(`Post ${postId} not found`);
      }

      // Check if post is in correct status
      if (post.status !== 'SCHEDULED' && post.status !== 'DRAFT') {
        console.log(`Post ${postId} is already ${post.status}, skipping`);
        return { success: true, skipped: true };
      }

      // Check if social account is connected
      if (!post.socialAccount || !post.socialAccount.isActive) {
        throw new Error(`No active social account found for platform ${platform}`);
      }

      console.log(`Publishing post to ${platform}:`, content.substring(0, 50));

      try {
        // Get the platform adapter
        const adapter = getAdapter(post.platform);

        // Get decrypted account with tokens
        const account = await oauthManager.getAccount(post.socialAccount.id);

        if (!account) {
          throw new Error(`Social account not found: ${post.socialAccount.id}`);
        }

        // Check if token is expired and refresh if needed
        if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
          console.log(`[Worker] Token expired for ${platform}, refreshing...`);
          const refreshed = await oauthManager.refreshAccessToken(
            adapter,
            post.platform,
            account.userId
          );

          if (!refreshed) {
            throw new Error('Failed to refresh access token');
          }

          // Get updated account
          const updatedAccount = await oauthManager.getAccount(post.socialAccount.id);
          if (!updatedAccount) {
            throw new Error('Failed to get updated account after refresh');
          }
          account.accessToken = updatedAccount.accessToken;
        }

        // Prepare post data
        const postData = {
          content: post.content,
          title: post.title || undefined,
          mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined,
        };

        // Publish to actual platform!
        const result = await adapter.publishPost(account.accessToken, postData);

        // Update post status to PUBLISHED with platform data
        await prisma.socialPost.update({
          where: { id: postId },
          data: {
            status: 'PUBLISHED',
            publishedAt: result.publishedAt,
            platformPostId: result.postId,
            platformUrl: result.url,
            error: null,
            errorCode: null,
          },
        });

        // Update job progress
        await job.updateProgress(100);

        console.log(`✅ Published to ${platform}: ${result.url}`);

        return {
          success: true,
          postId,
          platform,
          platformPostId: result.postId,
          platformUrl: result.url,
          publishedAt: result.publishedAt,
        };
      } catch (error) {
        // Update post with error
        await prisma.socialPost.update({
          where: { id: postId },
          data: {
            status: 'ERROR',
            error: error instanceof Error ? error.message : 'Unknown error',
            errorCode: 'PUBLISH_FAILED',
            retryCount: post.retryCount + 1,
          },
        });

        throw error;
      }
    },
    {
      connection,
      concurrency: 3, // Process 3 posts concurrently
      limiter: {
        max: 5, // Max 5 jobs per duration
        duration: 1000, // 1 second
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Social post job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Social post job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('❌ Social worker error:', err);
  });

  return worker;
}

/**
 * Graceful shutdown handler
 */
export async function shutdownWorkers(workers: Worker[]) {
  console.log('🛑 Shutting down workers...');

  await Promise.all(
    workers.map(async (worker) => {
      await worker.close();
    })
  );

  console.log('✅ All workers closed');

  await connection.quit();
  console.log('✅ Redis connection closed');
}
