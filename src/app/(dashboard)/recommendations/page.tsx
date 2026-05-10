"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, Circle, ExternalLink, X, Play, Brain, Loader2 } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

interface ActionItem {
  id: string
  text: string
  completed: boolean
}

interface Recommendation {
  id: string
  title: string
  description: string
  reasoning: string
  status: "new" | "in_progress" | "completed" | "dismissed"
  confidence: number
  estimatedEarnings: number
  affiliateNetwork: string
  category: string
  trendingItemId?: string
  actionItems: ActionItem[]
  createdAt: string
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    title: "Promote Portable Power Stations",
    description: "Create comparison content for portable power stations targeting camping enthusiasts and remote workers. Focus on EcoFlow and Jackery models with high commission rates.",
    reasoning: "Camping season begins in 6 weeks and search volume for portable power stations has increased 340% over the past 30 days. The average order value is $800+ with 8-12% commission rates on Amazon Associates. Reddit r/camping and r/overlanding threads show organic demand. This aligns with your tech niche and existing audience.",
    status: "new",
    confidence: 92,
    estimatedEarnings: 3200,
    affiliateNetwork: "Amazon Associates",
    category: "Tech",
    trendingItemId: "1",
    actionItems: [
      { id: "1a", text: "Research top 5 portable power stations under $1000", completed: false },
      { id: "1b", text: "Create comparison table with specs and pricing", completed: false },
      { id: "1c", text: "Write SEO-optimized review article (2000+ words)", completed: false },
      { id: "1d", text: "Generate affiliate links for each product", completed: false },
    ],
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Build a GLP-1 Supplement Guide",
    description: "Capitalize on the weight loss supplement trend by creating an authoritative guide to natural GLP-1 supplements. Target long-tail keywords with low competition.",
    reasoning: "GLP-1 medications like Ozempic have created massive demand for natural alternatives. Search volume for 'natural GLP-1 supplements' is up 890% YoY. Health supplement affiliate programs offer 20-40% commissions with recurring revenue from subscription models. This is a high-intent, buyer-ready audience.",
    status: "in_progress",
    confidence: 85,
    estimatedEarnings: 4500,
    affiliateNetwork: "ShareASale",
    category: "Health",
    actionItems: [
      { id: "2a", text: "Research FDA-compliant claims for supplement content", completed: true },
      { id: "2b", text: "Identify top 3 supplement brands with affiliate programs", completed: true },
      { id: "2c", text: "Write buyer's guide with ingredient breakdowns", completed: false },
      { id: "2d", text: "Set up email funnel for supplement recommendations", completed: false },
    ],
    createdAt: "2024-03-14T08:00:00Z",
  },
  {
    id: "3",
    title: "Walking Pad Treadmill Reviews",
    description: "Target the booming under-desk treadmill market with video and written reviews. Focus on the work-from-home professional demographic.",
    reasoning: "Walking pad searches have tripled since January. The WFH trend is permanent for many workers, and health-conscious professionals are the ideal affiliate audience. Products range from $200-$600 with 6-10% commission. YouTube review content for this category has low competition but high watch time.",
    status: "new",
    confidence: 78,
    estimatedEarnings: 1800,
    affiliateNetwork: "Amazon Associates",
    category: "Fitness",
    trendingItemId: "6",
    actionItems: [
      { id: "3a", text: "Order top 3 walking pads for hands-on review", completed: false },
      { id: "3b", text: "Film comparison video with noise level tests", completed: false },
      { id: "3c", text: "Write blog post with embedded video", completed: false },
    ],
    createdAt: "2024-03-14T15:00:00Z",
  },
  {
    id: "4",
    title: "AI Budget App Roundup",
    description: "Create a comprehensive roundup of AI-powered personal finance apps. Target millennials and Gen Z users looking for automated money management.",
    reasoning: "Fintech app signups spike in Q1 as people set financial goals. AI budget apps offer $5-25 CPA with some paying recurring commissions. The keyword 'best AI budget app' has a difficulty score of only 23 with 8,100 monthly searches. Your finance content already ranks well in this space.",
    status: "completed",
    confidence: 71,
    estimatedEarnings: 1200,
    affiliateNetwork: "Impact",
    category: "Finance",
    trendingItemId: "3",
    actionItems: [
      { id: "4a", text: "Sign up and test 8 AI budget apps", completed: true },
      { id: "4b", text: "Create feature comparison spreadsheet", completed: true },
      { id: "4c", text: "Publish roundup article with affiliate links", completed: true },
      { id: "4d", text: "Promote on Twitter and LinkedIn", completed: true },
    ],
    createdAt: "2024-03-10T12:00:00Z",
  },
  {
    id: "5",
    title: "Smart Home Energy Monitor Campaign",
    description: "Promote smart energy monitors through content targeting homeowners concerned about rising utility costs. Pair with seasonal energy-saving tips.",
    reasoning: "Utility costs are projected to rise 12% this summer. Energy monitor searches peak March-June as homeowners prepare for summer AC costs. Sense and Emporia monitors offer $15-30 per sale. Content angle: 'This $100 device can save you $500/year on electricity' performs extremely well in testing.",
    status: "new",
    confidence: 64,
    estimatedEarnings: 950,
    affiliateNetwork: "Amazon Associates",
    category: "Home",
    trendingItemId: "5",
    actionItems: [
      { id: "5a", text: "Install and test Sense energy monitor for 2 weeks", completed: false },
      { id: "5b", text: "Document actual energy savings with screenshots", completed: false },
      { id: "5c", text: "Create before/after energy bill comparison content", completed: false },
    ],
    createdAt: "2024-03-13T09:00:00Z",
  },
]

