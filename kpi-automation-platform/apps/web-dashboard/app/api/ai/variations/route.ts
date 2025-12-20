import { NextRequest, NextResponse } from 'next/server'
import { aiContentGenerator, ContentGenerationRequest } from '@kpi/automation'

/**
 * POST /api/ai/variations
 * Generate multiple variations of content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { request: contentRequest, count = 3 } = body

    if (!contentRequest || !contentRequest.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content request with type is required'
        },
        { status: 400 }
      )
    }

    const variations = await aiContentGenerator.generateVariations(
      contentRequest as ContentGenerationRequest,
      count
    )

    return NextResponse.json({
      success: true,
      data: variations,
      count: variations.length
    })
  } catch (error: any) {
    console.error('Failed to generate variations:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate variations'
      },
      { status: 500 }
    )
  }
}
