'use client'

import Link from 'next/link'
import { ArrowBigUpIcon, ArrowRightIcon, MessageCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/shared/states'
import { TopicBadge } from '@/components/shared/insight-badges'
import { topicFor } from '@/components/shared/comment-detail-sheet'
import { formatDate, formatNumber } from '@/lib/format'
import type { RedditComment } from '@/lib/types'

export function TopComments({
  comments,
  onSelect,
  className,
}: {
  comments: RedditComment[]
  onSelect: (comment: RedditComment) => void
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top comments</CardTitle>
        <CardDescription>Your highest-scoring comments in this range</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/comments?sort=score" />}
            nativeButton={false}
          >
            View all
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {comments.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {comments.map((comment) => {
              const topic = topicFor(comment.topicId)
              return (
                <li key={comment.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(comment)}
                    className="flex w-full flex-col gap-2 rounded-md py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2 sm:px-2"
                  >
                    <p className="line-clamp-2 text-sm leading-relaxed text-pretty">{comment.body}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">r/{comment.subreddit}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <ArrowBigUpIcon className="size-3.5" aria-hidden="true" />
                        {formatNumber(comment.score)}
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <MessageCircleIcon className="size-3.5" aria-hidden="true" />
                        {formatNumber(comment.replies)}
                      </span>
                      {topic ? <TopicBadge name={topic.name} color={topic.color} /> : null}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            title="No comments in this range"
            description="Try selecting a longer date range."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
