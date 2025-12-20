import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { CompanyUpdateSchema } from '@/lib/validations/company';
import { z } from 'zod';

/**
 * GET /api/companies/[id]
 * Get a single company by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const includeLeads = request.nextUrl.searchParams.get('includeLeads') === 'true';

    const company = await prisma.company.findUnique({
      where: { id },
      include: includeLeads ? {
        leads: {
          orderBy: { createdAt: 'desc' },
        },
      } : undefined,
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/companies/[id]
 * Update a company
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = CompanyUpdateSchema.parse(body);

    // Check if company exists
    const existing = await prisma.company.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // If name is being updated, check for duplicates
    if (validated.name && validated.name !== existing.name) {
      const duplicate = await prisma.company.findUnique({
        where: { name: validated.name },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Company with this name already exists' },
          { status: 409 }
        );
      }
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.domainUrl !== undefined && { domainUrl: validated.domainUrl }),
        ...(validated.employees !== undefined && { employees: validated.employees }),
        ...(validated.linkedinUrl !== undefined && { linkedinUrl: validated.linkedinUrl }),
        ...(validated.twitterUrl !== undefined && { twitterUrl: validated.twitterUrl }),
        ...(validated.city !== undefined && { city: validated.city }),
        ...(validated.industry !== undefined && { industry: validated.industry }),
        ...(validated.annualRevenue !== undefined && { annualRevenue: validated.annualRevenue }),
        ...(validated.isIdealCustomer !== undefined && { isIdealCustomer: validated.isIdealCustomer }),
        ...(validated.position !== undefined && { position: validated.position }),
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/companies/[id]
 * Delete a company
 * 
 * Prevents deletion if company has associated leads
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if company has leads
    if (company._count.leads > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete company with associated leads',
          leadCount: company._count.leads,
        },
        { status: 409 }
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Company deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
