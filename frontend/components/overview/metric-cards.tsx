import {
  ArrowBigUpIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  HashIcon,
  MessageSquareTextIcon,
  NetworkIcon,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatChange, formatCompact, previousPeriodLabel } from '@/lib/format'
import type { DateRange, MetricValue, OverviewData } from '@/lib/types'

const METRICS: {
  key: keyof OverviewData['metrics']
  label: string
  icon: LucideIcon
  decimals?: number
}[] = [
  { key: 'totalComments', label: 'Total comments', icon: MessageSquareTextIcon },
  { key: 'activeSubreddits', label: 'Active subreddits', icon: HashIcon },
  { key: 'topicsDiscovered', label: 'Topics discovered', icon: NetworkIcon },
  { key: 'avgScore', label: 'Avg. comment score', icon: ArrowBigUpIcon, decimals: 1 },
]

export function MetricCards({
  metrics,
  range,
}: {
  metrics: OverviewData['metrics']
  range: DateRange
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {METRICS.map((m) => (
        <MetricCard
          key={m.key}
          label={m.label}
          icon={m.icon}
          metric={metrics[m.key]}
          decimals={m.decimals}
          comparison={previousPeriodLabel(range)}
        />
      ))}
    </div>
  )
}

function MetricCard({
  label,
  icon: Icon,
  metric,
  decimals,
  comparison,
}: {
  label: string
  icon: LucideIcon
  metric: MetricValue
  decimals?: number
  comparison: string
}) {
  const value = decimals ? metric.value.toFixed(decimals) : formatCompact(metric.value)
  const change = metric.change
  const positive = change !== null && change >= 0

  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center justify-between gap-2">
          <span className="truncate">{label}</span>
          <Icon className="size-4 shrink-0" aria-hidden="true" />
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
        <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          {change !== null ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium tabular-nums',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              {positive ? (
                <ArrowUpRightIcon className="size-3" aria-hidden="true" />
              ) : (
                <ArrowDownRightIcon className="size-3" aria-hidden="true" />
              )}
              {formatChange(change)}
            </span>
          ) : null}
          <span>{comparison}</span>
        </p>
      </CardHeader>
    </Card>
  )
}
