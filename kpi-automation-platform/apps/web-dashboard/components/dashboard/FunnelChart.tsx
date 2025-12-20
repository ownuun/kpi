'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@kpi/ui-components'
import { ArrowRight } from 'lucide-react'

interface FunnelStage {
  name: string
  value: number
  color?: string
}

interface FunnelChartProps {
  stages: FunnelStage[]
  title?: string
  description?: string
}

export function FunnelChart({
  stages,
  title = 'Sales Funnel',
  description = 'Conversion rates through sales stages',
}: FunnelChartProps) {
  const maxValue = Math.max(...stages.map(s => s.value))

  const defaultColors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
  ]

  const getConversionRate = (index: number) => {
    if (index === 0) return 100
    const current = stages[index].value
    const previous = stages[index - 1].value
    return previous > 0 ? Math.round((current / previous) * 100) : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const widthPercent = (stage.value / maxValue) * 100
            const conversionRate = getConversionRate(index)
            const color = stage.color || defaultColors[index % defaultColors.length]

            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{stage.name}</span>
                    {index > 0 && (
                      <span className="text-xs text-gray-500">
                        ({conversionRate}% conversion)
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('ko-KR').format(stage.value)}
                  </span>
                </div>
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500 flex items-center justify-end px-4`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-white font-medium text-sm">
                      {Math.round(widthPercent)}%
                    </span>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Overall Conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {stages.length > 0
                  ? Math.round((stages[stages.length - 1].value / stages[0].value) * 100)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Drop-off Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stages.length > 0
                  ? Math.round((1 - stages[stages.length - 1].value / stages[0].value) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
