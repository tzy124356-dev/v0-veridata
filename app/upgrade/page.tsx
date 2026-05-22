"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Crown,
  Sparkles,
  Zap,
  Users,
  ChevronRight,
  X,
  MessageSquare,
  HardDrive,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [version, setVersion] = useState<"A" | "B" | "C">("A")

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 版本切换器 */}
      <div className="fixed top-3 left-3 z-50 flex items-center gap-2 rounded-lg bg-white/90 px-2 py-1 shadow-md backdrop-blur-sm">
        <span className="text-[10px] text-gray-400">版本：</span>
        {(["A", "B", "C"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={cn(
              "h-6 w-6 rounded text-[10px] font-medium transition-all",
              version === v
                ? "bg-[#1e40af] text-white"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {version === "A" && <UpgradeVersionA />}
      {version === "B" && <UpgradeVersionB />}
      {version === "C" && <UpgradeVersionC />}
    </div>
  )
}

// 版本A：卡片对比式 - 三列卡片垂直排列
function UpgradeVersionA() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)

  return (
    <div className="flex flex-col pb-8">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
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
              <div className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-3 py-0.5 text-xs font-medium text-white">
                推荐
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
                <MessageSquare className="h-3.5 w-3.5" />
                {plan.questions}
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
          <button className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1e40af]/25">
            微信支付订阅
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            支持开具发票 · 7天无理由退款
          </p>
        </div>
      )}

      {/* 团队版弹窗 */}
      {showTeamModal && (
        <TeamContactModal onClose={() => setShowTeamModal(false)} />
      )}
    </div>
  )
}

