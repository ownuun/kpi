/**
 * 사전 정의된 자동화 워크플로우
 */

import { Workflow, workflowEngine } from './workflow-engine'

/**
 * 1. 신규 리드 생성 시 자동화
 * - 환영 이메일 발송
 * - 영업팀에 알림
 * - 리드 스코어 초기화
 */
export const newLeadWorkflow: Workflow = {
  id: 'wf_new_lead',
  name: '신규 리드 자동화',
  description: '새로운 리드가 생성되면 환영 이메일을 보내고 영업팀에 알립니다',
  trigger: {
    type: 'lead_created'
  },
  actions: [
    {
      id: 'action_1',
      type: 'send_email',
      config: {
        template: 'welcome',
        subject: '환영합니다! KPI Platform에 오신 것을 환영합니다',
        to: '{{lead.email}}'
      }
    },
    {
      id: 'action_2',
      type: 'send_notification',
      config: {
        message: '새로운 리드가 생성되었습니다: {{lead.name}}',
        channel: 'slack',
        recipients: ['sales-team']
      }
    },
    {
      id: 'action_3',
      type: 'update_lead',
      config: {
        score: 50,
        status: 'new',
        assignedTo: 'auto'
      }
    }
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

/**
 * 2. 이메일 오픈 시 자동화
 * - 리드 스코어 증가
 * - 영업팀에 핫 리드 알림
 */
export const emailOpenedWorkflow: Workflow = {
  id: 'wf_email_opened',
  name: '이메일 오픈 추적',
  description: '리드가 이메일을 열면 스코어를 증가시킵니다',
  trigger: {
    type: 'email_opened',
    conditions: {
      campaignType: 'sales'
    }
  },
  actions: [
    {
      id: 'action_1',
      type: 'update_lead',
      config: {
        scoreIncrement: 10,
        lastEngaged: 'now'
      }
    },
    {
      id: 'action_2',
      type: 'conditional_branch',
      config: {
        condition: 'score > 80',
        trueAction: 'send_notification',
        falseAction: null
      }
    },
    {
      id: 'action_3',
      type: 'send_notification',
      config: {
        message: '🔥 핫 리드: {{lead.name}} (스코어: {{lead.score}})',
        channel: 'slack'
      }
    }
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

/**
 * 3. SNS 포스트 자동 발행
 * - 예약된 시간에 자동 포스팅
 * - 여러 플랫폼 동시 발행
 * - 성과 추적 시작
 */
export const scheduledPostWorkflow: Workflow = {
  id: 'wf_scheduled_post',
  name: 'SNS 자동 포스팅',
  description: '예약된 시간에 여러 SNS 플랫폼에 동시 포스팅합니다',
  trigger: {
    type: 'time_based',
    schedule: '0 10 * * *' // 매일 오전 10시
  },
  actions: [
    {
      id: 'action_1',
      type: 'post_to_social',
      config: {
        platform: 'linkedin',
        content: '{{post.content}}',
        media: '{{post.media}}'
      }
    },
    {
      id: 'action_2',
      type: 'post_to_social',
      config: {
        platform: 'facebook',
        content: '{{post.content}}',
        media: '{{post.media}}'
      },
      delay: 1000 // 1초 후 실행
    },
    {
      id: 'action_3',
      type: 'post_to_social',
      config: {
        platform: 'instagram',
        content: '{{post.content}}',
        media: '{{post.media}}'
      },
      delay: 2000 // 2초 후 실행
    },
    {
      id: 'action_4',
      type: 'send_notification',
      config: {
        message: '✅ 포스트가 3개 플랫폼에 발행되었습니다',
        channel: 'slack'
      }
    }
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

/**
 * 4. 거래 단계 변경 시 자동화
 * - 단계별 자동 액션
 * - 승리 시 축하 이메일
 */
export const dealStageChangedWorkflow: Workflow = {
  id: 'wf_deal_stage_changed',
  name: '거래 단계 자동화',
  description: '거래 단계가 변경되면 자동으로 액션을 수행합니다',
  trigger: {
    type: 'deal_stage_changed',
    conditions: {
      newStage: 'won'
    }
  },
  actions: [
    {
      id: 'action_1',
      type: 'send_email',
      config: {
        template: 'deal_won_congratulations',
        subject: '🎉 축하합니다! 거래가 성사되었습니다',
        to: '{{lead.email}}'
      }
    },
    {
      id: 'action_2',
      type: 'send_notification',
      config: {
        message: '🎊 거래 성사: {{deal.name}} ({{deal.amount}}원)',
        channel: 'slack',
        recipients: ['sales-team', 'management']
      }
    },
    {
      id: 'action_3',
      type: 'create_task',
      config: {
        title: '온보딩 프로세스 시작: {{deal.name}}',
        assignedTo: 'customer-success-team',
        dueDate: '+7d'
      }
    }
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

/**
 * 5. 장기 미응답 리드 재참여 캠페인
 * - 30일 이상 미응답 리드에게 자동 이메일
 */
export const reengagementWorkflow: Workflow = {
  id: 'wf_reengagement',
  name: '재참여 캠페인',
  description: '장기 미응답 리드에게 재참여 이메일을 발송합니다',
  trigger: {
    type: 'time_based',
    schedule: '0 9 * * MON' // 매주 월요일 오전 9시
  },
  actions: [
    {
      id: 'action_1',
      type: 'send_email',
      config: {
        template: 'reengagement',
        subject: '혹시 저희를 잊으셨나요? 특별 혜택을 드립니다',
        filter: {
          lastEngaged: { $lt: '30d' },
          status: { $ne: 'lost' }
        }
      }
    },
    {
      id: 'action_2',
      type: 'update_lead',
      config: {
        tags: ['reengagement_campaign_sent'],
        lastContactedAt: 'now'
      },
      delay: 1000
    }
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}

/**
 * 모든 사전 정의 워크플로우 등록
 */
export function registerPredefinedWorkflows(): void {
  workflowEngine.registerWorkflow(newLeadWorkflow)
  workflowEngine.registerWorkflow(emailOpenedWorkflow)
  workflowEngine.registerWorkflow(scheduledPostWorkflow)
  workflowEngine.registerWorkflow(dealStageChangedWorkflow)
  workflowEngine.registerWorkflow(reengagementWorkflow)

  console.log('✅ All predefined workflows registered')
}

/**
 * 워크플로우 데모 실행
 */
export async function runWorkflowDemo(): Promise<void> {
  console.log('\n🚀 Starting Workflow Automation Demo...\n')

  // 신규 리드 생성 시뮬레이션
  console.log('📝 Scenario 1: New Lead Created')
  await workflowEngine.trigger('lead_created', {
    leadId: 'lead_123',
    name: '홍길동',
    email: 'hong@example.com',
    company: '삼성전자'
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  // 이메일 오픈 시뮬레이션
  console.log('\n📧 Scenario 2: Email Opened')
  await workflowEngine.trigger('email_opened', {
    leadId: 'lead_123',
    campaignType: 'sales',
    score: 85
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  // 거래 성사 시뮬레이션
  console.log('\n🎉 Scenario 3: Deal Won')
  await workflowEngine.trigger('deal_stage_changed', {
    dealId: 'deal_456',
    name: '삼성전자 프로젝트',
    amount: 50000000,
    newStage: 'won',
    lead: {
      email: 'hong@example.com'
    }
  })

  console.log('\n✅ Workflow Demo Completed!\n')
}
