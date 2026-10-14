'use client'

import { AlertTriangleIcon, InboxIcon, RotateCwIcon, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this data. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            <RotateCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
  bordered = true,
}: {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  bordered?: boolean
}) {
  return (
    <Empty className={bordered ? 'border border-dashed' : undefined}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}
