import Link from 'next/link'
import { FileText, Mail, Users, TrendingUp, Calendar, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">KPI Automation Platform</h1>
          <p className="text-xl text-blue-100 mb-8">
            SNS 관리, 이메일 마케팅, CRM을 하나의 플랫폼에서
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              대시보드 시작하기
            </Link>
            <Link
              href="/analytics"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition"
            >
              분석 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">핵심 기능</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* SNS 관리 */}
          <Link href="/posts" className="group">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">SNS 관리</h3>
              <p className="text-gray-600 mb-4">
                LinkedIn, Facebook, Instagram 등 멀티 플랫폼 포스팅 자동화
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 예약 포스팅</li>
                <li>• 멀티 플랫폼 동시 발행</li>
                <li>• 성과 분석</li>
              </ul>
            </div>
          </Link>

          {/* 이메일 관리 */}
          <Link href="/dashboard" className="group">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">이메일 마케팅</h3>
              <p className="text-gray-600 mb-4">
                자동화된 이메일 캠페인과 성과 추적
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 캠페인 관리</li>
                <li>• 오픈율 & 클릭률 추적</li>
                <li>• A/B 테스팅</li>
              </ul>
            </div>
          </Link>

          {/* CRM */}
          <Link href="/leads" className="group">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">CRM</h3>
              <p className="text-gray-600 mb-4">
                리드 관리부터 거래 성사까지 전체 세일즈 프로세스
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 리드 파이프라인</li>
                <li>• 미팅 스케줄링</li>
                <li>• 거래 추적</li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Additional Features */}
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">추가 기능</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/analytics" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">분석 & 리포트</h4>
                <p className="text-sm text-gray-500">실시간 성과 대시보드</p>
              </div>
            </div>
          </Link>

          <Link href="/utm" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">UTM 생성기</h4>
                <p className="text-sm text-gray-500">캠페인 추적 링크 생성</p>
              </div>
            </div>
          </Link>

          <Link href="/pipeline" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">리드 파이프라인</h4>
                <p className="text-sm text-gray-500">세일즈 퍼널 관리</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">93%</div>
              <div className="text-gray-600">자동화율</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-gray-600">비용 절감</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-gray-600">생산성 향상</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">자동 운영</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
