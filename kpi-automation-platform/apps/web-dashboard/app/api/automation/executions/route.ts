import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine } from '@kpi/automation'

/**
 * GET /api/automation/executions
 * Get workflow execution history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workflowId = searchParams.get('workflowId')
    const status = searchParams.get('status')

    const executions = workflowEngine.getExecutions()

    let filtered = executions
    if (workflowId) {
      filtered = filtered.filter(e => e.workflowId === workflowId)
    }
    if (status) {
      filtered = filtered.filter(e => e.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length
    })
  } catch (error: any) {
    console.error('Failed to fetch executions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch executions'
      },
      { status: 500 }
    )
  }
}
