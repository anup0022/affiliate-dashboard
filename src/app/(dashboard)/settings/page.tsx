"use client"

import { useState } from "react"
import {
  Key,
  User,
  Settings2,
  Check,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  Save,
  Unplug,
  Brain,
  Globe,
  ShoppingBag,
  Share2,
  Zap,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ApiService {
  id: string
  name: string
  icon: React.ElementType
  connected: boolean
  apiKey: string
  iconBg: string
  iconColor: string
}

const initialServices: ApiService[] = [
  { id: "openai", name: "OpenAI", icon: Brain, connected: true, apiKey: "sk-...4f8K", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { id: "google-ads", name: "Google Ads", icon: Globe, connected: false, apiKey: "", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { id: "amazon", name: "Amazon Associates", icon: ShoppingBag, connected: true, apiKey: "amzn-...x9Rw", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { id: "cj", name: "CJ Affiliate", icon: Share2, connected: true, apiKey: "cj-...m3Pq", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { id: "shareasale", name: "ShareASale", icon: Zap, connected: false, apiKey: "", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { id: "impact", name: "Impact", icon: CreditCard, connected: true, apiKey: "imp-...k7Lv", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { id: "clickbank", name: "ClickBank", icon: CreditCard, connected: false, apiKey: "", iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  { id: "serpapi", name: "Google Trends (SerpAPI)", icon: TrendingUp, connected: false, apiKey: "", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  { id: "reddit", name: "Reddit", icon: MessageSquare, connected: false, apiKey: "", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api-keys")
  const [services, setServices] = useState(initialServices)
  const [editingKey, setEditingKey] = useState<Record<string, string>>({})
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  // Account
  const [name, setName] = useState("Alex Johnson")
  const [email, setEmail] = useState("alex@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [trendAlerts, setTrendAlerts] = useState(true)
  const [earningsReports, setEarningsReports] = useState(false)
  const [recommendationAlerts, setRecommendationAlerts] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState("6h")
  const [currency, setCurrency] = useState("USD")
  const [autoScan, setAutoScan] = useState(true)

  function handleSaveKey(id: string) {
    const key = editingKey[id]
    if (!key) return
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, connected: true, apiKey: key.substring(0, 4) + "..." + key.slice(-4) }
          : s
      )
    )
    setEditingKey((prev) => ({ ...prev, [id]: "" }))
  }

  function handleDisconnect(id: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: false, apiKey: "" } : s))
    )
  }

  const tabs = [
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "account", label: "Account", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings2 },
  ]

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and API connections</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* API Keys Tab */}
      {activeTab === "api-keys" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 leading-relaxed">
              Connect your accounts to unlock all features. Each service needs an API key — check the <span className="font-medium">Help guide</span> for step-by-step instructions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${service.iconBg}`}>
                        <Icon className={`h-5 w-5 ${service.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        {service.connected ? (
                          <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            <Check className="h-3 w-3" />Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                            <X className="h-3 w-3" />Not Connected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {service.connected && !editingKey[service.id] ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={showKey[service.id] ? service.apiKey : "****" + service.apiKey.slice(-4)}
                            className="font-mono text-xs bg-gray-50 border-gray-200 text-gray-700"
                          />
                          <button
                            className="shrink-0 p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowKey((p) => ({ ...p, [service.id]: !p[service.id] }))}
                          >
                            {showKey[service.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <button
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDisconnect(service.id)}
                        >
                          <Unplug className="h-3.5 w-3.5" />Disconnect
                        </button>
                      </>
                    ) : (
                      <>
                        <Input
                          type="password"
                          placeholder="Enter API key..."
                          value={editingKey[service.id] || ""}
                          onChange={(e) => setEditingKey((p) => ({ ...p, [service.id]: e.target.value }))}
                          className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400"
                        />
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!editingKey[service.id]}
                          onClick={() => handleSaveKey(service.id)}
                        >
                          <Save className="mr-1.5 h-3.5 w-3.5" />Save & Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-1">
              <h3 className="text-base font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
            <div className="px-6 pb-6 pt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900" />
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="mr-1.5 h-3.5 w-3.5" />Update Profile
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-1">
              <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
            <div className="px-6 pb-6 pt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-gray-50 border-gray-200" />
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-red-200 shadow-sm">
            <div className="px-6 pt-5 pb-1">
              <h3 className="text-base font-semibold text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-500">Irreversible actions for your account</p>
            </div>
            <div className="px-6 pb-6 pt-4">
              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                </div>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white shrink-0">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-1">
              <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Configure which notifications you receive</p>
            </div>
            <div className="px-6 pb-6 pt-4 space-y-5">
              {[
                { label: "Email Notifications", desc: "Receive email updates about your account activity", value: emailNotifications, set: setEmailNotifications },
                { label: "Trend Alerts", desc: "Get notified when new trending topics are detected", value: trendAlerts, set: setTrendAlerts },
                { label: "Earnings Reports", desc: "Receive weekly earnings summary reports via email", value: earningsReports, set: setEarningsReports },
                { label: "Recommendation Alerts", desc: "Get notified about new AI-generated product recommendations", value: recommendationAlerts, set: setRecommendationAlerts },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.set} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 pt-5 pb-1">
              <h3 className="text-base font-semibold text-gray-900">Data Settings</h3>
              <p className="text-sm text-gray-500">Customize how data is fetched and displayed</p>
            </div>
            <div className="px-6 pb-6 pt-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-Scan Interval</p>
                  <p className="text-xs text-gray-500">How often to sync data from affiliate networks</p>
                </div>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200 text-gray-700"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Every hour</SelectItem>
                    <SelectItem value="6h">Every 6 hours</SelectItem>
                    <SelectItem value="12h">Every 12 hours</SelectItem>
                    <SelectItem value="24h">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Default Currency</p>
                  <p className="text-xs text-gray-500">Currency used for displaying earnings</p>
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200 text-gray-700"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-Scan Trending Topics</p>
                  <p className="text-xs text-gray-500">Automatically scan for trending topics on a schedule</p>
                </div>
                <Switch checked={autoScan} onCheckedChange={setAutoScan} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
