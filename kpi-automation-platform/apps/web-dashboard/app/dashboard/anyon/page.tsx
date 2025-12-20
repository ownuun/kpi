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
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react'

export default async function AnyonDashboardPage() {
  // Get ANYON business line
  const anyonLine = await prisma.businessLine.findFirst({
    where: { name: 'ANYON' },
  })

  if (!anyonLine) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ANYON business line not found
          </h2>
          <p className="text-gray-600">
            Please initialize the database with business line data.
          </p>
        </div>
      </div>
    )
  }

  const [metrics, funnelData, revenueData, platformStats] = await Promise.all([
    getDashboardMetrics(anyonLine.id),
    getFunnelData(anyonLine.id),
    getRevenueByMonth(anyonLine.id, 6),
    getPlatformStats(anyonLine.id),
  ])

  // Calculate target achievement
  const monthlyTarget = 30000000 // 30M KRW target for ANYON
  const currentRevenue = metrics.totalRevenue
  const targetAchievement = monthlyTarget > 0 ? (currentRevenue / monthlyTarget) * 100 : 0

  // Calculate growth metrics
  const monthOverMonthGrowth = 24.5 // Mock data
  const yearOverYearGrowth = 180.3 // Mock data

  return (
    <>
      <Navigation />
      <div className="space-y-8">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ANYON Dashboard</h1>
            <p className="text-gray-600 mt-1">ANYON 사업 라인 성과 분석</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <BusinessLineSelector />
        </div>
      </div>

      {/* Target Achievement Banner */}
      <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="h-12 w-12 text-purple-600" />
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
              <p className="text-4xl font-bold text-purple-600">
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
          <div className="mt-4 h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${Math.min(targetAchievement, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Growth Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-12 w-12" />
              <div>
                <p className="text-sm opacity-90">Month-over-Month Growth</p>
                <p className="text-4xl font-bold">{monthOverMonthGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-12 w-12" />
              <div>
                <p className="text-sm opacity-90">Year-over-Year Growth</p>
                <p className="text-4xl font-bold">{yearOverYearGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={24.5}
        />
        <MetricCard
          title="Active Leads"
          value={metrics.totalLeads}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          change={32.8}
        />
        <MetricCard
          title="Deals Closed"
          value={metrics.totalDeals}
          icon={<Handshake className="h-4 w-4" />}
          trend="up"
          change={28.6}
        />
        <MetricCard
          title="Meetings"
          value={metrics.totalMeetings}
          icon={<Calendar className="h-4 w-4" />}
          trend="up"
          change={15.4}
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
          change={6.7}
        />
        <MetricCard
          title="Average Deal Size"
          value={metrics.averageDealSize}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={14.2}
        />
        <MetricCard
          title="Target Achievement"
          value={targetAchievement.toFixed(1)}
          format="percentage"
          icon={<Target className="h-4 w-4" />}
          trend={targetAchievement >= 100 ? 'up' : 'neutral'}
          change={targetAchievement >= 100 ? 12.3 : 4.8}
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
            title="Revenue Trend - ANYON"
            description="Last 6 months revenue vs target"
          />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FunnelChart
              stages={[
                { name: 'Content Posted', value: funnelData.promotion, color: 'bg-purple-500' },
                { name: 'Website Visits', value: funnelData.visits, color: 'bg-pink-500' },
                { name: 'Lead Inquiries', value: funnelData.inquiries, color: 'bg-rose-500' },
                { name: 'Meetings Held', value: funnelData.meetings, color: 'bg-red-500' },
                { name: 'Deals Closed', value: funnelData.deals, color: 'bg-orange-500' },
              ]}
              title="Sales Funnel - ANYON"
            />

            {/* Funnel Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Funnel Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Viral Growth Potential</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    ANYON shows strong organic growth patterns. Social media engagement
                    drives {' '}
                    {funnelData.promotion > 0
                      ? Math.round((funnelData.visits / funnelData.promotion) * 100)
                      : 0}% more traffic than industry average.
                  </p>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-pink-600" />
                    <h4 className="font-medium text-gray-900">Strong Momentum</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Month-over-month growth of 24.5% indicates strong market fit and
                    effective marketing strategies. Keep focusing on community building.
                  </p>
                </div>

                <div className="p-4 bg-rose-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-rose-600" />
                    <h4 className="font-medium text-gray-900">Optimization Opportunity</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Invest in content marketing and community engagement to amplify
                    word-of-mouth growth. Consider referral programs to boost viral coefficient.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <PlatformStats
            data={platformStats}
            title="Platform Performance - ANYON"
            description="Engagement and lead generation by platform"
          />
        </TabsContent>
      </Tabs>

      {/* Product Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Product Adoption Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">1,234</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
              <p className="text-xs text-green-600 mt-1">+18% this month</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-3xl font-bold text-pink-600">87%</p>
              <p className="text-sm text-gray-600 mt-1">User Satisfaction</p>
              <p className="text-xs text-green-600 mt-1">+5% this month</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <p className="text-3xl font-bold text-rose-600">4.2</p>
              <p className="text-sm text-gray-600 mt-1">NPS Score</p>
              <p className="text-xs text-green-600 mt-1">+0.3 this month</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">92%</p>
              <p className="text-sm text-gray-600 mt-1">Retention Rate</p>
              <p className="text-xs text-green-600 mt-1">+2% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New feature launched</p>
                <p className="text-sm text-gray-600">AI-powered content recommendations</p>
              </div>
              <span className="text-sm text-gray-500">30 mins ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Viral campaign success</p>
                <p className="text-sm text-gray-600">Instagram post reached 50K+ impressions</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Partnership deal closed</p>
                <p className="text-sm text-gray-600">Strategic partnership with major platform</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Product update deployed</p>
                <p className="text-sm text-gray-600">Version 2.1 with performance improvements</p>
              </div>
              <span className="text-sm text-gray-500">8 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
