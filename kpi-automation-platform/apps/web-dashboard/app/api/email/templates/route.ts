import { NextRequest, NextResponse } from 'next/server'
import { emailAutomation } from '@kpi/automation'

/**
 * GET /api/email/templates
 * Get all email templates
 */
export async function GET(request: NextRequest) {
  try {
    const templates = emailAutomation.getAllTemplates()

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length
    })
  } catch (error: any) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch templates'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/email/templates
 * Register a new email template
 */
export async function POST(request: NextRequest) {
  try {
    const template = await request.json()

    if (!template.id || !template.name || !template.subject || !template.body) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, name, subject, body'
        },
        { status: 400 }
      )
    }

    emailAutomation.registerTemplate(template)

    return NextResponse.json({
      success: true,
      data: template
    }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to register template:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to register template'
      },
      { status: 500 }
    )
  }
}
