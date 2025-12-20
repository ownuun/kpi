import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Users, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: '분석 & 리포트 | KPI Automation Platform',
  description: 'Metabase 기반 심층 분석 대시보드',
};

/**
 * Analytics Page (Simplified Version)
 *
 * This is a simplified version that shows the UI structure without Metabase integration.
 * Once Metabase is set up, you can use the full version at /analytics
 */
export default function AnalyticsSimplePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">분석 & 리포트</h2>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="funnel" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">퍼널 분석</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">플랫폼 ROI</span>
          </TabsTrigger>
          <TabsTrigger value="trend" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">주간 추이</span>
          </TabsTrigger>
          <TabsTrigger value="attribution" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">리드 소스</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">사업 부문</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>퍼널 분석</CardTitle>
              <CardDescription>
                전환 퍼널 전체를 시각화합니다: 홍보 → 유입 → 문의 → 미팅 → 거래
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center space-y-4">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Metabase 대시보드</h3>
                    <div className="text-sm text-muted-foreground max-w-md space-y-3">
                      <p>Metabase를 설정하면 여기에 퍼널 분석 대시보드가 표시됩니다.</p>
                      <div className="bg-background p-4 rounded-md text-left text-xs space-y-2">
                        <p className="font-semibold text-foreground">빠른 설정:</p>
                        <code className="block">docker run -d -p 3001:3000 metabase/metabase</code>
                        <p className="text-muted-foreground">
                          자세한 설정: <code>METABASE_SETUP.md</code> 참고
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">주요 인사이트</CardTitle>
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
                <CardTitle className="text-lg">개선 추천</CardTitle>
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

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>플랫폼 ROI 분석</CardTitle>
              <CardDescription>
                각 플랫폼의 투자 대비 수익률 및 성과 지표를 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center space-y-4">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Metabase 대시보드</h3>
                    <p className="text-sm text-muted-foreground">
                      플랫폼 ROI 분석 대시보드
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 수익 플랫폼</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>LinkedIn</span>
                  <span className="font-bold text-green-600">₩12.5M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facebook</span>
                  <span className="font-bold">₩8.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Instagram</span>
                  <span className="font-bold">₩5.8M</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 전환율</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>LinkedIn</span>
                  <span className="font-bold text-green-600">3.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>YouTube</span>
                  <span className="font-bold">2.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Blog</span>
                  <span className="font-bold">2.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">개선 필요</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                  <p>TikTok - 낮은 전환율 (0.3%)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <p>Twitter - 높은 이탈률</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <p>Pinterest - 적은 트래픽</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주간 성과 추이</CardTitle>
              <CardDescription>
                주차별 핵심 지표의 변화 추이를 확인합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center space-y-4">
                  <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Metabase 대시보드</h3>
                    <p className="text-sm text-muted-foreground">
                      주간 추이 대시보드
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>리드 소스 분석</CardTitle>
              <CardDescription>
                UTM 파라미터 기반으로 어떤 캠페인과 채널이 가장 효과적인지 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center space-y-4">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Metabase 대시보드</h3>
                    <p className="text-sm text-muted-foreground">
                      리드 소스 분석 대시보드
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최고 성과 캠페인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="truncate">linkedin-b2b-outbound-q1</span>
                  <span className="font-bold text-green-600">₩15.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate">google-ads-enterprise</span>
                  <span className="font-bold">₩9.8M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate">facebook-retargeting</span>
                  <span className="font-bold">₩7.5M</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">채널별 기여도</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Organic Search</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Paid Social</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Direct</span>
                  <span className="font-bold">22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Referral</span>
                  <span className="font-bold">15%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사업 부문별 비교</CardTitle>
              <CardDescription>
                외주, B2B, ANYON 사업 부문의 성과를 비교 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center space-y-4">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Metabase 대시보드</h3>
                    <p className="text-sm text-muted-foreground">
                      사업 부문 비교 대시보드
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">외주 사업부</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">월 매출</span>
                  <span className="font-bold">₩45.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">성약률</span>
                  <span className="font-bold text-green-600">38.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 거래액</span>
                  <span className="font-bold">₩8.5M</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">B2B 사업부</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">월 매출</span>
                  <span className="font-bold">₩62.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">성약률</span>
                  <span className="font-bold text-green-600">42.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 거래액</span>
                  <span className="font-bold">₩15.2M</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ANYON 사업부</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">월 매출</span>
                  <span className="font-bold">₩28.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">성약률</span>
                  <span className="font-bold">25.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 거래액</span>
                  <span className="font-bold">₩5.2M</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
