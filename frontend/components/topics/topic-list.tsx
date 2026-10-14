'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendBadge } from '@/components/shared/insight-badges'
import { cn } from '@/lib/utils'
import { formatNumber, formatPercent } from '@/lib/format'
import type { TopicSummary } from '@/lib/types'
import { Sparkline } from './sparkline'

export function TopicList({
  topics,
  selectedId,
  onSelect,
}: {
  topics: TopicSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>{topics.length} topics</CardTitle>
        <CardDescription>Sorted by comment volume</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <ul className="flex flex-col gap-1" aria-label="Topics">
          {topics.map((topic) => {
            const active = topic.id === selectedId
            return (
              <li key={topic.id}>
                <button
                  type="button"
                  onClick={() => onSelect(topic.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex w-full flex-col gap-2 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2',
                    active && 'bg-muted ring-1 ring-border',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: topic.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm font-medium">{topic.name}</span>
                    </span>
                    <TrendBadge trend={topic.trend} growth={topic.growth} />
                  </div>
                  <div className="flex items-end gap-3">
                    <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {formatNumber(topic.commentCount)} · {formatPercent(topic.share)}
                    </p>
                    <div className="min-w-0 flex-1">
                      <Sparkline data={topic.sparkline} color={topic.color} id={`list-${topic.id}`} />
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
