import type {
  AppSettings,
  AssistantReply,
  CommentQuery,
  DateRange,
  ExportResult,
  FilterOptions,
  OverviewData,
  Paginated,
  RedditComment,
  RefreshResult,
  TopicDetail,
  TopicSummary,
  UserProfile,
} from '@/lib/types'
import type { ChatTurn, InsightsService } from './insights-service'

/**
 * Reference implementation for a future FastAPI backend. Not wired up yet —
 * switch `lib/services/index.ts` to `new HttpInsightsService(baseUrl)` once
 * the API exposes these routes.
 */
export class HttpInsightsService implements InsightsService {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error(`Request to ${path} failed with ${response.status}`)
    }
    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  getProfile() {
    return this.request<UserProfile>('/me')
  }

  getOverview(range: DateRange) {
    return this.request<OverviewData>(`/analytics/overview?range=${range}`)
  }

  getTopics(range: DateRange) {
    return this.request<TopicSummary[]>(`/topics?range=${range}`)
  }

  getTopic(id: string, range: DateRange) {
    return this.request<TopicDetail | null>(
      `/topics/${encodeURIComponent(id)}?range=${range}`,
    )
  }

  getComments(query: CommentQuery) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') params.set(key, String(value))
    }
    return this.request<Paginated<RedditComment>>(`/comments?${params}`)
  }

  getComment(id: string) {
    return this.request<RedditComment | null>(
      `/comments/${encodeURIComponent(id)}`,
    )
  }

  getFilterOptions() {
    return this.request<FilterOptions>('/comments/filters')
  }

  askAssistant(question: string, history: ChatTurn[]) {
    return this.request<AssistantReply>('/chat', {
      method: 'POST',
      body: JSON.stringify({ question, history }),
    })
  }

  refreshAnalysis() {
    return this.request<RefreshResult>('/analysis/refresh', { method: 'POST' })
  }

  getSettings() {
    return this.request<AppSettings>('/settings')
  }

  updateSettings(settings: AppSettings) {
    return this.request<AppSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  exportData() {
    return this.request<ExportResult>('/data/export', { method: 'POST' })
  }

  deleteAllData() {
    return this.request<void>('/data', { method: 'DELETE' })
  }

  restoreDemoData() {
    return Promise.resolve()
  }
}
