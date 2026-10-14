'use client'

import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { PageHeader } from '@/components/shared/page-header'
import { DateRangeSelect } from '@/components/shared/date-range-select'
import { ErrorState } from '@/components/shared/states'
import { CommentDetailSheet } from '@/components/shared/comment-detail-sheet'
import { useOverview } from '@/lib/hooks/use-insights'
import { insightsService } from '@/lib/services'
import { formatRelative } from '@/lib/format'
import type { DateRange, RedditComment } from '@/lib/types'
import { MetricCards } from './metric-cards'
import { ActivityChart } from './activity-chart'
import { TopicDistributionChart } from './topic-distribution-chart'
import { SubredditChart } from './subreddit-chart'
import { SentimentChart } from './sentiment-chart'
import { TopComments } from './top-comments'
import { TopTopics } from './top-topics'
import { RecentActivity } from './recent-activity'
import { OverviewSkeleton } from './overview-skeleton'

export function OverviewView() {
  const [range, setRange] = useState<DateRange>('6m')
  const [selected, setSelected] = useState<RedditComment | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { data, error, isLoading, mutate } = useOverview(range)
  const { mutate: globalMutate } = useSWRConfig()

  async function refresh() {
    setRefreshing(true)
    try {
      const result = await insightsService.refreshAnalysis()
      await globalMutate(() => true)
      toast.success('Analysis refreshed', {
        description: `${result.newComments} new comments · ${result.topicsUpdated} topics updated`,
      })
    } catch {
      toast.error('Refresh failed', { description: 'Please try again in a moment.' })
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Overview"
        description={
          data
            ? `A snapshot of your Reddit activity. Last analyzed ${formatRelative(data.lastAnalyzedAt)}.`
            : 'A snapshot of your Reddit activity.'
        }
        actions={
          <>
            <DateRangeSelect value={range} onChange={setRange} />
            <Button variant="outline" onClick={refresh} disabled={refreshing}>
              {refreshing ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCwIcon data-icon="inline-start" />
              )}
              Refresh analysis
            </Button>
          </>
        }
      />

      {error && !data ? (
        <ErrorState onRetry={() => mutate()} />
      ) : isLoading && !data ? (
        <OverviewSkeleton />
      ) : data ? (
        <div className="flex flex-col gap-4">
          <MetricCards metrics={data.metrics} range={range} />

          <div className="grid gap-4 lg:grid-cols-3">
            <ActivityChart data={data.activity} className="lg:col-span-2" />
            <TopicDistributionChart data={data.topicDistribution} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SubredditChart data={data.subreddits} />
            <SentimentChart data={data.sentiment} totals={data.sentimentTotals} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <TopComments
              comments={data.topComments}
              onSelect={setSelected}
              className="lg:col-span-2"
            />
            <RecentActivity events={data.recentActivity} />
          </div>

          <TopTopics topics={data.topTopics} />
        </div>
      ) : null}

      <CommentDetailSheet comment={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </main>
  )
}
