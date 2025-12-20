/**
 * Scheduler for time-based workflow triggers
 */
import * as cron from 'node-cron'
import { workflowEngine } from './workflow-engine'

export interface ScheduledTask {
  id: string
  workflowId: string
  cronExpression: string
  task: cron.ScheduledTask
  enabled: boolean
}

export class WorkflowScheduler {
  private scheduledTasks: Map<string, ScheduledTask> = new Map()

  /**
   * Schedule a time-based workflow
   */
  schedule(workflowId: string, cronExpression: string, data?: Record<string, any>): string {
    const taskId = `task_${workflowId}_${Date.now()}`

    const task = cron.schedule(cronExpression, async () => {
      console.log(`⏰ Executing scheduled workflow: ${workflowId}`)
      try {
        await workflowEngine.trigger('time_based', {
          workflowId,
          scheduledAt: new Date().toISOString(),
          ...data
        })
      } catch (error) {
        console.error(`❌ Scheduled workflow failed: ${workflowId}`, error)
      }
    })

    const scheduledTask: ScheduledTask = {
      id: taskId,
      workflowId,
      cronExpression,
      task,
      enabled: true
    }

    this.scheduledTasks.set(taskId, scheduledTask)
    console.log(`✅ Scheduled workflow ${workflowId} with cron: ${cronExpression}`)

    return taskId
  }

  /**
   * Unschedule a task
   */
  unschedule(taskId: string): boolean {
    const scheduledTask = this.scheduledTasks.get(taskId)
    if (!scheduledTask) {
      return false
    }

    scheduledTask.task.stop()
    this.scheduledTasks.delete(taskId)
    console.log(`🛑 Unscheduled task: ${taskId}`)
    return true
  }

  /**
   * Pause a scheduled task
   */
  pause(taskId: string): boolean {
    const scheduledTask = this.scheduledTasks.get(taskId)
    if (!scheduledTask) {
      return false
    }

    scheduledTask.task.stop()
    scheduledTask.enabled = false
    console.log(`⏸ Paused task: ${taskId}`)
    return true
  }

  /**
   * Resume a paused task
   */
  resume(taskId: string): boolean {
    const scheduledTask = this.scheduledTasks.get(taskId)
    if (!scheduledTask) {
      return false
    }

    scheduledTask.task.start()
    scheduledTask.enabled = true
    console.log(`▶️ Resumed task: ${taskId}`)
    return true
  }

  /**
   * Get all scheduled tasks
   */
  getTasks(): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values())
  }

  /**
   * Get a specific scheduled task
   */
  getTask(taskId: string): ScheduledTask | undefined {
    return this.scheduledTasks.get(taskId)
  }

  /**
   * Stop all scheduled tasks
   */
  stopAll(): void {
    for (const scheduledTask of this.scheduledTasks.values()) {
      scheduledTask.task.stop()
    }
    this.scheduledTasks.clear()
    console.log('🛑 All scheduled tasks stopped')
  }
}

export const workflowScheduler = new WorkflowScheduler()
