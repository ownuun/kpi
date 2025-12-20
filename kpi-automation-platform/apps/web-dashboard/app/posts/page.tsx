'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import BusinessLineTabs, { BusinessLine } from '@/components/BusinessLineTabs'
import { useLanguage } from '@/contexts/LanguageContext'

// Sample data - 나중에 DB에서 가져올 수 있음
const stats = [
  { label: '전체 포스트', value: '156', icon: FileText, color: 'blue' },
  { label: '예약됨', value: '23', icon: Clock, color: 'yellow' },
  { label: '발행됨', value: '128', icon: CheckCircle, color: 'green' },
  { label: '실패', value: '5', icon: XCircle, color: 'red' },
]

const platforms = [
  { name: 'LinkedIn', posts: 45, color: 'bg-blue-100 text-blue-800' },
  { name: 'Facebook', posts: 38, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Instagram', posts: 32, color: 'bg-pink-100 text-pink-800' },
  { name: 'Twitter/X', posts: 28, color: 'bg-sky-100 text-sky-800' },
  { name: 'YouTube', posts: 13, color: 'bg-red-100 text-red-800' },
]

const allPosts = [
  {
    id: 1,
    title: '새로운 제품 출시 소식',
    platform: 'LinkedIn',
    status: 'published',
    publishedAt: '2시간 전',
    views: 1234,
    likes: 89,
    businessLine: 'B2B'
  },
  {
    id: 2,
    title: '주간 마케팅 팁',
    platform: 'Instagram',
    status: 'scheduled',
    scheduledAt: '내일 오전 10시',
    views: 0,
    likes: 0,
    businessLine: 'ANYON'
  },
  {
    id: 3,
    title: '고객 성공 사례',
    platform: 'Facebook',
    status: 'published',
    publishedAt: '5시간 전',
    views: 2341,
    likes: 156,
    businessLine: 'B2B'
  },
  {
    id: 4,
    title: '외주 프로젝트 소개',
    platform: 'LinkedIn',
    status: 'published',
    publishedAt: '1일 전',
    views: 892,
    likes: 45,
    businessLine: '외주'
  },
  {
    id: 5,
    title: 'ANYON 플랫폼 업데이트',
    platform: 'Facebook',
    status: 'scheduled',
    scheduledAt: '내일 오후 2시',
    views: 0,
    likes: 0,
    businessLine: 'ANYON'
  },
]

export default function PostsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [businessLine, setBusinessLine] = useState<BusinessLine>('all')

  const recentPosts = useMemo(() => {
    if (businessLine === 'all') return allPosts
    return allPosts.filter(post => post.businessLine === businessLine)
  }, [businessLine])

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('SNS 포스팅', 'Social Media Posts')}</h1>
          <p className="mt-2 text-gray-600">
            {t('멀티 플랫폼 SNS 포스팅 관리 및 성과 분석', 'Multi-platform social media posting management and analytics')}
          </p>
        </div>
        <Link
          href="/posts/new"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {t('+ 새 포스트 작성', '+ New Post')}
        </Link>
      </div>

      <BusinessLineTabs onTabChange={setBusinessLine} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600',
          }[stat.color]

          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{t('최근 포스트', 'Recent Posts')}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 hover:bg-gray-50 hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {post.platform}
                        </span>
                        {post.status === 'published' ? (
                          <>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {post.publishedAt}
                            </span>
                            <span>👁 {post.views.toLocaleString()}</span>
                            <span>❤️ {post.likes}</span>
                          </>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.scheduledAt}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status === 'published' ? t('발행됨', 'Published') : t('예약됨', 'Scheduled')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{t('플랫폼별 현황', 'Platform Stats')}</h2>
            </div>
            <div className="p-6 space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{platform.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${platform.color}`}>
                    {platform.posts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">{t('자동 포스팅 기능', 'Auto-posting Feature')}</h4>
                <p className="text-xs text-blue-700 mb-2">
                  {t('AI 기반 자동 포스팅으로 시간을 절약하세요', 'Save time with AI-powered automatic posting')}
                </p>
                <Link href="/settings" className="text-xs text-blue-600 hover:text-blue-800 underline">
                  {t('설정에서 활성화 →', 'Enable in settings →')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
