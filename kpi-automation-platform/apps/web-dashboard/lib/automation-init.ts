/**
 * Initialize all automation services
 * Call this on application startup
 */
import {
  registerPredefinedWorkflows,
  registerDefaultEmailTemplates,
  registerDefaultScoringRules,
  workflowScheduler
} from '@kpi/automation'

let initialized = false

export function initializeAutomation() {
  if (initialized) {
    console.log('⚠️ Automation already initialized')
    return
  }

  console.log('🚀 Initializing automation services...\n')

  try {
    // Register predefined workflows
    console.log('1️⃣ Registering workflows...')
    registerPredefinedWorkflows()

    // Register email templates
    console.log('\n2️⃣ Registering email templates...')
    registerDefaultEmailTemplates()

    // Register lead scoring rules
    console.log('\n3️⃣ Registering lead scoring rules...')
    registerDefaultScoringRules()

    // Schedule time-based workflows
    console.log('\n4️⃣ Scheduling time-based workflows...')

    // Schedule SNS posting (daily at 10 AM)
    workflowScheduler.schedule('wf_scheduled_post', '0 10 * * *', {
      post: {
        content: 'Daily automated post from KPI Platform',
        media: []
      }
    })

    // Schedule re-engagement campaign (every Monday at 9 AM)
    workflowScheduler.schedule('wf_reengagement', '0 9 * * MON')

    console.log('\n✅ Automation services initialized successfully!\n')
    console.log('📊 Status:')
    console.log('  - Workflows: Active')
    console.log('  - Email Templates: Registered')
    console.log('  - Lead Scoring: Active')
    console.log('  - Scheduled Tasks: Running\n')

    initialized = true
  } catch (error) {
    console.error('❌ Failed to initialize automation:', error)
    throw error
  }
}

export function isAutomationInitialized(): boolean {
  return initialized
}
