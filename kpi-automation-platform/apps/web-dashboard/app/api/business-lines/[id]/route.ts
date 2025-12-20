import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@kpi/database'

// PATCH - 비즈니스 라인 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    const businessLine = await prisma.businessLine.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: businessLine,
    })
  } catch (error) {
    console.error('Failed to update business line:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update business line',
      },
      { status: 500 }
    )
  }
}

// DELETE - 비즈니스 라인 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 관련 데이터 확인
    const relatedData = await prisma.businessLine.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            leads: true,
            deals: true,
            meetings: true,
            platforms: true,
          },
        },
      },
    })

    if (relatedData && relatedData._count) {
      const total =
        relatedData._count.leads +
        relatedData._count.deals +
        relatedData._count.meetings +
        relatedData._count.platforms

      if (total > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete business line with existing data',
            details: relatedData._count,
          },
          { status: 400 }
        )
      }
    }

    await prisma.businessLine.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Failed to delete business line:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete business line',
      },
      { status: 500 }
    )
  }
}
