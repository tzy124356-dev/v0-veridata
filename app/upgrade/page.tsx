"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  Crown,
  Users,
  ChevronRight,
  X,
  MessageSquare,
  HardDrive,
  Star,
  Info,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { addPoints } from "@/lib/storage"
import { TeamContactModal } from "@/components/team-contact-modal"
import { WechatPayModal } from "@/components/wechat-pay-modal"

// 套餐数据
const plans = [
  {
    id: "free",
    name: "免费版",
    price: 0,
    yearPrice: 0,
    questions: "50次/月",
    storage: "2G",
    extra: null,
    popular: false,
  },
  {
    id: "lite",
    name: "轻度版",
    price: 39,
    yearPrice: 399,
    questions: "300次/月",
    storage: "5G",
    extra: null,
    popular: true,
  },
  {
    id: "pro",
    name: "重度版",
    price: 99,
    yearPrice: 999,
    questions: "1000次/月",
    storage: "20G",
    extra: "优先体验新功能",
    popular: false,
  },
]

export default function UpgradePage() {
  const { isChecking } = useAuthGuard()
  
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-white">
      <UpgradeVersionA />
    </div>
  )
}

// 版本A：卡片对比式 - 三列卡片垂直排列
function UpgradeVersionA() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)

  const currentPlan = plans.find((p) => p.id === selectedPlan)

  const handleSubscribe = () => {
    if (!selectedPlan || selectedPlan === "free") return
    // 调起微信支付结果弹窗
    setShowPayModal(true)
  }

  // 支付成功后发放积分并跳转
  const handlePaySuccess = () => {
    if (!selectedPlan || selectedPlan === "free") return
    const pointsToAdd = selectedPlan === "lite" ? 300 : 1000
    const planName = selectedPlan === "lite" ? "轻度版订阅" : "专业版订阅"
    addPoints(pointsToAdd, "member", planName)
    setShowPayModal(false)
    router.push("/points")
  }

  return (
    <div className="flex flex-col pb-8">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-white/80 px-4 backdrop-blur-md">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="text-base font-semibold text-gray-900">升级会员</span>
        <div className="w-9" />
      </header>

      {/* 头部介绍 */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
          <Crown className="h-7 w-7 text-white" />
        </div>
        <h1 className="mb-1 text-xl font-bold text-gray-900">解锁更多专业功能</h1>
        <p className="text-sm text-gray-500">选择适合您的方案，提升工作效率</p>
      </div>

      {/* 计费周期切换 */}
      <div className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-full bg-gray-100 p-1">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-all",
            billingCycle === "monthly"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          )}
        >
          月付
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-all",
            billingCycle === "yearly"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500"
          )}
        >
          年付
          <span className="ml-1 text-xs text-[#1e40af]">省15%</span>
        </button>
      </div>

      {/* 积分规则提示卡 */}
      <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl bg-[#1e40af]/5 px-4 py-3">
        <Info className="h-4 w-4 flex-shrink-0 text-[#1e40af]" />
        <p className="text-xs leading-relaxed text-gray-600">
          订阅即获积分，1 积分可发起 1 次提问。积分按"免费 → 赠送 → 会员"顺序扣减，付费部分留到最后。
        </p>
      </div>

      {/* 套餐卡片 */}
      <div className="space-y-3 px-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={cn(
              "relative rounded-2xl border-2 bg-white p-4 transition-all",
              selectedPlan === plan.id
                ? "border-[#1e40af] shadow-lg shadow-[#1e40af]/10"
                : "border-gray-100",
              plan.popular && "ring-2 ring-[#1e40af]/20"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 left-4">
                <div className="relative">
                  <div className="rounded-md bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-3 py-1 text-xs font-medium text-white">
                    推荐
                  </div>
                  <div className="absolute -bottom-1.5 left-3 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1e40af]" />
                </div>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#1e40af]">
                    ¥{billingCycle === "monthly" ? plan.price : plan.yearPrice}
                  </span>
                  <span className="text-sm text-gray-400">
                    /{billingCycle === "monthly" ? "月" : "年"}
                  </span>
                </div>
              </div>
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                selectedPlan === plan.id
                  ? "border-[#1e40af] bg-[#1e40af]"
                  : "border-gray-300"
              )}>
                {selectedPlan === plan.id && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                <MessageSquare className="h-3.5 w-3.5 -scale-x-100" />
                {plan.questions}
                <span className="ml-1.5 text-[10px] text-gray-400">= {plan.questions.replace("次/月", "")} 积分/月</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                <HardDrive className="h-3.5 w-3.5" />
                {plan.storage}
              </span>
              {plan.extra && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#1e40af]/5 px-2.5 py-1 text-xs text-[#1e40af]">
                  <Star className="h-3.5 w-3.5" />
                  {plan.extra}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 团队版入口 */}
      <button
        onClick={() => setShowTeamModal(true)}
        className="mx-4 mt-4 flex items-center justify-between rounded-xl border border-dashed border-[#1e40af]/30 bg-[#1e40af]/5 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e40af]/10">
            <Users className="h-5 w-5 text-[#1e40af]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">团队版即将上线</p>
            <p className="text-xs text-gray-500">留下联系方式优先体验</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>

      {/* 立即订阅按钮 */}
      {selectedPlan && selectedPlan !== "free" && (
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
          <button 
            onClick={handleSubscribe}
            className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1e40af]/25"
          >
            微信支付订阅
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            支持开具发票 · 积分用完前不支持退款
          </p>
        </div>
      )}

      {/* 团队版弹窗 */}
      {showTeamModal && (
        <TeamContactModal onClose={() => setShowTeamModal(false)} />
      )}

      {/* 微信支付结果弹窗 */}
      {showPayModal && currentPlan && (
        <WechatPayModal
          planName={currentPlan.name}
          amount={billingCycle === "monthly" ? currentPlan.price : currentPlan.yearPrice}
          cycleLabel={billingCycle === "monthly" ? "月" : "年"}
          onClose={() => setShowPayModal(false)}
          onSuccess={handlePaySuccess}
        />
      )}
    </div>
  )
}
