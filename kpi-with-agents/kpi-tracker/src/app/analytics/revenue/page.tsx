'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface MonthlyRevenue {
  month: string;
  revenue: number;
  deals: number;
  avgDealSize: number;
}

interface BusinessLineRevenue {
  businessLine: string;
  revenue: number;
  percentage: number;
  deals: number;
  color?: string;
}

interface PaymentStatus {
  status: string;
  count: number;
  amount: number;
  deals: Array<{
    id: string;
    name: string;
    amount: number;
    expectedDate?: string;
    confirmedDate?: string;
  }>;
}

interface ForecastData {
  month: string;
  projected: number;
  pipelineValue: number;
  confidence: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  avgDealSize: number;
  revenueTarget: number;
  targetProgress: number;
}

export default function RevenueDashboardPage() {
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('12'); // months
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [businessLineRevenue, setBusinessLineRevenue] = useState<BusinessLineRevenue[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          businessLine: selectedBusinessLine,
          dateRange: dateRange,
        });

        const [monthlyRes, blRes, paymentRes, forecastRes, metricsRes] = await Promise.all([
          fetch(`/api/analytics/revenue/monthly?${params}`),
          fetch(`/api/analytics/revenue/by-business-line?${params}`),
          fetch(`/api/analytics/revenue/payment-status?${params}`),
          fetch(`/api/analytics/revenue/forecast?${params}`),
          fetch(`/api/analytics/revenue/metrics?${params}`),
        ]);

        setMonthlyRevenue(await monthlyRes.json());
        setBusinessLineRevenue(await blRes.json());
        setPaymentStatus(await paymentRes.json());
        setForecast(await forecastRes.json());
        setMetrics(await metricsRes.json());
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBusinessLine, dateRange]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/analytics"
            className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Analytics
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Revenue Dashboard</h1>
          <p className="mt-2 text-zinc-600">
            Track revenue trends, forecasts, and payment status
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="businessLine" className="text-sm font-medium text-zinc-700">
              Business Line:
            </label>
            <select
              id="businessLine"
              value={selectedBusinessLine}
              onChange={(e) => setSelectedBusinessLine(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="outsourcing">외주</option>
              <option value="b2b">B2B</option>
              <option value="anyon">ANYON</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="dateRange" className="text-sm font-medium text-zinc-700">
              Time Period:
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
              <option value="24">Last 2 years</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-600">Loading revenue data...</div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            {metrics && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <MetricCard
                  title="Total Revenue"
                  value={`₩${(metrics.totalRevenue / 1000000).toFixed(1)}M`}
                  description={`${metrics.targetProgress.toFixed(1)}% of ₩${(metrics.revenueTarget / 1000000)}M goal`}
                  trend={metrics.monthlyGrowth > 0 ? 'up' : 'down'}
                  trendValue={`${Math.abs(metrics.monthlyGrowth).toFixed(1)}%`}
                />
                <MetricCard
                  title="Monthly Growth"
                  value={`${metrics.monthlyGrowth > 0 ? '+' : ''}${metrics.monthlyGrowth.toFixed(1)}%`}
                  description="vs previous month"
                  trend={metrics.monthlyGrowth > 0 ? 'up' : 'down'}
                />
                <MetricCard
                  title="Avg Deal Size"
                  value={`₩${(metrics.avgDealSize / 1000000).toFixed(2)}M`}
                  description="Per closed deal"
                />
                <MetricCard
                  title="Target Progress"
                  value={`${metrics.targetProgress.toFixed(0)}%`}
                  description="of ₩30M goal"
                  trend={metrics.targetProgress > 50 ? 'up' : undefined}
                />
              </div>
            )}

            {/* Monthly Revenue Chart */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                Monthly Revenue Trend
              </h2>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));
                  const width = (month.revenue / maxRevenue) * 100;

                  return (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-700">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-500">{month.deals} deals</span>
                          <span className="font-semibold text-zinc-900">
                            ₩{(month.revenue / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                      <div className="h-8 w-full overflow-hidden rounded-lg bg-zinc-100">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="text-xs text-zinc-500">
                        Avg: ₩{(month.avgDealSize / 1000).toFixed(0)}K
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue by Business Line & Forecast */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Revenue by Business Line */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                  Revenue by Business Line
                </h2>
                <div className="space-y-4">
                  {businessLineRevenue.map((bl) => (
                    <div key={bl.businessLine} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-zinc-900">{bl.businessLine}</div>
                          <div className="text-xs text-zinc-500">{bl.deals} deals</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-zinc-900">
                            ₩{(bl.revenue / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-zinc-500">
                            {bl.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bl.percentage}%`,
                            backgroundColor: bl.color || '#3b82f6',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Forecast */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                  Revenue Forecast
                </h2>
                <p className="mb-4 text-sm text-zinc-600">
                  Based on current pipeline and historical conversion rates
                </p>
                <div className="space-y-4">
                  {forecast.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-700">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-zinc-500">
                            {month.confidence}% confidence
                          </span>
                          <span className="font-semibold text-blue-600">
                            ₩{(month.projected / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                      <div className="relative h-6 w-full overflow-hidden rounded-lg bg-zinc-100">
                        <div
                          className="absolute h-full bg-blue-200"
                          style={{
                            width: `${(month.pipelineValue / month.projected) * 100}%`,
                          }}
                        />
                        <div
                          className="absolute h-full bg-blue-600"
                          style={{
                            width: `${Math.min((month.projected / (month.pipelineValue || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Pipeline: ₩{(month.pipelineValue / 1000000).toFixed(2)}M</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Status Tracking */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Payment Status Tracking
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {paymentStatus.map((status) => (
                  <div key={status.status} className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                      <div>
                        <div className="text-sm font-medium text-zinc-700">
                          {status.status === 'confirmed' ? '입금 완료' : '입금 대기'}
                        </div>
                        <div className="text-xs text-zinc-500">{status.count} deals</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-zinc-900">
                          ₩{(status.amount / 1000000).toFixed(2)}M
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {status.deals.map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between rounded border border-zinc-200 p-3"
                        >
                          <div>
                            <div className="text-sm font-medium text-zinc-900">
                              {deal.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {status.status === 'confirmed'
                                ? `Paid: ${deal.confirmedDate ? new Date(deal.confirmedDate).toLocaleDateString() : 'N/A'}`
                                : `Expected: ${deal.expectedDate ? new Date(deal.expectedDate).toLocaleDateString() : 'TBD'}`}
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${status.status === 'confirmed' ? 'text-green-600' : 'text-orange-600'}`}
                          >
                            ₩{(deal.amount / 1000).toFixed(0)}K
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  description,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-sm font-medium text-zinc-600">{title}</div>
      <div className="mb-1 flex items-baseline gap-2">
        <div className="text-3xl font-bold text-zinc-900">{value}</div>
        {trend && trendValue && (
          <span
            className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div className="text-sm text-zinc-500">{description}</div>
    </div>
  );
}
