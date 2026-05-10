"use client"

import { useState } from "react"
import {
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Pencil,
  Trash2,
  Pause,
  Play,
  MousePointerClick,
  DollarSign,
  TrendingUp,
  Search,
  Info,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils"

interface AffiliateLink {
  id: string
  title: string
  url: string
  network: string
  productName: string
  category: string
  commissionRate: number
  clicks: number
  conversions: number
  revenue: number
  status: "active" | "paused" | "expired"
  createdAt: string
}

const networkColors: Record<string, string> = {
  Amazon: "bg-orange-100 text-orange-700",
  CJ: "bg-blue-100 text-blue-700",
  ShareASale: "bg-emerald-100 text-emerald-700",
  Impact: "bg-purple-100 text-purple-700",
  ClickBank: "bg-pink-100 text-pink-700",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
}

const mockLinks: AffiliateLink[] = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Review",
    url: "https://www.amazon.com/dp/B09XS7JWHH?tag=affiliate-20",
    network: "Amazon",
    productName: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    commissionRate: 4.0,
    clicks: 3842,
    conversions: 127,
    revenue: 1524.0,
    status: "active",
    createdAt: "2024-11-15",
  },
  {
    id: "2",
    title: "MacBook Air M3 Best Price",
    url: "https://www.amazon.com/dp/B0CX23V2ZK?tag=affiliate-20",
    network: "Amazon",
    productName: "Apple MacBook Air M3",
    category: "Electronics",
    commissionRate: 3.0,
    clicks: 5210,
    conversions: 84,
    revenue: 3276.0,
    status: "active",
    createdAt: "2024-10-22",
  },
  {
    id: "3",
    title: "Nike Air Max 2024 Collection",
    url: "https://www.cj.com/r/nike-airmax-2024?pid=aff123",
    network: "CJ",
    productName: "Nike Air Max DN",
    category: "Fashion",
    commissionRate: 8.0,
    clicks: 2176,
    conversions: 198,
    revenue: 2851.2,
    status: "active",
    createdAt: "2024-12-01",
  },
  {
    id: "4",
    title: "Hosting Comparison Guide",
    url: "https://www.shareasale.com/r/hosting-compare?aff=456",
    network: "ShareASale",
    productName: "Bluehost Web Hosting",
    category: "Software",
    commissionRate: 65.0,
    clicks: 1893,
    conversions: 42,
    revenue: 2730.0,
    status: "active",
    createdAt: "2024-09-18",
  },
  {
    id: "5",
    title: "Fitness Tracker Roundup",
    url: "https://impact.com/r/fitbit-charge6?ref=aff789",
    network: "Impact",
    productName: "Fitbit Charge 6",
    category: "Fitness",
    commissionRate: 5.0,
    clicks: 1450,
    conversions: 67,
    revenue: 536.0,
    status: "paused",
    createdAt: "2024-08-30",
  },
  {
    id: "6",
    title: "Photography Course Bundle",
    url: "https://clickbank.com/r/photo-master-pro?hop=aff321",
    network: "ClickBank",
    productName: "Photo Master Pro Course",
    category: "Education",
    commissionRate: 50.0,
    clicks: 892,
    conversions: 31,
    revenue: 1550.0,
    status: "active",
    createdAt: "2024-11-05",
  },
  {
    id: "7",
    title: "Levi's Denim Sale Picks",
    url: "https://www.shareasale.com/r/levis-denim-sale?aff=456",
    network: "ShareASale",
    productName: "Levi's 501 Original Jeans",
    category: "Fashion",
    commissionRate: 10.0,
    clicks: 1620,
    conversions: 89,
    revenue: 712.0,
    status: "expired",
    createdAt: "2024-06-12",
  },
  {
    id: "8",
    title: "VPN Service Comparison",
    url: "https://impact.com/r/nordvpn-deal?ref=aff012",
    network: "Impact",
    productName: "NordVPN 2-Year Plan",
    category: "Software",
    commissionRate: 40.0,
    clicks: 2340,
    conversions: 156,
    revenue: 4992.0,
    status: "active",
    createdAt: "2024-10-01",
  },
]

