"use client"

import { useState } from "react"
import {
  Plus,
  Pause,
  Play,
  Pencil,
  Trash2,
  Sparkles,
  Eye,
  AlertTriangle,
  DollarSign,
  MousePointerClick,
  Target,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  linkedProduct: string
  status: "active" | "paused" | "draft" | "ended"
  dailyBudget: number
  totalBudget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  startDate: string
  endDate: string
  keywords: string[]
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Sony XM5 - Holiday Sale",
    linkedProduct: "Sony WH-1000XM5 Headphones",
    status: "active",
    dailyBudget: 50,
    totalBudget: 1500,
    spent: 892.4,
    impressions: 148200,
    clicks: 4890,
    conversions: 127,
    ctr: 3.3,
    cpc: 0.18,
    startDate: "2024-11-15",
    endDate: "2025-01-15",
    keywords: ["best noise cancelling headphones", "sony xm5 review", "wireless headphones 2024"],
  },
  {
    id: "2",
    name: "NordVPN - Security Campaign",
    linkedProduct: "NordVPN 2-Year Plan",
    status: "active",
    dailyBudget: 75,
    totalBudget: 2250,
    spent: 1654.8,
    impressions: 312400,
    clicks: 9180,
    conversions: 312,
    ctr: 2.94,
    cpc: 0.18,
    startDate: "2024-10-01",
    endDate: "2025-01-31",
    keywords: ["best vpn 2024", "online privacy", "vpn deals"],
  },
  {
    id: "3",
    name: "MacBook Air M3 - Back to School",
    linkedProduct: "Apple MacBook Air M3",
    status: "paused",
    dailyBudget: 100,
    totalBudget: 3000,
    spent: 2180.5,
    impressions: 245600,
    clicks: 6240,
    conversions: 84,
    ctr: 2.54,
    cpc: 0.35,
    startDate: "2024-08-01",
    endDate: "2024-10-31",
    keywords: ["macbook air m3", "best laptop for students", "apple laptop deals"],
  },
  {
    id: "4",
    name: "Bluehost - New Year Promo",
    linkedProduct: "Bluehost Web Hosting",
    status: "draft",
    dailyBudget: 40,
    totalBudget: 1200,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    startDate: "2025-01-01",
    endDate: "2025-02-28",
    keywords: ["best web hosting", "cheap hosting", "wordpress hosting"],
  },
  {
    id: "5",
    name: "Nike Air Max - Summer Collection",
    linkedProduct: "Nike Air Max DN",
    status: "ended",
    dailyBudget: 60,
    totalBudget: 1800,
    spent: 1800,
    impressions: 198700,
    clicks: 5420,
    conversions: 198,
    ctr: 2.73,
    cpc: 0.33,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    keywords: ["nike air max", "running shoes", "summer sneakers"],
  },
]

