import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics, getFunnelData, getRevenueByMonth, getBusinessLines } from '@/lib/dashboard-data';

/**
 * GET /api/dashboard
 * Fetch dashboard metrics and data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessLine = searchParams.get('businessLine');
    const months = parseInt(searchParams.get('months') || '6');

    // Fetch all dashboard data in parallel
    const [metrics, funnelData, revenueData, businessLines] = await Promise.all([
      getDashboardMetrics(businessLine || undefined),
      getFunnelData(businessLine || undefined),
      getRevenueByMonth(businessLine || undefined, months),
      getBusinessLines(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        funnelData,
        revenueData,
        businessLines,
      },
    });

  } catch (error: any) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch dashboard data'
      },
      { status: 500 }
    );
  }
}
