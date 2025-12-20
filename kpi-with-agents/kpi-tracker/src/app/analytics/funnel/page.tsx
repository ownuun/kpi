'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface FunnelStageData {
  stage: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
  dropOffCount: number;
  avgTimeToConvert: number; // in hours
}

interface TimeToConvertData {
  stage: string;
  avgHours: number;
  minHours: number;
  maxHours: number;
  median: number;
}

interface DropOffAnalysis {
  stage: string;
  dropOffCount: number;
  dropOffRate: number;
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

export default function FunnelAnalysisPage() {
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [funnelData, setFunnelData] = useState<FunnelStageData[]>([]);
  const [timeToConvert, setTimeToConvert] = useState<TimeToConvertData[]>([]);
  const [dropOffAnalysis, setDropOffAnalysis] = useState<DropOffAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          businessLine: selectedBusinessLine,
          dateRange: dateRange,
        });

        const [funnelRes, timeRes, dropOffRes] = await Promise.all([
          fetch(`/api/analytics/funnel-stages?${params}`),
          fetch(`/api/analytics/time-to-convert?${params}`),
          fetch(`/api/analytics/drop-off?${params}`),
        ]);

        setFunnelData(await funnelRes.json());
        setTimeToConvert(await timeRes.json());
        setDropOffAnalysis(await dropOffRes.json());
      } catch (error) {
        console.error('Error fetching funnel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBusinessLine, dateRange]);

  const overallConversionRate = funnelData.length > 0
    ? ((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(2)
    : '0.00';

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
          <h1 className="text-3xl font-bold text-zinc-900">Funnel Analysis</h1>
          <p className="mt-2 text-zinc-600">
            Detailed conversion tracking and drop-off analysis
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
            <div className="text-zinc-600">Loading funnel analysis...</div>
          </div>
        ) : (
          <>
            {/* Overall Metrics */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard
                title="Overall Conversion Rate"
                value={`${overallConversionRate}%`}
                description="From SNS to Won Deal"
                trend="up"
              />
              <MetricCard
                title="Total Leads"
                value={funnelData.find((s) => s.stage === 'Leads')?.count.toLocaleString() || '0'}
                description="In selected period"
              />
              <MetricCard
                title="Avg. Time to Close"
                value={`${timeToConvert.find((t) => t.stage === 'Deal to Won')?.avgHours.toFixed(1) || 0}h`}
                description="From deal to won"
              />
            </div>

            {/* Step-by-Step Conversion */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                Step-by-Step Conversion Rates
              </h2>
              <div className="space-y-6">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900">{stage.stage}</div>
                            <div className="text-sm text-zinc-500">
                              {stage.count.toLocaleString()} users
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {index > 0 && (
                          <div className="mb-1 text-2xl font-bold text-zinc-900">
                            {stage.conversionRate.toFixed(1)}%
                          </div>
                        )}
                        {stage.dropOffRate > 0 && (
                          <div className="text-sm text-red-600">
                            -{stage.dropOffRate.toFixed(1)}% drop-off
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual bar */}
                    <div className="ml-14 mt-2">
                      <div className="h-8 w-full overflow-hidden rounded-lg bg-zinc-100">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{
                            width: `${(stage.count / funnelData[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Conversion arrow */}
                    {index < funnelData.length - 1 && (
                      <div className="ml-14 mt-3 flex items-center gap-2 text-sm text-zinc-600">
                        <span>↓</span>
                        <span>
                          {stage.conversionRate.toFixed(1)}% convert to next stage
                        </span>
                        <span className="text-zinc-400">
                          ({stage.dropOffCount.toLocaleString()} drop off)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time to Convert Metrics */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Time to Convert Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="pb-3 text-left text-sm font-semibold text-zinc-900">
                        Stage Transition
                      </th>
                      <th className="pb-3 text-right text-sm font-semibold text-zinc-900">
                        Average Time
                      </th>
                      <th className="pb-3 text-right text-sm font-semibold text-zinc-900">
                        Median
                      </th>
                      <th className="pb-3 text-right text-sm font-semibold text-zinc-900">
                        Min
                      </th>
                      <th className="pb-3 text-right text-sm font-semibold text-zinc-900">
                        Max
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeToConvert.map((time) => (
                      <tr key={time.stage} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 text-sm text-zinc-900">{time.stage}</td>
                        <td className="py-3 text-right text-sm font-medium text-zinc-900">
                          {formatTime(time.avgHours)}
                        </td>
                        <td className="py-3 text-right text-sm text-zinc-600">
                          {formatTime(time.median)}
                        </td>
                        <td className="py-3 text-right text-sm text-zinc-600">
                          {formatTime(time.minHours)}
                        </td>
                        <td className="py-3 text-right text-sm text-zinc-600">
                          {formatTime(time.maxHours)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Drop-off Analysis */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">Drop-off Analysis</h2>
              <div className="space-y-6">
                {dropOffAnalysis.map((analysis) => (
                  <div key={analysis.stage} className="border-b border-zinc-100 pb-6 last:border-0">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900">{analysis.stage}</h3>
                      <div className="text-sm text-zinc-600">
                        {analysis.dropOffCount.toLocaleString()} users ({analysis.dropOffRate.toFixed(1)}%)
                      </div>
                    </div>
                    {analysis.reasons.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-zinc-700">Top Reasons:</div>
                        {analysis.reasons.map((reason) => (
                          <div key={reason.reason} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-zinc-700">{reason.reason}</span>
                                <span className="text-zinc-500">
                                  {reason.count} ({reason.percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                                <div
                                  className="h-full rounded-full bg-red-500"
                                  style={{ width: `${reason.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
}: {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-sm font-medium text-zinc-600">{title}</div>
      <div className="mb-1 flex items-baseline gap-2">
        <div className="text-3xl font-bold text-zinc-900">{value}</div>
        {trend && (
          <span
            className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="text-sm text-zinc-500">{description}</div>
    </div>
  );
}

// Helper function to format time
function formatTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours.toFixed(0)}h` : `${days}d`;
  }
}