const affiliateLinks = [
  "Sony WH-1000XM5 Headphones",
  "Apple MacBook Air M3",
  "Nike Air Max DN",
  "Bluehost Web Hosting",
  "Fitbit Charge 6",
  "Photo Master Pro Course",
  "NordVPN 2-Year Plan",
  "Levi's 501 Original Jeans",
]

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  draft: "bg-gray-100 text-gray-600",
  ended: "bg-red-100 text-red-700",
}

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [tab, setTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState("")
  const [form, setForm] = useState({
    name: "",
    linkedProduct: "",
    dailyBudget: "",
    keywords: "",
    startDate: "",
    endDate: "",
  })

  const filtered = campaigns.filter((c) => {
    if (tab === "all") return true
    return c.status === tab
  })

  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  function toggleStatus(id: string) {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
      )
    )
  }

  function deleteCampaign(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  async function generateCopy() {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setGeneratedCopy(
      `Headline: Get the Best ${form.linkedProduct || "Deal"} - Limited Time Offer!\n\nDescription: Discover why thousands trust ${form.linkedProduct || "this product"}. Shop now and save big with our exclusive deal. Free shipping available.\n\nCall to Action: Shop Now & Save`
    )
    setGenerating(false)
  }

  function handleCreate() {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: form.name,
      linkedProduct: form.linkedProduct,
      status: "draft",
      dailyBudget: parseFloat(form.dailyBudget) || 0,
      totalBudget: (parseFloat(form.dailyBudget) || 0) * 30,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      startDate: form.startDate,
      endDate: form.endDate,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    }
    setCampaigns((prev) => [newCampaign, ...prev])
    setForm({ name: "", linkedProduct: "", dailyBudget: "", keywords: "", startDate: "", endDate: "" })
    setGeneratedCopy("")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Google Ads</h1>
          <p className="text-sm text-gray-500">Create and manage ad campaigns for your affiliate products</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="mr-2 h-4 w-4" />Create Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create Campaign</DialogTitle>
              <DialogDescription className="text-gray-500">Set up a new Google Ads campaign linked to your affiliate product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                <Input placeholder="e.g. Holiday Sale - Sony XM5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Linked Affiliate Product</label>
                <Select value={form.linkedProduct} onValueChange={(v) => setForm({ ...form, linkedProduct: v })}>
                  <SelectTrigger className="border-gray-200"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {affiliateLinks.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Daily Budget ($)</label>
                  <Input type="number" placeholder="50" value={form.dailyBudget} onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })} className="border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border-gray-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Target Keywords</label>
                <Textarea placeholder="Enter keywords, separated by commas" rows={3} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="border-gray-200" />
              </div>
              <Separator className="bg-gray-100" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">AI Ad Copy</label>
                  <Button variant="outline" size="sm" onClick={generateCopy} disabled={generating || !form.linkedProduct} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    {generating ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-2 h-3.5 w-3.5" />}
                    Generate Ad Copy
                  </Button>
                </div>
                {generatedCopy && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedCopy}</pre>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-200 text-gray-600">Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name || !form.linkedProduct} className="bg-blue-600 hover:bg-blue-700 text-white">Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-medium text-amber-800">Google Ads is not connected yet</p>
          <p className="mt-0.5 text-sm text-amber-700">Go to Settings to add your API credentials, or use the Help guide to learn how.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Spent", value: formatCurrency(totalSpent), icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Impressions", value: formatNumber(totalImpressions), icon: Eye, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Clicks", value: formatNumber(totalClicks), icon: MousePointerClick, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg CTR", value: formatPercent(avgCtr), icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
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

      {/* Tabs + Campaign List */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-4">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">No campaigns found in this category.</div>
          )}
          {filtered.map((campaign) => {
            const budgetPercent = campaign.totalBudget > 0 ? (campaign.spent / campaign.totalBudget) * 100 : 0
            return (
              <Card key={campaign.id} className="overflow-hidden bg-white border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Product: {campaign.linkedProduct}</p>
                      <p className="text-xs text-gray-400">{campaign.startDate} — {campaign.endDate}</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-5">
                      {[
                        { label: "Impressions", value: formatNumber(campaign.impressions) },
                        { label: "Clicks", value: formatNumber(campaign.clicks) },
                        { label: "Conversions", value: campaign.conversions.toString() },
                        { label: "CTR", value: formatPercent(campaign.ctr) },
                        { label: "CPC", value: formatCurrency(campaign.cpc) },
                      ].map((m) => (
                        <div key={m.label} className="text-center">
                          <p className="text-xs text-gray-400">{m.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Budget: {formatCurrency(campaign.spent)} / {formatCurrency(campaign.totalBudget)}</span>
                      <span>{Math.round(budgetPercent)}% used</span>
                    </div>
                    <Progress value={budgetPercent} className="mt-1.5 h-1.5" />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-5 py-3">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(campaign.id)} disabled={campaign.status === "ended" || campaign.status === "draft"} className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      {campaign.status === "active" ? <><Pause className="mr-1.5 h-3.5 w-3.5" />Pause</> : <><Play className="mr-1.5 h-3.5 w-3.5" />Resume</>}
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50"><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Button>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Generate AI Copy</Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteCampaign(campaign.id)}>
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
