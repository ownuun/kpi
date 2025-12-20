import { NextRequest, NextResponse } from 'next/server';
import { workflowEngine } from '@kpi/automation';

/**
 * GET /api/pipeline
 * Fetch pipeline data (mock data for now)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLine = searchParams.get('businessLine');
    const stage = searchParams.get('stage');

    // Mock pipeline data
    const mockData = [
      {
        id: '1',
        name: '삼성전자',
        firstName: '홍',
        lastName: '길동',
        email: 'hong@samsung.com',
        company: '삼성전자',
        stage: 'qualified',
        value: 50000000,
        probability: 70,
        expectedCloseDate: '2025-01-15',
        businessLine: 'B2B',
      },
      {
        id: '2',
        name: 'LG전자',
        firstName: '김',
        lastName: '철수',
        email: 'kim@lg.com',
        company: 'LG전자',
        stage: 'proposal',
        value: 35000000,
        probability: 50,
        expectedCloseDate: '2025-01-20',
        businessLine: 'B2B',
      },
      {
        id: '3',
        name: '현대자동차',
        firstName: '이',
        lastName: '영희',
        email: 'lee@hyundai.com',
        company: '현대자동차',
        stage: 'negotiation',
        value: 80000000,
        probability: 80,
        expectedCloseDate: '2025-01-10',
        businessLine: 'ANYON',
      },
      {
        id: '4',
        name: 'SK하이닉스',
        firstName: '박',
        lastName: '민수',
        email: 'park@sk.com',
        company: 'SK하이닉스',
        stage: 'new',
        value: 45000000,
        probability: 30,
        expectedCloseDate: '2025-02-01',
        businessLine: '외주',
      },
    ];

    // Simple filtering
    let filteredData = mockData;
    if (businessLine) {
      filteredData = filteredData.filter(d => d.businessLine === businessLine);
    }
    if (stage) {
      filteredData = filteredData.filter(d => d.stage === stage);
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    });

  } catch (error: any) {
    console.error('Failed to fetch pipeline leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch leads'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pipeline
 * Create a new lead (mock for now)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      stage: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Trigger lead_created workflow automation
    try {
      await workflowEngine.trigger('lead_created', {
        leadId: newLead.id,
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        company: body.company,
        ...body
      });
      console.log('✅ Lead creation workflow triggered');
    } catch (workflowError) {
      console.error('⚠️ Workflow trigger failed (non-blocking):', workflowError);
    }

    return NextResponse.json({
      success: true,
      data: newLead
    }, { status: 201 });

  } catch (error: any) {
    console.error('Failed to create lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create lead'
      },
      { status: 500 }
    );
  }
}
