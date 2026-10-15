import type { InsightsService } from './insights-service'
import { MockInsightsService } from './mock-insights-service'

export type { InsightsService, ChatTurn } from './insights-service'

/**
 * Single injection point for data access. Swap for
 * `new HttpInsightsService(process.env.NEXT_PUBLIC_API_URL)` to use a real backend.
 */
export const insightsService: InsightsService = new MockInsightsService()
