"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  FolderOpen,
  User,
  ChevronRight,
  FileText,
  Bell,
  HelpCircle,
  Search,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { IdentityModal } from "@/components/identity-modal"
import { FeedbackFab } from "@/components/feedback-fab"
import { writeUserIdentity } from "@/lib/identity-options"
import { useAuthGuard } from "@/hooks/use-auth-guard"

// 底部导航Tab类型
type TabType = "chat" | "vault" | "profile"

// 场景指南数据 - 来自PRD
const scenarioGuides = [
  {
    id: "register",
    icon: FileText,
    title: "注册申报准备",
    hint: "要申报了，不知道从哪里开始",
  },
  {
    id: "supplement",
    icon: Bell,
    title: "收到发补通知",
    hint: "收到发补通知了，怎么办",
  },
  {
    id: "classify",
    icon: HelpCircle,
    title: "产品分类界定困惑",
    hint: "产品分类搞不清楚，帮我判断一下",
  },
  {
    id: "guideline",
    icon: Search,
    title: "技术指导原则查询",
    hint: "找不到对应的技术指导原则",
  },
]

export default function HomePage() {
  const { isChecking } = useAuthGuard()
  const [showIdentityModal, setShowIdentityModal] = useState(false)

  // 首次访问自动弹出身份选择（仅弹一次）
  useEffect(() => {
    if (typeof window === "undefined" || isChecking) return
    const shown = localStorage.getItem("identity_modal_shown")
    if (shown === "true") return
    const timer = setTimeout(() => setShowIdentityModal(true), 900)
    return () => clearTimeout(timer)
  }, [isChecking])

  const handleIdentitySubmit = (data: {
    position: string
    fields: string[]
    customPosition?: string
    customField?: string
  }) => {
    writeUserIdentity(data)
    if (typeof window !== "undefined") {
      localStorage.setItem("identity_modal_shown", "true")
    }
  }

  const handleIdentityClose = () => {
    setShowIdentityModal(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("identity_modal_shown", "true")
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <HomeContent />
      </main>

      {/* 悬浮反馈按钮 */}
      <FeedbackFab />

      {/* 底部导航 */}
      <BottomNavigation activeTab="chat" />

      {/* 身份选择弹窗 */}
      <IdentityModal
        isOpen={showIdentityModal}
        onClose={handleIdentityClose}
        onSubmit={(data) => {
          handleIdentitySubmit(data)
          setShowIdentityModal(false)
        }}
      />
    </div>
  )
}

// 微信小程序导航栏
function MiniProgramNavBar() {
  return (
    <div className="relative flex h-11 items-center justify-center bg-background">
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
  )
}

// 首页内容
function HomeContent() {
  return (
    <div className="min-h-full bg-background">
      {/* 微信小程序导航栏 */}
      <MiniProgramNavBar />

      {/* 深蓝渐变头部区域 - 品牌展示 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb]">
        {/* 背景光晕 */}
        <div className="absolute -right-[60px] -top-10 h-[220px] w-[220px] rounded-full bg-blue-400/25 blur-[60px]" />
        <div className="absolute -left-10 -bottom-[60px] h-[180px] w-[180px] rounded-full bg-cyan-400/20 blur-[60px]" />

        <div className="relative flex items-center justify-center px-6 py-9">
          {/* 品牌锁定区域: logo + 竖线 + 文字 */}
          <div className="flex items-center" style={{ transform: 'translateX(-4px)' }}>
            {/* Logo带光晕 */}
            <div className="relative mr-5 flex-shrink-0">
              <div 
                className="absolute -inset-1.5 rounded-full blur-lg"
                style={{ background: 'radial-gradient(closest-side, rgba(147,197,253,0.32), rgba(147,197,253,0))' }}
              />
              <Image
                src="/crab-logo.png"
                alt="械研"
                width={104}
                height={104}
                priority
                className="relative block object-contain brightness-0 invert drop-shadow-lg"
              />
            </div>

            {/* 竖线分割 */}
            <div 
              className="mr-5 h-14 w-px flex-shrink-0"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 100%)' }}
            />

            {/* 文字区域 */}
            <div className="flex min-w-0 flex-col items-start gap-2">
              {/* Slogan */}
              <div className="whitespace-nowrap text-[26px] font-bold leading-tight tracking-wide text-white">
                让&nbsp;AI&nbsp;
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ background: 'linear-gradient(90deg, #FDBA74 0%, #FB923C 100%)', WebkitBackgroundClip: 'text' }}
                >
                  有据而行
                </span>
              </div>

              {/* 品牌名 */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-[13px] font-medium tracking-wide text-white/90">
                  械研
                </span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-[3px] text-white/50">
                  VERIDATA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 白色内容区域 */}
      <div className="mt-5 bg-background px-4 pb-6">
        {/* VeriAsk 智能体区块 */}
        <section className="mb-6">
          <SectionTitle>VeriAsk 智能体</SectionTitle>
          <MainFeatureCard />
        </section>

        {/* 场景指南 */}
        <ScenarioGuideSection />
      </div>
    </div>
  )
}

// 区块标题
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="h-5 w-1.5 rounded-full bg-primary" />
      <h3 className="text-base font-semibold text-foreground">{children}</h3>
    </div>
  )
}

// 智能问答主卡片 - 新设计
function MainFeatureCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] px-[26px] py-8">
      {/* 背景装饰光晕 */}
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-[40px]" />
      <div className="absolute right-20 top-0 h-24 w-24 rounded-full bg-blue-300/10 blur-[40px]" />

      {/* 内容 */}
      <div className="relative z-10">
        {/* 标题 */}
        <h2 className="text-[32px] font-bold leading-tight tracking-wide text-white">
          智能问答
        </h2>

        {/* 白色渐变分割线 */}
        <div 
          className="mt-5 mb-6 h-px w-3/4"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)' }}
        />

        {/* 描述区域 */}
        <div className="mb-6">
          <p className="mb-1.5 text-[15px] font-medium leading-normal text-white/95">
            注册问题的深层问答
          </p>
          <p className="text-[13px] leading-relaxed text-white/60">
            基于行业数据库，每条回答有出处
          </p>
        </div>

        {/* 全宽按钮 */}
        <Link
          href="/chat"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-6 py-4 text-[15px] font-semibold tracking-wide text-[#1e40af] shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          style={{ boxShadow: '0 4px 16px rgba(8, 20, 60, 0.15)' }}
        >
          立即提问
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// 场景指南区块 - 列表式
function ScenarioGuideSection() {
  return (
    <section>
      <SectionTitle>推荐场景指南</SectionTitle>

      {/* 列表卡片 */}
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        {scenarioGuides.map((guide, index) => (
          <Link
            key={guide.id}
            href={`/chat?q=${encodeURIComponent(guide.hint)}`}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted",
              index < scenarioGuides.length - 1 && "border-b border-border"
            )}
          >
            <span className="flex text-primary/80">
              <guide.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-sm font-medium text-foreground">
              {guide.title}
            </span>
            <span className="text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// 底部导航
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
