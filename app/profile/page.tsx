"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  ChevronRight,
  Clock,
  Bookmark,
  FileText,
  HelpCircle,
  Settings,
  MessageSquare,
  FolderOpen,
  Crown,
  Coins,
  Pencil,
  Copy,
  Sparkles,
  Bell,
  LogOut,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { FeedbackFab } from "@/components/feedback-fab"
import { IdentityModal } from "@/components/identity-modal"
import {
  readUserIdentity,
  writeUserIdentity,
  getPositionLabel,
  getFieldLabels,
  UserIdentity,
} from "@/lib/identity-options"
import { useAuthGuard, clearAuthStorage } from "@/hooks/use-auth-guard"

// 用户数据统计
const userStats = {
  questions: 28,
  favorites: 12,
  documents: 5,
}

export default function ProfilePage() {
  const { isChecking } = useAuthGuard()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    clearAuthStorage()
    setShowLogoutModal(false)
    router.replace("/login")
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 微信小程序导航栏 - 与首页一致 */}
      <div className="relative flex h-11 items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-[#f0f7ff]">
        <span className="text-[17px] font-semibold tracking-wide text-foreground">
          Veridata
        </span>

        {/* 微信胶囊按钮 */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-[87px] items-center rounded-full border border-black/5 bg-black/[0.04]">
          <div className="flex flex-1 items-center justify-center text-foreground">
            <svg width="18" height="4" viewBox="0 0 18 4">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
              <circle cx="9" cy="2" r="1.5" fill="currentColor" />
              <circle cx="16" cy="2" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="h-4 w-px bg-black/15" />
          <div className="flex flex-1 items-center justify-center text-foreground">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="1.6" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-20 scrollbar-hide">
        <ProfileContent onLogout={() => setShowLogoutModal(true)} />
      </main>

      {/* 悬浮反馈按钮 */}
      <FeedbackFab />

      {/* 底部导航 */}
      <BottomNavigation activeTab="profile" />

      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white">
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                退出登录
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                确定要退出当前账号吗？
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                取消
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={handleLogout}
                className="flex-1 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 简洁卡片式 - 用户卡片 + 精简菜单 + 大按钮退出
function ProfileContent({
  onLogout,
}: {
  onLogout: () => void
}) {
  const [totalPoints, setTotalPoints] = useState(95)
  const [identity, setIdentity] = useState<UserIdentity | null>(null)
  const [showIdentityModal, setShowIdentityModal] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const refreshAll = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_points")
        if (stored) {
          const points = JSON.parse(stored)
          setTotalPoints(points.free + points.gift + points.member)
        }
        setInviteCode(localStorage.getItem("user_invite_code") ?? "")
        setIdentity(readUserIdentity())
      }
    }
    refreshAll()
    // 页面切回前台时刷新（覆盖从其它页跳回的场景）
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshAll()
    }
    document.addEventListener("visibilitychange", handleVisibility)
    // 监听跨标签页的 storage 变化
    window.addEventListener("storage", refreshAll)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("storage", refreshAll)
    }
  }, [])

  const handleCopyInviteCode = async () => {
    if (!inviteCode) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invite/${inviteCode}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      alert(`邀请链接：${window.location.origin}/invite/${inviteCode}`)
    }
  }

  const handleIdentityUpdate = (data: UserIdentity) => {
    writeUserIdentity(data)
    setIdentity(data)
    setShowIdentityModal(false)
  }

  const menuItems = [
    { icon: Clock, label: "历史记录", href: "/history" },
    { icon: Bookmark, label: "我的收藏", href: "/favorites", badge: userStats.favorites },
    { icon: FileText, label: "我的知识库", href: "/vault", badge: userStats.documents },
  ]

  const settingsItems = [
    { icon: HelpCircle, label: "帮助与反馈", href: "/help" },
    { icon: Settings, label: "设置", href: "/settings" },
  ]

  return (
    <>
      {/* 用户信息卡片 */}
      <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">张工程师</h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  轻度版
                </span>
              </div>
              {identity ? (
                <p className="truncate text-xs text-gray-500">
                  {getPositionLabel(identity.position)}
                  {identity.fields.length > 0 && ` · ${getFieldLabels(identity.fields).join("、")}`}
                </p>
              ) : (
                <button
                  onClick={() => setShowIdentityModal(true)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1e40af]"
                >
                  点击设置身份偏好
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/notifications"
                className="relative flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-[#1e40af]"
                aria-label="通知中心"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-red-500" />
              </Link>
              {identity && (
                <button
                  onClick={() => setShowIdentityModal(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-[#1e40af]"
                  aria-label="修改身份"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 邀请码展示区 */}
          {inviteCode && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#1e40af]/5 to-orange-50/50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] leading-none text-gray-400">我的邀请码</p>
                  <p className="mt-1 font-mono text-sm font-bold leading-none text-[#1e40af]">{inviteCode}</p>
                </div>
              </div>
              <button
                onClick={handleCopyInviteCode}
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#1e40af] shadow-sm hover:shadow"
              >
                <Copy className="h-3 w-3" />
                {copied ? "已复制" : "复制链接"}
              </button>
            </div>
          )}

          {/* 数据统计 */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3">
            <div className="text-center">
              <p className="text-lg font-bold text-[#1e40af]">{userStats.questions}</p>
              <p className="text-[10px] text-gray-400">累计提问</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-lg font-bold text-[#1e40af]">{userStats.favorites}</p>
              <p className="text-[10px] text-gray-400">收藏回答</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1e40af]">{totalPoints}</p>
              <p className="text-[10px] text-gray-400">剩余积分</p>
            </div>
          </div>
        </div>

      {/* 会员信息 */}
      <Link
        href="/upgrade"
        className="mb-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
            <Crown className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-sm text-gray-900">会员信息</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-600">轻度版</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>
      </Link>

      {/* 我的积分 */}
      <Link
        href="/points"
        className="mb-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-gray-50"
      >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
              <Coins className="h-4 w-4 text-violet-500" />
            </div>
            <span className="text-sm text-gray-900">我的积分</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500">{totalPoints}</span>
            <span className="text-[10px] text-gray-400">积分</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
        </Link>

      {/* 功能菜单 */}
      <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm">
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50",
              index !== menuItems.length - 1 && "border-b border-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af]/5">
                <item.icon className="h-4 w-4 text-[#1e40af]" />
              </div>
              <span className="text-sm text-gray-900">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="rounded-full bg-[#1e40af]/10 px-2 py-0.5 text-xs text-[#1e40af]">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* 设置菜单 */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {settingsItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50",
              index !== settingsItems.length - 1 && "border-b border-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                <item.icon className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-sm text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        ))}
      </div>

      {/* 退出登录 */}
      <button
        onClick={onLogout}
        className="w-full rounded-2xl bg-white py-3.5 text-sm text-gray-400 shadow-sm transition-colors hover:text-red-500"
      >
        退出登录
      </button>

      <p className="mt-6 text-center text-xs text-gray-300">v1.0.0</p>

      {/* 身份编辑弹窗 */}
      <IdentityModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onSubmit={handleIdentityUpdate}
        initialPosition={identity?.position}
        initialFields={identity?.fields}
      />
    </>
  )
}

// 底部导航 - 与首页完全一致
type TabType = "chat" | "vault" | "profile"

function BottomNavigation({ activeTab }: { activeTab: TabType }) {
  const tabs = [
    { id: "chat" as const, icon: MessageSquare, label: "智能问答", href: "/" },
    { id: "vault" as const, icon: FolderOpen, label: "我的知识库", href: "/vault" },
    { id: "profile" as const, icon: User, label: "我的", href: "/profile" },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-7">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-1.5 transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className={cn("h-5 w-5", tab.id === "chat" && "-scale-x-100")} />
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
