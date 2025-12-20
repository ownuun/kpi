import { NextRequest, NextResponse } from 'next/server'
import { initializeAutomation, isAutomationInitialized } from '@/lib/automation-init'

/**
 * GET /api/automation/init
 * Check if automation is initialized
 */
export async function GET(request: NextRequest) {
  try {
    const initialized = isAutomationInitialized()

    return NextResponse.json({
      success: true,
      initialized
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/automation/init
 * Initialize automation services
 */
export async function POST(request: NextRequest) {
  try {
    initializeAutomation()

    return NextResponse.json({
      success: true,
      message: 'Automation services initialized successfully'
    })
  } catch (error: any) {
    console.error('Failed to initialize automation:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize automation'
      },
      { status: 500 }
    )
  }
}
