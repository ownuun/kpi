'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import { Link as LinkIcon, Copy, Check, Share2, History } from 'lucide-react'

interface UTMParams {
  url: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
}

export default function UTMGeneratorPage() {
  const [params, setParams] = useState<UTMParams>({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  })
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const updateParam = (key: keyof UTMParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  const generateUTMUrl = (): string => {
    if (!params.url) return ''

    const url = new URL(params.url.startsWith('http') ? params.url : `https://${params.url}`)

    if (params.source) url.searchParams.set('utm_source', params.source)
    if (params.medium) url.searchParams.set('utm_medium', params.medium)
    if (params.campaign) url.searchParams.set('utm_campaign', params.campaign)
    if (params.term) url.searchParams.set('utm_term', params.term)
    if (params.content) url.searchParams.set('utm_content', params.content)

    return url.toString()
  }

  const generatedUrl = generateUTMUrl()

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
      setCopied(true)

      // Add to history
      if (!history.includes(generatedUrl)) {
        setHistory(prev => [generatedUrl, ...prev].slice(0, 5))
      }

      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clearForm = () => {
    setParams({
      url: '',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    })
  }

  const presetTemplates = [
    {
      name: 'Google 광고',
      params: { source: 'google', medium: 'cpc', campaign: '', term: '', content: '' }
    },
    {
      name: 'Facebook 광고',
      params: { source: 'facebook', medium: 'social', campaign: '', term: '', content: '' }
    },
    {
      name: 'LinkedIn 광고',
      params: { source: 'linkedin', medium: 'social', campaign: '', term: '', content: '' }
    },
    {
      name: '이메일 캠페인',
      params: { source: 'email', medium: 'email', campaign: '', term: '', content: '' }
    },
    {
      name: '블로그 포스트',
      params: { source: 'blog', medium: 'referral', campaign: '', term: '', content: '' }
    },
  ]

  const applyTemplate = (template: typeof presetTemplates[0]) => {
    setParams(prev => ({ ...prev, ...template.params }))
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LinkIcon className="w-8 h-8" />
            UTM 파라미터 생성기
          </h1>
          <p className="mt-2 text-gray-600">
            마케팅 캠페인 추적을 위한 UTM 링크를 생성합니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* URL 입력 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">기본 URL</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  웹사이트 URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={params.url}
                  onChange={(e) => updateParam('url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-xs text-gray-500">
                  추적하려는 웹페이지의 전체 URL을 입력하세요
                </p>
              </div>
            </div>

            {/* UTM 파라미터 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">UTM 파라미터</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    캠페인 소스 (utm_source) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={params.source}
                    onChange={(e) => updateParam('source', e.target.value)}
                    placeholder="google, facebook, newsletter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    트래픽 출처 (예: google, facebook, newsletter)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    캠페인 매체 (utm_medium) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={params.medium}
                    onChange={(e) => updateParam('medium', e.target.value)}
                    placeholder="cpc, social, email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    마케팅 매체 (예: cpc, social, email, banner)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    캠페인 이름 (utm_campaign) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={params.campaign}
                    onChange={(e) => updateParam('campaign', e.target.value)}
                    placeholder="summer_sale, product_launch"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    캠페인 식별자 (예: summer_sale, product_launch)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    캠페인 키워드 (utm_term)
                  </label>
                  <input
                    type="text"
                    value={params.term}
                    onChange={(e) => updateParam('term', e.target.value)}
                    placeholder="running+shoes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    유료 검색 키워드 (선택사항)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    캠페인 콘텐츠 (utm_content)
                  </label>
                  <input
                    type="text"
                    value={params.content}
                    onChange={(e) => updateParam('content', e.target.value)}
                    placeholder="logo_link, text_link"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    A/B 테스트 또는 광고 구분 (선택사항)
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={clearForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* 생성된 URL */}
            {generatedUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">생성된 URL</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 break-all">
                  <code className="text-sm text-gray-800">{generatedUrl}</code>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        복사됨!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        URL 복사
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.open(generatedUrl, '_blank')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    테스트
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 빠른 템플릿 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">빠른 템플릿</h3>
              <div className="space-y-2">
                {presetTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-sm"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 최근 생성 */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">최근 생성</h3>
                </div>
                <div className="space-y-3">
                  {history.map((url, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="text-xs text-gray-600 truncate">{url}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(url)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        복사
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 도움말 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3">💡 UTM이란?</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                UTM 파라미터는 Google Analytics에서 트래픽 출처를 추적하는 태그입니다.
                각 마케팅 채널의 성과를 정확하게 측정할 수 있습니다.
              </p>
              <div className="mt-4 space-y-2 text-xs text-blue-700">
                <p><strong>source:</strong> 트래픽 출처</p>
                <p><strong>medium:</strong> 마케팅 매체</p>
                <p><strong>campaign:</strong> 캠페인 이름</p>
                <p><strong>term:</strong> 검색 키워드</p>
                <p><strong>content:</strong> 광고 구분</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
