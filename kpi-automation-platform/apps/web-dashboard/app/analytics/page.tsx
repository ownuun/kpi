'use client';

import { useState, useMemo } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3, TrendingUp, Target, Users, Building2 } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import BusinessLineTabs, { BusinessLine } from '@/components/BusinessLineTabs';
import { useLanguage } from '@/contexts/LanguageContext';

// Sample data (나중에 DB에서 가져올 수 있음)
const funnelDataByLine: Record<string, any[]> = {
  all: [
    { stage: '홍보', count: 1000, percentage: 100, color: '#3b82f6' },
    { stage: '유입', count: 152, percentage: 15.2, color: '#10b981' },
    { stage: '문의', count: 65, percentage: 6.5, color: '#f59e0b' },
    { stage: '미팅', count: 28, percentage: 2.8, color: '#ef4444' },
    { stage: '거래', count: 21, percentage: 2.1, color: '#8b5cf6' },
  ],
  B2B: [
    { stage: '홍보', count: 450, percentage: 100, color: '#3b82f6' },
    { stage: '유입', count: 89, percentage: 19.8, color: '#10b981' },
    { stage: '문의', count: 38, percentage: 8.4, color: '#f59e0b' },
    { stage: '미팅', count: 18, percentage: 4.0, color: '#ef4444' },
    { stage: '거래', count: 12, percentage: 2.7, color: '#8b5cf6' },
  ],
  ANYON: [
    { stage: '홍보', count: 350, percentage: 100, color: '#3b82f6' },
    { stage: '유입', count: 42, percentage: 12.0, color: '#10b981' },
    { stage: '문의', count: 18, percentage: 5.1, color: '#f59e0b' },
    { stage: '미팅', count: 6, percentage: 1.7, color: '#ef4444' },
    { stage: '거래', count: 5, percentage: 1.4, color: '#8b5cf6' },
  ],
  외주: [
    { stage: '홍보', count: 200, percentage: 100, color: '#3b82f6' },
    { stage: '유입', count: 21, percentage: 10.5, color: '#10b981' },
    { stage: '문의', count: 9, percentage: 4.5, color: '#f59e0b' },
    { stage: '미팅', count: 4, percentage: 2.0, color: '#ef4444' },
    { stage: '거래', count: 4, percentage: 2.0, color: '#8b5cf6' },
  ],
};

const platformROIData = [
  { platform: 'LinkedIn', revenue: 12500000, posts: 45, conversion: 3.8 },
  { platform: 'Facebook', revenue: 8200000, posts: 62, conversion: 2.1 },
  { platform: 'Instagram', revenue: 5800000, posts: 89, conversion: 1.8 },
  { platform: 'YouTube', revenue: 4500000, posts: 23, conversion: 2.4 },
  { platform: 'Blog', revenue: 3200000, posts: 34, conversion: 2.1 },
  { platform: 'Twitter', revenue: 2100000, posts: 56, conversion: 0.9 },
];

const weeklyTrendData = [
  { week: '12/01', posts: 45, visits: 234, leads: 28, deals: 5, revenue: 45000000 },
  { week: '12/08', posts: 52, visits: 289, leads: 35, deals: 7, revenue: 58000000 },
  { week: '12/15', posts: 48, visits: 267, leads: 31, deals: 6, revenue: 52000000 },
  { week: '12/22', posts: 61, visits: 312, leads: 42, deals: 9, revenue: 72000000 },
];

const leadSourceData = [
  { source: 'linkedin-b2b-outbound', visits: 456, leads: 42, deals: 8, revenue: 15200000 },
  { source: 'google-ads-enterprise', visits: 389, leads: 35, deals: 6, revenue: 9800000 },
  { source: 'facebook-retargeting', visits: 523, leads: 28, deals: 5, revenue: 7500000 },
  { source: 'organic-search', visits: 678, leads: 45, deals: 4, revenue: 6200000 },
];

