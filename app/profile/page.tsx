"use client"

import { useState } from "react"
import {
  User,
  ChevronRight,
  FileText,
  MessageSquare,
  HelpCircle,
  Bell,
  Gift,
  LogOut,
  Settings,
  Bookmark,
  Crown,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ProfilePage() {
  const [isLoggedIn] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-5 pt-12 pb-6">
          {/* 顶部导航 */}
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">我的</h1>
            <Link href="/settings" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </header>

          {/* 用户信息卡片 */}
          <UserInfoCard isLoggedIn={isLoggedIn} />

          {/* 用户成长数据 */}
          {isLoggedIn && <GrowthStats />}

          {/* 订阅信息 */}
          <SubscriptionCard />

          {/* 功能列表 */}
          <FunctionList />
        </div>
      </main>

      {/* 底部导航 */}
      <BottomNavigation />
    </div>
  )
}

// 用户信息卡片
function UserInfoCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <button className="glass mb-4 w-full rounded-2xl p-5 text-left transition-all hover:bg-secondary/30 active:scale-[0.99]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-lg font-semibold text-foreground">点击登录</p>
            <p className="text-sm text-muted-foreground">登录后享受完整功能</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </button>
    )
  }

  return (
    <div className="glass mb-4 rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/10">
            <User className="h-full w-full p-4 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-lg font-semibold text-foreground">用户昵称</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              注册工程师
            </span>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            编辑身份信息
          </button>
        </div>
      </div>
    </div>
  )
}

// 用户成长数据
function GrowthStats() {
  return (
    <div className="glass mb-4 rounded-2xl p-5">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">
        你已在械研
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 p-4 text-center">
          <p className="mb-1 text-2xl font-bold text-foreground">XX</p>
          <p className="text-xs text-muted-foreground">次提问</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4 text-center">
          <p className="mb-1 text-2xl font-bold text-foreground">XX</p>
          <p className="text-xs text-muted-foreground">份法规为据</p>
        </div>
      </div>
    </div>
  )
}

// 订阅信息卡片
function SubscriptionCard() {
  return (
    <div className="glass mb-4 overflow-hidden rounded-2xl">
      <div className="border-b border-border/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="font-medium text-foreground">免费版</span>
          </div>
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95">
            升级
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">本月剩余</p>
            <p className="font-medium text-foreground">50 / 50 次</p>
          </div>
          <div>
            <p className="text-muted-foreground">档案库空间</p>
            <p className="font-medium text-foreground">0G / 2G</p>
          </div>
        </div>
      </div>
      <Link href="/pricing" className="flex items-center justify-center gap-2 px-5 py-3 text-sm text-primary hover:bg-secondary/30">
        查看套餐详情
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

// 功能列表
function FunctionList() {
  const menuGroups = [
    {
      items: [
        { icon: Bookmark, label: "我的收藏", href: "/favorites" },
        { icon: MessageSquare, label: "历史问答记录", href: "/history" },
      ],
    },
    {
      items: [
        { icon: Gift, label: "积分中心", href: "/points", badge: "即将上线" },
        { icon: Bell, label: "通知中心", href: "/notifications" },
      ],
    },
    {
      items: [
        { icon: HelpCircle, label: "帮助文档", href: "/help" },
        { icon: FileText, label: "服务协议与隐私政策", href: "/terms" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="glass overflow-hidden rounded-2xl">
          {group.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              href={item.href}
              className="flex items-center justify-between border-b border-border/50 px-5 py-4 last:border-b-0 hover:bg-secondary/30 active:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{item.label}</span>
                {"badge" in item && item.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      ))}

      {/* 退出登录 */}
      <button className="glass flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm text-destructive hover:bg-destructive/5 active:bg-destructive/10">
        <LogOut className="h-5 w-5" />
        退出登录
      </button>
    </div>
  )
}

// 底部导航
function BottomNavigation() {
  const tabs = [
    { id: "chat", icon: MessageSquare, label: "智能问答", href: "/" },
    { id: "vault", icon: FileText, label: "我的档案库", href: "/vault" },
    { id: "profile", icon: User, label: "我的", href: "/profile" },
  ]

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-1.5 transition-colors",
              tab.id === "profile"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
