'use client'

import useSWR from 'swr'
import { insightsService } from '@/lib/services'
import type { CommentQuery, DateRange } from '@/lib/types'

export const cacheKeys = {
  profile: 'profile',
  overview: (range: DateRange) => ['overview', range] as const,
  topics: (range: DateRange) => ['topics', range] as const,
  topic: (id: string, range: DateRange) => ['topic', id, range] as const,
  comments: (query: CommentQuery) => ['comments', JSON.stringify(query)] as const,
  comment: (id: string) => ['comment', id] as const,
  filters: 'filters',
  settings: 'settings',
}

export function useProfile() {
  return useSWR(cacheKeys.profile, () => insightsService.getProfile())
}

export function useOverview(range: DateRange) {
  return useSWR(cacheKeys.overview(range), () => insightsService.getOverview(range), {
    keepPreviousData: true,
  })
}

export function useTopics(range: DateRange) {
  return useSWR(cacheKeys.topics(range), () => insightsService.getTopics(range), {
    keepPreviousData: true,
  })
}

export function useTopic(id: string | null, range: DateRange) {
  return useSWR(id ? cacheKeys.topic(id, range) : null, () =>
    insightsService.getTopic(id as string, range),
  )
}

export function useComments(query: CommentQuery) {
  return useSWR(cacheKeys.comments(query), () => insightsService.getComments(query), {
    keepPreviousData: true,
  })
}

export function useComment(id: string | null) {
  return useSWR(id ? cacheKeys.comment(id) : null, () =>
    insightsService.getComment(id as string),
  )
}

export function useFilterOptions() {
  return useSWR(cacheKeys.filters, () => insightsService.getFilterOptions())
}

export function useSettings() {
  return useSWR(cacheKeys.settings, () => insightsService.getSettings())
}