const businessLineData = [
  { name: 'B2B', revenue: 62800000, deals: 28, winRate: 42.1, avgDeal: 15200000 },
  { name: '외주', revenue: 45200000, deals: 35, winRate: 38.5, avgDeal: 8500000 },
  { name: 'ANYON', revenue: 28500000, deals: 52, winRate: 25.8, avgDeal: 5200000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [businessLine, setBusinessLine] = useState<BusinessLine>('all')

  const funnelData = useMemo(() => funnelDataByLine[businessLine] || funnelDataByLine.all, [businessLine])

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('분석 & 리포트', 'Analytics & Reports')}</h2>
      </div>

      <BusinessLineTabs onTabChange={setBusinessLine} />

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="funnel" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">{t('퍼널 분석', 'Funnel Analysis')}</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('플랫폼 ROI', 'Platform ROI')}</span>
          </TabsTrigger>
          <TabsTrigger value="trend" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('주간 추이', 'Weekly Trend')}</span>
          </TabsTrigger>
          <TabsTrigger value="attribution" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('리드 소스', 'Lead Sources')}</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('사업 부문', 'Business Lines')}</span>
          </TabsTrigger>
        </TabsList>

        {/* 퍼널 분석 */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('퍼널 분석', 'Funnel Analysis')}</CardTitle>
              <CardDescription>
                {t('전환 퍼널 전체를 시각화합니다: 홍보 → 유입 → 문의 → 미팅 → 거래', 'Visualize the entire conversion funnel: Promotion → Traffic → Inquiry → Meeting → Deal')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {funnelData.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>{t('데이터가 없습니다', 'No data available')}</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={80} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-semibold">{payload[0].payload.stage}</p>
                              <p className="text-sm">개수: {payload[0].payload.count}</p>
                              <p className="text-sm">전환율: {payload[0].payload.percentage ?? 0}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('주요 인사이트', 'Key Insights')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">방문 → 문의 전환율</span>
                  <span className="font-semibold">15.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">문의 → 미팅 전환율</span>
                  <span className="font-semibold">42.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">미팅 → 거래 전환율</span>
                  <span className="font-semibold">31.5%</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">전체 전환율</span>
                  <span className="font-bold text-green-600">2.05%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('개선 추천', 'Recommendations')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <p>방문자 중 85%가 이탈 - 랜딩페이지 개선 필요</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                  <p>문의→미팅 전환율 양호 (42.8%)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <p>미팅 후 68%가 거래 실패 - 영업 프로세스 점검</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 플랫폼 ROI */}
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('플랫폼 ROI 분석', 'Platform ROI Analysis')}</CardTitle>
              <CardDescription>
                {t('각 플랫폼의 투자 대비 수익률 및 성과 지표를 분석합니다', 'Analyze ROI and performance metrics for each platform')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {platformROIData.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>{t('데이터가 없습니다', 'No data available')}</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={platformROIData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') return [`₩${(value / 1000000).toFixed(1)}M`, '수익'];
                        if (name === 'conversion') return [`${value}%`, '전환율'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="수익" radius={[8, 8, 0, 0]} />
                    <Bar yAxisId="right" dataKey="conversion" fill="#10b981" name="전환율 (%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 수익 플랫폼</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {platformROIData.slice(0, 3).map((platform, idx) => (
                  <div key={platform.platform} className="flex justify-between items-center">
                    <span>{platform.platform}</span>
                    <span className={idx === 0 ? "font-bold text-green-600" : "font-bold"}>
                      ₩{(platform.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 전환율</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[...platformROIData].sort((a, b) => b.conversion - a.conversion).slice(0, 3).map((platform, idx) => (
                  <div key={platform.platform} className="flex justify-between items-center">
                    <span>{platform.platform}</span>
                    <span className={idx === 0 ? "font-bold text-green-600" : "font-bold"}>
                      {platform.conversion}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">포스트당 수익</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {platformROIData.map((platform) => ({
                  ...platform,
                  revenuePerPost: platform.revenue / platform.posts
                })).sort((a, b) => b.revenuePerPost - a.revenuePerPost).slice(0, 3).map((platform, idx) => (
                  <div key={platform.platform} className="flex justify-between items-center">
                    <span>{platform.platform}</span>
                    <span className={idx === 0 ? "font-bold text-green-600" : "font-bold"}>
                      ₩{(platform.revenuePerPost / 1000).toFixed(0)}K
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 주간 추이 */}
        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주간 성과 추이</CardTitle>
              <CardDescription>
                주차별 핵심 지표의 변화 추이를 확인합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyTrendData.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>{t('데이터가 없습니다', 'No data available')}</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={weeklyTrendData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') return [`₩${(value / 1000000).toFixed(0)}M`, '매출'];
                        if (name === 'leads') return [value, '리드'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="매출" />
                    <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#10b981" fillOpacity={1} fill="url(#colorLeads)" name="리드" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 리드 소스 */}
        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>리드 소스 분석</CardTitle>
              <CardDescription>
                UTM 파라미터 기반으로 어떤 캠페인과 채널이 가장 효과적인지 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">캠페인</th>
                      <th className="text-right p-2">방문</th>
                      <th className="text-right p-2">리드</th>
                      <th className="text-right p-2">거래</th>
                      <th className="text-right p-2">수익</th>
                      <th className="text-right p-2">전환율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadSourceData.map((source) => (
                      <tr key={source.source} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{source.source}</td>
                        <td className="text-right p-2">{source.visits}</td>
                        <td className="text-right p-2">{source.leads}</td>
                        <td className="text-right p-2">{source.deals}</td>
                        <td className="text-right p-2">₩{(source.revenue / 1000000).toFixed(1)}M</td>
                        <td className="text-right p-2">
                          <span className="font-semibold text-green-600">
                            {((source.leads / source.visits) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">채널별 기여도</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Organic Search', value: 35 },
                        { name: 'Paid Social', value: 28 },
                        { name: 'Direct', value: 22 },
                        { name: 'Referral', value: 15 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 성과 캠페인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {leadSourceData.slice(0, 3).map((source, idx) => (
                  <div key={source.source} className="flex justify-between items-center">
                    <span className="truncate">{source.source}</span>
                    <span className={idx === 0 ? "font-bold text-green-600" : "font-bold"}>
                      ₩{(source.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 사업 부문 */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사업 부문별 비교</CardTitle>
              <CardDescription>
                외주, B2B, ANYON 사업 부문의 성과를 비교 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={businessLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') return [`₩${(value / 1000000).toFixed(1)}M`, '매출'];
                      if (name === 'winRate') return [`${value}%`, '성약률'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="매출" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="winRate" fill="#10b981" name="성약률 (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {businessLineData.map((line) => (
              <Card key={line.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{line.name} 사업부</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">월 매출</span>
                    <span className="font-bold">₩{(line.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">성약률</span>
                    <span className="font-bold text-green-600">{line.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">평균 거래액</span>
                    <span className="font-bold">₩{(line.avgDeal / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">거래 수</span>
                    <span className="font-bold">{line.deals}건</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </>
  );
}
