import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { CompanySchema } from '@/lib/validations/company';
import { z } from 'zod';

/**
 * GET /api/companies
 * List companies with optional filtering and search
 * 
 * Query parameters:
 * - search: Search in name
 * - industry: Filter by industry
 * - isIdealCustomer: Filter ideal customers (true/false)
 * - minEmployees: Minimum employee count
 * - maxEmployees: Maximum employee count
 * - limit: Number of results (default: 20, max: 100)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');
    const isIdealCustomer = searchParams.get('isIdealCustomer');
    const minEmployees = searchParams.get('minEmployees');
    const maxEmployees = searchParams.get('maxEmployees');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeLeads = searchParams.get('includeLeads') === 'true';

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (industry) {
      where.industry = industry;
    }

    if (isIdealCustomer !== null) {
      where.isIdealCustomer = isIdealCustomer === 'true';
    }

    if (minEmployees || maxEmployees) {
      where.employees = {};
      if (minEmployees) where.employees.gte = parseInt(minEmployees);
      if (maxEmployees) where.employees.lte = parseInt(maxEmployees);
    }

    // Get companies with optional lead count
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: includeLeads ? {
          leads: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
        } : undefined,
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies
 * Create a new company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CompanySchema.parse(body);

    // Check if company with same name already exists
    const existing = await prisma.company.findUnique({
      where: { name: validated.name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Company with this name already exists' },
        { status: 409 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: validated.name,
        domainUrl: validated.domainUrl,
        employees: validated.employees,
        linkedinUrl: validated.linkedinUrl,
        twitterUrl: validated.twitterUrl,
        city: validated.city,
        industry: validated.industry,
        annualRevenue: validated.annualRevenue,
        isIdealCustomer: validated.isIdealCustomer,
        position: validated.position,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
