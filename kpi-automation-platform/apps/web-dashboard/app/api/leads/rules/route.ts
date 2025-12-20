import { NextRequest, NextResponse } from 'next/server'
import { leadScoringEngine } from '@kpi/automation'

/**
 * GET /api/leads/rules
 * Get all scoring rules
 */
export async function GET(request: NextRequest) {
  try {
    const rules = leadScoringEngine.getRules()

    return NextResponse.json({
      success: true,
      data: rules,
      count: rules.length
    })
  } catch (error: any) {
    console.error('Failed to fetch scoring rules:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch scoring rules'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/leads/rules
 * Register a new scoring rule
 */
export async function POST(request: NextRequest) {
  try {
    const rule = await request.json()

    if (!rule.id || !rule.name || rule.points === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, name, points'
        },
        { status: 400 }
      )
    }

    // Note: In production, you'd need to serialize/deserialize the condition function
    // For now, this is a simplified version
    leadScoringEngine.registerRule(rule)

    return NextResponse.json({
      success: true,
      data: rule
    }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to register scoring rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to register scoring rule'
      },
      { status: 500 }
    )
  }
}
