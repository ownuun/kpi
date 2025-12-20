/**
 * Workflow Automation Engine
 * 트리거 기반 자동화 워크플로우 엔진
 */

export type TriggerType =
  | 'lead_created'
  | 'email_opened'
  | 'email_clicked'
  | 'form_submitted'
  | 'post_published'
  | 'meeting_scheduled'
  | 'deal_stage_changed'
  | 'time_based'
  | 'webhook'

export type ActionType =
  | 'send_email'
  | 'create_task'
  | 'update_lead'
  | 'post_to_social'
  | 'send_notification'
  | 'call_webhook'
  | 'wait'
  | 'conditional_branch'

export interface WorkflowTrigger {
  type: TriggerType
  conditions?: Record<string, any>
  schedule?: string // Cron expression for time-based triggers
}

export interface WorkflowAction {
  id: string
  type: ActionType
  config: Record<string, any>
  nextActions?: string[] // IDs of next actions
  delay?: number // Delay in ms before executing
}

export interface Workflow {
  id: string
  name: string
  description?: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  status: 'active' | 'inactive' | 'paused'
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  triggeredAt: Date
  completedAt?: Date
  status: 'running' | 'completed' | 'failed' | 'paused'
  currentActionId?: string
  data: Record<string, any>
  error?: string
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()
  private actionHandlers: Map<ActionType, (action: WorkflowAction, data: any) => Promise<any>> = new Map()

  constructor() {
    this.registerDefaultHandlers()
  }

  /**
   * 워크플로우 등록
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow)
    console.log(`✅ Workflow registered: ${workflow.name}`)
  }

  /**
   * 액션 핸들러 등록
   */
  registerActionHandler(
    type: ActionType,
    handler: (action: WorkflowAction, data: any) => Promise<any>
  ): void {
    this.actionHandlers.set(type, handler)
  }

  /**
   * 워크플로우 트리거
   */
  async trigger(triggerType: TriggerType, data: Record<string, any>): Promise<void> {
    const matchingWorkflows = Array.from(this.workflows.values()).filter(
      (wf) => wf.trigger.type === triggerType && wf.status === 'active'
    )

    for (const workflow of matchingWorkflows) {
      if (this.checkConditions(workflow.trigger.conditions, data)) {
        await this.executeWorkflow(workflow, data)
      }
    }
  }

  /**
   * 워크플로우 실행
   */
  private async executeWorkflow(workflow: Workflow, data: Record<string, any>): Promise<void> {
    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflow.id,
      triggeredAt: new Date(),
      status: 'running',
      data
    }

    this.executions.set(execution.id, execution)
    console.log(`🚀 Executing workflow: ${workflow.name}`)

    try {
      for (const action of workflow.actions) {
        execution.currentActionId = action.id

        // Delay if specified
        if (action.delay) {
          await this.wait(action.delay)
        }

        // Execute action
        const handler = this.actionHandlers.get(action.type)
        if (handler) {
          const result = await handler(action, execution.data)
          execution.data = { ...execution.data, ...result }
          console.log(`  ✓ Action completed: ${action.type}`)
        } else {
          console.warn(`  ⚠ No handler for action type: ${action.type}`)
        }
      }

      execution.status = 'completed'
      execution.completedAt = new Date()
      console.log(`✅ Workflow completed: ${workflow.name}`)
    } catch (error: any) {
      execution.status = 'failed'
      execution.error = error.message
      console.error(`❌ Workflow failed: ${workflow.name}`, error)
    }
  }

  /**
   * 조건 체크
   */
  private checkConditions(conditions: Record<string, any> | undefined, data: Record<string, any>): boolean {
    if (!conditions) return true

    return Object.entries(conditions).every(([key, expectedValue]) => {
      const actualValue = data[key]
      if (typeof expectedValue === 'object' && expectedValue !== null) {
        // Advanced conditions (e.g., { $gt: 100 })
        const [operator, value] = Object.entries(expectedValue)[0] as [string, any]
        switch (operator) {
          case '$gt': return actualValue > (value as number)
          case '$gte': return actualValue >= (value as number)
          case '$lt': return actualValue < (value as number)
          case '$lte': return actualValue <= (value as number)
          case '$eq': return actualValue === value
          case '$ne': return actualValue !== value
          case '$in': return Array.isArray(value) && value.includes(actualValue)
          default: return false
        }
      }
      return actualValue === expectedValue
    })
  }

  /**
   * 대기
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 기본 액션 핸들러 등록
   */
  private registerDefaultHandlers(): void {
    // 이메일 발송
    this.registerActionHandler('send_email', async (action, data) => {
      console.log(`📧 Sending email to ${data.email}`)
      // 실제 이메일 발송 로직
      return { emailSent: true, sentAt: new Date() }
    })

    // 작업 생성
    this.registerActionHandler('create_task', async (action, data) => {
      console.log(`📝 Creating task: ${action.config.title}`)
      return { taskCreated: true, taskId: `task_${Date.now()}` }
    })

    // 리드 업데이트
    this.registerActionHandler('update_lead', async (action, data) => {
      console.log(`👤 Updating lead: ${data.leadId}`)
      return { leadUpdated: true }
    })

    // SNS 포스팅
    this.registerActionHandler('post_to_social', async (action, data) => {
      console.log(`📱 Posting to ${action.config.platform}`)
      return { posted: true, postId: `post_${Date.now()}` }
    })

    // 알림 발송
    this.registerActionHandler('send_notification', async (action, data) => {
      console.log(`🔔 Sending notification: ${action.config.message}`)
      return { notificationSent: true }
    })

    // 웹훅 호출
    this.registerActionHandler('call_webhook', async (action, data) => {
      console.log(`🌐 Calling webhook: ${action.config.url}`)
      // 실제 HTTP 요청
      return { webhookCalled: true }
    })

    // 대기
    this.registerActionHandler('wait', async (action, data) => {
      const duration = action.config.duration || 1000
      console.log(`⏳ Waiting ${duration}ms`)
      await this.wait(duration)
      return {}
    })
  }

  /**
   * 워크플로우 상태 확인
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  /**
   * 모든 워크플로우 실행 내역 조회
   */
  getExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values())
  }

  /**
   * 활성 워크플로우 목록
   */
  getActiveWorkflows(): Workflow[] {
    return Array.from(this.workflows.values()).filter(wf => wf.status === 'active')
  }

  /**
   * 모든 워크플로우 목록
   */
  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values())
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine()
