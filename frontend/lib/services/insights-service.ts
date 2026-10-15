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

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Data-access contract for the UI. The app only talks to this interface,
 * so the mock implementation can be swapped for HTTP calls to a FastAPI
 * backend (see `http-insights-service.ts`) without touching components.
 */
export interface InsightsService {
  getProfile(): Promise<UserProfile>
  getOverview(range: DateRange): Promise<OverviewData>
  getTopics(range: DateRange): Promise<TopicSummary[]>
  getTopic(id: string, range: DateRange): Promise<TopicDetail | null>
  getComments(query: CommentQuery): Promise<Paginated<RedditComment>>
  getComment(id: string): Promise<RedditComment | null>
  getFilterOptions(): Promise<FilterOptions>
  askAssistant(question: string, history: ChatTurn[]): Promise<AssistantReply>
  refreshAnalysis(): Promise<RefreshResult>
  getSettings(): Promise<AppSettings>
  updateSettings(settings: AppSettings): Promise<AppSettings>
  exportData(): Promise<ExportResult>
  deleteAllData(): Promise<void>
  restoreDemoData(): Promise<void>
}
