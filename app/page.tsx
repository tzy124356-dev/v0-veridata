"use client"

import { useState } from "react"
import {
  MessageSquare,
  FolderOpen,
  User,
  ChevronRight,
  Search,
  FileText,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IdentityModal } from "@/components/identity-modal"
import { FeedbackModal } from "@/components/feedback-modal"

// 底部导航Tab类型
type TabType = "chat" | "vault" | "profile"

// 场景标签数据
const scenarioTags = [
  { id: 1, label: "注册申报准备中", hint: "要申报了，不知道从哪里开始" },
  { id: 2, label: "收到发补通知", hint: "收到发补通知了，怎么办" },
  { id: 3, label: "产品分类界定困惑", hint: "产品分类搞不清楚，帮我判断一下" },
  { id: 4, label: "技术指导原则查询", hint: "找不到对应的技术指导原则" },
]

// 知识库统计
const knowledgeStats = [
  { label: "医疗器械分类", value: "22大类" },
  { label: "法规规章", value: "XX份" },
  { label: "技术指导原则", value: "XX份" },
  { label: "已批产品档案", value: "XX个" },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat")
  const [showIdentityBanner, setShowIdentityBanner] = useState(true)
  const [showIdentityModal, setShowIdentityModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const router = useRouter()

  // 处理Tab切换
  const handleTabChange = (tab: TabType) => {
    if (tab === "vault") {
      router.push("/vault")
    } else if (tab === "profile") {
      router.push("/profile")
    } else {
      setActiveTab("chat")
    }
  }

  // 处理身份信息提交
  const handleIdentitySubmit = (data: { position: string; fields: string[] }) => {
    console.log("Identity submitted:", data)
    setShowIdentityBanner(false)
  }

  // 处理反馈提交
  const handleFeedbackSubmit = (data: { type: string; content: string }) => {
    console.log("Feedback submitted:", data)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === "chat" && (
          <HomeContent
            showIdentityBanner={showIdentityBanner}
            onOpenIdentityModal={() => setShowIdentityModal(true)}
          />
        )}
      </main>

      {/* 底部导航 */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 全局悬浮反馈按钮 */}
      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />

      {/* 身份选择浮层 */}
      <IdentityModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onSubmit={handleIdentitySubmit}
      />

      {/* 反馈浮层 */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  )
}

// 首页内容
function HomeContent({
  showIdentityBanner,
  onOpenIdentityModal,
}: {
  showIdentityBanner: boolean
  onOpenIdentityModal: () => void
}) {
  return (
    <div className="gradient-deep-blue min-h-full px-5 pt-12 pb-6">
      {/* 品牌区域 */}
      <header className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          械研 VERIDATA
        </h1>
        <p className="text-sm text-muted-foreground">械研，让AI有据而行</p>
      </header>

      {/* 身份选择横幅 */}
      {showIdentityBanner && (
        <IdentityBanner onClick={onOpenIdentityModal} />
      )}

      {/* 核心入口卡片 */}
      <MainEntryCard />

      {/* 场景引导标签 */}
      <ScenarioGuide />

      {/* 知识库覆盖信息 */}
      <KnowledgeBaseInfo />
    </div>
  )
}

// Logo 组件
function Logo() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* 外圈光晕 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 blur-xl" />
      {/* 主体 */}
      <div className="glass relative flex h-14 w-14 items-center justify-center rounded-2xl">
        <div className="gradient-accent flex h-10 w-10 items-center justify-center rounded-xl">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  )
}

// 身份选择横幅
function IdentityBanner({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass mb-6 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all hover:bg-secondary/50 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm text-foreground">
          告诉我们你的方向，获得更精准的内容
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}

// 主入口卡片
function MainEntryCard() {
  return (
    <Link href="/chat" className="block">
      <div className="glass mb-6 overflow-hidden rounded-2xl transition-all hover:bg-secondary/30 active:scale-[0.99]">
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-foreground">
                智能问答
              </h2>
              <p className="text-xs text-muted-foreground">VeriAsk</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-secondary-foreground">
            注册问题的深层问答
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>基于行业官方数据库，每条回答有出处</span>
          </div>
        </div>
        <div className="border-t border-border/50 bg-secondary/30 px-5 py-3">
          <div className="flex w-full items-center justify-center gap-2 text-sm font-medium text-primary">
            <Search className="h-4 w-4" />
            开始提问
          </div>
        </div>
      </div>
    </Link>
  )
}

// 场景引导
function ScenarioGuide() {
  const router = useRouter()
  
  const handleScenarioClick = (hint: string) => {
    // 跳转到问答页并携带预设问题
    router.push(`/chat?q=${encodeURIComponent(hint)}`)
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-medium text-foreground">
        选择你的场景
      </h3>
      <div className="flex flex-wrap gap-2">
        {scenarioTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleScenarioClick(tag.hint)}
            className="glass-subtle rounded-full px-4 py-2 text-sm text-secondary-foreground transition-all hover:bg-secondary/60 active:scale-95"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// 知识库信息
function KnowledgeBaseInfo() {
  return (
    <div className="glass-subtle rounded-xl p-4">
      <h4 className="mb-3 text-xs font-medium text-muted-foreground">
        当前知识库覆盖
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {knowledgeStats.map((stat, index) => (
          <div key={index} className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 底部导航
function BottomNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}) {
  const tabs = [
    { id: "chat" as const, icon: MessageSquare, label: "智能问答" },
    { id: "vault" as const, icon: FolderOpen, label: "我的档案库" },
    { id: "profile" as const, icon: User, label: "我的" },
  ]

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-1.5 transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// 全局反馈按钮
function FeedbackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass fixed right-4 bottom-20 z-40 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-secondary/60 active:scale-95"
      aria-label="反馈"
    >
      <HelpCircle className="h-5 w-5 text-muted-foreground" />
    </button>
  )
}
