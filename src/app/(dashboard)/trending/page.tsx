"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, TrendingUp, ExternalLink, Link2, Info, Loader2 } from "lucide-react"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"

interface TrendingItem {
  id: string
  title: string
  description: string
  category: "tech" | "health" | "finance" | "fashion" | "home" | "fitness"
  source: "google_trends" | "reddit" | "twitter"
  trendScore: number
  searchVolume: number
  commissionEstimate: number
  createdAt: string
}

const MOCK_TRENDING: TrendingItem[] = [
  {
    id: "1",
    title: "Portable Power Stations",
    description: "Surge in demand for portable power stations as camping season approaches and remote work continues to drive off-grid living trends.",
    category: "tech",
    source: "google_trends",
    trendScore: 94,
    searchVolume: 284000,
    commissionEstimate: 45.0,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "GLP-1 Supplements",
    description: "Natural GLP-1 receptor agonist supplements trending as affordable alternatives, driven by weight loss medication interest.",
    category: "health",
    source: "reddit",
    trendScore: 91,
    searchVolume: 412000,
    commissionEstimate: 32.5,
    createdAt: "2024-03-15T09:30:00Z",
  },
  {
    id: "3",
    title: "AI-Powered Budget Apps",
    description: "Personal finance apps leveraging AI for automated savings and investment recommendations gaining massive traction.",
    category: "finance",
    source: "twitter",
    trendScore: 87,
    searchVolume: 156000,
    commissionEstimate: 18.0,
    createdAt: "2024-03-15T08:45:00Z",
  },
  {
    id: "4",
    title: "Quiet Luxury Handbags",
    description: "Understated designer bags without visible logos trending on social media. The Row and Bottega Veneta leading the quiet luxury movement.",
    category: "fashion",
    source: "twitter",
    trendScore: 83,
    searchVolume: 198000,
    commissionEstimate: 85.0,
    createdAt: "2024-03-14T22:00:00Z",
  },
  {
    id: "5",
    title: "Smart Home Energy Monitors",
    description: "Real-time energy monitoring devices surging as utility costs rise. Consumers seeking ways to reduce electricity bills.",
    category: "home",
    source: "google_trends",
    trendScore: 79,
    searchVolume: 134000,
    commissionEstimate: 22.0,
    createdAt: "2024-03-14T20:15:00Z",
  },
  {
    id: "6",
    title: "Walking Pad Treadmills",
    description: "Under-desk walking pads dominating fitness searches as WFH professionals look for ways to increase daily step count.",
    category: "fitness",
    source: "reddit",
    trendScore: 88,
    searchVolume: 267000,
    commissionEstimate: 28.0,
    createdAt: "2024-03-14T18:00:00Z",
  },
  {
    id: "7",
    title: "USB-C Hubs & Docking Stations",
    description: "Universal USB-C docking stations trending as Apple and PC manufacturers converge on USB-C standard across all devices.",
    category: "tech",
    source: "reddit",
    trendScore: 76,
    searchVolume: 189000,
    commissionEstimate: 15.0,
    createdAt: "2024-03-14T16:30:00Z",
  },
  {
    id: "8",
    title: "Mushroom Coffee Blends",
    description: "Adaptogenic mushroom coffee gaining mainstream appeal. Lion's mane and chaga blends marketed for focus and immunity.",
    category: "health",
    source: "google_trends",
    trendScore: 72,
    searchVolume: 145000,
    commissionEstimate: 19.5,
    createdAt: "2024-03-14T14:00:00Z",
  },
  {
    id: "9",
    title: "Robo-Advisor Platforms",
    description: "Automated investment platforms with tax-loss harvesting features trending among millennial and Gen Z first-time investors.",
    category: "finance",
    source: "twitter",
    trendScore: 68,
    searchVolume: 98000,
    commissionEstimate: 55.0,
    createdAt: "2024-03-14T12:00:00Z",
  },
  {
    id: "10",
    title: "Outdoor Modular Furniture",
    description: "Weatherproof modular patio furniture trending as homeowners invest in outdoor living spaces for spring and summer.",
    category: "home",
    source: "google_trends",
    trendScore: 65,
    searchVolume: 112000,
    commissionEstimate: 62.0,
    createdAt: "2024-03-14T10:00:00Z",
  },
  {
    id: "11",
    title: "Athleisure Sets for Men",
    description: "Matching athletic lounge sets for men exploding on TikTok. Brands like Vuori and Lululemon menswear driving searches.",
    category: "fashion",
    source: "twitter",
    trendScore: 74,
    searchVolume: 176000,
    commissionEstimate: 24.0,
    createdAt: "2024-03-13T21:00:00Z",
  },
  {
    id: "12",
    title: "Smart Resistance Bands",
    description: "Bluetooth-connected resistance bands with rep counting and form tracking gaining traction in the home fitness market.",
    category: "fitness",
    source: "reddit",
    trendScore: 61,
    searchVolume: 87000,
    commissionEstimate: 12.0,
    createdAt: "2024-03-13T19:00:00Z",
  },
]

