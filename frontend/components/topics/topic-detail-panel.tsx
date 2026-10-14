'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowBigUpIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CommentDetailSheet } from '@/components/shared/comment-detail-sheet'
import { SentimentBadge, TrendBadge } from '@/components/shared/insight-badges'
import { ErrorState } from '@/components/shared/states'
import { useTopic } from '@/lib/hooks/use-insights'
import { formatDate, formatNumber, formatPercent } from '@/lib/format'
import type { DateRange, RedditComment, SentimentBreakdown } from '@/lib/types'

export function TopicDetailPanel({ topicId, range }: { topicId: string; range: DateRange }) {
  const { data: topic, error, isLoading, mutate } = useTopic(topicId, range)
  const [selected, setSelected] = useState<RedditComment | null>(null)

  if (error) return <ErrorState onRetry={() => mutate()} />
  if (isLoading || !topic) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartConfig = { count: { label: 'Comments', color: topic.color } } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: topic.color }}
            aria-hidden="true"
          />
          <CardTitle className="text-lg">{topic.name}</CardTitle>
          <TrendBadge trend={topic.trend} growth={topic.growth} />
        </div>
        <CardDescription className="text-pretty">{topic.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <dl className="grid grid-cols-3 gap-3">
          <Stat label="Comments" value={formatNumber(topic.commentCount)} />
          <Stat label="Share of total" value={formatPercent(topic.share, 1)} />
          <Stat label="Avg. score" value={topic.avgScore.toFixed(1)} />
        </dl>

        <section className="flex flex-col gap-3" aria-labelledby="topic-activity">
          <h3 id="topic-activity" className="text-sm font-medium">
            Activity over time
          </h3>
          <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
            <BarChart data={topic.activity} margin={{ left: 0, right: 0, top: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="flex flex-col gap-3" aria-labelledby="topic-sentiment">
            <h3 id="topic-sentiment" className="text-sm font-medium">
              Sentiment
            </h3>
            <SentimentBars sentiment={topic.sentiment} />
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="topic-subreddits">
            <h3 id="topic-subreddits" className="text-sm font-medium">
              Top subreddits
            </h3>
            <ul className="flex flex-col gap-2">
              {topic.topSubreddits.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-muted-foreground">r/{s.label}</span>
                  <span className="font-medium tabular-nums">{formatNumber(s.count)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="flex flex-col gap-3" aria-labelledby="topic-subtopics">
            <h3 id="topic-subtopics" className="text-sm font-medium">
              Sub-topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {topic.subtopics.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-3" aria-labelledby="topic-keywords">
            <h3 id="topic-keywords" className="text-sm font-medium">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {topic.keywords.map((k) => (
                <Badge key={k} variant="outline" className="font-mono font-normal">
                  {k}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <Separator />

        <section className="flex flex-col gap-3" aria-labelledby="topic-comments">
          <h3 id="topic-comments" className="text-sm font-medium">
            Representative comments
          </h3>
          {topic.representativeComments.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {topic.representativeComments.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c)}
                    className="flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2"
                  >
                    <p className="line-clamp-3 text-sm leading-relaxed text-pretty">{c.body}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">r/{c.subreddit}</span>
                      <span>{formatDate(c.createdAt)}</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <ArrowBigUpIcon className="size-3.5" aria-hidden="true" />
                        {formatNumber(c.score)}
                      </span>
                      <SentimentBadge sentiment={c.sentiment} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No comments in this range.</p>
          )}
        </section>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button render={<Link href={`/comments?topic=${topic.id}`} />} nativeButton={false}>
          View all comments
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button
          variant="outline"
          render={
            <Link
              href={`/chat?q=${encodeURIComponent(`Summarize my views on ${topic.name}`)}`}
            />
          }
          nativeButton={false}
        >
          <SparklesIcon data-icon="inline-start" />
          Ask AI about this topic
        </Button>
      </CardFooter>

      <CommentDetailSheet comment={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

const SENTIMENT_ROWS: { key: keyof SentimentBreakdown; label: string; className: string }[] = [
  { key: 'positive', label: 'Positive', className: 'bg-success' },
  { key: 'neutral', label: 'Neutral', className: 'bg-chart-5' },
  { key: 'negative', label: 'Negative', className: 'bg-destructive' },
]

function SentimentBars({ sentiment }: { sentiment: SentimentBreakdown }) {
  const total = sentiment.positive + sentiment.neutral + sentiment.negative || 1
  return (
    <ul className="flex flex-col gap-3">
      {SENTIMENT_ROWS.map((row) => {
        const share = sentiment[row.key] / total
        return (
          <li key={row.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium tabular-nums">{formatPercent(share)}</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${row.label} sentiment`}
              aria-valuenow={Math.round(share * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={`h-full rounded-full ${row.className}`} style={{ width: `${share * 100}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
