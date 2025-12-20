#!/usr/bin/env tsx

import 'dotenv/config';
import { createEmailWorker, createSocialWorker, shutdownWorkers } from '@/lib/queue/workers';
import { Worker } from 'bullmq';

console.log('🚀 Starting BullMQ workers...');

// Create workers
const workers: Worker[] = [];

try {
  const emailWorker = createEmailWorker();
  workers.push(emailWorker);
  console.log('✅ Email worker started');

  const socialWorker = createSocialWorker();
  workers.push(socialWorker);
  console.log('✅ Social worker started');

  console.log('\n📊 Workers are now processing jobs...');
  console.log('Press Ctrl+C to stop\n');
} catch (error) {
  console.error('❌ Failed to start workers:', error);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n📨 SIGTERM received');
  await shutdownWorkers(workers);
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n📨 SIGINT received');
  await shutdownWorkers(workers);
  process.exit(0);
});

// Keep the process running
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});
