import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TopicsView } from '@/components/topics/topics-view'

export const metadata: Metadata = {
  title: 'Topics',
}

export default function TopicsPage() {
  return (
    <Suspense>
      <TopicsView />
    </Suspense>
  )
}
