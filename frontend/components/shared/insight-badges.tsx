import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Sentiment, TopicTrend } from '@/lib/types'

const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
}

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: 'bg-success',
  neutral: 'bg-muted-foreground',
  negative: 'bg-destructive',
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span className={cn('size-1.5 rounded-full', SENTIMENT_DOT[sentiment])} aria-hidden="true" />
      {SENTIMENT_LABEL[sentiment]}
    </Badge>
  )
}

export function TopicBadge({ name, color }: { name: string; color: string }) {
  return (
    <Badge variant="secondary" className="max-w-full gap-1.5 font-normal">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="truncate">{name}</span>
    </Badge>
  )
}

export function TrendBadge({ trend, growth }: { trend: TopicTrend; growth: number }) {
  const Icon = trend === 'rising' ? TrendingUpIcon : trend === 'declining' ? TrendingDownIcon : MinusIcon
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-normal tabular-nums',
        trend === 'rising' && 'text-success',
        trend === 'declining' && 'text-destructive',
        trend === 'stable' && 'text-muted-foreground',
      )}
    >
      <Icon data-icon="inline-start" />
      {trend === 'stable' ? 'Stable' : `${growth > 0 ? '+' : ''}${Math.round(growth)}%`}
    </Badge>
  )
}
