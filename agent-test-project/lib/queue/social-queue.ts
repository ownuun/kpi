import { Queue, QueueEvents } from 'bullmq';
import { connection } from './redis';
import { SocialPlatform } from '@prisma/client';

export interface SocialPostJobData {
  postId: string;
  platform: SocialPlatform;
  content: string;
  scheduledAt?: Date;
  imageUrl?: string;
  videoUrl?: string;
}

// Create social post queue
export const socialQueue = new Queue<SocialPostJobData>('social-posts', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 200,
      age: 48 * 3600, // 48 hours
    },
    removeOnFail: {
      count: 1000,
      age: 30 * 24 * 3600, // 30 days
    },
  },
});

// Queue events
export const socialQueueEvents = new QueueEvents('social-posts', { connection });

socialQueueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Social post job ${jobId} completed`);
});

socialQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Social post job ${jobId} failed:`, failedReason);
});

/**
 * Queue a social post for publishing
 */
export async function queueSocialPost(data: SocialPostJobData) {
  const delay = data.scheduledAt 
    ? Math.max(0, new Date(data.scheduledAt).getTime() - Date.now())
    : 0;

  const job = await socialQueue.add(
    'publish-post',
    data,
    {
      jobId: `social-${data.postId}-${Date.now()}`,
      delay, // Delay in milliseconds
    }
  );

  if (delay > 0) {
    console.log(`📱 Scheduled social post job ${job.id} for ${data.platform} (delay: ${Math.round(delay / 1000)}s)`);
  } else {
    console.log(`📱 Queued social post job ${job.id} for ${data.platform}`);
  }

  return job;
}

/**
 * Queue multiple social posts
 */
export async function queueBulkSocialPosts(posts: SocialPostJobData[]) {
  const jobs = posts.map((post, index) => {
    const delay = post.scheduledAt
      ? Math.max(0, new Date(post.scheduledAt).getTime() - Date.now())
      : 0;

    return {
      name: 'publish-post',
      data: post,
      opts: {
        jobId: `social-${post.postId}-${Date.now()}-${index}`,
        delay,
      },
    };
  });

  const addedJobs = await socialQueue.addBulk(jobs);

  console.log(`📱 Queued ${addedJobs.length} social post jobs`);

  return addedJobs;
}

/**
 * Cancel a scheduled post
 */
export async function cancelSocialPost(postId: string) {
  const jobs = await socialQueue.getJobs(['waiting', 'delayed']);
  
  for (const job of jobs) {
    if (job.data.postId === postId) {
      await job.remove();
      console.log(`🗑️  Cancelled social post job for post ${postId}`);
      return true;
    }
  }

  return false;
}

/**
 * Reschedule a post
 */
export async function rescheduleSocialPost(postId: string, newScheduledAt: Date) {
  // Cancel existing job
  await cancelSocialPost(postId);

  // Get post data from database
  const { prisma } = await import('@/lib/db/prisma');
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  // Queue with new schedule
  return queueSocialPost({
    postId: post.id,
    platform: post.platform,
    content: post.content,
    scheduledAt: newScheduledAt,
    imageUrl: post.imageUrl || undefined,
    videoUrl: post.videoUrl || undefined,
  });
}

/**
 * Get queue statistics
 */
export async function getSocialQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    socialQueue.getWaitingCount(),
    socialQueue.getActiveCount(),
    socialQueue.getCompletedCount(),
    socialQueue.getFailedCount(),
    socialQueue.getDelayedCount(),
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
 * Get scheduled posts
 */
export async function getScheduledPosts() {
  const delayedJobs = await socialQueue.getJobs(['delayed']);
  
  return delayedJobs.map(job => ({
    jobId: job.id,
    postId: job.data.postId,
    platform: job.data.platform,
    scheduledAt: new Date(job.timestamp + (job.opts.delay || 0)),
    content: job.data.content.substring(0, 100) + '...',
  }));
}

/**
 * Clean up old jobs
 */
export async function cleanSocialQueue() {
  const completedCount = await socialQueue.clean(48 * 3600 * 1000, 200, 'completed');
  const failedCount = await socialQueue.clean(30 * 24 * 3600 * 1000, 1000, 'failed');
  
  console.log(`🧹 Cleaned ${completedCount} completed and ${failedCount} failed social jobs`);
  
  return { completedCount, failedCount };
}
