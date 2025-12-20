'use client'

import { useState } from 'react'

export type BusinessLine = 'all' | 'B2B' | 'ANYON' | '외주'

interface BusinessLineTabsProps {
  onTabChange: (line: BusinessLine) => void
  defaultTab?: BusinessLine
}

export default function BusinessLineTabs({ onTabChange, defaultTab = 'all' }: BusinessLineTabsProps) {
  const [activeTab, setActiveTab] = useState<BusinessLine>(defaultTab)

  const tabs: { value: BusinessLine; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'B2B', label: 'B2B' },
    { value: 'ANYON', label: 'ANYON' },
    { value: '외주', label: '외주' }
  ]

  const handleTabClick = (line: BusinessLine) => {
    setActiveTab(line)
    onTabChange(line)
  }

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition
              ${
                activeTab === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
