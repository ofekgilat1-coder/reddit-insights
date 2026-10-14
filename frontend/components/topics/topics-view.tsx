'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { NetworkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { DateRangeSelect } from '@/components/shared/date-range-select'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { useTopics } from '@/lib/hooks/use-insights'
import type { DateRange } from '@/lib/types'
import { TopicList } from './topic-list'
import { TopicDetailPanel } from './topic-detail-panel'

export function TopicsView() {
  const [range, setRange] = useState<DateRange>('6m')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: topics, error, isLoading, mutate } = useTopics(range)

  const requested = searchParams.get('topic')
  const selectedId =
    topics?.find((t) => t.id === requested)?.id ?? topics?.[0]?.id ?? null

  function select(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('topic', id)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Topics"
        description="Themes discovered across your comment history, grouped by AI. Select a topic to see how it has evolved."
        actions={<DateRangeSelect value={range} onChange={setRange} />}
      />

      {error && !topics ? (
        <ErrorState onRetry={() => mutate()} />
      ) : isLoading && !topics ? (
        <TopicsSkeleton />
      ) : topics && topics.length === 0 ? (
        <EmptyState
          icon={NetworkIcon}
          title="No topics in this range"
          description="Try a longer date range, or refresh the analysis from the Overview page."
        />
      ) : topics ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <TopicList topics={topics} selectedId={selectedId} onSelect={select} />
          {selectedId ? <TopicDetailPanel topicId={selectedId} range={range} /> : null}
        </div>
      ) : null}
    </main>
  )
}

function TopicsSkeleton() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <Card>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
