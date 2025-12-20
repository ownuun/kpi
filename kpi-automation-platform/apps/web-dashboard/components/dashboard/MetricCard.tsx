import { Card, CardContent, CardHeader, CardTitle } from '@kpi/ui-components'
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  format?: 'currency' | 'number' | 'percentage'
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  trend = 'neutral',
  format = 'number',
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val

    // Handle invalid numbers
    if (isNaN(val) || !isFinite(val)) {
      return format === 'currency' ? '₩0' : '0'
    }

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0,
        }).format(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      default:
        return new Intl.NumberFormat('ko-KR').format(val)
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4" />
      case 'down':
        return <ArrowDownIcon className="h-4 w-4" />
      default:
        return <TrendingUpIcon className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && !isNaN(change) && isFinite(change) && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()} mt-1`}>
            {getTrendIcon()}
            <span className="font-medium">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-gray-500">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