const STATUS_STYLES: Record<Recommendation["status"], string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  dismissed: "bg-gray-100 text-gray-500 border border-gray-200",
}

const STATUS_LABELS: Record<Recommendation["status"], string> = {
  new: "New",
  in_progress: "In Progress",
  completed: "Completed",
  dismissed: "Dismissed",
}

const TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [generating, setGenerating] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [expandedReasoning, setExpandedReasoning] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState("all")

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch("/api/recommendations")
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : data.items ?? data.recommendations ?? []
        if (items.length > 0) return items
      }
    } catch {}
    return MOCK_RECOMMENDATIONS
  }, [])

  useEffect(() => {
    fetchRecommendations().then((data) => {
      setRecommendations(data)
      setLoaded(true)
    })
  }, [fetchRecommendations])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/recommendations", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : data.items ?? data.recommendations ?? []
        if (items.length > 0) { setRecommendations(items); setGenerating(false); return }
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 3500))
    setRecommendations(MOCK_RECOMMENDATIONS)
    setGenerating(false)
  }

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const updateStatus = (id: string, status: Recommendation["status"]) => {
    setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const toggleActionItem = (recId: string, itemId: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? { ...r, actionItems: r.actionItems.map((a) => (a.id === itemId ? { ...a, completed: !a.completed } : a)) }
          : r
      )
    )
  }

  const filtered = recommendations.filter((r) => {
    if (tab === "all") return r.status !== "dismissed"
    return r.status === tab
  })

  const activeRecs = recommendations.filter((r) => r.status !== "dismissed")
  const avgConfidence = activeRecs.length > 0 ? Math.round(activeRecs.reduce((s, r) => s + r.confidence, 0) / activeRecs.length) : 0
  const totalEarnings = activeRecs.reduce((s, r) => s + r.estimatedEarnings, 0)

  const tabCounts: Record<string, number> = {
    all: recommendations.filter((r) => r.status !== "dismissed").length,
    new: recommendations.filter((r) => r.status === "new").length,
    in_progress: recommendations.filter((r) => r.status === "in_progress").length,
    completed: recommendations.filter((r) => r.status === "completed").length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-sm text-gray-500 mt-1">Smart suggestions to maximize your affiliate earnings</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          title="Let our AI find new opportunities for you"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <Sparkles className={cn("h-4 w-4", generating && "animate-pulse")} />
          {generating ? "Generating..." : "Generate New"}
        </button>
      </div>

      {/* Helpful tip */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <Brain className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Our AI analyzes trending data and market signals to recommend the best affiliate opportunities for you.
        </p>
      </div>

      {/* Stat Cards */}
      {loaded && !generating && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2.5">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Recommendations</p>
              <p className="text-xl font-bold text-gray-900">{activeRecs.length}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-2.5">
              <Brain className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Avg Confidence</p>
              <p className="text-xl font-bold text-gray-900">{avgConfidence}%</p>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="rounded-full bg-amber-50 p-2.5">
              <span className="text-lg font-bold text-amber-600">$</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Est. Monthly Earnings</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generating State */}
      {generating && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white border border-gray-100 shadow-sm">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-900 font-semibold">AI is analyzing trends and generating recommendations...</p>
          <p className="text-sm text-gray-500 mt-1">Evaluating market data, commission rates, and your niche fit</p>
        </div>
      )}

      {/* Tabs & Content */}
      {loaded && !generating && (
        <>
          {/* Tab pills */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  tab === t.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {t.label} ({tabCounts[t.value]})
              </button>
            ))}
          </div>

          {/* Recommendation cards */}
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-white border border-gray-100">
                <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-900 font-medium">No recommendations in this category</p>
                <p className="text-sm text-gray-500 mt-1">Generate new recommendations or check other tabs</p>
              </div>
            )}

            {filtered.map((rec) => {
              const confColor = rec.confidence >= 80 ? "bg-emerald-500" : rec.confidence >= 50 ? "bg-amber-400" : "bg-red-400"
              const confText = rec.confidence >= 80 ? "text-emerald-600" : rec.confidence >= 50 ? "text-amber-600" : "text-red-500"

              return (
                <div
                  key={rec.id}
                  className={cn(
                    "rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-4 transition-shadow hover:shadow-md",
                    rec.status === "dismissed" && "opacity-60"
                  )}
                >
                  {/* Top row: badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold", STATUS_STYLES[rec.status])}>
                      {STATUS_LABELS[rec.status]}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 text-xs font-medium">
                      {rec.category}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 text-xs font-medium">
                      {rec.affiliateNetwork}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>

                  {/* AI Reasoning (expandable) */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50">
                    <button
                      className="flex w-full items-center justify-between p-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => toggleReasoning(rec.id)}
                      title="Click to see why our AI recommends this"
                    >
                      <span className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        Why we recommend this
                      </span>
                      {expandedReasoning.has(rec.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {expandedReasoning.has(rec.id) && (
                      <div className="px-3 pb-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
                        {rec.reasoning}
                      </div>
                    )}
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Confidence */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Confidence</span>
                        <span className={cn("font-semibold", confText)}>{rec.confidence}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", confColor)} style={{ width: `${rec.confidence}%` }} />
                      </div>
                    </div>
                    {/* Estimated Earnings */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
                      <span className="text-gray-500">Est. Monthly Earnings</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(rec.estimatedEarnings)}</span>
                    </div>
                  </div>

                  {/* Action Items */}
                  {rec.actionItems.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Action Items</p>
                      <div className="space-y-1">
                        {rec.actionItems.map((item) => (
                          <button
                            key={item.id}
                            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors"
                            onClick={() => toggleActionItem(rec.id, item.id)}
                            title={item.completed ? "Click to mark as not done" : "Click to mark as done"}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                            )}
                            <span className={cn(item.completed && "line-through text-gray-400", !item.completed && "text-gray-700")}>
                              {item.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                    {rec.status === "new" && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                        onClick={() => updateStatus(rec.id, "in_progress")}
                        title="Begin working on this recommendation"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Working
                      </button>
                    )}
                    {rec.status === "in_progress" && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                        onClick={() => updateStatus(rec.id, "completed")}
                        title="Mark this recommendation as completed"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Complete
                      </button>
                    )}
                    {rec.status !== "dismissed" && rec.status !== "completed" && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => updateStatus(rec.id, "dismissed")}
                        title="Not interested in this recommendation"
                      >
                        <X className="h-3.5 w-3.5" />
                        Dismiss
                      </button>
                    )}
                    {rec.status === "dismissed" && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => updateStatus(rec.id, "new")}
                        title="Bring this recommendation back"
                      >
                        Restore
                      </button>
                    )}
                    {rec.trendingItemId && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors ml-auto"
                        title="See the trending data behind this recommendation"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Trending Item
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Skeleton Loading */}
      {!loaded && !generating && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-gray-100 animate-pulse" />
                <div className="h-5 w-14 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-5 w-2/3 rounded bg-gray-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-2 w-full rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
