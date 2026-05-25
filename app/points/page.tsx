"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, ChevronRight, CreditCard, Gift, BookOpen, MessageSquare, X, Loader2, Sparkles, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getPoints, getPointRecords, getUserInviteCode, redeemCode, type PointsData, type PointRecord } from "@/lib/storage"
import { PointsRulesModal } from "@/components/points-rules-modal"

export default function PointsPage() {
  const { isChecking } = useAuthGuard()
  const router = useRouter()
  const [points, setPoints] = useState<PointsData>({ free: 0, gift: 0, member: 0 })
  const [records, setRecords] = useState<PointRecord[]>([])
  const [showRulesModal, setShowRulesModal] = useState(false)
  
  // 兑换码相关状态
  const [myInviteCode, setMyInviteCode] = useState("")
  const [redeemInput, setRedeemInput] = useState("")
  const [redeemError, setRedeemError] = useState("")
  const [showCopied, setShowCopied] = useState(false)
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false)

  const refreshData = () => {
    if (typeof window !== "undefined") {
      setPoints(getPoints())
      setRecords(getPointRecords())
      setMyInviteCode(getUserInviteCode())
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

      {/* 我的邀请码卡片 - 单行布局 */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">我的邀请码</p>
            <p className="text-base font-bold text-[#1e40af]">{myInviteCode || "------"}</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (myInviteCode) {
              const textArea = document.createElement("textarea")
              textArea.value = myInviteCode
              textArea.style.position = "fixed"
              textArea.style.left = "-9999px"
              document.body.appendChild(textArea)
              textArea.select()
              try {
                document.execCommand("copy")
                setShowCopied(true)
                setTimeout(() => setShowCopied(false), 1500)
              } catch {
                // 静默失败
              }
              document.body.removeChild(textArea)
            }
          }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100"
        >
          {showCopied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-500">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 兑换好友的码卡片 */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#1e40af]" />
          <span className="font-semibold text-gray-900">兑换好友的码</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={redeemInput}
            onChange={(e) => {
              setRedeemInput(e.target.value.toUpperCase())
              setRedeemError("")
            }}
            placeholder="输入兑换码（YJ + 5 位数字）"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#1e40af]/50 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
          />
          <button
            onClick={() => {
              const result = redeemCode(redeemInput)
              if (result.success) {
                setRedeemInput("")
                setRedeemError("")
                setShowRedeemSuccess(true)
                refreshData()
                setTimeout(() => setShowRedeemSuccess(false), 2000)
              } else {
                setRedeemError(result.message)
                setTimeout(() => setRedeemError(""), 3000)
              }
            }}
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-5 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            兑换
          </button>
        </div>
        {redeemError && (
          <p className="mt-2 text-xs text-red-500">{redeemError}</p>
        )}
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
        <PointsRulesModal onClose={() => setShowRulesModal(false)} />
      )}

      {/* 兑换成功弹窗 */}
      {showRedeemSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900">兑换成功！</h3>
            <p className="mt-2 text-sm text-gray-500">
              获得 30 积分，对方将获得 100 积分
            </p>
            <p className="mt-1 text-xs text-gray-400">（演示版未模拟对方积分）</p>
          </div>
        </div>
      )}
    </div>
  )
}
