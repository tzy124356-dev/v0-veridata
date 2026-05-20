"use client"

import {
  MessageSquare,
  FolderOpen,
  User,
  ChevronRight,
  CheckCircle2,
  FileText,
  Bell,
  HelpCircle,
  Search,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 底部导航Tab类型
type TabType = "chat" | "vault" | "profile"

// 场景指南数据 - 来自PRD
const scenarioGuides = [
  {
    id: "register",
    icon: FileText,
    title: "注册申报准备",
    description: "梳理路径，高效准备",
    hint: "要申报了，不知道从哪里开始",
  },
  {
    id: "supplement",
    icon: Bell,
    title: "收到发补通知",
    description: "解析意见，回应参考",
    hint: "收到发补通知了，怎么办",
  },
  {
    id: "classify",
    icon: HelpCircle,
    title: "分类界定困惑",
    description: "分析依据，明确类别",
    hint: "产品分类搞不清楚，帮我判断一下",
  },
  {
    id: "guideline",
    icon: Search,
    title: "指导原则查询",
    description: "检索文件，把握要点",
    hint: "找不到对应的技术指导原则",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <HomeContent />
      </main>

      {/* 悬浮反馈按钮 */}
      <FeedbackButton />

      {/* 底部导航 */}
      <BottomNavigation activeTab="chat" />
    </div>
  )
}

// 首页内容
function HomeContent() {
  return (
    <div className="min-h-full">
      {/* 深蓝渐变头部区域 - 紧凑版 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
        </div>

        <div className="relative px-5 pt-10 pb-6">
          {/* 品牌区域 */}
          <header className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                械研 VERIDATA
              </h1>
              <p className="text-[11px] text-white/70">械研，让AI有据而行</p>
            </div>
          </header>

          {/* 身份选择横幅 */}
          <IdentityBanner />
        </div>
      </div>

      {/* 白色内容区域 - 带圆弧顶部 */}
      <div className="-mt-3 rounded-t-3xl bg-background px-5 pt-5 pb-6">
        {/* 智能问答主卡片 */}
        <MainFeatureCard />
        
        {/* 场景指南 */}
        <ScenarioGuideSection />
      </div>
    </div>
  )
}

// 身份选择横幅
function IdentityBanner() {
  return (
    <Link
      href="/profile/identity"
      className="mb-5 flex items-center justify-between rounded-xl bg-white/15 px-4 py-3 backdrop-blur-sm transition-all active:bg-white/20"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm text-white">
          告诉我们你的方向，获得更精准的内容
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-white/70" />
    </Link>
  )
}

// 智能问答主卡片 - 放在白色区域中（加大版）
function MainFeatureCard() {
  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] p-6">
      {/* 背景装饰光晕 */}
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
      <div className="absolute right-20 top-0 h-24 w-24 rounded-full bg-blue-300/10 blur-2xl" />

      {/* 右侧AI图标装饰 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -bottom-2 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-cyan-400/50 blur-md" />
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-sm">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* 左侧内容 */}
      <div className="relative z-10 max-w-[60%]">
        <h2 className="mb-1.5 text-2xl font-bold text-white">智能问答</h2>
        <p className="mb-3 text-sm text-white/80">注册问题的深层问答</p>

        {/* 出处说明 */}
        <div className="mb-4 flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cyan-300" />
          <span className="text-xs leading-relaxed text-white/70">
            基于行业官方数据库，每条回答有出处
          </span>
        </div>

        {/* 立即提问按钮 */}
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-[#1e40af] transition-all hover:bg-white/90 active:scale-[0.98]"
        >
          立即提问
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// 场景指南区块
function ScenarioGuideSection() {
  return (
    <section>
      {/* 标题 */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          为你推荐场景指南
        </h3>
      </div>

      {/* 2x2 场景卡片网格 - 紧凑横向布局 */}
      <div className="grid grid-cols-2 gap-2.5">
        {scenarioGuides.map((guide) => (
          <Link
            key={guide.id}
            href={`/chat?q=${encodeURIComponent(guide.hint)}`}
            className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-3 transition-all hover:border-primary/30 hover:shadow-soft active:scale-[0.98]"
          >
            {/* 图标 */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <guide.icon className="h-4 w-4 text-primary" />
            </div>

            {/* 标题 */}
            <span className="text-sm font-medium text-foreground">
              {guide.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// 悬浮反馈按钮
function FeedbackButton() {
  return (
    <Link
      href="/feedback"
      className="fixed right-4 bottom-24 z-40 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all active:scale-95"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="mt-0.5 text-[10px] leading-none">反馈</span>
    </Link>
  )
}

// 底部导航
function BottomNavigation({ activeTab }: { activeTab: TabType }) {
  const tabs = [
    { id: "chat" as const, icon: MessageSquare, label: "智能问答", href: "/" },
    { id: "vault" as const, icon: FolderOpen, label: "我的档案库", href: "/vault" },
    { id: "profile" as const, icon: User, label: "我的", href: "/profile" },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background">
      <div className="flex items-center justify-around py-2 pb-safe">
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
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
