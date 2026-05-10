"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const DEFAULT_DATA = [
  { name: "Amazon", value: 4250, color: "#f97316" },
  { name: "CJ Affiliate", value: 3180, color: "#3b82f6" },
  { name: "ShareASale", value: 2460, color: "#10b981" },
  { name: "Impact", value: 1890, color: "#a855f7" },
  { name: "ClickBank", value: 1067, color: "#ec4899" },
]

interface NetworkChartProps {
  data?: { name: string; value: number; color: string }[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold" style={{ color: d.payload.color }}>
        {d.name}
      </p>
      <p className="text-sm text-gray-600">${d.value.toLocaleString()}</p>
    </div>
  )
}

export function NetworkChart({ data }: NetworkChartProps) {
  const chartData = data ?? DEFAULT_DATA
  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400 text-xs"
          >
            Total
          </text>
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-900 text-lg font-bold"
          >
            ${total.toLocaleString()}
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-gray-500">{d.name}</span>
            <span className="font-medium text-gray-700">
              ${d.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
