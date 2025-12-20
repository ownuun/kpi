'use client'

import { useState, useEffect } from 'react'

interface HistoryItem {
  id: string
  url: string
  source: string
  medium: string
  campaign: string
  createdAt: Date
}

interface UtmHistoryProps {
  generatedUrl: string
}

export function UtmHistory({ generatedUrl }: UtmHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('utm_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed)
      } catch (err) {
        console.error('Failed to parse history:', err)
      }
    }
  }, [])

  // Add new URL to history when it's generated
  useEffect(() => {
    if (!generatedUrl) return

    const urlObj = new URL(generatedUrl)
    const params = new URLSearchParams(urlObj.search)

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      url: generatedUrl,
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      createdAt: new Date(),
    }

    // Add to beginning and keep only last 20 items
    const updated = [newItem, ...history].slice(0, 20)
    setHistory(updated)

    // Save to localStorage
    localStorage.setItem('utm_history', JSON.stringify(updated))
  }, [generatedUrl])

  const deleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    localStorage.setItem('utm_history', JSON.stringify(updated))
  }

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([])
      localStorage.removeItem('utm_history')
    }
  }

  const copyItemUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadHistory = () => {
    if (history.length === 0) return

    const csv = [
      ['URL', 'Source', 'Medium', 'Campaign', 'Created At'].join(','),
      ...history.map((item) =>
        [
          `"${item.url}"`,
          item.source,
          item.medium,
          item.campaign,
          new Date(item.createdAt).toLocaleString(),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `utm-history-${Date.now()}.csv`
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors border-b border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Generated URLs History
        </h3>
        <span className="text-xl text-gray-600">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm mb-2">No URLs generated yet</p>
              <p className="text-gray-400 text-xs">
                Generated URLs will appear here
              </p>
            </div>
          ) : (
            <>
              {/* History Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    {/* Item Header */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-1">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs font-mono text-gray-700 truncate">
                          {item.url}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-lg flex-shrink-0"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>

                    {/* Item Details */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="bg-white border border-gray-200 rounded p-2">
                        <p className="text-gray-600 uppercase tracking-wide text-xs mb-1">
                          Source
                        </p>
                        <p className="font-semibold text-gray-900">{item.source}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-2">
                        <p className="text-gray-600 uppercase tracking-wide text-xs mb-1">
                          Medium
                        </p>
                        <p className="font-semibold text-gray-900">{item.medium}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-2">
                        <p className="text-gray-600 uppercase tracking-wide text-xs mb-1">
                          Campaign
                        </p>
                        <p className="font-semibold text-gray-900">{item.campaign}</p>
                      </div>
                    </div>

                    {/* Item Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyItemUrl(item.url)}
                        className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => window.open(item.url, '_blank')}
                        className="flex-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded hover:bg-purple-100 transition-colors"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="border-t pt-4 flex gap-2">
                <button
                  onClick={downloadHistory}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={clearHistory}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  Clear History
                </button>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>{history.length}</strong> URL{history.length !== 1 ? 's' : ''} generated
                  {history.length > 0 &&
                    ` - Latest: ${new Date(history[0].createdAt).toLocaleTimeString()}`}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
