'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface BusinessLine {
  id: string;
  name: string;
  color?: string;
}

interface FunnelMetrics {
  snsViews: number;
  landingVisits: number;
  leads: number;
  meetings: number;
  deals: number;
  wonDeals: number;
}

interface ConversionRates {
  snsToLanding: number;
  landingToLead: number;
  leadToMeeting: number;
  meetingToDeal: number;
  dealToWon: number;
}

interface SnsPerformance {
  platform: string;
  views: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

interface RecentDeal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  createdAt: string;
  leadName: string;
}

interface RevenueData {
  total: number;
  target: number;
  percentage: number;
  byBusinessLine: Array<{
    name: string;
    amount: number;
    color?: string;
  }>;
}

export default function AnalyticsPage() {
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<string>('all');
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
  const [conversionRates, setConversionRates] = useState<ConversionRates | null>(null);
  const [snsPerformance, setSnsPerformance] = useState<SnsPerformance[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [dateRange, setDateRange] = useState<string>('30'); // days
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch business lines
        const blResponse = await fetch('/api/business-lines');
        const blData = await blResponse.json();
        setBusinessLines(blData);

        // Fetch analytics data based on filters
        const params = new URLSearchParams({
          businessLine: selectedBusinessLine,
          dateRange: dateRange,
        });

        const [funnelRes, conversionRes, snsRes, sourcesRes, dealsRes, revenueRes] = await Promise.all([
          fetch(`/api/analytics/funnel?${params}`),
          fetch(`/api/analytics/conversion-rates?${params}`),
          fetch(`/api/analytics/sns-performance?${params}`),
          fetch(`/api/analytics/lead-sources?${params}`),
          fetch(`/api/analytics/recent-deals?${params}`),
          fetch(`/api/analytics/revenue?${params}`),
        ]);

        setFunnelMetrics(await funnelRes.json());
        setConversionRates(await conversionRes.json());
        setSnsPerformance(await snsRes.json());
        setLeadSources(await sourcesRes.json());
        setRecentDeals(await dealsRes.json());
        setRevenueData(await revenueRes.json());
      } catch (error) {
        console.error('Error fetching analytics data:', error);
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
          <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
          <p className="mt-2 text-zinc-600">
            Track your KPIs and performance metrics across all business lines
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
              {businessLines.map((bl) => (
                <option key={bl.id} value={bl.id}>
                  {bl.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="dateRange" className="text-sm font-medium text-zinc-700">
              Date Range:
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-600">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* Revenue Progress */}
            {revenueData && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                  Revenue Progress (Goal: ₩30,000,000)
                </h2>
                <div className="mb-2 flex items-end justify-between">
                  <div className="text-3xl font-bold text-zinc-900">
                    ₩{revenueData.total.toLocaleString()}
                  </div>
                  <div className="text-lg text-zinc-600">
                    {revenueData.percentage.toFixed(1)}% of goal
                  </div>
                </div>
                <div className="mb-4 h-4 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${Math.min(revenueData.percentage, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {revenueData.byBusinessLine.map((bl) => (
                    <div key={bl.name} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600">{bl.name}</span>
                      <span className="font-medium text-zinc-900">
                        ₩{bl.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link
                href="/analytics/funnel"
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">Funnel Analysis</h3>
                <p className="text-sm text-zinc-600">
                  Detailed conversion analysis and drop-off rates
                </p>
              </Link>
              <Link
                href="/analytics/revenue"
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">Revenue Dashboard</h3>
                <p className="text-sm text-zinc-600">
                  Monthly trends, forecasting, and payment tracking
                </p>
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_METABASE_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">Metabase</h3>
                <p className="text-sm text-zinc-600">
                  Advanced visualizations and custom reports
                </p>
              </a>
            </div>

            {/* Funnel Visualization */}
            {funnelMetrics && conversionRates && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                  Full Funnel Overview
                </h2>
                <div className="space-y-4">
                  <FunnelStage
                    name="SNS Views"
                    count={funnelMetrics.snsViews}
                    nextRate={conversionRates.snsToLanding}
                    percentage={100}
                  />
                  <FunnelStage
                    name="Landing Visits"
                    count={funnelMetrics.landingVisits}
                    nextRate={conversionRates.landingToLead}
                    percentage={(funnelMetrics.landingVisits / funnelMetrics.snsViews) * 100}
                  />
                  <FunnelStage
                    name="Leads"
                    count={funnelMetrics.leads}
                    nextRate={conversionRates.leadToMeeting}
                    percentage={(funnelMetrics.leads / funnelMetrics.snsViews) * 100}
                  />
                  <FunnelStage
                    name="Meetings"
                    count={funnelMetrics.meetings}
                    nextRate={conversionRates.meetingToDeal}
                    percentage={(funnelMetrics.meetings / funnelMetrics.snsViews) * 100}
                  />
                  <FunnelStage
                    name="Deals"
                    count={funnelMetrics.deals}
                    nextRate={conversionRates.dealToWon}
                    percentage={(funnelMetrics.deals / funnelMetrics.snsViews) * 100}
                  />
                  <FunnelStage
                    name="Won Deals"
                    count={funnelMetrics.wonDeals}
                    percentage={(funnelMetrics.wonDeals / funnelMetrics.snsViews) * 100}
                    isLast
                  />
                </div>
              </div>
            )}

            {/* SNS Performance & Lead Sources */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* SNS Performance */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                  Top Performing SNS Platforms
                </h2>
                <div className="space-y-3">
                  {snsPerformance.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-zinc-900 capitalize">
                            {platform.platform}
                          </span>
                          <span className="text-sm text-zinc-600">
                            {platform.ctr.toFixed(2)}% CTR
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500">
                          {platform.views.toLocaleString()} views · {platform.clicks.toLocaleString()} clicks · {platform.conversions} conversions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Sources */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">Lead Source Breakdown</h2>
                <div className="space-y-3">
                  {leadSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-zinc-900">{source.source}</span>
                          <span className="text-sm text-zinc-600">
                            {source.count} ({source.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Deals Timeline */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">Recent Deals</h2>
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-zinc-900">{deal.name}</div>
                      <div className="text-sm text-zinc-500">
                        {deal.leadName} · {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-zinc-900">
                        ₩{deal.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-zinc-500">{deal.stage}</div>
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

// Funnel Stage Component
function FunnelStage({
  name,
  count,
  nextRate,
  percentage,
  isLast = false,
}: {
  name: string;
  count: number;
  nextRate?: number;
  percentage: number;
  isLast?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-zinc-900">{name}</span>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-zinc-900">{count.toLocaleString()}</span>
              <span className="text-sm text-zinc-500">({percentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
      {!isLast && nextRate !== undefined && (
        <div className="ml-4 mt-2 text-sm text-zinc-600">
          ↓ {nextRate.toFixed(1)}% conversion rate
        </div>
      )}
    </div>
  );
}
