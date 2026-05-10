import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num)
}

export function formatPercent(num: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1 }).format(num / 100)
}