// 版本B：表格对比式 - 功能对比表格
function UpgradeVersionB() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [showTeamModal, setShowTeamModal] = useState(false)

  const features = [
    { name: "问答次数", free: "50次/月", lite: "300次/月", pro: "1000次/月" },
    { name: "档案库空间", free: "2G", lite: "5G", pro: "20G" },
    { name: "法规依据引用", free: true, lite: true, pro: true },
    { name: "历史记录", free: "7天", lite: "30天", pro: "永久" },
    { name: "收藏功能", free: true, lite: true, pro: true },
    { name: "优先客服", free: false, lite: true, pro: true },
    { name: "新功能优先体验", free: false, lite: false, pro: true },
  ]

  return (
    <div className="flex flex-col pb-32">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="text-base font-semibold text-gray-900">选择方案</span>
        <div className="w-9" />
      </header>

      {/* 计费周期切换 */}
      <div className="flex justify-center px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
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
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            )}
          >
            年付 · 省15%
          </button>
        </div>
      </div>

      {/* 价格头部 */}
      <div className="mt-4 grid grid-cols-4 gap-1 px-2">
        <div className="p-2" />
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "rounded-t-xl p-3 text-center",
              plan.popular ? "bg-[#1e40af] text-white" : "bg-gray-50"
            )}
          >
            <p className={cn("text-xs", plan.popular ? "text-white/80" : "text-gray-500")}>
              {plan.name}
            </p>
            <p className={cn("mt-1 text-lg font-bold", plan.popular ? "text-white" : "text-gray-900")}>
              ¥{billingCycle === "monthly" ? plan.price : plan.yearPrice}
            </p>
            <p className={cn("text-[10px]", plan.popular ? "text-white/60" : "text-gray-400")}>
              /{billingCycle === "monthly" ? "月" : "年"}
            </p>
          </div>
        ))}
      </div>

      {/* 功能对比表格 */}
      <div className="px-2">
        {features.map((feature, index) => (
          <div
            key={feature.name}
            className={cn(
              "grid grid-cols-4 gap-1",
              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            )}
          >
            <div className="flex items-center p-3 text-xs text-gray-600">
              {feature.name}
            </div>
            {[feature.free, feature.lite, feature.pro].map((value, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center p-3",
                  i === 1 && "bg-[#1e40af]/5"
                )}
              >
                {typeof value === "boolean" ? (
                  value ? (
                    <Check className="h-4 w-4 text-[#1e40af]" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )
                ) : (
                  <span className="text-xs font-medium text-gray-700">{value}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 订阅按钮 */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            className={cn(
              "rounded-xl py-3 text-sm font-medium transition-all",
              plan.id === "free"
                ? "bg-gray-100 text-gray-600"
                : plan.popular
                ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-md"
                : "bg-[#1e40af]/10 text-[#1e40af]"
            )}
          >
            {plan.id === "free" ? "当前" : "订阅"}
          </button>
        ))}
      </div>

      {/* 团队版入口 */}
      <button
        onClick={() => setShowTeamModal(true)}
        className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-sm text-amber-700"
      >
        <Users className="h-4 w-4" />
        团队版即将上线，点击预约
      </button>

      {/* 说明 */}
      <div className="mx-4 mt-4 rounded-xl bg-gray-50 p-4">
        <p className="text-xs leading-relaxed text-gray-500">
          · 支持微信支付<br />
          · 可开具电子发票<br />
          · 7天无理由退款
        </p>
      </div>

      {showTeamModal && <TeamContactModal onClose={() => setShowTeamModal(false)} />}
    </div>
  )
}

// 版本C：滑动卡片式 - 横向滑动大卡片
function UpgradeVersionC() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [currentPlan, setCurrentPlan] = useState(1)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const planDetails = [
    {
      ...plans[0],
      icon: Zap,
      gradient: "from-gray-400 to-gray-500",
      features: ["每月50次问答", "2G档案空间", "基础法规查询", "7天历史记录"],
    },
    {
      ...plans[1],
      icon: Sparkles,
      gradient: "from-[#1e40af] to-[#3b82f6]",
      features: ["每月300次问答", "5G档案空间", "完整法规引用", "30天历史记录", "优先客服支持"],
    },
    {
      ...plans[2],
      icon: Crown,
      gradient: "from-amber-500 to-orange-500",
      features: ["每月1000次问答", "20G档案空间", "完整法规引用", "永久历史记录", "优先客服支持", "新功能优先体验"],
    },
  ]

  return (
    <div className="flex flex-col pb-8">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="text-base font-semibold text-gray-900">会员中心</span>
        <div className="w-9" />
      </header>

      {/* 头部背景 */}
      <div className="relative bg-gradient-to-br from-[#1e40af] via-[#1d4ed8] to-[#3b82f6] px-4 pb-20 pt-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-blue-300/20 blur-2xl" />
        </div>
        <div className="relative text-center">
          <h1 className="text-xl font-bold text-white">选择您的专属方案</h1>
          <p className="mt-1 text-sm text-white/70">解锁全部专业功能</p>
        </div>
        
        {/* 计费周期 */}
        <div className="relative mt-4 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-white/20 p-1 backdrop-blur-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                billingCycle === "monthly"
                  ? "bg-white text-[#1e40af]"
                  : "text-white/80"
              )}
            >
              月付
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                billingCycle === "yearly"
                  ? "bg-white text-[#1e40af]"
                  : "text-white/80"
              )}
            >
              年付 · 8.5折
            </button>
          </div>
        </div>
      </div>

      {/* 套餐卡片 - 横向滑动 */}
      <div className="-mt-12 overflow-x-auto px-4 pb-4 scrollbar-hide">
        <div className="flex gap-3" style={{ width: "fit-content" }}>
          {planDetails.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                onClick={() => setCurrentPlan(index)}
                className={cn(
                  "w-[280px] flex-shrink-0 rounded-2xl bg-white p-5 shadow-xl transition-all",
                  currentPlan === index && "ring-2 ring-[#1e40af]"
                )}
              >
                {/* 头部 */}
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", plan.gradient)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#1e40af]">
                        ¥{billingCycle === "monthly" ? plan.price : plan.yearPrice}
                      </span>
                      <span className="text-sm text-gray-400">
                        /{billingCycle === "monthly" ? "月" : "年"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 功能列表 */}
                <div className="mt-4 space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1e40af]/10">
                        <Check className="h-3 w-3 text-[#1e40af]" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 订阅按钮 */}
                <button
                  className={cn(
                    "mt-5 w-full rounded-xl py-3 text-sm font-semibold transition-all",
                    plan.id === "free"
                      ? "bg-gray-100 text-gray-600"
                      : index === 1
                      ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-[#1e40af]/25"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                  )}
                >
                  {plan.id === "free" ? "当前方案" : "立即订阅"}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 指示器 */}
      <div className="flex justify-center gap-1.5 py-2">
        {planDetails.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              currentPlan === index ? "w-4 bg-[#1e40af]" : "w-1.5 bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* 团队版 */}
      <button
        onClick={() => setShowTeamModal(true)}
        className="mx-4 mt-2 flex items-center justify-between rounded-2xl border border-[#1e40af]/20 bg-gradient-to-r from-[#1e40af]/5 to-[#3b82f6]/5 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e40af]/10">
            <Users className="h-5 w-5 text-[#1e40af]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">团队版</p>
            <p className="text-xs text-gray-500">即将上线，留下联系方式优先体验</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-[#1e40af]" />
      </button>

      {/* 支付说明 */}
      <div className="mx-4 mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>微信支付</span>
        <span>·</span>
        <span>可开发票</span>
        <span>·</span>
        <span>7天退款</span>
      </div>

      {showTeamModal && <TeamContactModal onClose={() => setShowTeamModal(false)} />}
    </div>
  )
}

// 团队版联系弹窗
function TeamContactModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (phone) {
      setSubmitted(true)
      setTimeout(onClose, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <p className="text-base font-medium text-gray-900">提交成功</p>
          <p className="mt-1 text-sm text-gray-500">我们将尽快与您联系</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">预约团队版</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          留下您的联系方式，团队版上线后我们将第一时间通知您。
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">手机号 *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">公司名称（选填）</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="请输入公司名称"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!phone}
          className={cn(
            "mt-5 w-full rounded-xl py-3.5 text-base font-semibold transition-all",
            phone
              ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white"
              : "bg-gray-100 text-gray-400"
          )}
        >
          提交预约
        </button>
      </div>
    </div>
  )
}
