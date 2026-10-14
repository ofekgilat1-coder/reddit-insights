'use client'

import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DATE_RANGE_OPTIONS } from '@/lib/format'
import type { DateRange } from '@/lib/types'

const items = DATE_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

export function DateRangeSelect({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (range: DateRange) => void
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as DateRange)
      }}
    >
      <SelectTrigger className="w-44" aria-label="Date range">
        <CalendarIcon className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