const initialFormState = {
  title: "",
  url: "",
  network: "",
  productName: "",
  commissionRate: "",
}

export default function LinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>(mockLinks)
  const [networkFilter, setNetworkFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(initialFormState)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = links.filter((l) => {
    if (networkFilter !== "all" && l.network !== networkFilter) return false
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.productName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0)
  const totalRevenue = links.reduce((s, l) => s + l.revenue, 0)
  const totalConversions = links.reduce((s, l) => s + l.conversions, 0)
  const avgConversion = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  function handleAddLink() {
    const newLink: AffiliateLink = {
      id: Date.now().toString(),
      title: form.title,
      url: form.url,
      network: form.network,
      productName: form.productName,
      category: "",
      commissionRate: parseFloat(form.commissionRate) || 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setLinks((prev) => [newLink, ...prev])
    setForm(initialFormState)
    setDialogOpen(false)
  }

  function toggleStatus(id: string) {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === "active" ? "paused" : "active" } : l
      )
    )
  }

  function deleteLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  function copyLink(id: string, url: string) {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="text-sm text-gray-500">Manage all your affiliate product links in one place</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Add Affiliate Link</DialogTitle>
              <DialogDescription className="text-gray-500">Create a new affiliate link to start tracking clicks and earnings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input placeholder="e.g. Sony Headphones Review" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Affiliate URL</label>
                <Input placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Network</label>
                  <Select value={form.network} onValueChange={(v) => setForm({ ...form, network: v })}>
                    <SelectTrigger className="border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Amazon", "CJ", "ShareASale", "Impact", "ClickBank"].map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Commission %</label>
                  <Input type="number" placeholder="e.g. 5" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} className="border-gray-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <Input placeholder="Product name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="border-gray-200" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-200 text-gray-600">Cancel</Button>
              <Button onClick={handleAddLink} disabled={!form.title || !form.url || !form.network} className="bg-blue-600 hover:bg-blue-700 text-white">Add Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Helpful tip */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-700">Add your affiliate links here. When someone clicks your link and buys, you earn a commission!</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={networkFilter} onValueChange={setNetworkFilter}>
          <SelectTrigger className="w-full sm:w-[160px] border-gray-200 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Networks</SelectItem>
            {["Amazon", "CJ", "ShareASale", "Impact", "ClickBank"].map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] border-gray-200 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9 border-gray-200 bg-white" placeholder="Search links..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Links", value: links.length.toString(), icon: LinkIcon, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Clicks", value: formatNumber(totalClicks), icon: MousePointerClick, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg Conversion", value: formatPercent(avgConversion), icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <Card key={s.label} className="bg-white border-gray-100 shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2.5 ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className="hidden lg:block bg-white border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Network</th>
                <th className="px-6 py-3">Commission</th>
                <th className="px-6 py-3">Clicks</th>
                <th className="px-6 py-3">Conversions</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((link) => (
                <tr key={link.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="mt-0.5 max-w-[200px] truncate text-xs text-gray-400">{link.url}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${networkColors[link.network] || "bg-gray-100 text-gray-600"}`}>
                      {link.network}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{link.commissionRate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(link.clicks)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(link.conversions)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">{formatCurrency(link.revenue)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[link.status]}`}>
                      {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={() => copyLink(link.id, link.url)}>
                        {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => deleteLink(link.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">No affiliate links found matching your filters.</div>
          )}
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((link) => (
          <Card key={link.id} className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{link.url}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[link.status]}`}>
                  {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${networkColors[link.network] || "bg-gray-100 text-gray-600"}`}>{link.network}</span>
                <span className="text-xs text-gray-500">{link.commissionRate}% commission</span>
              </div>
              <div className="my-3 border-t border-gray-100" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-400">Clicks</p>
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(link.clicks)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Conv.</p>
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(link.conversions)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Revenue</p>
                  <p className="text-sm font-semibold text-emerald-600">{formatCurrency(link.revenue)}</p>
                </div>
              </div>
              <div className="my-3 border-t border-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{link.createdAt}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600" onClick={() => copyLink(link.id, link.url)}>
                    {copiedId === link.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600" onClick={() => toggleStatus(link.id)}>
                    {link.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => deleteLink(link.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
