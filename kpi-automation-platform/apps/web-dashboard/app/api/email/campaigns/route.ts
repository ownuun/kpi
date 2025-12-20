import { NextRequest, NextResponse } from 'next/server'
import { emailAutomation } from '@kpi/automation'

/**
 * GET /api/email/campaigns
 * Get all email campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const campaigns = emailAutomation.getAllCampaigns()

    return NextResponse.json({
      success: true,
      data: campaigns,
      count: campaigns.length
    })
  } catch (error: any) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch campaigns'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/email/campaigns
 * Create a new email campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, templateId, recipients, fromEmail, fromName, replyTo, schedule, trackOpens, trackClicks } = body

    if (!name || !templateId || !recipients || !fromEmail || !fromName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, templateId, recipients, fromEmail, fromName'
        },
        { status: 400 }
      )
    }

    const campaign = emailAutomation.createCampaign(
      name,
      templateId,
      recipients,
      {
        fromEmail,
        fromName,
        replyTo,
        schedule: schedule ? new Date(schedule) : undefined,
        trackOpens,
        trackClicks
      }
    )

    return NextResponse.json({
      success: true,
      data: campaign
    }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create campaign'
      },
      { status: 500 }
    )
  }
}
