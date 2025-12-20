import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const LeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  additionalEmails: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  jobTitle: z.string().optional(),
  city: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  intro: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).default('NEW'),
  companyId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LeadSchema.parse(body);

    // Check if email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email: validated.email }
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'Lead with this email already exists', leadId: existingLead.id },
        { status: 409 }
      );
    }

    // If companyId is provided, verify it exists
    if (validated.companyId) {
      const companyExists = await prisma.company.findUnique({
        where: { id: validated.companyId }
      });

      if (!companyExists) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
    }

    const lead = await prisma.lead.create({
      data: validated,
      include: {
        company: true
      }
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Leads] Validation error:', error.errors);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
          fields: error.errors.map(e => e.path.join('.'))
        },
        { status: 400 }
      );
    }
    console.error('[Leads] Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const leads = await prisma.lead.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(source && { source }),
        ...(search && {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
            { jobTitle: { contains: search } },
          ]
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          }
        }
      }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
