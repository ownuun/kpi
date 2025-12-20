import { Queue, QueueEvents } from 'bullmq';
import { connection } from './redis';

export interface EmailJobData {
  campaignId: string;
  recipient: string;
  subject: string;
  html: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export interface BulkEmailJobData {
  campaignId: string;
  recipients: string[];
}

// Create email queue
export const emailQueue = new Queue<EmailJobData>('emails', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Remove after 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
      age: 7 * 24 * 3600, // Remove after 7 days
    },
  },
});

// Queue events for monitoring
export const emailQueueEvents = new QueueEvents('emails', { connection });

emailQueueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Email job ${jobId} completed`);
});

emailQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Email job ${jobId} failed:`, failedReason);
});

/**
 * Queue a single email for sending
 */
export async function queueEmail(data: EmailJobData) {
  const job = await emailQueue.add('send-email', data, {
    jobId: `email-${data.campaignId}-${data.recipient}-${Date.now()}`,
  });

  console.log(`📧 Queued email job ${job.id} for ${data.recipient}`);
  
  return job;
}

/**
 * Queue multiple emails in bulk
 */
export async function queueBulkEmails(data: BulkEmailJobData) {
  const jobs = data.recipients.map((recipient, index) => ({
    name: 'send-email',
    data: {
      campaignId: data.campaignId,
      recipient,
      subject: '', // Will be filled by worker from campaign
      html: '', // Will be filled by worker from campaign
    },
    opts: {
      jobId: `email-${data.campaignId}-${recipient}-${Date.now()}-${index}`,
    },
  }));

  const addedJobs = await emailQueue.addBulk(jobs);

  console.log(`📧 Queued ${addedJobs.length} email jobs for campaign ${data.campaignId}`);

  return addedJobs;
}

/**
 * Get queue statistics
 */
export async function getEmailQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    emailQueue.getWaitingCount(),
    emailQueue.getActiveCount(),
    emailQueue.getCompletedCount(),
    emailQueue.getFailedCount(),
    emailQueue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

/**
 * Pause the queue
 */
export async function pauseEmailQueue() {
  await emailQueue.pause();
  console.log('⏸️  Email queue paused');
}

/**
 * Resume the queue
 */
export async function resumeEmailQueue() {
  await emailQueue.resume();
  console.log('▶️  Email queue resumed');
}

/**
 * Clean up old jobs
 */
export async function cleanEmailQueue() {
  const completedCount = await emailQueue.clean(24 * 3600 * 1000, 100, 'completed');
  const failedCount = await emailQueue.clean(7 * 24 * 3600 * 1000, 500, 'failed');
  
  console.log(`🧹 Cleaned ${completedCount} completed and ${failedCount} failed jobs`);
  
  return { completedCount, failedCount };
}