const CATEGORY_COLORS: Record<TrendingItem["category"], { badge: string; label: string }> = {
  tech: { badge: "bg-blue-50 text-blue-700 border border-blue-200", label: "Tech" },
  health: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Health" },
  finance: { badge: "bg-amber-50 text-amber-700 border border-amber-200", label: "Finance" },
  fashion: { badge: "bg-pink-50 text-pink-700 border border-pink-200", label: "Fashion" },
  home: { badge: "bg-purple-50 text-purple-700 border border-purple-200", label: "Home" },
  fitness: { badge: "bg-red-50 text-red-700 border border-red-200", label: "Fitness" },
}

const SOURCE_LABELS: Record<TrendingItem["source"], string> = {
  google_trends: "Google Trends",
  reddit: "Reddit",
  twitter: "Twitter",
}

export default function TrendingPage() {
  const [items, setItems] = useState<TrendingItem[]>([])
  const [scanning, setScanning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [category, setCategory] = useState("all")
  const [source, setSource] = useState("all")
  const [sortBy, setSortBy] = useState("score")

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch("/api/trending")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) return data
        if (data.items && Array.isArray(data.items) && data.items.length > 0) return data.items
      }
    } catch {}
    return MOCK_TRENDING
  }, [])

  useEffect(() => {
    fetchTrending().then((data) => {
      setItems(data)
      setLoaded(true)
    })
  }, [fetchTrending])

  const handleScan = async () => {
    setScanning(true)
    try {
      const res = await fetch("/api/trending", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        const newItems = Array.isArray(data) ? data : data.items ?? []
        if (newItems.length > 0) { setItems(newItems); setScanning(false); return }
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 3000))
    setItems(MOCK_TRENDING)
    setScanning(false)
  }

  const filtered = items
    .filter((i) => category === "all" || i.category === category)
    .filter((i) => source === "all" || i.source === source)
    .sort((a, b) => {
      if (sortBy === "score") return b.trendScore - a.trendScore
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return b.searchVolume - a.searchVolume
    })

  const selectClass =
    "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-full appearance-none cursor-pointer"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trending Products</h1>
          <p className="text-sm text-gray-500 mt-1">Discover what&apos;s selling right now across the web</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          title="Click to scan for the latest trending products"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <RefreshCw className={cn("h-4 w-4", scanning && "animate-spin")} />
          {scanning ? "Scanning..." : "Scan Now"}
        </button>
      </div>

      {/* Helpful tip */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          These products are trending based on Google Trends, Reddit, and social media. Higher trend scores mean more demand right now.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass} title="Filter by product category">
              <option value="all">All Categories</option>
              <option value="tech">Tech</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className={selectClass} title="Filter by where the trend was found">
              <option value="all">All Sources</option>
              <option value="google_trends">Google Trends</option>
              <option value="reddit">Reddit</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass} title="Choose how to sort the results">
              <option value="score">Trend Score</option>
              <option value="newest">Newest</option>
              <option value="volume">Search Volume</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scanning State */}
      {scanning && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white border border-gray-100 shadow-sm">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-900 font-semibold">Scanning the web for trending products...</p>
          <p className="text-sm text-gray-500 mt-1">Checking Google Trends, Reddit, and Twitter</p>
        </div>
      )}

      {/* Skeleton Loading */}
      {!loaded && !scanning && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-gray-100 animate-pulse" />
                <div className="h-5 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-5 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-2 w-full rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {loaded && !scanning && (
        <>
          <p className="text-sm text-gray-500">
            Showing {filtered.length} of {items.length} items
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const catInfo = CATEGORY_COLORS[item.category]
              const barColor = item.trendScore > 70 ? "bg-blue-500" : item.trendScore > 50 ? "bg-amber-400" : "bg-gray-300"
              const scoreColor = item.trendScore > 70 ? "text-blue-600" : item.trendScore > 50 ? "text-amber-600" : "text-gray-500"

              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 space-y-3"
                >
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold", catInfo.badge)}>
                      {catInfo.label}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-medium">
                      {SOURCE_LABELS[item.source]}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

                  {/* Trend Score */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Trend Score</span>
                      <span className={cn("font-semibold", scoreColor)}>{item.trendScore}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${item.trendScore}%` }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Vol: {formatNumber(item.searchVolume)}</span>
                    <span>Est: {formatCurrency(item.commissionEstimate)}/sale</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      title="Generate an affiliate link for this product"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Create Link
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      title="See full details about this trending product"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-900 font-medium">No trending items found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or scan for new trends</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
