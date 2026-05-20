"use client"

import { useState } from "react"
import {
  MessageSquare,
  FolderOpen,
  User,
  ChevronRight,
  Search,
  FileText,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Home,
  Newspaper,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

// 底部导航Tab类型
type TabType = "home" | "market" | "news" | "profile"

// AI智能体数据
const aiAgents = [
  {
    id: "ask",
    name: "问诊",
    subtitle: "专业咨询，一问即答",
    status: "上线中",
    statusColor: "bg-green-500",
    icon: MessageSquare,
    gradient: "from-blue-600 to-blue-400",
    href: "/chat",
  },
  {
    id: "practice",
    name: "对练",
    subtitle: "模拟审查官问答",
    status: "Beta",
    statusColor: "bg-amber-500",
    icon: Target,
    gradient: "from-violet-600 to-violet-400",
    href: "/practice",
  },
  {
    id: "track",
    name: "追踪",
    subtitle: "项目进度看板",
    status: "实时",
    statusColor: "bg-green-500",
    icon: TrendingUp,
    gradient: "from-purple-600 to-purple-400",
    href: "/track",
  },
  {
    id: "find",
    name: "找人",
    subtitle: "智能匹配服务商",
    status: "新上线",
    statusColor: "bg-blue-500",
    icon: Users,
    gradient: "from-indigo-600 to-indigo-400",
    href: "/find",
  },
]

// 热门问题数据
const hotQuestions = [
  { id: 1, question: "二类医疗器械注册需要哪些材料？" },
  { id: 2, question: "注册费用大概多少？周期多久？" },
  { id: 3, question: "产品分类界定怎么确认？" },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const router = useRouter()

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === "profile") {
      router.push("/profile")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <HomeContent />
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

// 首页内容
function HomeContent() {
  const router = useRouter()

  const handleSearch = () => {
    router.push("/chat")
  }

  const handleQuestionClick = (question: string) => {
    router.push(`/chat?q=${encodeURIComponent(question)}`)
  }

  return (
    <div className="min-h-full">
      {/* 深蓝渐变头部区域 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-8">
        {/* 品牌区域 */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <span className="text-xl font-bold text-white">械</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">械研</h1>
            <p className="text-xs text-white/70">医械注册智能平台</p>
          </div>
        </header>

        {/* 欢迎语 */}
        <div className="mb-6">
          <h2 className="mb-2 text-3xl font-bold text-white">你好</h2>
          <p className="text-sm text-white/80">
            医疗器械注册，让每一步都有据可查
          </p>
        </div>

        {/* 搜索栏 */}
        <button
          onClick={handleSearch}
          className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-left shadow-lg transition-all active:scale-[0.99]"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            搜索注册问题、法规、案例...
          </span>
        </button>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-background px-5 py-6">
        {/* AI 智能体 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  AI 智能体
                </h3>
              </div>
              <p className="mt-1 pl-3 text-xs text-muted-foreground">
                4个专属助手，全程陪跑注册
              </p>
            </div>
            <Link
              href="/agents"
              className="flex items-center gap-1 text-sm text-primary"
            >
              查看全部
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 2x2 卡片网格 */}
          <div className="grid grid-cols-2 gap-3">
            {aiAgents.map((agent) => (
              <Link
                key={agent.id}
                href={agent.href}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 transition-all active:scale-[0.98]",
                  agent.gradient
                )}
              >
                {/* 状态标签 */}
                <div className="mb-3 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      agent.statusColor
                    )}
                  />
                  <span className="text-xs text-white/80">{agent.status}</span>
                </div>

                {/* 图标 */}
                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <agent.icon className="h-5 w-5 text-white" />
                </div>

                {/* 标题和描述 */}
                <h4 className="mb-1 text-xl font-bold text-white">
                  {agent.name}
                </h4>
                <p className="text-xs text-white/70">{agent.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 热门问题 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                热门问题
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                注册人最常咨询的问题
              </p>
            </div>
            <Link
              href="/questions"
              className="flex items-center gap-1 text-sm text-primary"
            >
              全部
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 问题列表 */}
          <div className="space-y-3">
            {hotQuestions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuestionClick(item.question)}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:bg-secondary/30 active:scale-[0.99]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {item.id}
                </span>
                <span className="flex-1 text-sm text-foreground">
                  {item.question}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
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
    { id: "home" as const, icon: Home, label: "首页" },
    { id: "market" as const, icon: FolderOpen, label: "超市" },
    { id: "news" as const, icon: Newspaper, label: "资讯" },
    { id: "profile" as const, icon: User, label: "我的" },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background">
      <div className="flex items-center justify-around py-2 pb-safe">
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
