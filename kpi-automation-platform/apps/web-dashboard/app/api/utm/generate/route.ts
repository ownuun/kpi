import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const utmGenerateSchema = z.object({
  baseUrl: z.string().url('Invalid base URL'),
  source: z.string().min(1, 'UTM source is required'),
  medium: z.string().min(1, 'UTM medium is required'),
  campaign: z.string().min(1, 'Campaign name is required'),
  term: z.string().optional(),
  content: z.string().optional(),
  businessLineId: z.string().optional(),
  platformId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = utmGenerateSchema.parse(body)

    // Generate the UTM URL
    const params = new URLSearchParams()
    params.append('utm_source', validatedData.source)
    params.append('utm_medium', validatedData.medium)
    params.append('utm_campaign', validatedData.campaign)

    if (validatedData.term) {
      params.append('utm_term', validatedData.term)
    }
    if (validatedData.content) {
      params.append('utm_content', validatedData.content)
    }

    const url = new URL(validatedData.baseUrl)
    url.search = params.toString()
    const generatedUrl = url.toString()

    // Optional: Save to database if platformId is provided
    if (validatedData.platformId) {
      try {
        // This would save the visit tracking in the LandingVisit model
        // For now, just log that it could be saved
        console.log(
          'UTM link generated for platform:',
          validatedData.platformId,
          generatedUrl
        )
      } catch (error) {
        console.error('Failed to save UTM tracking:', error)
        // Don't fail the request if database save fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        url: generatedUrl,
        parameters: {
          utm_source: validatedData.source,
          utm_medium: validatedData.medium,
          utm_campaign: validatedData.campaign,
          utm_term: validatedData.term || null,
          utm_content: validatedData.content || null,
        },
        metadata: {
          urlLength: generatedUrl.length,
          generatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
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

    console.error('UTM generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate UTM link',
      },
      { status: 500 }
    )
  }
}
