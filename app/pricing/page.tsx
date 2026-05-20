"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Check,
  Crown,
  Zap,
  Sparkles,
  MessageSquare,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 套餐数据
const plans = [
  {
    id: "free",
    name: "免费版",
    price: 0,
    yearPrice: 0,
    period: "",
    questions: 50,
    storage: 2,
    features: ["每月50次问答", "2G档案库空间", "基础知识库访问"],
    highlight: false,
    icon: Sparkles,
    iconColor: "text-muted-foreground",
    iconBg: "bg-secondary",
  },
  {
    id: "lite",
    name: "轻度版",
    price: 39,
    yearPrice: 399,
    period: "/月",
    questions: 300,
    storage: 5,
    features: ["每月300次问答", "5G档案库空间", "完整知识库访问", "优先响应"],
    highlight: true,
    badge: "推荐",
    icon: Zap,
    iconColor: "text-[#1e40af]",
    iconBg: "bg-[#1e40af]/10",
  },
  {
    id: "pro",
    name: "专业版",
    price: 99,
    yearPrice: 999,
    period: "/月",
    questions: 1000,
    storage: 20,
    features: [
      "每月1000次问答",
      "20G档案库空间",
      "完整知识库访问",
      "优先响应",
      "优先体验新功能",
    ],
    highlight: false,
    icon: Crown,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month")
  const [selectedPlan, setSelectedPlan] = useState<string>("lite")

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const finalPrice =
    billingPeriod === "year" && selectedPlanData?.yearPrice
      ? selectedPlanData.yearPrice
      : (selectedPlanData?.price || 0) * (billingPeriod === "year" ? 12 : 1)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 深蓝渐变头部 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-8">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">选择套餐</h1>
          <div className="w-9" />
        </header>

        {/* 计费周期切换 */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-white/10 p-1 backdrop-blur-sm">
            <button
              onClick={() => setBillingPeriod("month")}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-all",
                billingPeriod === "month"
                  ? "bg-white text-[#1e40af]"
                  : "text-white/70 hover:text-white"
              )}
            >
              按月付费
            </button>
            <button
              onClick={() => setBillingPeriod("year")}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-all",
                billingPeriod === "year"
                  ? "bg-white text-[#1e40af]"
                  : "text-white/70 hover:text-white"
              )}
            >
              按年付费
              <span className="ml-1 rounded bg-amber-400/20 px-1.5 py-0.5 text-xs text-amber-300">
                省15%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 白色内容区域 */}
      <main className="flex-1 bg-background px-5 py-6 pb-32">
        {/* 套餐卡片 */}
        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price =
              billingPeriod === "year" && plan.yearPrice
                ? Math.round(plan.yearPrice / 12)
                : plan.price

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all active:scale-[0.99]",
                  selectedPlan === plan.id
                    ? "border-[#1e40af] ring-1 ring-[#1e40af]"
                    : "border-border hover:border-[#1e40af]/30"
                )}
              >
                {/* 推荐标签 */}
                {plan.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-2.5 py-0.5 text-xs font-medium text-white">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      plan.iconBg
                    )}
                  >
                    <Icon className={cn("h-6 w-6", plan.iconColor)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">
                        ¥{price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 核心数据 */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
                    <MessageSquare className="h-4 w-4 text-[#1e40af]" />
                    <span className="text-sm text-foreground">
                      {plan.questions}次/月
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
                    <HardDrive className="h-4 w-4 text-[#1e40af]" />
                    <span className="text-sm text-foreground">
                      {plan.storage}G空间
                    </span>
                  </div>
                </div>

                {/* 功能列表 */}
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-[#1e40af]" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 选中指示 */}
                {selectedPlan === plan.id && (
                  <div className="absolute right-4 bottom-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#1e40af]">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* 团队版预留 */}
        <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-center">
          <p className="mb-2 text-sm font-medium text-foreground">团队版即将上线</p>
          <p className="text-xs text-muted-foreground">
            留下联系方式优先体验
          </p>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 space-y-1 text-center text-xs text-muted-foreground">
          <p>支持微信支付</p>
          <p>如需发票或有退款需求，请联系客服</p>
        </div>
      </main>

      {/* 底部确认按钮 */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedPlanData?.name} · {billingPeriod === "year" ? "年付" : "月付"}
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">
              ¥{finalPrice}
            </span>
            {billingPeriod === "year" && selectedPlan !== "free" && (
              <span className="ml-1 text-xs text-muted-foreground">/年</span>
            )}
          </div>
        </div>
        <button
          className={cn(
            "w-full rounded-xl py-3.5 text-sm font-medium transition-all active:scale-[0.98]",
            selectedPlan === "free"
              ? "bg-secondary text-muted-foreground"
              : "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white"
          )}
        >
          {selectedPlan === "free" ? "当前套餐" : "立即订阅"}
        </button>
      </div>
    </div>
  )
}
