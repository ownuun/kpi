'use client'

import { useState } from 'react'

interface UtmPreviewProps {
  url: string
}

export function UtmPreview({ url }: UtmPreviewProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!url) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-gray-500 text-center py-8">
          Fill in the required fields above to generate a URL
        </p>
      </div>
    )
  }

  // Parse URL to display base and parameters separately
  const urlObj = new URL(url)
  const baseUrl = urlObj.origin + urlObj.pathname
  const params = new URLSearchParams(urlObj.search)
  const paramArray = Array.from(params.entries())

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">URL Preview</h3>
        <button
          onClick={copyToClipboard}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
            copySuccess
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {copySuccess ? 'Copied!' : 'Copy URL'}
        </button>
      </div>

      {/* Full URL Display */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Full URL:</p>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 overflow-x-auto">
          <code className="text-sm text-gray-900 break-all font-mono">{url}</code>
        </div>
      </div>

      {/* Parameters Breakdown */}
      <div>
        <p className="text-sm text-gray-600 mb-3 font-medium">UTM Parameters:</p>
        <div className="space-y-2">
          {paramArray.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Parameter</p>
                <p className="text-sm font-mono text-blue-600">{key}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Value</p>
                <p className="text-sm font-mono text-gray-900 break-all">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URL Length Indicator */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">URL Length:</span>
          <span className="text-sm font-mono text-gray-900">{url.length} characters</span>
        </div>
        {url.length > 2000 && (
          <p className="text-xs text-amber-600 mt-2">
            Warning: URL is longer than 2000 characters. Some platforms may have limitations.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            const link = document.createElement('a')
            link.href = url
            link.download = `utm-link-${Date.now()}.txt`
            link.click()
          }}
          className="px-3 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          Download as Text
        </button>
        <button
          onClick={() => {
            window.open(url, '_blank')
          }}
          className="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
        >
          Test Link
        </button>
      </div>
    </div>
  )
}
