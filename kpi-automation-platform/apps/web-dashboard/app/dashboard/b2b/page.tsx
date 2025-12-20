import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@kpi/ui-components'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { PlatformStats } from '@/components/dashboard/PlatformStats'
import { BusinessLineSelector } from '@/components/dashboard/BusinessLineSelector'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'
import Navigation from '@/components/layout/Navigation'
import {
  getDashboardMetrics,
  getFunnelData,
  getRevenueByMonth,
  getPlatformStats,
} from '@/lib/dashboard-data'
import { prisma } from '@/lib/db'
import {
  DollarSign,
  Users,
  Handshake,
  Calendar,
  TrendingUp,
  Target,
  Building2,
  ArrowRight,
} from 'lucide-react'

export default async function B2BDashboardPage() {
  // Get B2B business line
  const b2bLine = await prisma.businessLine.findFirst({
    where: { name: 'B2B' },
  })

  if (!b2bLine) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            B2B business line not found
          </h2>
          <p className="text-gray-600">
            Please initialize the database with business line data.
          </p>
        </div>
      </div>
    )
  }

  const [metrics, funnelData, revenueData, platformStats] = await Promise.all([
    getDashboardMetrics(b2bLine.id),
    getFunnelData(b2bLine.id),
    getRevenueByMonth(b2bLine.id, 6),
    getPlatformStats(b2bLine.id),
  ])

  // Calculate target achievement
  const monthlyTarget = 80000000 // 80M KRW target for B2B
  const currentRevenue = metrics.totalRevenue
  const targetAchievement = monthlyTarget > 0 ? (currentRevenue / monthlyTarget) * 100 : 0

  return (
    <>
      <Navigation />
      <div className="space-y-8">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500 text-white">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">B2B Dashboard</h1>
            <p className="text-gray-600 mt-1">B2B 사업 라인 성과 분석</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <BusinessLineSelector />
        </div>
      </div>

      {/* Target Achievement Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Monthly Target Achievement
                </h3>
                <p className="text-sm text-gray-600">
                  Target: {new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                    maximumFractionDigits: 0,
                  }).format(monthlyTarget)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-green-600">
                {targetAchievement.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  maximumFractionDigits: 0,
                }).format(currentRevenue)}
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${Math.min(targetAchievement, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={18.7}
        />
        <MetricCard
          title="Active Leads"
          value={metrics.totalLeads}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          change={12.4}
        />
        <MetricCard
          title="Deals Closed"
          value={metrics.totalDeals}
          icon={<Handshake className="h-4 w-4" />}
          trend="up"
          change={22.1}
        />
        <MetricCard
          title="Meetings"
          value={metrics.totalMeetings}
          icon={<Calendar className="h-4 w-4" />}
          trend="up"
          change={9.3}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate.toFixed(1)}
          format="percentage"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          change={5.2}
        />
        <MetricCard
          title="Average Deal Size"
          value={metrics.averageDealSize}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={11.6}
        />
        <MetricCard
          title="Target Achievement"
          value={targetAchievement.toFixed(1)}
          format="percentage"
          icon={<Target className="h-4 w-4" />}
          trend={targetAchievement >= 100 ? 'up' : 'neutral'}
          change={targetAchievement >= 100 ? 8.4 : 1.2}
        />
      </div>

      {/* Charts with Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="funnel">Sales Funnel</TabsTrigger>
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueChart
            data={revenueData.map(item => ({
              ...item,
              target: monthlyTarget,
            }))}
            title="Revenue Trend - B2B"
            description="Last 6 months revenue vs target"
          />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FunnelChart
              stages={[
                { name: 'Marketing Posts', value: funnelData.promotion, color: 'bg-green-500' },
                { name: 'Website Visits', value: funnelData.visits, color: 'bg-emerald-500' },
                { name: 'Lead Inquiries', value: funnelData.inquiries, color: 'bg-teal-500' },
                { name: 'Meetings Held', value: funnelData.meetings, color: 'bg-cyan-500' },
                { name: 'Deals Closed', value: funnelData.deals, color: 'bg-sky-500' },
              ]}
              title="Sales Funnel - B2B"
            />

            {/* Funnel Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Funnel Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-gray-900">Enterprise Focus</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    B2B deals typically have longer sales cycles but higher average deal values.
                    Meeting to deal conversion: {' '}
                    {funnelData.meetings > 0
                      ? Math.round((funnelData.deals / funnelData.meetings) * 100)
                      : 0}%
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Lead Quality</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Higher quality leads result in better conversion rates. Focus on targeted
                    outreach and account-based marketing strategies.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Recommendation</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Strengthen post-meeting follow-ups and proposal quality to improve
                    close rates. Consider implementing automated nurture sequences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <PlatformStats
            data={platformStats}
            title="Platform Performance - B2B"
            description="Engagement and lead generation by platform"
          />
        </TabsContent>
      </Tabs>

      {/* Pipeline Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Qualification Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600 mt-1">Active opportunities</p>
            <p className="text-sm font-medium text-green-600 mt-2">
              Total value: 120M KRW
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proposal Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-600 mt-1">Pending proposals</p>
            <p className="text-sm font-medium text-green-600 mt-2">
              Total value: 95M KRW
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Negotiation Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600 mt-1">In negotiation</p>
            <p className="text-sm font-medium text-green-600 mt-2">
              Total value: 75M KRW
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Major deal won</p>
                <p className="text-sm text-gray-600">Enterprise SaaS contract - 25M KRW</p>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Proposal sent</p>
                <p className="text-sm text-gray-600">Custom integration package</p>
              </div>
              <span className="text-sm text-gray-500">3 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Demo scheduled</p>
                <p className="text-sm text-gray-600">Platform walkthrough for Fortune 500 client</p>
              </div>
              <span className="text-sm text-gray-500">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
