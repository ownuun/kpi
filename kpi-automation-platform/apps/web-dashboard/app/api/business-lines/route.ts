import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@kpi/database'

// GET - 모든 비즈니스 라인 조회
export async function GET(request: NextRequest) {
  try {
    const businessLines = await prisma.businessLine.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: businessLines,
    })
  } catch (error) {
    console.error('Failed to fetch business lines:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch business lines',
      },
      { status: 500 }
    )
  }
}

// POST - 새 비즈니스 라인 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, color } = body

    // 이름 중복 체크
    const existing = await prisma.businessLine.findUnique({
      where: { name },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Business line with this name already exists',
        },
        { status: 400 }
      )
    }

    const businessLine = await prisma.businessLine.create({
      data: {
        name,
        displayName,
        description: description || null,
        color: color || null,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: businessLine,
    })
  } catch (error) {
    console.error('Failed to create business line:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create business line',
      },
      { status: 500 }
    )
  }
}
