"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Key,
  User,
  Settings2,
  Check,
  X,
  Eye,
  EyeOff,
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
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
  maskedKey: string
  iconBg: string
  iconColor: string
  hint: string
  url: string
  dbId?: string // id from database for disconnect/delete
}

const SERVICE_DEFINITIONS: Omit<ApiService, "connected" | "maskedKey" | "dbId">[] = [
  { id: "openai", name: "OpenAI", icon: Brain, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", hint: "Create key at platform.openai.com → API Keys. Starts with sk-", url: "https://platform.openai.com/api-keys" },
  { id: "google-ads", name: "Google Ads", icon: Globe, iconBg: "bg-blue-50", iconColor: "text-blue-600", hint: "Apply for a developer token in Google Ads → Tools → API Center", url: "https://ads.google.com/aw/apicenter" },
  { id: "amazon", name: "Amazon Associates", icon: ShoppingBag, iconBg: "bg-amber-50", iconColor: "text-amber-600", hint: "Get your PA API key from Product Advertising API dashboard", url: "https://affiliate-program.amazon.com/assoc_credentials/home" },
  { id: "cj", name: "CJ Affiliate", icon: Share2, iconBg: "bg-blue-50", iconColor: "text-blue-600", hint: "Find your API key in CJ → Account → Web Services", url: "https://members.cj.com/member/publisher/home.do" },
  { id: "shareasale", name: "ShareASale", icon: Zap, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", hint: "Get your API token from ShareASale → Tools → API Program", url: "https://account.shareasale.com/a-apiManager.cfm" },
  { id: "impact", name: "Impact", icon: CreditCard, iconBg: "bg-purple-50", iconColor: "text-purple-600", hint: "Find your Account SID & Auth Token in Impact → Settings → API", url: "https://app.impact.com/secure/mediapartner/accountSettings/mp-wsSettings.ihtml" },
  { id: "clickbank", name: "ClickBank", icon: CreditCard, iconBg: "bg-rose-50", iconColor: "text-rose-600", hint: "Generate API keys at ClickBank → Settings → API Keys", url: "https://accounts.clickbank.com/apiKey.htm" },
  { id: "serpapi", name: "Google Trends (SerpAPI)", icon: TrendingUp, iconBg: "bg-sky-50", iconColor: "text-sky-600", hint: "Sign up free at serpapi.com and copy your private API key", url: "https://serpapi.com/manage-api-key" },
  { id: "reddit", name: "Reddit", icon: MessageSquare, iconBg: "bg-orange-50", iconColor: "text-orange-600", hint: "Create a Reddit app at reddit.com/prefs/apps → script type", url: "https://www.reddit.com/prefs/apps" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api-keys")
  const [services, setServices] = useState<ApiService[]>(
    SERVICE_DEFINITIONS.map((s) => ({ ...s, connected: false, maskedKey: "" }))
  )
  const [editingKey, setEditingKey] = useState<Record<string, string>>({})
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [validating, setValidating] = useState<Record<string, boolean>>({})
  const [validationError, setValidationError] = useState<Record<string, string>>({})
  const [loadingCredentials, setLoadingCredentials] = useState(true)

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

  // Load saved credentials from DB on mount
  const loadCredentials = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      const creds = data.credentials as Array<{
        id: string
        service: string
        apiKey: string
        isActive: boolean
      }>

      setServices((prev) =>
        prev.map((svc) => {
          const saved = creds.find((c) => c.service === svc.id && c.isActive)
          if (saved) {
            return { ...svc, connected: true, maskedKey: saved.apiKey, dbId: saved.id }
          }
          return { ...svc, connected: false, maskedKey: "", dbId: undefined }
        })
      )
    } catch (err) {
      console.error("Failed to load credentials:", err)
    } finally {
      setLoadingCredentials(false)
    }
  }, [])

  useEffect(() => {
    loadCredentials()
  }, [loadCredentials])

  async function handleSaveKey(id: string) {
    const key = editingKey[id]?.trim()
    if (!key) return

    // Clear previous errors
    setValidationError((prev) => ({ ...prev, [id]: "" }))
    setValidating((prev) => ({ ...prev, [id]: true }))

    try {
      // Step 1: Validate the key
      const validateRes = await fetch("/api/settings/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: id, apiKey: key }),
      })

      const validateData = await validateRes.json()

      if (!validateData.valid) {
        setValidationError((prev) => ({
          ...prev,
          [id]: validateData.error || "Invalid API key",
        }))
        return
      }

      // Step 2: Save to database
      const saveRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: id, apiKey: key }),
      })

      if (!saveRes.ok) {
        const errData = await saveRes.json()
        setValidationError((prev) => ({
          ...prev,
          [id]: errData.error || "Failed to save API key",
        }))
        return
      }

      const saveData = await saveRes.json()

      // Step 3: Update UI
      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                connected: true,
                maskedKey: saveData.credential.apiKey,
                dbId: saveData.credential.id,
              }
            : s
        )
      )
      setEditingKey((prev) => ({ ...prev, [id]: "" }))
    } catch {
      setValidationError((prev) => ({
        ...prev,
        [id]: "Network error. Please try again.",
      }))
    } finally {
      setValidating((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function handleDisconnect(id: string) {
    const service = services.find((s) => s.id === id)
    if (!service?.dbId) {
      // No DB record, just reset UI
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, connected: false, maskedKey: "", dbId: undefined } : s
        )
      )
      return
    }

    try {
      const res = await fetch(`/api/settings?id=${service.dbId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        console.error("Failed to delete credential")
      }
    } catch {
      console.error("Network error deleting credential")
    }

    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, connected: false, maskedKey: "", dbId: undefined } : s
      )
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
              Connect your accounts to unlock all features. Each service needs an API key — check the <span className="font-medium">Help guide</span> for step-by-step instructions. Keys are validated before saving.
            </p>
          </div>

          {loadingCredentials ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Loading saved credentials...</span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon
                const isValidating = validating[service.id]
                const error = validationError[service.id]
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
                              value={showKey[service.id] ? service.maskedKey : "****" + service.maskedKey.slice(-4)}
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
                          {/* How to get API key hint */}
                          <p className="text-[11px] text-gray-500 leading-relaxed">{service.hint}</p>
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            Get API Key <ExternalLink className="h-3 w-3" />
                          </a>

                          <Input
                            type="password"
                            placeholder="Enter API key..."
                            value={editingKey[service.id] || ""}
                            onChange={(e) => {
                              setEditingKey((p) => ({ ...p, [service.id]: e.target.value }))
                              // Clear error when user starts typing
                              if (validationError[service.id]) {
                                setValidationError((p) => ({ ...p, [service.id]: "" }))
                              }
                            }}
                            disabled={isValidating}
                            className={`bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 ${
                              error ? "border-red-300 focus:ring-red-500" : ""
                            }`}
                          />

                          {/* Validation error message */}
                          {error && (
                            <div className="flex items-start gap-1.5 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                              <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                            </div>
                          )}

                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!editingKey[service.id]?.trim() || isValidating}
                            onClick={() => handleSaveKey(service.id)}
                          >
                            {isValidating ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                Validating...
                              </>
                            ) : (
                              <>
                                <Save className="mr-1.5 h-3.5 w-3.5" />
                                Validate & Connect
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
