'use client'

import Link from 'next/link'
import { LayoutDashboard, BarChart3, FileText, Settings, Calendar, Target, Home, Zap, Users, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const navigationItems = [
  { name: { ko: '홈', en: 'Home' }, href: '/', icon: Home },
  { name: { ko: '대시보드', en: 'Dashboard' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { ko: '분석 & 리포트', en: 'Analytics' }, href: '/analytics', icon: BarChart3 },
  { name: { ko: 'SNS 포스팅', en: 'Posts' }, href: '/posts', icon: FileText },
  { name: { ko: 'CRM', en: 'CRM' }, href: '/leads', icon: Users },
  { name: { ko: '리드 파이프라인', en: 'Pipeline' }, href: '/pipeline', icon: Target },
  { name: { ko: '자동화', en: 'Automation' }, href: '/automation', icon: Zap },
  { name: { ko: 'UTM 생성기', en: 'UTM Builder' }, href: '/utm', icon: Calendar },
  { name: { ko: '설정', en: 'Settings' }, href: '/settings', icon: Settings },
]

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              KPI Platform
            </Link>
            <div className="hidden md:flex gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  <item.icon className="h-4 w-4" />
                  {language === 'ko' ? item.name.ko : item.name.en}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <Globe className="w-4 h-4" />
              {language === 'ko' ? 'EN' : 'KO'}
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
