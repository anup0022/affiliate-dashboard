"use client"

import { useState } from "react"
import {
  RefreshCw,
  DollarSign,
  CalendarDays,
  TrendingUp,
  Star,
  Download,
  Info,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/utils"

// Generate 30 days of earnings data
function generateDailyData() {
  const data = []
  const base = new Date("2024-12-01")
  for (let i = 0; i < 30; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const amount = 250 + Math.random() * 450 + (i > 20 ? 100 : 0) + Math.sin(i / 3) * 80
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: d.toISOString().split("T")[0],
      earnings: Math.round(amount * 100) / 100,
    })
  }
  return data
}

const dailyData = generateDailyData()

const networkData = [
  { name: "Amazon", value: 5234, color: "#f59e0b" },
  { name: "CJ", value: 3456, color: "#2563eb" },
  { name: "ShareASale", value: 2100, color: "#059669" },
  { name: "Impact", value: 1200, color: "#7c3aed" },
  { name: "ClickBank", value: 857, color: "#e11d48" },
]

const networkBreakdown = [
  { network: "Amazon", color: "text-amber-600", period: "Last 30 Days", amount: 5234, transactions: 211, avg: 24.81 },
  { network: "CJ", color: "text-blue-600", period: "Last 30 Days", amount: 3456, transactions: 287, avg: 12.04 },
  { network: "ShareASale", color: "text-emerald-600", period: "Last 30 Days", amount: 2100, transactions: 131, avg: 16.03 },
  { network: "Impact", color: "text-purple-600", period: "Last 30 Days", amount: 1200, transactions: 468, avg: 2.56 },
  { network: "ClickBank", color: "text-rose-600", period: "Last 30 Days", amount: 857, transactions: 31, avg: 27.65 },
]

const recentTransactions = [
  { id: "1", date: "2024-12-30", network: "Amazon", amount: 48.9, source: "Sony WH-1000XM5 Headphones", type: "conversion" },
  { id: "2", date: "2024-12-30", network: "CJ", amount: 12.5, source: "Nike Air Max DN", type: "conversion" },
  { id: "3", date: "2024-12-29", network: "Impact", amount: 89.6, source: "NordVPN 2-Year Plan", type: "conversion" },
  { id: "4", date: "2024-12-29", network: "Amazon", amount: 15.2, source: "Apple MacBook Air M3", type: "click" },
  { id: "5", date: "2024-12-29", network: "ShareASale", amount: 65.0, source: "Bluehost Web Hosting", type: "conversion" },
  { id: "6", date: "2024-12-28", network: "ClickBank", amount: 50.0, source: "Photo Master Pro Course", type: "conversion" },
  { id: "7", date: "2024-12-28", network: "Amazon", amount: 22.3, source: "Kindle Paperwhite", type: "conversion" },
  { id: "8", date: "2024-12-27", network: "CJ", amount: 8.75, source: "Levi's 501 Jeans", type: "conversion" },
  { id: "9", date: "2024-12-27", network: "Impact", amount: 15.0, source: "NordVPN 2-Year Plan", type: "bonus" },
  { id: "10", date: "2024-12-27", network: "Amazon", amount: 31.4, source: "Sony WH-1000XM5 Headphones", type: "conversion" },
]

const networkBadgeColors: Record<string, string> = {
  Amazon: "bg-amber-100 text-amber-700",
  CJ: "bg-blue-100 text-blue-700",
  ShareASale: "bg-emerald-100 text-emerald-700",
  Impact: "bg-purple-100 text-purple-700",
  ClickBank: "bg-rose-100 text-rose-700",
}

const periods = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "year", label: "This Year" },
]

export default function EarningsPage() {
  const [period, setPeriod] = useState("30d")
  const [syncing, setSyncing] = useState(false)

  const totalEarnings = 12847
  const thisMonth = 4206
  const avgDaily = 140
  const bestDay = 804

  async function handleSync() {
    setSyncing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setSyncing(false)
  }

  function exportCsv() {
    const header = "Date,Earnings\n"
    const rows = dailyData.map((d) => `${d.fullDate},${d.earnings}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "earnings-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalNetwork = networkBreakdown.reduce((s, r) => s + r.amount, 0)
  const totalTransactions = networkBreakdown.reduce((s, r) => s + r.transactions, 0)

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500">Track your affiliate income across all networks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} className="border-gray-200 text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />Export CSV
          </Button>
          <Button onClick={handleSync} disabled={syncing} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Earnings"}
          </Button>
        </div>
      </div>

      {/* Helpful Tip */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 leading-relaxed">
          Earnings are synced from your connected affiliate networks. Connect more networks in <span className="font-medium">Settings</span> to see all your income here.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              period === p.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Earnings", value: formatCurrency(totalEarnings), icon: DollarSign, bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "This Month", value: formatCurrency(thisMonth), icon: CalendarDays, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Average Daily", value: formatCurrency(avgDaily), icon: TrendingUp, bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
          { label: "Best Day", value: formatCurrency(bestDay), icon: Star, bgColor: "bg-amber-50", iconColor: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-2.5 ${s.bgColor}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-3">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-gray-900">Earnings Over Time</h3>
          </div>
          <div className="px-4 pb-5">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ color: "#1e293b", fontWeight: 600 }}
                  itemStyle={{ color: "#2563eb" }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Earnings"]}
                />
                <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={2} fill="url(#earnGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-gray-900">Revenue by Network</h3>
          </div>
          <div className="px-4 pb-5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={networkData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {networkData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" className="text-lg font-bold fill-gray-900">
                  ${(totalNetwork / 1000).toFixed(1)}k
                </text>
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-gray-900">Earnings Breakdown</h3>
        </div>
        <div className="px-6 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="px-4 py-3">Network</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right"># Transactions</th>
                  <th className="px-4 py-3 text-right">Avg / Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {networkBreakdown.map((row) => (
                  <tr key={row.network} className="transition-colors hover:bg-gray-50">
                    <td className={`px-4 py-3.5 font-medium ${row.color}`}>{row.network}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{row.period}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-600">{row.transactions}</td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-600">{formatCurrency(row.avg)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 font-semibold bg-gray-50">
                  <td className="px-4 py-3.5 text-gray-900">Total</td>
                  <td className="px-4 py-3.5 text-gray-400">—</td>
                  <td className="px-4 py-3.5 text-right text-emerald-600">{formatCurrency(totalNetwork)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-900">{totalTransactions}</td>
                  <td className="px-4 py-3.5 text-right text-gray-900">{formatCurrency(totalNetwork / totalTransactions)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="px-6 pb-5">
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.source}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{tx.date}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${networkBadgeColors[tx.network]}`}>
                        {tx.network}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-600">+{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
