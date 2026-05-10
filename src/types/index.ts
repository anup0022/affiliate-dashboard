import type {
  User,
  TrendingItem,
  AffiliateLink,
  Recommendation,
  AdCampaign,
  Earning,
} from '@prisma/client'

// ── Affiliate Networks ──────────────────────────────────────────────

export const AffiliateNetwork = {
  AMAZON: 'amazon',
  SHAREASALE: 'shareasale',
  CJ: 'cj',
  RAKUTEN: 'rakuten',
  IMPACT: 'impact',
  AWIN: 'awin',
  CLICKBANK: 'clickbank',
  PARTNERSTACK: 'partnerstack',
  OTHER: 'other',
} as const

export type AffiliateNetwork =
  (typeof AffiliateNetwork)[keyof typeof AffiliateNetwork]

// ── Dashboard Stats ─────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
  activeLinks: number
  activeCampaigns: number
  pendingRecommendations: number
  revenueChange: number // percentage change from previous period
  clicksChange: number
  conversionsChange: number
}

export interface PeriodStats {
  period: string // e.g. "2024-01", "2024-W03", "2024-01-15"
  revenue: number
  clicks: number
  conversions: number
  impressions: number
}

export interface NetworkStats {
  network: AffiliateNetwork | string
  revenue: number
  clicks: number
  conversions: number
  linkCount: number
}

// ── API Responses ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: undefined
}

export interface ApiErrorResponse {
  success: false
  data?: undefined
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Chart Data ──────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string
  value: number
}

export interface TimeSeriesDataPoint {
  date: string // ISO date string
  value: number
}

export interface MultiSeriesDataPoint {
  date: string
  [seriesKey: string]: string | number
}

export interface RevenueChartData {
  daily: TimeSeriesDataPoint[]
  weekly: TimeSeriesDataPoint[]
  monthly: TimeSeriesDataPoint[]
}

export interface NetworkDistributionData {
  network: string
  revenue: number
  percentage: number
  color: string
}

export interface CampaignPerformanceData {
  campaignId: string
  title: string
  spent: number
  revenue: number
  roi: number
  impressions: number
  clicks: number
  conversions: number
}

// ── Domain-Specific Types ───────────────────────────────────────────

export interface TrendingItemWithScore extends TrendingItem {
  relevanceScore: number
  matchedKeywords: string[]
}

export interface AffiliateLinkWithStats extends AffiliateLink {
  ctr: number // click-through rate
  conversionRate: number
  earningsPerClick: number
}

export interface RecommendationWithTrend extends Recommendation {
  trendingItem: TrendingItem | null
}

export interface CampaignWithLink extends AdCampaign {
  affiliateLink: AffiliateLink | null
  roi: number
}

export interface EarningsSummary {
  total: number
  byNetwork: Record<string, number>
  byPeriod: PeriodStats[]
  currency: string
}

// ── Chat / AI ───────────────────────────────────────────────────────

export interface ChatCompletionRequest {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  context?: {
    recentTrends?: TrendingItem[]
    userLinks?: AffiliateLink[]
    earnings?: Earning[]
  }
}

export interface ChatCompletionResponse {
  reply: string
  suggestions?: string[]
  recommendations?: Partial<Recommendation>[]
}

// ── Filters & Sorting ───────────────────────────────────────────────

export interface DateRange {
  from: Date
  to: Date
}

export interface LinkFilters {
  network?: AffiliateNetwork | string
  status?: 'active' | 'paused' | 'archived'
  category?: string
  dateRange?: DateRange
  search?: string
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

// ── Re-exports for convenience ──────────────────────────────────────

export type {
  User,
  TrendingItem,
  AffiliateLink,
  Recommendation,
  AdCampaign,
  Earning,
}
