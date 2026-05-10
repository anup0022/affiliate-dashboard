"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Settings,
  HelpCircle,
  User,
  TrendingUp,
  DollarSign,
  Lightbulb,
  ShoppingCart,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/trending": "Trending",
  "/recommendations": "Recommendations",
  "/chat": "AI Chat",
  "/links": "Affiliate Links",
  "/ads": "Google Ads",
  "/earnings": "Earnings",
  "/settings": "Settings",
  "/help": "Help & Setup",
};

// Mock notifications
const initialNotifications = [
  {
    id: "1",
    icon: TrendingUp,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "New trending product found",
    description: "Portable Power Stations are trending with 94% score",
    time: "2 min ago",
    read: false,
    href: "/trending",
  },
  {
    id: "2",
    icon: DollarSign,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Earnings milestone reached",
    description: "You've earned $12,847 this month — up 12.5%",
    time: "1 hour ago",
    read: false,
    href: "/earnings",
  },
  {
    id: "3",
    icon: Lightbulb,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "New AI recommendation",
    description: "AI suggests promoting GLP-1 Supplements (91% confidence)",
    time: "3 hours ago",
    read: false,
    href: "/recommendations",
  },
  {
    id: "4",
    icon: ShoppingCart,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    title: "Amazon link converted",
    description: "MacBook Air M3 link earned $38.40 commission",
    time: "5 hours ago",
    read: true,
    href: "/links",
  },
  {
    id: "5",
    icon: TrendingUp,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Trend alert: Walking Pads",
    description: "Walking Pad Treadmills surged to 88% trend score",
    time: "Yesterday",
    read: true,
    href: "/trending",
  },
];

interface UserInfo {
  name: string;
  email: string;
  image: string | null;
}

interface HeaderProps {
  onMenuToggle: () => void;
  user: UserInfo;
}

export default function Header({ onMenuToggle, user }: HeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const firstName = user.name.split(" ")[0];

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(
      ([k]) => k !== "/" && pathname.startsWith(k)
    )?.[1] ??
    "Dashboard";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="w-56 pl-9 h-9 rounded-lg bg-gray-50 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <Link
                      key={notif.id}
                      href={notif.href}
                      onClick={() => {
                        markRead(notif.id);
                        setShowNotifications(false);
                      }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                        !notif.read && "bg-blue-50/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          notif.iconBg
                        )}
                      >
                        <Icon className={cn("w-4 h-4", notif.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm leading-tight",
                            notif.read
                              ? "text-gray-600"
                              : "text-gray-900 font-medium"
                          )}
                        >
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {notif.description}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="shrink-0 mt-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs text-center text-gray-400">
                  Notifications are based on your connected services
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-gray-700 pr-1">
              {firstName}
            </span>
          </button>

          {/* Profile dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user.email}
                </p>
              </div>

              {/* Links */}
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
                <Link
                  href="/help"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  Help & Setup
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
