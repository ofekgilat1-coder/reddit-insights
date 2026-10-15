export type Sentiment = 'positive' | 'neutral' | 'negative'

export type DateRange = '30d' | '90d' | '6m' | '12m' | 'all'

export type TopicTrend = 'rising' | 'stable' | 'declining'

export interface RedditComment {
  id: string
  body: string
  subreddit: string
  postTitle: string
  createdAt: string
  score: number
  replies: number
  topicId: string
  subtopic: string
  secondaryTopicIds: string[]
  sentiment: Sentiment
  /** -1 (very negative) to 1 (very positive) */
  sentimentScore: number
  permalink: string
}

export interface Topic {
  id: string
  name: string
  description: string
  keywords: string[]
  /** CSS color reference, e.g. `var(--chart-1)` */
  color: string
}

export interface CountPoint {
  label: string
  count: number
}

export interface SentimentBreakdown {
  positive: number
  neutral: number
  negative: number
}

export interface TopicSummary extends Topic {
  commentCount: number
  /** 0..1 share of all comments in the selected range */
  share: number
  avgScore: number
  trend: TopicTrend
  /** Percentage change between the first and second half of the range */
  growth: number
  sparkline: CountPoint[]
  topSubreddits: CountPoint[]
  subtopics: string[]
}

export interface TopicDetail extends TopicSummary {
  activity: CountPoint[]
  sentiment: SentimentBreakdown
  representativeComments: RedditComment[]
}

export interface MetricValue {
  value: number
  previous: number
  /** Percentage change vs previous period, null when there is no baseline */
  change: number | null
}

export interface ActivityPoint {
  label: string
  comments: number
  karma: number
}

export interface SentimentPoint extends SentimentBreakdown {
  label: string
}

export interface TopicShare {
  topicId: string
  name: string
  count: number
  share: number
  color: string
}

export type ActivityEventType = 'comment' | 'milestone' | 'analysis'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  title: string
  description: string
  timestamp: string
  commentId?: string
}

export interface OverviewData {
  range: DateRange
  metrics: {
    totalComments: MetricValue
    activeSubreddits: MetricValue
    topicsDiscovered: MetricValue
    avgScore: MetricValue
  }
  activity: ActivityPoint[]
  subreddits: CountPoint[]
  topicDistribution: TopicShare[]
  sentiment: SentimentPoint[]
  sentimentTotals: SentimentBreakdown
  topComments: RedditComment[]
  topTopics: TopicSummary[]
  recentActivity: ActivityEvent[]
  lastAnalyzedAt: string
}

export type CommentSortField = 'date' | 'score'
export type SortDirection = 'asc' | 'desc'

export interface CommentQuery {
  search?: string
  subreddit?: string
  topicId?: string
  sentiment?: Sentiment
  range?: DateRange
  sortBy: CommentSortField
  sortDir: SortDirection
  page: number
  pageSize: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterOptions {
  subreddits: string[]
  topics: Topic[]
}

export interface AssistantReply {
  id: string
  /** Paragraphs. Citation markers like `[1]` map to `sources[0]`. */
  content: string[]
  sources: RedditComment[]
  followUps: string[]
}

export type ConnectionStatus = 'demo' | 'connected' | 'disconnected'

export interface UserProfile {
  username: string
  displayName: string
  initials: string
  connection: {
    status: ConnectionStatus
    lastSyncedAt: string | null
    commentsIndexed: number
  }
}

export type TopicGranularity = 'broad' | 'balanced' | 'detailed'
export type RetentionPeriod = '30d' | '90d' | '365d' | 'forever'
export type ThemePreference = 'light' | 'dark' | 'system'

export interface AppSettings {
  analysis: {
    autoSync: boolean
    sentimentAnalysis: boolean
    includeLowScore: boolean
    granularity: TopicGranularity
    excludedSubreddits: string[]
  }
  retention: {
    period: RetentionPeriod
    storeRawText: boolean
  }
}

export interface RefreshResult {
  analyzedAt: string
  newComments: number
  topicsUpdated: number
}

export interface ExportResult {
  filename: string
  sizeBytes: number
}
