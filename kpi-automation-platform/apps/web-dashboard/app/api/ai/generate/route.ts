import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator, ContentGenerationRequest } from '@kpi/automation'

/**
 * POST /api/ai/generate
 * Generate AI content for SNS posts or emails
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json()

    if (!body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content type is required'
        },
        { status: 400 }
      )
    }

    const generatedContent = await aiContentGenerator.generate(body)

    return NextResponse.json({
      success: true,
      data: generatedContent
    })
  } catch (error: any) {
    console.error('Failed to generate content:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content'
      },
      { status: 500 }
    )
  }
}
