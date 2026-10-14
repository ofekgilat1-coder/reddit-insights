import { MessageSquareIcon, SparklesIcon, TrophyIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/states'
import { formatRelative } from '@/lib/format'
import type { ActivityEvent, ActivityEventType } from '@/lib/types'

const ICONS: Record<ActivityEventType, typeof MessageSquareIcon> = {
  comment: MessageSquareIcon,
  milestone: TrophyIcon,
  analysis: SparklesIcon,
}

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest comments and insights</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <ol className="flex flex-col gap-4">
            {events.map((event) => {
              const Icon = ICONS[event.type]
              return (
                <li key={event.id} className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm font-medium leading-snug">{event.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
                    <time dateTime={event.timestamp} className="text-xs text-muted-foreground">
                      {formatRelative(event.timestamp)}
                    </time>
                  </div>
                </li>
              )
            })}
          </ol>
        ) : (
          <EmptyState title="No recent activity" description="Nothing new yet." bordered={false} />
        )}
      </CardContent>
    </Card>
  )
}
