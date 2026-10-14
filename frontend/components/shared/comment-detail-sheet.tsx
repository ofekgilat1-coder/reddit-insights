'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowBigUpIcon,
  CopyIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
  SparklesIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SentimentBadge, TopicBadge } from '@/components/shared/insight-badges'
import { MOCK_TOPICS } from '@/lib/mock/mock-data'
import { formatDateTime, formatNumber } from '@/lib/format'
import type { RedditComment } from '@/lib/types'

export function topicFor(id: string) {
  return MOCK_TOPICS.find((t) => t.id === id)
}

export function CommentDetailSheet({
  comment,
  onOpenChange,
}: {
  comment: RedditComment | null
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const topic = comment ? topicFor(comment.topicId) : undefined

  async function copyLink() {
    if (!comment) return
    try {
      await navigator.clipboard.writeText(comment.permalink)
      toast.success('Permalink copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <Sheet open={comment !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        {comment ? (
          <>
            <SheetHeader className="border-b">
              <SheetDescription>
                r/{comment.subreddit} · {formatDateTime(comment.createdAt)}
              </SheetDescription>
              <SheetTitle className="text-base leading-snug text-pretty">
                {comment.postTitle}
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
              <blockquote className="border-l-2 border-primary pl-4 text-sm leading-relaxed text-pretty">
                {comment.body}
              </blockquote>

              <dl className="grid grid-cols-3 gap-3">
                <Stat label="Score" icon={ArrowBigUpIcon} value={formatNumber(comment.score)} />
                <Stat label="Replies" icon={MessageCircleIcon} value={formatNumber(comment.replies)} />
                <Stat
                  label="Sentiment"
                  value={`${comment.sentimentScore > 0 ? '+' : ''}${comment.sentimentScore.toFixed(2)}`}
                />
              </dl>

              <Separator />

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-medium text-muted-foreground">Classification</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {topic ? <TopicBadge name={topic.name} color={topic.color} /> : null}
                  {comment.secondaryTopicIds.map((id) => {
                    const secondary = topicFor(id)
                    return secondary ? (
                      <TopicBadge key={id} name={secondary.name} color={secondary.color} />
                    ) : null
                  })}
                  <SentimentBadge sentiment={comment.sentiment} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Sub-topic: <span className="text-foreground">{comment.subtopic}</span>
                </p>
              </div>
            </div>

            <SheetFooter className="border-t sm:flex-row">
              <Button
                className="sm:flex-1"
                render={<a href={comment.permalink} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
              >
                <ExternalLinkIcon data-icon="inline-start" />
                Open on Reddit
              </Button>
              <Button variant="outline" onClick={copyLink}>
                <CopyIcon data-icon="inline-start" />
                Copy link
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/chat?q=${encodeURIComponent(`What else have I said about ${comment.subtopic.toLowerCase()}?`)}`,
                  )
                }
              >
                <SparklesIcon data-icon="inline-start" />
                Ask AI
              </Button>
            </SheetFooter>
          </>
        ) : (
          <SheetHeader>
            <SheetTitle className="sr-only">Comment details</SheetTitle>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1 text-base font-semibold tabular-nums">
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        {value}
      </dd>
    </div>
  )
}
