'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@kpi/ui-components'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { BusinessLineSelector } from '@/components/dashboard/BusinessLineSelector'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  DollarSign,
  Users,
  Handshake,
  Calendar,
  TrendingUp,
  Building2,
  BriefcaseBusiness,
  Sparkles,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { t } = useLanguage()
  const [metrics, setMetrics] = useState<any>(null)
  const [funnelData, setFunnelData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [businessLines, setBusinessLines] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();

        if (result.success) {
          setMetrics(result.data.metrics);
          setFunnelData(result.data.funnelData);
          setRevenueData(result.data.revenueData);
          setBusinessLines(result.data.businessLines);
        } else {
          console.error('Failed to fetch dashboard data:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }
    loadData()
  }, [])

  if (!metrics) return <div className="flex items-center justify-center h-screen">{t('로딩 중...', 'Loading...')}</div>

  // Business line cards will be generated from database data

  return (
    <div className="space-y-8">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('대시보드', 'Dashboard')}</h1>
          <p className="text-gray-600 mt-1">
            {t('KPI 자동화 플랫폼에 오신 것을 환영합니다', 'Welcome to your KPI automation platform')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <BusinessLineSelector />
        </div>
      </div>

      {/* Business Line Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessLineCards.map((line) => (
          <Link key={line.name} href={line.path}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${line.color} text-white`}>
                      {line.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{line.displayName}</CardTitle>
                      <p className="text-sm text-gray-600">{line.name}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {t('상세 보기', 'View Details')}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('총 매출', 'Total Revenue')}
          value={metrics.totalRevenue}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={12.5}
        />
        <MetricCard
          title={t('총 리드', 'Total Leads')}
          value={metrics.totalLeads}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          change={8.2}
        />
        <MetricCard
          title={t('성사된 거래', 'Deals Closed')}
          value={metrics.totalDeals}
          icon={<Handshake className="h-4 w-4" />}
          trend="up"
          change={15.3}
        />
        <MetricCard
          title={t('미팅', 'Meetings')}
          value={metrics.totalMeetings}
          icon={<Calendar className="h-4 w-4" />}
          trend="neutral"
          change={2.1}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title={t('전환율', 'Conversion Rate')}
          value={metrics.conversionRate.toFixed(1)}
          format="percentage"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          change={3.5}
        />
        <MetricCard
          title={t('평균 거래 규모', 'Average Deal Size')}
          value={metrics.averageDealSize}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          change={7.8}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenueData}
          title={t('매출 추이', 'Revenue Trend')}
          description={t('최근 6개월 매출 실적', 'Last 6 months revenue performance')}
        />
        <FunnelChart
          stages={[
            { name: t('홍보', 'Promotion'), value: funnelData.promotion },
            { name: t('웹사이트 방문', 'Website Visits'), value: funnelData.visits },
            { name: t('문의', 'Inquiries'), value: funnelData.inquiries },
            { name: t('미팅', 'Meetings'), value: funnelData.meetings },
            { name: t('거래 성사', 'Deals Closed'), value: funnelData.deals },
          ]}
        />
      </div>

      {/* Business Line Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('사업 부문 성과', 'Business Line Performance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessLines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: line.color || '#6b7280' }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{line.displayName}</p>
                    <p className="text-sm text-gray-600">{line.name}</p>
                  </div>
                </div>
                <Link href={`/dashboard/${line.name.toLowerCase()}`}>
                  <Button variant="outline" size="sm">
                    {t('대시보드 보기', 'View Dashboard')}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
