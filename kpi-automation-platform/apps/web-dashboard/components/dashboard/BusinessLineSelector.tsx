'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kpi/ui-components'
import { Building2, BriefcaseBusiness, Sparkles } from 'lucide-react'

interface BusinessLine {
  value: string
  label: string
  path: string
  icon: React.ReactNode
  color: string
}

const businessLines: BusinessLine[] = [
  {
    value: 'all',
    label: 'All Business Lines',
    path: '/dashboard',
    icon: <Building2 className="h-4 w-4" />,
    color: 'text-gray-600',
  },
  {
    value: 'outsourcing',
    label: 'Outsourcing',
    path: '/dashboard/outsourcing',
    icon: <BriefcaseBusiness className="h-4 w-4" />,
    color: 'text-blue-600',
  },
  {
    value: 'b2b',
    label: 'B2B',
    path: '/dashboard/b2b',
    icon: <Building2 className="h-4 w-4" />,
    color: 'text-green-600',
  },
  {
    value: 'anyon',
    label: 'ANYON',
    path: '/dashboard/anyon',
    icon: <Sparkles className="h-4 w-4" />,
    color: 'text-purple-600',
  },
]

export function BusinessLineSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const currentLine = businessLines.find(line =>
    pathname === line.path
  ) || businessLines[0]

  const handleChange = (value: string) => {
    const line = businessLines.find(l => l.value === value)
    if (line) {
      router.push(line.path)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={currentLine.color}>
          {currentLine.icon}
        </div>
        <span className="text-sm font-medium text-gray-700">Business Line:</span>
      </div>
      <Select value={currentLine.value} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {businessLines.map((line) => (
            <SelectItem key={line.value} value={line.value}>
              <div className="flex items-center gap-2">
                <span className={line.color}>{line.icon}</span>
                <span>{line.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
