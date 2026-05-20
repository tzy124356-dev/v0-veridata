"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Check,
  Crown,
  Zap,
  Sparkles,
  MessageSquare,
  HardDrive,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 套餐数据
const plans = [
  {
    id: "free",
    name: "免费版",
    price: 0,
    period: "",
    questions: 50,
    storage: 2,
    features: ["每月50次问答", "2G档案库空间", "基础知识库访问"],
    highlight: false,
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
  },
  {
    id: "pro",
    name: "重度版",
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
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month")
  const [selectedPlan, setSelectedPlan] = useState<string>("lite")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航 */}
      <header className="glass sticky top-0 z-40 border-b border-border/50 px-5 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">选择套餐</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 px-5 py-6">
        {/* 计费周期切换 */}
        <div className="mb-6 flex justify-center">
          <div className="glass inline-flex rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("month")}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-all",
                billingPeriod === "month"
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:text-foreground"
              )}
            >
              按月付费
            </button>
            <button
              onClick={() => setBillingPeriod("year")}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-all",
                billingPeriod === "year"
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:text-foreground"
              )}
            >
              按年付费
              <span className="ml-1 text-xs opacity-80">省15%</span>
            </button>
          </div>
        </div>

        {/* 套餐卡片 */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* 团队版预留 */}
        <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-center">
          <p className="mb-2 text-sm text-foreground">团队版即将上线</p>
          <button className="text-sm text-primary hover:underline">
            留下联系方式优先体验
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
          <p>支持微信支付</p>
          <p>如需发票或有退款需求，请联系客服</p>
        </div>
      </main>

      {/* 底部确认按钮 */}
      <div className="glass sticky bottom-0 border-t border-border/50 p-5">
        <button className="gradient-accent w-full rounded-xl py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
          {selectedPlan === "free" ? "当前套餐" : "立即订阅"}
        </button>
      </div>
    </div>
  )
}

// 套餐卡片
function PlanCard({
  plan,
  billingPeriod,
  isSelected,
  onSelect,
}: {
  plan: (typeof plans)[0]
  billingPeriod: "month" | "year"
  isSelected: boolean
  onSelect: () => void
}) {
  const price =
    billingPeriod === "year" && plan.yearPrice
      ? Math.round(plan.yearPrice / 12)
      : plan.price

  const getIcon = () => {
    switch (plan.id) {
      case "free":
        return <Sparkles className="h-5 w-5" />
      case "lite":
        return <Zap className="h-5 w-5" />
      case "pro":
        return <Crown className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        "glass relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all active:scale-[0.99]",
        isSelected && "ring-2 ring-primary",
        plan.highlight && !isSelected && "ring-1 ring-primary/30"
      )}
    >
      {/* 推荐标签 */}
      {plan.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {plan.badge}
        </span>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            plan.id === "pro"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-primary/10 text-primary"
          )}
        >
          {getIcon()}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              ¥{price}
            </span>
            {plan.period && (
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            )}
          </div>
        </div>
      </div>

      {/* 核心数据 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">
            {plan.questions}次/月
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
          <HardDrive className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{plan.storage}G空间</span>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="space-y-2">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="text-sm text-secondary-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {/* 选中指示 */}
      {isSelected && (
        <div className="absolute right-4 bottom-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}
