"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Trash2,
  LogOut,
  Info,
  FileText,
  Database,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthGuard, clearAuthStorage } from "@/hooks/use-auth-guard"
import { ClearCacheModal, LogoutModal } from "@/components/logout-modal"

export default function SettingsPage() {
  const { isChecking } = useAuthGuard()
  const router = useRouter()
  const [showClearCacheModal, setShowClearCacheModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  const settingGroups = [
    {
      title: "数据与存储",
      items: [
        {
          icon: Database,
          label: "清除缓存",
          type: "action" as const,
          description: "释放存储空间",
          onClick: () => setShowClearCacheModal(true),
        },
      ],
    },
    {
      title: "关于",
      items: [
        {
          icon: Info,
          label: "关于我们",
          type: "link" as const,
          href: "/about",
        },
        {
          icon: FileText,
          label: "用户协议",
          type: "link" as const,
          href: "/terms",
        },
        {
          icon: Shield,
          label: "隐私政策",
          type: "link" as const,
          href: "/privacy",
        },
      ],
    },
  ]

  const handleClearCache = () => {
    setCacheCleared(true)
    setTimeout(() => {
      setShowClearCacheModal(false)
      setCacheCleared(false)
    }, 1500)
  }

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
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="text-base font-semibold text-gray-900">设置</span>
        <div className="w-9" />
      </header>

      <div className="flex-1 px-4 pb-24 pt-4">
        {/* 设置分组 */}
        {settingGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-500">
              {group.title}
            </h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <div
                    key={itemIndex}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5",
                      itemIndex !== group.items.length - 1 &&
                        "border-b border-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e40af]/10">
                        <Icon className="h-4.5 w-4.5 text-[#1e40af]" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                        {item.type === "action" && item.description && (
                          <p className="text-xs text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.type === "link" && (
                      <Link
                        href={item.href || "#"}
                        className="flex items-center text-gray-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                    {item.type === "action" && (
                      <button
                        onClick={item.onClick}
                        className="text-sm text-[#1e40af]"
                      >
                        清除
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* 退出登录按钮 */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full rounded-2xl bg-white py-3.5 text-center text-sm font-medium text-red-500 shadow-sm transition-all active:scale-[0.98]"
        >
          退出登录
        </button>

        {/* 版本号 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          版本 1.0.0
        </p>
      </div>

      {/* 清除缓存确认弹窗 */}
      {showClearCacheModal && (
        <ClearCacheModal 
          onClose={() => setShowClearCacheModal(false)}
          onConfirm={handleClearCache}
          cacheCleared={cacheCleared}
        />
      )}

      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <LogoutModal 
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}
