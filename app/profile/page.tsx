"use client"

import { useState } from "react"
import {
  ArrowLeft,
  User,
  ChevronRight,
  Clock,
  Bookmark,
  FileText,
  HelpCircle,
  Settings,
  Bell,
  Crown,
  LogOut,
  Shield,
  Smartphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 用户数据统计
const userStats = {
  questions: 28,
  favorites: 12,
  documents: 5,
}

// 功能菜单数据
const menuItems = [
  {
    id: "history",
    icon: Clock,
    label: "历史问答记录",
    href: "/history",
    badge: null,
  },
  {
    id: "favorites",
    icon: Bookmark,
    label: "我的收藏",
    href: "/favorites",
    badge: userStats.favorites,
  },
  {
    id: "vault",
    icon: FileText,
    label: "我的档案库",
    href: "/vault",
    badge: userStats.documents,
  },
]

const settingsItems = [
  {
    id: "notifications",
    icon: Bell,
    label: "消息通知",
    href: "/notifications",
  },
  {
    id: "account",
    icon: Shield,
    label: "账号与安全",
    href: "/account",
  },
  {
    id: "devices",
    icon: Smartphone,
    label: "登录设备管理",
    href: "/devices",
  },
  {
    id: "help",
    icon: HelpCircle,
    label: "帮助与反馈",
    href: "/help",
  },
  {
    id: "settings",
    icon: Settings,
    label: "设置",
    href: "/settings",
  },
]

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 深蓝渐变头部 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-8">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">个人中心</h1>
          <div className="w-9" />
        </header>

        {/* 用户信息卡片 */}
        {isLoggedIn ? (
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">张工程师</h2>
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                    专业版
                  </span>
                </div>
                <p className="text-sm text-white/70">注册专员 · 医美针剂方向</p>
              </div>
              <Link
                href="/profile/edit"
                className="flex h-8 items-center rounded-lg bg-white/20 px-3 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                编辑
              </Link>
            </div>

            {/* 数据统计 */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{userStats.questions}</p>
                <p className="text-xs text-white/60">累计提问</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{userStats.favorites}</p>
                <p className="text-xs text-white/60">收藏回答</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{userStats.documents}</p>
                <p className="text-xs text-white/60">档案文件</p>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <User className="h-8 w-8 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-lg font-semibold text-white">点击登录</h2>
              <p className="text-sm text-white/70">登录后享受更多功能</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60" />
          </Link>
        )}
      </div>

      {/* 白色内容区域 */}
      <main className="flex-1 bg-background px-5 py-6">
        {/* 会员升级入口 */}
        <Link
          href="/pricing"
          className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-all hover:from-amber-100 hover:to-orange-100 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                升级专业版，解锁更多功能
              </p>
              <p className="text-xs text-amber-700/70">无限提问 · 更大档案库 · 优先支持</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-amber-600" />
        </Link>

        {/* 功能菜单 */}
        <div className="mb-6 rounded-xl border border-border bg-card">
          {menuItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-secondary/50",
                index !== menuItems.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-[#1e40af]" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge !== null && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>

        {/* 设置菜单 */}
        <div className="mb-6 rounded-xl border border-border bg-card">
          {settingsItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-secondary/50",
                index !== settingsItems.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* 退出登录按钮 */}
        {isLoggedIn && (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        )}

        {/* 版本信息 */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          械研 VERIDATA v1.0.0
        </p>
      </main>
    </div>
  )
}
