'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import BusinessLineTabs, { BusinessLine } from '@/components/BusinessLineTabs'
import { useLanguage } from '@/contexts/LanguageContext'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string
  jobTitle?: string
  status?: string
  source?: string
  businessLine?: string
  createdAt: Date
}

export default function LeadsPage() {
  const { t } = useLanguage()
  const [businessLine, setBusinessLine] = useState<BusinessLine>('all')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - 실제로는 API에서 가져옴
    const mockLeads: Lead[] = [
      {
        id: '1',
        firstName: '홍',
        lastName: '길동',
        email: 'hong@samsung.com',
        company: '삼성전자',
        jobTitle: 'CTO',
        status: 'qualified',
        source: 'LinkedIn',
        businessLine: 'B2B',
        createdAt: new Date('2024-12-15')
      },
      {
        id: '2',
        firstName: '김',
        lastName: '철수',
        email: 'kim@lg.com',
        company: 'LG전자',
        jobTitle: 'VP of Sales',
        status: 'proposal',
        source: 'Referral',
        businessLine: 'B2B',
        createdAt: new Date('2024-12-14')
      },
      {
        id: '3',
        firstName: '이',
        lastName: '영희',
        email: 'lee@hyundai.com',
        company: '현대자동차',
        jobTitle: 'Manager',
        status: 'negotiation',
        source: 'Website',
        businessLine: 'ANYON',
        createdAt: new Date('2024-12-13')
      },
      {
        id: '4',
        firstName: '박',
        lastName: '민수',
        email: 'park@sk.com',
        company: 'SK하이닉스',
        jobTitle: 'Director',
        status: 'new',
        source: 'Cold Call',
        businessLine: '외주',
        createdAt: new Date('2024-12-12')
      },
      {
        id: '5',
        firstName: '최',
        lastName: '수진',
        email: 'choi@naver.com',
        company: '네이버',
        jobTitle: 'Team Lead',
        status: 'contacted',
        source: 'Event',
        businessLine: 'ANYON',
        createdAt: new Date('2024-12-11')
      },
    ]

    setLeads(mockLeads)
    setLoading(false)
  }, [])

  const filteredLeads = useMemo(() => {
    if (businessLine === 'all') return leads
    return leads.filter(lead => lead.businessLine === businessLine)
  }, [businessLine, leads])

  const getStatusBadgeColor = (status?: string) => {
    const colors: Record<string, string> = {
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
    }
    return colors[status || 'new'] || colors.new
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('CRM 리드 관리', 'CRM Lead Management')}</h1>
            <p className="text-gray-600">{t('비즈니스 라인별 리드 현황 및 관리', 'Lead status and management by business line')}</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            {t('+ 새 리드 추가', '+ Add New Lead')}
          </Link>
        </div>

        <BusinessLineTabs onTabChange={setBusinessLine} />

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">{t('로딩 중...', 'Loading...')}</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">
              {businessLine === 'all' ? t('리드가 없습니다', 'No leads found') : t(`${businessLine} 비즈니스 라인에 리드가 없습니다`, `No leads found in ${businessLine} business line`)}
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              {t('첫 번째 리드 생성하기', 'Create your first lead')}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('이름', 'Name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('이메일', 'Email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('회사', 'Company')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('비즈니스 라인', 'Business Line')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('상태', 'Status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('소스', 'Source')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('생성일', 'Created')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                      {lead.jobTitle && (
                        <div className="text-sm text-gray-500">{lead.jobTitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {lead.businessLine || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{t('전체 리드', 'Total Leads')}</div>
            <div className="text-3xl font-bold text-gray-900">{filteredLeads.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{t('신규', 'New')}</div>
            <div className="text-3xl font-bold text-blue-600">
              {filteredLeads.filter(l => l.status === 'new').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{t('적격', 'Qualified')}</div>
            <div className="text-3xl font-bold text-green-600">
              {filteredLeads.filter(l => l.status === 'qualified').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{t('협상 중', 'Negotiation')}</div>
            <div className="text-3xl font-bold text-orange-600">
              {filteredLeads.filter(l => l.status === 'negotiation').length}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
