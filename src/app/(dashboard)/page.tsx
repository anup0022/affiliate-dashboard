"use client"

import {
  DollarSign,
  Link as LinkIcon,
  MousePointerClick,
  Target,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Megaphone,
  Lightbulb,
  CheckCircle2,
  Circle,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { StatCard } from "@/components/dashboard/stat-card"
import { EarningsChart } from "@/components/charts/earnings-chart"
import { NetworkChart } from "@/components/charts/network-chart"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const checklistItems = [
  { label: "Connect Database", done: true },
  { label: "Add OpenAI Key", done: true },
  { label: "Join Amazon Associates", done: false },
  { label: "Set up Google Trends", done: false },
]

const recentRecommendations = [
  { title: "Sony WH-1000XM5 Headphones", category: "Electronics", status: "published" as const, clicks: 1240, earnings: 384.5 },
  { title: "Notion Productivity Setup Guide", category: "Software", status: "published" as const, clicks: 890, earnings: 267.0 },
  { title: "Standing Desk Comparison 2025", category: "Furniture", status: "draft" as const, clicks: 0, earnings: 0 },
  { title: "Best Running Shoes for Beginners", category: "Sports", status: "published" as const, clicks: 2100, earnings: 512.3 },
  { title: "AI Writing Tools Roundup", category: "Software", status: "review" as const, clicks: 340, earnings: 98.0 },
]

const topLinks = [
  { name: "MacBook Air M3 — Amazon", url: "amzn.to/3xKd9f", clicks: 8420, conversions: 312, earnings: 3840.0 },
  { name: "Bluehost Hosting — CJ", url: "bluehost.sjv.io/c/123", clicks: 5610, conversions: 189, earnings: 2835.0 },
  { name: "Canva Pro — Impact", url: "partner.canva.com/abc", clicks: 4390, conversions: 156, earnings: 1872.0 },
  { name: "Kindle Paperwhite — Amazon", url: "amzn.to/4aB2cD", clicks: 3270, conversions: 98, earnings: 1274.0 },
  { name: "NordVPN Annual Plan — ShareASale", url: "shareasale.com/r/nvpn", clicks: 2940, conversions: 134, earnings: 1608.0 },
]

const quickActions = [
  { title: "Scan Trending Products", description: "Find hot products with high conversion potential", icon: TrendingUp, href: "/trending", color: "bg-blue-50 text-blue-600" },
  { title: "Ask AI Advisor", description: "Get personalized recommendations from AI", icon: MessageSquare, href: "/chat", color: "bg-purple-50 text-purple-600" },
  { title: "Create Ad Campaign", description: "Launch a new campaign to boost earnings", icon: Megaphone, href: "/ads", color: "bg-orange-50 text-orange-600" },
  { title: "View Earnings Report", description: "See detailed breakdown of your revenue", icon: DollarSign, href: "/earnings", color: "bg-emerald-50 text-emerald-600" },
]

const statusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  published: "success",
  draft: "secondary",
  review: "warning",
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const completedCount = checklistItems.filter((i) => i.done).length
  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}! Here&apos;s your dashboard overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">{todayStr}</p>
      </div>

      {/* Setup Checklist */}
      {completedCount < checklistItems.length && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Get Started</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {completedCount} of {checklistItems.length} completed
              </p>
            </div>
            <Link href="/help" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
                <span className={item.done ? "text-gray-400 line-through" : "text-gray-700"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Earnings" value="$12,847.50" change={12.5} changeLabel="from last month" icon={DollarSign} trend="up" />
        <StatCard title="Active Links" value="34" change={3} changeLabel="new this week" icon={LinkIcon} trend="up" />
        <StatCard title="Total Clicks" value="45.2K" change={8.3} changeLabel="from last month" icon={MousePointerClick} trend="up" />
        <StatCard title="Conversion Rate" value="3.2%" change={0.5} changeLabel="from last month" icon={Target} trend="up" />
      </div>

      {/* Tip Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-5 py-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Tip:</span> Products with a trend score above 80% typically convert 3x better.{" "}
          <Link href="/trending" className="font-medium text-blue-600 hover:text-blue-700">
            Check Trending for hot products!
          </Link>
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Over Time</CardTitle>
            <CardDescription>Daily earnings for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <EarningsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Network</CardTitle>
            <CardDescription>Revenue split across affiliate networks</CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${action.color.split(" ")[0]}`}>
                  <action.icon className={`h-5 w-5 ${action.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Two Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recommendations</CardTitle>
            <CardDescription>Your latest product recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecommendations.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                      <span className="text-xs text-gray-400">{item.category}</span>
                    </div>
                  </div>
                  {item.clicks > 0 && (
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.earnings)}</p>
                      <p className="text-xs text-gray-400">{item.clicks.toLocaleString()} clicks</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Highest earning affiliate links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLinks.map((link, i) => (
                <div
                  key={link.name}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{link.name}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <ExternalLink className="h-3 w-3" />
                      {link.url}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {formatCurrency(link.earnings)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {link.clicks.toLocaleString()} clicks · {link.conversions} conv
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
