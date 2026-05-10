import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = "up",
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>

      <div className="mt-2 flex items-center gap-1.5">
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
            trend === "up" && "bg-emerald-50 text-emerald-600",
            trend === "down" && "bg-red-50 text-red-500",
            trend === "neutral" && "bg-gray-50 text-gray-500"
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {change > 0 ? "+" : ""}
          {change}%
        </div>
        <span className="text-xs text-gray-400">{changeLabel}</span>
      </div>
    </div>
  )
}
