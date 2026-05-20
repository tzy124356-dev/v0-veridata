"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Trash2,
  Clock,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 模拟历史数据
const mockHistory = [
  {
    id: 1,
    question: "医美针剂注册申报需要准备哪些材料？",
    time: "今天 14:30",
    preview: "根据《医疗器械注册与备案管理办法》，医美针剂作为第三类医疗器械...",
  },
  {
    id: 2,
    question: "收到发补通知后应该如何处理？",
    time: "今天 10:15",
    preview: "收到发补通知后，建议按以下步骤处理：首先仔细阅读发补意见...",
  },
  {
    id: 3,
    question: "透明质酸类产品的分类界定标准是什么？",
    time: "昨天 16:42",
    preview: "透明质酸类产品的分类主要依据其预期用途和作用机理...",
  },
  {
    id: 4,
    question: "技术指导原则中关于临床评价的要求有哪些？",
    time: "昨天 09:20",
    preview: "根据《医疗器械临床评价技术指导原则》，临床评价应包括...",
  },
  {
    id: 5,
    question: "注射用透明质酸钠的有效期验证方法？",
    time: "3天前",
    preview: "有效期验证应按照《医疗器械稳定性研究技术审查指导原则》...",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [history, setHistory] = useState(mockHistory)

  const filteredHistory = history.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const isEmpty = history.length === 0

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
          <EmptyState />
        ) : filteredHistory.length === 0 ? (
          <NoResultsState query={searchQuery} />
        ) : (
          <HistoryList history={filteredHistory} onDelete={handleDelete} />
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
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e40af]/10">
        <MessageSquare className="h-8 w-8 text-[#1e40af]" />
      </div>
      <p className="mb-2 font-medium text-foreground">还没有问答记录</p>
      <p className="mb-6 text-sm text-muted-foreground">去提问吧</p>
      <Link
        href="/chat"
        className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
      >
        开始提问
      </Link>
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
}: {
  history: typeof mockHistory
  onDelete: (id: number) => void
}) {
  // 按日期分组
  const today = history.filter((item) => item.time.startsWith("今天"))
  const yesterday = history.filter((item) => item.time.startsWith("昨天"))
  const earlier = history.filter(
    (item) => !item.time.startsWith("今天") && !item.time.startsWith("昨天")
  )

  return (
    <div className="space-y-6">
      {today.length > 0 && (
        <HistoryGroup title="今天" items={today} onDelete={onDelete} />
      )}
      {yesterday.length > 0 && (
        <HistoryGroup title="昨天" items={yesterday} onDelete={onDelete} />
      )}
      {earlier.length > 0 && (
        <HistoryGroup title="更早" items={earlier} onDelete={onDelete} />
      )}
    </div>
  )
}

// 历史分组
function HistoryGroup({
  title,
  items,
  onDelete,
}: {
  title: string
  items: typeof mockHistory
  onDelete: (id: number) => void
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <HistoryItem key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

// 历史项
function HistoryItem({
  item,
  onDelete,
}: {
  item: (typeof mockHistory)[0]
  onDelete: (id: number) => void
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
          {item.preview}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{item.time}</span>
        </div>
      </Link>

      {/* 删除按钮 */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete(item.id)
        }}
        className={cn(
          "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive opacity-0 transition-all hover:bg-destructive/20 active:scale-95 group-hover:opacity-100"
        )}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
