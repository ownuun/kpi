import { NextRequest, NextResponse } from 'next/server'
import { emailAutomation } from '@kpi/automation'

/**
 * GET /api/email/campaigns/[id]
 * Get a specific campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const campaign = emailAutomation.getCampaign(id)

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error: any) {
    console.error('Failed to fetch campaign:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch campaign'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/email/campaigns/[id]/send
 * Send a campaign
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await emailAutomation.sendCampaign(id)

    return NextResponse.json({
      success: true,
      message: 'Campaign sent successfully'
    })
  } catch (error: any) {
    console.error('Failed to send campaign:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send campaign'
      },
      { status: 500 }
    )
  }
}
