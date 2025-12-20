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
  BriefcaseBusiness,
  ArrowRight,
} from 'lucide-react'

export default async function OutsourcingDashboardPage() {
  // Get outsourcing business line
  const outsourcingLine = await prisma.businessLine.findFirst({
    where: { name: '외주' },
  })

  if (!outsourcingLine) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Outsourcing business line not found
          </h2>
          <p className="text-gray-600">
            Please initialize the database with business line data.
          </p>
        </div>
      </div>
    )
  }

  const [metrics, funnelData, revenueData, platformStats] = await Promise.all([
    getDashboardMetrics(outsourcingLine.id),
    getFunnelData(outsourcingLine.id),
    getRevenueByMonth(outsourcingLine.id, 6),
    getPlatformStats(outsourcingLine.id),
  ])

  // Calculate target achievement
  const monthlyTarget = 50000000 // 50M KRW target
  const currentRevenue = metrics.totalRevenue
  const targetAchievement = monthlyTarget > 0 ? (currentRevenue / monthlyTarget) * 100 : 0

  return (
    <>
      <Navigation />
      <div className="space-y-8">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500 text-white">
            <BriefcaseBusiness className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Outsourcing Dashboard</h1>
            <p className="text-gray-600 mt-1">외주 사업 라인 성과 분석</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <BusinessLineSelector />
        </div>
      </div>

      {/* Target Achievement Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="h-12 w-12 text-blue-600" />
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
              <p className="text-4xl font-bold text-blue-600">
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
          <div className="mt-4 h-3 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
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
          change={12.5}
        />
        <MetricCard
          title="Active Leads"
          value={metrics.totalLeads}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          change={8.2}
        />
        <MetricCard
          title="Deals Closed"
          value={metrics.totalDeals}
          icon={<Handshake className="h-4 w-4" />}
          trend="up"
          change={15.3}
        />
        <MetricCard
          title="Meetings"
          value={metrics.totalMeetings}
          icon={<Calendar className="h-4 w-4" />}
          trend="neutral"
          change={2.1}
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
          change={3.5}
        />
        <MetricCard
          title="Average Deal Size"
          value={metrics.averageDealSize}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={7.8}
        />
        <MetricCard
          title="Target Achievement"
          value={targetAchievement.toFixed(1)}
          format="percentage"
          icon={<Target className="h-4 w-4" />}
          trend={targetAchievement >= 100 ? 'up' : 'down'}
          change={targetAchievement >= 100 ? 5.2 : -2.3}
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
            title="Revenue Trend - Outsourcing"
            description="Last 6 months revenue vs target"
          />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FunnelChart
              stages={[
                { name: 'Promotion Posts', value: funnelData.promotion, color: 'bg-blue-500' },
                { name: 'Website Visits', value: funnelData.visits, color: 'bg-indigo-500' },
                { name: 'Lead Inquiries', value: funnelData.inquiries, color: 'bg-purple-500' },
                { name: 'Meetings Held', value: funnelData.meetings, color: 'bg-pink-500' },
                { name: 'Deals Closed', value: funnelData.deals, color: 'bg-rose-500' },
              ]}
              title="Sales Funnel - Outsourcing"
            />

            {/* Funnel Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Funnel Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Best Performing Stage</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Inquiry to Meeting conversion rate is highest at{' '}
                    {funnelData.inquiries > 0
                      ? Math.round((funnelData.meetings / funnelData.inquiries) * 100)
                      : 0}%
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                    <h4 className="font-medium text-gray-900">Needs Improvement</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Visit to Inquiry conversion needs optimization. Current rate:{' '}
                    {funnelData.visits > 0
                      ? Math.round((funnelData.inquiries / funnelData.visits) * 100)
                      : 0}%
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-gray-900">Recommendation</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Focus on improving landing page quality and CTA effectiveness to boost
                    visit-to-inquiry conversion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <PlatformStats
            data={platformStats}
            title="Platform Performance - Outsourcing"
            description="Engagement and lead generation by platform"
          />
        </TabsContent>
      </Tabs>

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
                <p className="font-medium text-gray-900">New deal closed</p>
                <p className="text-sm text-gray-600">Enterprise client - 15M KRW</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Meeting scheduled</p>
                <p className="text-sm text-gray-600">Discovery call with potential client</p>
              </div>
              <span className="text-sm text-gray-500">5 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New lead generated</p>
                <p className="text-sm text-gray-600">From LinkedIn campaign</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
