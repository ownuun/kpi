'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import BusinessLineTabs, { BusinessLine } from '@/components/BusinessLineTabs'
import { Play, Settings, BarChart3, Mail, Target, FileText, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AutomationPage() {
  const { t } = useLanguage()
  const [businessLine, setBusinessLine] = useState<BusinessLine>('all')
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)

  useEffect(() => {
    checkInitialization()
  }, [])

  const checkInitialization = async () => {
    try {
      const response = await fetch('/api/automation/init')
      const data = await response.json()
      setInitialized(data.initialized)
    } catch (error) {
      console.error('Failed to check initialization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInitialize = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/automation/init', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setInitialized(true)
        alert('✅ 자동화 서비스가 초기화되었습니다!')
      } else {
        alert('❌ 초기화 실패: ' + data.error)
      }
    } catch (error) {
      alert('❌ 초기화 실패')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunDemo = async () => {
    setExecuting(true)
    try {
      // Trigger demo scenarios
      await triggerLeadCreated()
      await new Promise(resolve => setTimeout(resolve, 1000))

      await triggerEmailOpened()
      await new Promise(resolve => setTimeout(resolve, 1000))

      await triggerDealWon()

      alert('✅ 데모 시나리오 실행 완료! 콘솔을 확인하세요.')
    } catch (error) {
      alert('❌ 데모 실행 실패')
      console.error(error)
    } finally {
      setExecuting(false)
    }
  }

  const triggerLeadCreated = async () => {
    const response = await fetch('/api/automation/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerType: 'lead_created',
        data: {
          leadId: 'demo_lead_123',
          name: '홍길동',
          email: 'hong@example.com',
          company: '삼성전자'
        }
      })
    })
    console.log('📝 Lead Created trigger:', await response.json())
  }

  const triggerEmailOpened = async () => {
    const response = await fetch('/api/automation/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerType: 'email_opened',
        data: {
          leadId: 'demo_lead_123',
          campaignType: 'sales',
          score: 85
        }
      })
    })
    console.log('📧 Email Opened trigger:', await response.json())
  }

  const triggerDealWon = async () => {
    const response = await fetch('/api/automation/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerType: 'deal_stage_changed',
        data: {
          dealId: 'demo_deal_456',
          name: '삼성전자 프로젝트',
          amount: 50000000,
          newStage: 'won',
          lead: {
            email: 'hong@example.com'
          }
        }
      })
    })
    console.log('🎉 Deal Won trigger:', await response.json())
  }

  const features = [
    {
      icon: FileText,
      title: 'SNS 자동 포스팅',
      description: '예약된 시간에 여러 플랫폼에 동시 발행',
      color: 'blue',
      status: 'active'
    },
    {
      icon: Mail,
      title: '이메일 자동화',
      description: '환영 메일, 재참여 캠페인 자동 발송',
      color: 'green',
      status: 'active'
    },
    {
      icon: Target,
      title: 'CRM 리드 스코어링',
      description: '행동 기반 자동 점수 부여 및 등급 관리',
      color: 'purple',
      status: 'active'
    },
    {
      icon: Zap,
      title: 'AI 콘텐츠 생성',
      description: 'SNS 포스트 및 이메일 내용 자동 생성',
      color: 'orange',
      status: 'active'
    }
  ]

  const workflows = [
    { name: '신규 리드 자동화', trigger: 'Lead Created', actions: 3 },
    { name: '이메일 오픈 추적', trigger: 'Email Opened', actions: 3 },
    { name: 'SNS 자동 포스팅', trigger: 'Time-based', actions: 4 },
    { name: '거래 단계 자동화', trigger: 'Deal Stage Changed', actions: 3 },
    { name: '재참여 캠페인', trigger: 'Time-based', actions: 2 }
  ]

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('자동화 센터', 'Automation Center')}</h1>
          <p className="mt-2 text-gray-600">
            {t('워크플로우 자동화, 이메일 캠페인, AI 콘텐츠 생성 관리', 'Workflow automation, email campaigns, and AI content generation management')}
          </p>
        </div>

        <BusinessLineTabs onTabChange={setBusinessLine} />

        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {initialized ? '✅ 자동화 활성화됨' : '⚠️ 자동화 비활성화'}
              </h2>
              <p className="text-blue-100">
                {initialized
                  ? '모든 자동화 서비스가 정상적으로 작동 중입니다'
                  : '자동화 서비스를 초기화하려면 아래 버튼을 클릭하세요'}
              </p>
            </div>
            <div className="flex gap-3">
              {!initialized && (
                <button
                  onClick={handleInitialize}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                >
                  {loading ? '초기화 중...' : '자동화 초기화'}
                </button>
              )}
              {initialized && (
                <button
                  onClick={handleRunDemo}
                  disabled={executing}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {executing ? '실행 중...' : '데모 실행'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('자동화 기능', 'Automation Features')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600'
              }[feature.color]

              return (
                <div key={feature.title} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Workflows Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('활성 워크플로우', 'Active Workflows')}</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('워크플로우 이름', 'Workflow Name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('트리거', 'Trigger')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('액션 수', 'Actions')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('상태', 'Status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{workflow.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{workflow.trigger}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {workflow.actions} actions
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">5</div>
            <div className="text-sm text-gray-600">{t('활성 워크플로우', 'Active Workflows')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">93%</div>
            <div className="text-sm text-gray-600">{t('자동화율', 'Automation Rate')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">1,234</div>
            <div className="text-sm text-gray-600">{t('실행 횟수 (이번 달)', 'Executions (This Month)')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">20h</div>
            <div className="text-sm text-gray-600">{t('절약된 시간 (주간)', 'Time Saved (Weekly)')}</div>
          </div>
        </div>
      </div>
    </>
  )
}
