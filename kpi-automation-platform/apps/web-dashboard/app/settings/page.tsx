'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import {
  Bell,
  Mail,
  Lock,
  User,
  Palette,
  Globe,
  Zap,
  Save,
  Check,
  Building2
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    // 프로필 설정
    name: '홍길동',
    email: 'hong@example.com',
    company: 'KPI Platform',
    jobTitle: 'Marketing Manager',

    // 알림 설정
    emailNotifications: true,
    slackNotifications: true,
    desktopNotifications: false,
    weeklyReport: true,

    // 자동화 설정
    autoPosting: false,
    autoLeadScoring: true,
    autoEmailCampaigns: false,

    // 언어 및 지역
    language: 'ko',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD',

    // 테마
    theme: 'light',
  })

  const handleSave = () => {
    // TODO: API call to save settings
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="mt-2 text-gray-600">
            계정 및 시스템 설정을 관리합니다
          </p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">설정이 저장되었습니다</span>
          </div>
        )}

        <div className="space-y-6">
          {/* 프로필 설정 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">프로필</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명
                  </label>
                  <input
                    type="text"
                    value={settings.company}
                    onChange={(e) => updateSetting('company', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직책
                  </label>
                  <input
                    type="text"
                    value={settings.jobTitle}
                    onChange={(e) => updateSetting('jobTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">알림</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">이메일 알림</p>
                  <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Slack 알림</p>
                  <p className="text-sm text-gray-500">Slack으로 실시간 알림을 받습니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.slackNotifications}
                    onChange={(e) => updateSetting('slackNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">데스크톱 알림</p>
                  <p className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.desktopNotifications}
                    onChange={(e) => updateSetting('desktopNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">주간 리포트</p>
                  <p className="text-sm text-gray-500">매주 월요일 성과 리포트를 받습니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReport}
                    onChange={(e) => updateSetting('weeklyReport', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 비즈니스 라인 관리 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">비즈니스 라인</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                사업 부문을 추가하거나 제거하고, 각 라인별 대시보드를 관리합니다
              </p>
              <Link
                href="/settings/business-lines"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Building2 className="w-4 h-4" />
                비즈니스 라인 관리
              </Link>
            </div>
          </div>

          {/* 자동화 설정 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">자동화</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">자동 포스팅</p>
                  <p className="text-sm text-gray-500">AI 기반 SNS 자동 포스팅을 활성화합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoPosting}
                    onChange={(e) => updateSetting('autoPosting', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">자동 리드 스코어링</p>
                  <p className="text-sm text-gray-500">리드 행동 기반 자동 점수 부여</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoLeadScoring}
                    onChange={(e) => updateSetting('autoLeadScoring', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">자동 이메일 캠페인</p>
                  <p className="text-sm text-gray-500">트리거 기반 자동 이메일 발송</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoEmailCampaigns}
                    onChange={(e) => updateSetting('autoEmailCampaigns', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 언어 및 지역 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">언어 및 지역</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    언어
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시간대
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜 형식
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => updateSetting('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="YYYY-MM-DD">2024-12-20</option>
                  <option value="MM/DD/YYYY">12/20/2024</option>
                  <option value="DD/MM/YYYY">20/12/2024</option>
                </select>
              </div>
            </div>
          </div>

          {/* 테마 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">테마</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`p-4 border-2 rounded-lg transition ${
                    settings.theme === 'light'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 bg-white border border-gray-300 rounded mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">라이트</p>
                </button>
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`p-4 border-2 rounded-lg transition ${
                    settings.theme === 'dark'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 bg-gray-900 border border-gray-700 rounded mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">다크</p>
                </button>
                <button
                  onClick={() => updateSetting('theme', 'auto')}
                  className={`p-4 border-2 rounded-lg transition ${
                    settings.theme === 'auto'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">시스템 설정</p>
                </button>
              </div>
            </div>
          </div>

          {/* 보안 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">보안</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                비밀번호 변경 →
              </button>
              <div className="pt-4 border-t border-gray-200">
                <button className="text-red-600 hover:text-red-700 font-medium">
                  계정 삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            설정 저장
          </button>
        </div>
      </div>
    </>
  )
}
