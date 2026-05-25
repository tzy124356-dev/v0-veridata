"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, ChevronRight, CreditCard, Gift, BookOpen, MessageSquare, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getPoints, getPointRecords, type PointsData, type PointRecord } from "@/lib/storage"

export default function PointsPage() {
  const { isChecking } = useAuthGuard()
  const router = useRouter()
  const [points, setPoints] = useState<PointsData>({ free: 0, gift: 0, member: 0 })
  const [records, setRecords] = useState<PointRecord[]>([])
  const [showRulesModal, setShowRulesModal] = useState(false)

  const refreshData = () => {
    if (typeof window !== "undefined") {
      setPoints(getPoints())
      setRecords(getPointRecords())
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // 页面可见时刷新数据
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshData()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const total = points.free + points.gift + points.member

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-white/80 px-4 backdrop-blur">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-900">积分中心</h1>
        <div className="w-9" />
      </header>

      {/* Hero 卡片 */}
      <div className="relative mx-4 mt-4 rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] p-6 text-center">
        <button
          onClick={() => setShowRulesModal(true)}
          className="absolute right-4 top-4"
        >
          <HelpCircle className="h-5 w-5 text-white/60" />
        </button>
        <p className="text-5xl font-bold tracking-tight text-white">{total}</p>
        <p className="mt-2 text-sm text-white/70">当前剩余积分</p>
        <p className="my-3 text-xs text-white/50">1 积分 = 1 次提问</p>
      </div>

      {/* 积分构成卡片 */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900">积分构成</span>
          <span className="text-[10px] text-gray-400">优先扣 免费 → 赠送 → 会员</span>
        </div>

        {/* 免费积分 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-700">免费积分</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{points.free} 分</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${(points.free / total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">平台基础赠送</p>
        </div>

        {/* 赠送积分 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span className="text-sm text-gray-700">赠送积分</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{points.gift} 分</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-400 transition-all"
              style={{ width: `${(points.gift / total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">分享好友、补充知识库可获取</p>
        </div>

        {/* 会员积分 */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              <span className="text-sm text-gray-700">会员积分</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{points.member} 分</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${(points.member / total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">订阅会员每月发放</p>
        </div>
      </div>

      {/* 积分记录卡片 */}
      <div className="mx-4 mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
          <span className="font-semibold text-gray-900">积分记录</span>
          <span className="text-xs text-gray-400">最近 20 条</span>
        </div>
        <div>
          {records.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              还没有积分记录
            </div>
          ) : (
            records.map((record, index) => {
              const isDeduct = record.type === "deduct"
              const Icon = isDeduct ? MessageSquare : (record.category === "gift" ? Gift : (record.category === "member" ? CreditCard : BookOpen))
              const iconBg = isDeduct ? "bg-gray-50" : (record.category === "gift" ? "bg-orange-50" : (record.category === "member" ? "bg-blue-50" : "bg-violet-50"))
              const iconColor = isDeduct ? "text-gray-400" : (record.category === "gift" ? "text-orange-600" : (record.category === "member" ? "text-blue-600" : "text-violet-600"))
              
              const formatTime = (isoTime: string) => {
                const date = new Date(isoTime)
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
              }
              
              return (
                <div
                  key={record.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3",
                    index !== records.length - 1 && "border-b border-gray-50"
                  )}
                >
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", iconBg)}>
                    <Icon className={cn("h-4 w-4", iconColor)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{record.title}</p>
                    <p className="text-xs text-gray-400">{formatTime(record.createdAt)}</p>
                  </div>
                  <span className={cn(
                    "font-semibold",
                    record.amount > 0 ? "text-green-600" : "text-gray-400"
                  )}>
                    {record.amount > 0 ? `+${record.amount}` : record.amount}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 底部固定 CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-5 py-4">
        <button
          onClick={() => router.push("/upgrade")}
          className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 text-base font-semibold text-white"
        >
          续费会员 · 获取更多积分
        </button>
      </div>

      {/* 规则说明弹窗 */}
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  )
}

function RulesModal({ onClose }: { onClose: () => void }) {
  const rules = [
    {
      num: 1,
      title: "什么是积分？",
      desc: "1 积分 = 1 次提问机会，是您在械研获取专业回答的凭证。",
    },
    {
      num: 2,
      title: "如何获取积分？",
      desc: "通过订阅会员、平台免费赠送，以及分享好友、补充知识库等活动均可获得。",
    },
    {
      num: 3,
      title: "积分扣减顺序",
      desc: "按免费 → 赠送 → 会员的顺序依次扣减，让您付费购买的积分尽量晚被使用。",
    },
    {
      num: 4,
      title: "积分有效期",
      desc: "会员积分仅在订阅周期内有效；免费积分和赠送积分长期有效，无过期顾虑。",
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 mx-auto max-w-lg animate-in slide-in-from-bottom rounded-t-3xl bg-white p-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">积分使用说明</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          {rules.map((rule) => (
            <div key={rule.num} className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1e40af]/10 text-xs font-semibold text-[#1e40af]">
                {rule.num}
              </div>
              <div>
                <p className="font-medium text-gray-900">{rule.title}</p>
                <p className="mt-1 text-sm text-gray-500">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 font-medium text-white"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}
