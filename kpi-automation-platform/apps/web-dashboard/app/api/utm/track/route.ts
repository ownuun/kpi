import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const utmTrackingSchema = z.object({
  pageUrl: z.string().url('Invalid page URL'),
  visitorId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrerUrl: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  platformId: z.string().optional(),
  leadId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = utmTrackingSchema.parse(body)

    // Save to database - LandingVisit model
    const landingVisit = await prisma.landingVisit.create({
      data: {
        pageUrl: validatedData.pageUrl,
        visitorId: validatedData.visitorId,
        ipAddress: validatedData.ipAddress,
        userAgent: validatedData.userAgent,
        referrerUrl: validatedData.referrerUrl,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        utmTerm: validatedData.utmTerm,
        utmContent: validatedData.utmContent,
        platformId: validatedData.platformId,
        leadId: validatedData.leadId,
      },
    })

    return NextResponse.json(
      {
        success: true,
        visitId: landingVisit.id,
        message: 'UTM tracking data saved successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('UTM tracking error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track UTM visit',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignFilter = searchParams.get('campaign')
    const sourceFilter = searchParams.get('source')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (campaignFilter) {
      where.utmCampaign = campaignFilter
    }
    if (sourceFilter) {
      where.utmSource = sourceFilter
    }

    const visits = await prisma.landingVisit.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        pageUrl: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmTerm: true,
        utmContent: true,
        createdAt: true,
        converted: true,
        platform: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: visits,
        total: visits.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to fetch UTM tracking data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tracking data',
      },
      { status: 500 }
    )
  }
}
