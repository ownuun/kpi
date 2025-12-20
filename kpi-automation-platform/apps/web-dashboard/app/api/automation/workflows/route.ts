import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine } from '@kpi/automation'

/**
 * GET /api/automation/workflows
 * Get all registered workflows
 */
export async function GET(request: NextRequest) {
  try {
    const workflows = workflowEngine.getWorkflows()

    return NextResponse.json({
      success: true,
      data: workflows,
      count: workflows.length
    })
  } catch (error: any) {
    console.error('Failed to fetch workflows:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch workflows'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/automation/workflows
 * Register a new workflow
 */
export async function POST(request: NextRequest) {
  try {
    const workflow = await request.json()

    workflowEngine.registerWorkflow(workflow)

    return NextResponse.json({
      success: true,
      data: workflow
    }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to register workflow:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to register workflow'
      },
      { status: 500 }
    )
  }
}
