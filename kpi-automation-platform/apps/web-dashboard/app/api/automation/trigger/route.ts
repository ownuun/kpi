import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine, TriggerType } from '@kpi/automation'

/**
 * POST /api/automation/trigger
 * Trigger workflows by event type
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { triggerType, data } = body

    if (!triggerType) {
      return NextResponse.json(
        {
          success: false,
          error: 'triggerType is required'
        },
        { status: 400 }
      )
    }

    await workflowEngine.trigger(triggerType as TriggerType, data || {})

    return NextResponse.json({
      success: true,
      message: `Triggered workflows for ${triggerType}`
    })
  } catch (error: any) {
    console.error('Failed to trigger workflows:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to trigger workflows'
      },
      { status: 500 }
    )
  }
}
