'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  utmFormSchema,
  type UtmFormData,
  UTM_SOURCES,
  UTM_MEDIUMS,
  CAMPAIGN_TYPES,
} from '@/lib/validations/utm'
import { UtmPreview } from './UtmPreview'
import { UtmHistory } from './UtmHistory'
import { QrCodeGenerator } from './QrCodeGenerator'

interface UtmBuilderProps {
  platforms?: Array<{ id: string; name: string }>
}

export function UtmBuilder({ platforms = [] }: UtmBuilderProps) {
  const [generatedUrl, setGeneratedUrl] = useState<string>('')
  const [showQrCode, setShowQrCode] = useState(false)
  const [searchSource, setSearchSource] = useState('')
  const [searchMedium, setSearchMedium] = useState('')
  const [searchCampaign, setSearchCampaign] = useState('')
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showMediumDropdown, setShowMediumDropdown] = useState(false)
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false)

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UtmFormData>({
    resolver: zodResolver(utmFormSchema),
    defaultValues: {
      baseUrl: 'https://example.com',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
      businessLine: '',
    },
  })

  const watchedValues = watch()

  // Generate URL whenever form values change
  useEffect(() => {
    if (
      watchedValues.baseUrl &&
      watchedValues.source &&
      watchedValues.medium &&
      watchedValues.campaign
    ) {
      generateUrl()
    }
  }, [watchedValues])

  const generateUrl = () => {
    const params = new URLSearchParams()
    params.append('utm_source', watchedValues.source)
    params.append('utm_medium', watchedValues.medium)
    params.append('utm_campaign', watchedValues.campaign)

    if (watchedValues.term) {
      params.append('utm_term', watchedValues.term)
    }
    if (watchedValues.content) {
      params.append('utm_content', watchedValues.content)
    }

    const url = new URL(watchedValues.baseUrl || 'https://example.com')
    url.search = params.toString()
    setGeneratedUrl(url.toString())
  }

  const filteredSources = UTM_SOURCES.filter((item) =>
    item.label.toLowerCase().includes(searchSource.toLowerCase())
  )

  const filteredMediums = UTM_MEDIUMS.filter((item) =>
    item.label.toLowerCase().includes(searchMedium.toLowerCase())
  )

  const filteredCampaigns = CAMPAIGN_TYPES.filter((item) =>
    item.label.toLowerCase().includes(searchCampaign.toLowerCase())
  )

  const onSelectSource = (value: string) => {
    setValue('source', value)
    setShowSourceDropdown(false)
    setSearchSource('')
  }

  const onSelectMedium = (value: string) => {
    setValue('medium', value)
    setShowMediumDropdown(false)
    setSearchMedium('')
  }

  const onSelectCampaign = (value: string) => {
    setValue('campaign', value)
    setShowCampaignDropdown(false)
    setSearchCampaign('')
  }

  const handleResetForm = () => {
    reset()
    setGeneratedUrl('')
    setShowQrCode(false)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              UTM Link Generator
            </h2>

            <form className="space-y-6">
              {/* Base URL */}
              <div>
                <label htmlFor="baseUrl" className="block text-sm font-medium mb-2">
                  Base URL <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="baseUrl"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="baseUrl"
                      type="url"
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.baseUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.baseUrl.message}</p>
                )}
              </div>

              {/* UTM Source */}
              <div>
                <label htmlFor="source" className="block text-sm font-medium mb-2">
                  UTM Source <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchSource}
                    onChange={(e) => {
                      setSearchSource(e.target.value)
                      setShowSourceDropdown(true)
                    }}
                    onFocus={() => setShowSourceDropdown(true)}
                    placeholder="Type to search (linkedin, facebook, google...)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {watchedValues.source && (
                    <div className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      Selected: {watchedValues.source}
                    </div>
                  )}

                  {showSourceDropdown && filteredSources.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filteredSources.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => onSelectSource(item.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                            watchedValues.source === item.value
                              ? 'bg-blue-100 font-medium'
                              : ''
                          }`}
                        >
                          {item.label}
                          {watchedValues.source === item.value && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.source && (
                  <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                )}
              </div>

              {/* UTM Medium */}
              <div>
                <label htmlFor="medium" className="block text-sm font-medium mb-2">
                  UTM Medium <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchMedium}
                    onChange={(e) => {
                      setSearchMedium(e.target.value)
                      setShowMediumDropdown(true)
                    }}
                    onFocus={() => setShowMediumDropdown(true)}
                    placeholder="Type to search (social, email, cpc...)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {watchedValues.medium && (
                    <div className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      Selected: {watchedValues.medium}
                    </div>
                  )}

                  {showMediumDropdown && filteredMediums.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filteredMediums.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => onSelectMedium(item.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                            watchedValues.medium === item.value
                              ? 'bg-blue-100 font-medium'
                              : ''
                          }`}
                        >
                          {item.label}
                          {watchedValues.medium === item.value && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.medium && (
                  <p className="mt-1 text-sm text-red-600">{errors.medium.message}</p>
                )}
              </div>

              {/* Campaign Name */}
              <div>
                <label htmlFor="campaign" className="block text-sm font-medium mb-2">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchCampaign}
                    onChange={(e) => {
                      setSearchCampaign(e.target.value)
                      setShowCampaignDropdown(true)
                    }}
                    onFocus={() => setShowCampaignDropdown(true)}
                    placeholder="Type to search or enter custom campaign name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {watchedValues.campaign && (
                    <div className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      Selected: {watchedValues.campaign}
                    </div>
                  )}

                  {showCampaignDropdown && filteredCampaigns.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filteredCampaigns.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => onSelectCampaign(item.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                            watchedValues.campaign === item.value
                              ? 'bg-blue-100 font-medium'
                              : ''
                          }`}
                        >
                          {item.label}
                          {watchedValues.campaign === item.value && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.campaign && (
                  <p className="mt-1 text-sm text-red-600">{errors.campaign.message}</p>
                )}
              </div>

              {/* Optional Fields */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Optional Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* UTM Term */}
                  <div>
                    <label htmlFor="term" className="block text-sm font-medium mb-2">
                      UTM Term (Keyword)
                    </label>
                    <Controller
                      name="term"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="term"
                          type="text"
                          placeholder="e.g., marketing automation"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    />
                  </div>

                  {/* UTM Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-2">
                      UTM Content (Ad Variant)
                    </label>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="content"
                          type="text"
                          placeholder="e.g., banner_top, text_link_footer"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Business Line (if platforms available) */}
                {platforms.length > 0 && (
                  <div className="mt-4">
                    <label htmlFor="businessLine" className="block text-sm font-medium mb-2">
                      Platform / Business Line
                    </label>
                    <Controller
                      name="businessLine"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          id="businessLine"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a platform...</option>
                          {platforms.map((platform) => (
                            <option key={platform.id} value={platform.id}>
                              {platform.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <UtmPreview url={generatedUrl} />

          {/* QR Code Section */}
          {generatedUrl && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <button
                onClick={() => setShowQrCode(!showQrCode)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <span>Generate QR Code</span>
                <span className="text-lg">{showQrCode ? '▼' : '▶'}</span>
              </button>
              {showQrCode && <QrCodeGenerator url={generatedUrl} />}
            </div>
          )}
        </div>

        {/* Sidebar - History */}
        <div className="lg:col-span-1">
          <UtmHistory generatedUrl={generatedUrl} />
        </div>
      </div>
    </div>
  )
}
