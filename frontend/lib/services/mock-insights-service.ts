import {
  MOCK_COMMENTS,
  MOCK_NOW,
  MOCK_PROFILE,
  MOCK_TOPICS,
} from '@/lib/mock/mock-data'
import type {
  ActivityEvent,
  AppSettings,
  AssistantReply,
  CommentQuery,
  CountPoint,
  DateRange,
  MetricValue,
  OverviewData,
  Paginated,
  RedditComment,
  SentimentBreakdown,
  Topic,
  TopicDetail,
  TopicSummary,
  TopicTrend,
} from '@/lib/types'
import type { ChatTurn, InsightsService } from './insights-service'

const DAY_MS = 86_400_000

const RANGE_DAYS: Record<DateRange, number> = {
  '30d': 30,
  '90d': 90,
  '6m': 182,
  '12m': 365,
  all: 730,
}

interface Bucket {
  start: number
  end: number
  label: string
}

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
})
const dayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

function delay(min = 250, max = 650) {
  return new Promise((resolve) =>
    setTimeout(resolve, min + Math.random() * (max - min)),
  )
}

function rangeBounds(range: DateRange) {
  const end = MOCK_NOW.getTime()
  const start = end - RANGE_DAYS[range] * DAY_MS
  return { start, end, previousStart: start - RANGE_DAYS[range] * DAY_MS }
}

function buildBuckets(range: DateRange): Bucket[] {
  const { start, end } = rangeBounds(range)

  if (range === '12m' || range === 'all') {
    const buckets: Bucket[] = []
    const cursor = new Date(start)
    cursor.setUTCDate(1)
    cursor.setUTCHours(0, 0, 0, 0)
    while (cursor.getTime() < end) {
      const next = new Date(cursor)
      next.setUTCMonth(next.getUTCMonth() + 1)
      buckets.push({
        start: Math.max(cursor.getTime(), start),
        end: Math.min(next.getTime(), end),
        label: monthFormatter.format(cursor).replace(' ', " '"),
      })
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }
    return buckets
  }

  const size = range === '30d' ? 1 : 7
  const buckets: Bucket[] = []
  for (let t = start; t < end; t += size * DAY_MS) {
    buckets.push({
      start: t,
      end: Math.min(t + size * DAY_MS, end),
      label: dayFormatter.format(new Date(t)),
    })
  }
  return buckets
}

function time(comment: RedditComment) {
  return new Date(comment.createdAt).getTime()
}

