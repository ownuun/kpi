import { NextRequest, NextResponse } from 'next/server'
import { leadScoringEngine, createLead } from '@kpi/automation'

/**
 * POST /api/leads/score
 * Calculate or update lead score
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead, action, context } = body

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead data is required'
        },
        { status: 400 }
      )
    }

    // If action is provided, apply specific scoring rule
    if (action) {
      const ruleApplied = leadScoringEngine.applyRule(
        lead,
        action,
        context
      )

      return NextResponse.json({
        success: true,
        data: {
          lead,
          ruleApplied,
          action
        }
      })
    }

    // Otherwise, calculate full score
    const newScore = leadScoringEngine.calculateScore(lead, context)

    return NextResponse.json({
      success: true,
      data: {
        lead,
        score: newScore
      }
    })
  } catch (error: any) {
    console.error('Failed to calculate lead score:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to calculate lead score'
      },
      { status: 500 }
    )
  }
}
