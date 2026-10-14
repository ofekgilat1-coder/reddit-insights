import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendBadge } from '@/components/shared/insight-badges'
import { EmptyState } from '@/components/shared/states'
import { Sparkline } from '@/components/topics/sparkline'
import { formatNumber, formatPercent } from '@/lib/format'
import type { TopicSummary } from '@/lib/types'

export function TopTopics({ topics }: { topics: TopicSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top topics</CardTitle>
        <CardDescription>The themes you return to most often</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/topics" />} nativeButton={false}>
            Explore topics
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {topics.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topics.slice(0, 4).map((topic) => (
              <Link
                key={topic.id}
                href={`/topics?topic=${topic.id}`}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 focus-visible:outline-2"
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
                <Sparkline data={topic.sparkline} color={topic.color} id={`top-${topic.id}`} />
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(topic.commentCount)} comments · {formatPercent(topic.share)} of total
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No topics yet"
            description="Topics appear once comments are analyzed."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