function inWindow(comments: RedditComment[], start: number, end: number) {
  return comments.filter((c) => {
    const t = time(c)
    return t >= start && t < end
  })
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

function metric(value: number, previous: number, hasBaseline: boolean): MetricValue {
  return {
    value,
    previous,
    change: hasBaseline ? percentChange(value, previous) : null,
  }
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const map = new Map<string, number>()
  for (const item of items) {
    const k = key(item)
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return map
}

function topCounts(map: Map<string, number>, limit: number): CountPoint[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function sentimentOf(comments: RedditComment[]): SentimentBreakdown {
  const result: SentimentBreakdown = { positive: 0, neutral: 0, negative: 0 }
  for (const c of comments) result[c.sentiment]++
  return result
}

function bucketCounts(comments: RedditComment[], buckets: Bucket[]) {
  return buckets.map((b) => inWindow(comments, b.start, b.end))
}

function trendFor(growth: number): TopicTrend {
  if (growth > 12) return 'rising'
  if (growth < -12) return 'declining'
  return 'stable'
}

function summarizeTopic(
  topic: Topic,
  rangeComments: RedditComment[],
  range: DateRange,
): TopicSummary {
  const { start, end } = rangeBounds(range)
  const comments = rangeComments.filter((c) => c.topicId === topic.id)
  const mid = start + (end - start) / 2
  const firstHalf = inWindow(comments, start, mid).length
  const secondHalf = inWindow(comments, mid, end).length
  const growth = percentChange(secondHalf, firstHalf) ?? 0
  const buckets = buildBuckets(range)

  return {
    ...topic,
    commentCount: comments.length,
    share: rangeComments.length ? comments.length / rangeComments.length : 0,
    avgScore: Math.round(average(comments.map((c) => c.score))),
    trend: trendFor(growth),
    growth,
    sparkline: bucketCounts(comments, buckets).map((items, i) => ({
      label: buckets[i].label,
      count: items.length,
    })),
    topSubreddits: topCounts(
      countBy(comments, (c) => c.subreddit),
      3,
    ),
    subtopics: [...new Set(comments.map((c) => c.subtopic))],
  }
}

function excerptMatches(comment: RedditComment, terms: string[]) {
  const haystack = `${comment.body} ${comment.subreddit} ${comment.postTitle} ${comment.subtopic}`.toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const DEFAULT_SETTINGS: AppSettings = {
  analysis: {
    autoSync: true,
    sentimentAnalysis: true,
    includeLowScore: false,
    granularity: 'balanced',
    excludedSubreddits: [],
  },
  retention: {
    period: '365d',
    storeRawText: true,
  },
}

export class MockInsightsService implements InsightsService {
  private lastAnalyzedAt = MOCK_PROFILE.connection.lastSyncedAt ?? MOCK_NOW.toISOString()
  private settings: AppSettings = structuredClone(DEFAULT_SETTINGS)
  private cleared = false

  private get comments(): RedditComment[] {
    return this.cleared ? [] : MOCK_COMMENTS
  }

  async getProfile() {
    await delay(150, 300)
    return {
      ...MOCK_PROFILE,
      connection: {
        ...MOCK_PROFILE.connection,
        lastSyncedAt: this.cleared ? null : this.lastAnalyzedAt,
        commentsIndexed: this.comments.length,
      },
    }
  }

  async getOverview(range: DateRange): Promise<OverviewData> {
    await delay()
    const { start, end, previousStart } = rangeBounds(range)
    const current = inWindow(this.comments, start, end)
    const previous = inWindow(this.comments, previousStart, start)
    const hasBaseline = previous.length > 0
    const buckets = buildBuckets(range)
    const perBucket = bucketCounts(current, buckets)

    const topicCounts = countBy(current, (c) => c.topicId)
    const topicDistribution = MOCK_TOPICS.map((topic) => ({
      topicId: topic.id,
      name: topic.name,
      count: topicCounts.get(topic.id) ?? 0,
      share: current.length ? (topicCounts.get(topic.id) ?? 0) / current.length : 0,
      color: topic.color,
    }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)

    const topTopics = MOCK_TOPICS.map((t) => summarizeTopic(t, current, range))
      .filter((t) => t.commentCount > 0)
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5)

    return {
      range,
      metrics: {
        totalComments: metric(current.length, previous.length, hasBaseline),
        activeSubreddits: metric(
          new Set(current.map((c) => c.subreddit)).size,
          new Set(previous.map((c) => c.subreddit)).size,
          hasBaseline,
        ),
        topicsDiscovered: metric(
          new Set(current.map((c) => c.subtopic)).size,
          new Set(previous.map((c) => c.subtopic)).size,
          hasBaseline,
        ),
        avgScore: metric(
          Number(average(current.map((c) => c.score)).toFixed(1)),
          Number(average(previous.map((c) => c.score)).toFixed(1)),
          hasBaseline,
        ),
      },
      activity: perBucket.map((items, i) => ({
        label: buckets[i].label,
        comments: items.length,
        karma: items.reduce((sum, c) => sum + c.score, 0),
      })),
      subreddits: topCounts(
        countBy(current, (c) => c.subreddit),
        8,
      ),
      topicDistribution,
      sentiment: this.sentimentSeries(current, range),
      sentimentTotals: sentimentOf(current),
      topComments: [...current].sort((a, b) => b.score - a.score).slice(0, 5),
      topTopics,
      recentActivity: this.recentActivity(),
      lastAnalyzedAt: this.lastAnalyzedAt,
    }
  }

  private sentimentSeries(comments: RedditComment[], range: DateRange) {
    let buckets = buildBuckets(range)
    if (range === '30d') {
      const { start, end } = rangeBounds(range)
      buckets = []
      for (let t = start; t < end; t += 7 * DAY_MS) {
        buckets.push({
          start: t,
          end: Math.min(t + 7 * DAY_MS, end),
          label: dayFormatter.format(new Date(t)),
        })
      }
    }
    return bucketCounts(comments, buckets).map((items, i) => ({
      label: buckets[i].label,
      ...sentimentOf(items),
    }))
  }

  private recentActivity(): ActivityEvent[] {
    if (this.cleared) return []
    const events: ActivityEvent[] = this.comments.slice(0, 6).map((c) => ({
      id: `comment-${c.id}`,
      type: 'comment',
      title: `Commented in r/${c.subreddit}`,
      description: c.postTitle,
      timestamp: c.createdAt,
      commentId: c.id,
    }))

    const sixtyDaysAgo = MOCK_NOW.getTime() - 60 * DAY_MS
    for (const c of this.comments) {
      if (c.score >= 800 && time(c) >= sixtyDaysAgo) {
        events.push({
          id: `milestone-${c.id}`,
          type: 'milestone',
          title: `Comment passed ${c.score >= 1000 ? `${Math.floor(c.score / 1000)}k` : '800'} points`,
          description: `r/${c.subreddit} · ${c.postTitle}`,
          timestamp: new Date(time(c) + 2 * DAY_MS).toISOString(),
          commentId: c.id,
        })
      }
    }

    events.push({
      id: 'analysis-latest',
      type: 'analysis',
      title: 'Analysis refreshed',
      description: `${this.comments.length.toLocaleString('en-US')} comments re-clustered into ${MOCK_TOPICS.length} topics`,
      timestamp: this.lastAnalyzedAt,
    })

    return events
      .filter((e) => new Date(e.timestamp).getTime() <= MOCK_NOW.getTime() + DAY_MS)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 8)
  }

  async getTopics(range: DateRange) {
    await delay()
    const { start, end } = rangeBounds(range)
    const current = inWindow(this.comments, start, end)
    return MOCK_TOPICS.map((t) => summarizeTopic(t, current, range)).filter(
      (t) => t.commentCount > 0,
    )
  }

  async getTopic(id: string, range: DateRange): Promise<TopicDetail | null> {
    await delay(200, 450)
    const topic = MOCK_TOPICS.find((t) => t.id === id)
    if (!topic) return null
    const { start, end } = rangeBounds(range)
    const current = inWindow(this.comments, start, end)
    const summary = summarizeTopic(topic, current, range)
    const topicComments = current.filter((c) => c.topicId === id)
    const buckets = buildBuckets(range)

    return {
      ...summary,
      activity: bucketCounts(topicComments, buckets).map((items, i) => ({
        label: buckets[i].label,
        count: items.length,
      })),
      sentiment: sentimentOf(topicComments),
      representativeComments: [...topicComments]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    }
  }

  async getComments(query: CommentQuery): Promise<Paginated<RedditComment>> {
    await delay(180, 420)
    const terms = (query.search ?? '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
    const bounds = query.range ? rangeBounds(query.range) : null

    const filtered = this.comments.filter((c) => {
      if (query.subreddit && c.subreddit !== query.subreddit) return false
      if (query.topicId && c.topicId !== query.topicId) return false
      if (query.sentiment && c.sentiment !== query.sentiment) return false
      if (bounds) {
        const t = time(c)
        if (t < bounds.start || t >= bounds.end) return false
      }
      if (terms.length && !excerptMatches(c, terms)) return false
      return true
    })

    const direction = query.sortDir === 'asc' ? 1 : -1
    filtered.sort((a, b) =>
      query.sortBy === 'score'
        ? (a.score - b.score) * direction
        : (time(a) - time(b)) * direction,
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / query.pageSize))
    const page = Math.min(Math.max(1, query.page), totalPages)
    return {
      items: filtered.slice((page - 1) * query.pageSize, page * query.pageSize),
      total: filtered.length,
      page,
      pageSize: query.pageSize,
      totalPages,
    }
  }

  async getComment(id: string) {
    await delay(100, 250)
    return this.comments.find((c) => c.id === id) ?? null
  }

  async getFilterOptions() {
    await delay(100, 200)
    return {
      subreddits: [...new Set(this.comments.map((c) => c.subreddit))].sort((a, b) =>
        a.localeCompare(b),
      ),
      topics: MOCK_TOPICS,
    }
  }

  async askAssistant(question: string, _history: ChatTurn[]): Promise<AssistantReply> {
    await delay(1100, 1900)
    const id = `reply-${Date.now()}`
    const q = question.toLowerCase()
    const comments = this.comments

    if (comments.length === 0) {
      return {
        id,
        content: [
          'There is no comment history to analyze yet. Restore the demo dataset from Settings or connect a Reddit account once the backend is available.',
        ],
        sources: [],
        followUps: [],
      }
    }

    const topicName = (topicId: string) =>
      MOCK_TOPICS.find((t) => t.id === topicId)?.name ?? topicId
    const pct = (n: number) => `${Math.round(n * 100)}%`
    const yearAgo = MOCK_NOW.getTime() - 365 * DAY_MS
    const lastYear = comments.filter((c) => time(c) >= yearAgo)

    if (/(most|top).*(topic|talk)|what.*talk about|topics/.test(q)) {
      const counts = topCounts(countBy(lastYear, (c) => c.topicId), 3)
      const sources = counts.map(
        ({ label }) =>
          lastYear
            .filter((c) => c.topicId === label)
            .sort((a, b) => b.score - a.score)[0],
      )
      return {
        id,
        content: [
          `Over the last 12 months you wrote ${lastYear.length.toLocaleString('en-US')} comments. Three topics account for ${pct(counts.reduce((s, c) => s + c.count, 0) / lastYear.length)} of them.`,
          `**${topicName(counts[0].label)}** leads with ${counts[0].count} comments (${pct(counts[0].count / lastYear.length)}), mostly about evaluation methodology and practical agent reliability [1].`,
          `**${topicName(counts[1].label)}** follows with ${counts[1].count} comments, where you consistently argue for simpler architectures [2]. **${topicName(counts[2].label)}** is third with ${counts[2].count} comments [3].`,
        ],
        sources,
        followUps: [
          'How have my interests changed over time?',
          'Which subreddits am I most active in?',
        ],
      }
    }

    if (/(change|evolv|shift|over time)/.test(q)) {
      const half = MOCK_NOW.getTime() - 365 * DAY_MS
      const before = comments.filter((c) => time(c) < half)
      const after = comments.filter((c) => time(c) >= half)
      const shares = MOCK_TOPICS.map((t) => {
        const b = before.filter((c) => c.topicId === t.id).length / (before.length || 1)
        const a = after.filter((c) => c.topicId === t.id).length / (after.length || 1)
        return { topic: t, before: b, after: a, delta: a - b }
      }).sort((x, y) => y.delta - x.delta)
      const rising = shares[0]
      const falling = shares[shares.length - 1]
      const earliest = before
        .filter((c) => c.topicId === falling.topic.id)
        .sort((a, b) => b.score - a.score)[0]
      const latest = after
        .filter((c) => c.topicId === rising.topic.id)
        .sort((a, b) => b.score - a.score)[0]
      return {
        id,
        content: [
          `Comparing the most recent 12 months with the year before, the biggest shift is toward **${rising.topic.name}**: it grew from ${pct(rising.before)} to ${pct(rising.after)} of your comments [2].`,
          `The largest decline is **${falling.topic.name}**, down from ${pct(falling.before)} to ${pct(falling.after)} [1]. Your tone in that area also became more reflective — fewer how-to answers, more opinions about trade-offs.`,
          'Overall activity increased as well, with weekends consistently being your most active days.',
        ],
        sources: [earliest, latest].filter(Boolean),
        followUps: [
          'Find my strongest arguments about AI.',
          'What topics do I talk about most?',
        ],
      }
    }

    if (/(argument|opinion|believe|stance|\bai\b|llm)/.test(q)) {
      const aiComments = comments
        .filter((c) => c.topicId === 'ai' && c.body.length > 200)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      return {
        id,
        content: [
          'Your most persuasive AI comments share a pattern: you push back on headline metrics and argue for verification over raw capability.',
          `On evaluation, you argue that public benchmarks stop measuring capability once they become targets, and recommend small private evals built from real failure cases [1].`,
          `On agents, your strongest claim is that reliability depends on cheap per-step verification, because errors compound across long tool loops [2]. You also reject the idea that safety and capability research are in tension [3].`,
        ],
        sources: aiComments,
        followUps: [
          'Which of my comments received the most engagement?',
          'How have my interests changed over time?',
        ],
      }
    }

    if (/(engag|upvote|score|popular|best|karma)/.test(q)) {
      const top = [...comments].sort((a, b) => b.score + b.replies * 3 - (a.score + a.replies * 3)).slice(0, 3)
      return {
        id,
        content: [
          `Your highest-engagement comment scored **${top[0].score.toLocaleString('en-US')} points** with ${top[0].replies} replies in r/${top[0].subreddit} [1].`,
          `The next two are in r/${top[1].subreddit} (${top[1].score.toLocaleString('en-US')} points) [2] and r/${top[2].subreddit} (${top[2].score.toLocaleString('en-US')} points) [3].`,
          'All three are long-form answers with a concrete story or number, then a general takeaway. Comments in that shape earn roughly 6x your median score.',
        ],
        sources: top,
        followUps: [
          'Find my strongest arguments about AI.',
          'What topics do I talk about most?',
        ],
      }
    }

    if (/subreddit|community|communities/.test(q)) {
      const subs = topCounts(countBy(lastYear, (c) => c.subreddit), 4)
      const sources = subs.slice(0, 3).map(
        ({ label }) =>
          lastYear.filter((c) => c.subreddit === label).sort((a, b) => b.score - a.score)[0],
      )
      return {
        id,
        content: [
          `In the last 12 months your most active communities were ${subs
            .map((s) => `r/${s.label} (${s.count})`)
            .join(', ')}.`,
          `Your best-received comment in r/${subs[0].label} is a good representative of how you engage there [1].`,
        ],
        sources,
        followUps: ['What topics do I talk about most?'],
      }
    }

    const terms = q
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['what', 'about', 'have', 'does', 'find', 'with', 'that', 'this', 'when', 'where', 'which', 'comments', 'comment'].includes(w))
    const matches = comments
      .filter((c) => terms.some((t) => c.body.toLowerCase().includes(t)))
      .sort((a, b) => b.score - a.score)

    if (matches.length === 0) {
      return {
        id,
        content: [
          "I couldn't find comments that clearly relate to that question. Try asking about a topic, a subreddit, or how your interests have changed.",
        ],
        sources: [],
        followUps: [
          'What topics do I talk about most?',
          'Which of my comments received the most engagement?',
        ],
      }
    }

    const top = matches.slice(0, 3)
    return {
      id,
      content: [
        `I found ${matches.length.toLocaleString('en-US')} comments related to that, mostly in ${topicName(top[0].topicId)}.`,
        `The most upvoted one is in r/${top[0].subreddit} [1]${top[1] ? `, followed by a related comment in r/${top[1].subreddit} [2]` : ''}.`,
      ],
      sources: top,
      followUps: ['How have my interests changed over time?'],
    }
  }

  async refreshAnalysis() {
    await delay(1400, 2200)
    this.lastAnalyzedAt = new Date().toISOString()
    return {
      analyzedAt: this.lastAnalyzedAt,
      newComments: 0,
      topicsUpdated: this.cleared ? 0 : MOCK_TOPICS.length,
    }
  }

  async getSettings() {
    await delay(150, 300)
    return structuredClone(this.settings)
  }

  async updateSettings(settings: AppSettings) {
    await delay(400, 700)
    this.settings = structuredClone(settings)
    return structuredClone(this.settings)
  }

  async exportData() {
    await delay(900, 1400)
    return {
      filename: 'reddit-insights-export.json',
      sizeBytes: this.comments.length * 612,
    }
  }

  async deleteAllData() {
    await delay(800, 1200)
    this.cleared = true
  }

  async restoreDemoData() {
    await delay(400, 700)
    this.cleared = false
  }
}
