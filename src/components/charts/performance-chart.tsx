"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const DEFAULT_DATA = [
  { day: "Mon", clicks: 1240, conversions: 42 },
  { day: "Tue", clicks: 1580, conversions: 55 },
  { day: "Wed", clicks: 1390, conversions: 48 },
  { day: "Thu", clicks: 1720, conversions: 63 },
  { day: "Fri", clicks: 1950, conversions: 71 },
  { day: "Sat", clicks: 1100, conversions: 34 },
  { day: "Sun", clicks: 980, conversions: 29 },
]

interface PerformanceChartProps {
  data?: { day: string; clicks: number; conversions: number }[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data ?? DEFAULT_DATA

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="clicks"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <YAxis
          yAxisId="conversions"
          orientation="right"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: 16, fontSize: 13, color: "#64748b" }}
        />
        <Bar
          yAxisId="clicks"
          dataKey="clicks"
          name="Clicks"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
        <Bar
          yAxisId="conversions"
          dataKey="conversions"
          name="Conversions"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
