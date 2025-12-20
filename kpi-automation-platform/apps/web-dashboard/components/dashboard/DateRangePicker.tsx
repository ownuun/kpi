'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@kpi/ui-components'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

type DateRange = '7d' | '30d' | '90d' | '1y' | 'custom'

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
}

const dateRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'custom', label: 'Custom range' },
] as const

export function DateRangePicker({ value = '30d', onChange }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(value)

  const handleChange = (newValue: string) => {
    const range = newValue as DateRange
    setSelectedRange(range)
    onChange?.(range)
  }

  const handlePrevious = () => {
    // Logic to move to previous period
    console.log('Previous period')
  }

  const handleNext = () => {
    // Logic to move to next period
    console.log('Next period')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Select value={selectedRange} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
