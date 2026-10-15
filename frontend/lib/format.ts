import { MOCK_NOW } from '@/lib/mock/mock-data'
import type { DateRange } from '@/lib/types'

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const standard = new Intl.NumberFormat('en-US')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

export function formatNumber(value: number) {
  return standard.format(value)
}

export function formatCompact(value: number) {
  return Math.abs(value) >= 10_000 ? compact.format(value) : standard.format(value)
}

export function formatPercent(value: number, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatChange(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return `${dateTimeFormatter.format(new Date(iso))} UTC`
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

/** Relative time against the dataset's reference "now" so mock data reads naturally. */
export function formatRelative(iso: string) {
  const then = new Date(iso).getTime()
  const now = Math.max(MOCK_NOW.getTime(), then)
  const diff = Math.max(0, now - then)
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string; short: string }[] = [
  { value: '30d', label: 'Last 30 days', short: '30D' },
  { value: '90d', label: 'Last 90 days', short: '90D' },
  { value: '6m', label: 'Last 6 months', short: '6M' },
  { value: '12m', label: 'Last 12 months', short: '12M' },
  { value: 'all', label: 'All time', short: 'All' },
]

export function rangeLabel(range: DateRange) {
  return DATE_RANGE_OPTIONS.find((o) => o.value === range)?.label ?? range
}

export function previousPeriodLabel(range: DateRange) {
  switch (range) {
    case '30d':
      return 'vs prior 30 days'
    case '90d':
      return 'vs prior 90 days'
    case '6m':
      return 'vs prior 6 months'
    case '12m':
      return 'vs prior 12 months'
    default:
      return 'all time'
  }
}
