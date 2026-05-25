"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Trash2,
  Clock,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getHistory, removeHistory, loadDemoHistory, type HistoryItem } from "@/lib/storage"

export default function HistoryPage() {
  const { isChecking } = useAuthGuard()
  const [searchQuery, setSearchQuery] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHistory(getHistory())
      setIsLoaded(true)
    }
  }, [])

  const filteredHistory = history.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    removeHistory(id)
    setHistory(getHistory())
  }

  const handleLoadDemo = () => {
    loadDemoHistory()
    setHistory(getHistory())
  }

  const isEmpty = history.length === 0

  // 格式化时间显示
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (diffDays === 1) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  }

  if (isChecking || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 深蓝渐变头部 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-6">
        <header className="mb-4 flex items-center justify-between">
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">历史问答记录</h1>
          <div className="w-9" />
        </header>

        {/* 搜索框 */}
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索历史记录..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* 白色内容区域 */}
      <main className="flex-1 bg-background px-5 py-6">
        {isEmpty ? (
          <EmptyState onLoadDemo={handleLoadDemo} />
        ) : filteredHistory.length === 0 ? (
          <NoResultsState query={searchQuery} />
        ) : (
          <HistoryList history={filteredHistory} onDelete={handleDelete} formatTime={formatTime} />
        )}

        {/* 底部提示 */}
        {!isEmpty && filteredHistory.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            最多保留 50 条记录，超出自动删除最早记录
          </p>
        )}
      </main>
    </div>
  )
}

// 空状态
function EmptyState({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e40af]/10">
        <MessageSquare className="h-8 w-8 text-[#1e40af]" />
      </div>
      <p className="mb-2 font-medium text-foreground">还没有问答记录</p>
      <p className="mb-6 text-sm text-muted-foreground">去提问吧</p>
      <div className="flex flex-col gap-3">
        <Link
          href="/chat"
          className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
        >
          开始提问
        </Link>
        <button
          onClick={onLoadDemo}
          className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          加载演示数据
        </button>
      </div>
    </div>
  )
}

// 无搜索结果
function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="mb-2 font-medium text-foreground">未找到相关记录</p>
      <p className="text-sm text-muted-foreground">
        没有包含&quot;{query}&quot;的问答记录
      </p>
    </div>
  )
}

// 历史列表
function HistoryList({
  history,
  onDelete,
  formatTime,
}: {
  history: HistoryItem[]
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}) {
  // 按日期分组
  const today: HistoryItem[] = []
  const yesterday: HistoryItem[] = []
  const earlier: HistoryItem[] = []
  
  const now = new Date()
  history.forEach((item) => {
    const date = new Date(item.createdAt)
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      today.push(item)
    } else if (diffDays === 1) {
      yesterday.push(item)
    } else {
      earlier.push(item)
    }
  })

  return (
    <div className="space-y-6">
      {today.length > 0 && (
        <HistoryGroup title="今天" items={today} onDelete={onDelete} formatTime={formatTime} />
      )}
      {yesterday.length > 0 && (
        <HistoryGroup title="昨天" items={yesterday} onDelete={onDelete} formatTime={formatTime} />
      )}
      {earlier.length > 0 && (
        <HistoryGroup title="更早" items={earlier} onDelete={onDelete} formatTime={formatTime} />
      )}
    </div>
  )
}

// 历史分组
function HistoryGroup({
  title,
  items,
  onDelete,
  formatTime,
}: {
  title: string
  items: HistoryItem[]
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <HistoryItemCard key={item.id} item={item} onDelete={onDelete} formatTime={formatTime} />
        ))}
      </div>
    </div>
  )
}

// 历史项
function HistoryItemCard({
  item,
  onDelete,
  formatTime,
}: {
  item: HistoryItem
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}) {
  return (
    <div className="group relative rounded-xl border border-border bg-card transition-all hover:border-[#1e40af]/30 hover:bg-secondary/30">
      <Link href={`/chat?history=${item.id}`} className="block p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {item.question}
          </h3>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
          {item.answerSummary}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(item.createdAt)}</span>
          </div>
          {/* 删除按钮 */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(item.id)
            }}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive opacity-0 transition-all hover:bg-destructive/20 active:scale-95 group-hover:opacity-100"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </Link>
    </div>
  )
}
