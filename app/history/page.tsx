"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Trash2,
  Clock,
  Plus,
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
      {/* 顶部导航 */}
      <header className="glass sticky top-0 z-40 border-b border-border/50 px-5 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">历史问答记录</h1>
          <Link
            href="/chat"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50"
          >
            <Plus className="h-5 w-5 text-foreground" />
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 py-4">
        {/* 搜索框 */}
        <div className="mb-4">
          <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
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

        {isEmpty ? (
          <EmptyState />
        ) : filteredHistory.length === 0 ? (
          <NoResultsState query={searchQuery} />
        ) : (
          <HistoryList history={filteredHistory} onDelete={handleDelete} />
        )}

        {/* 底部提示 */}
        {!isEmpty && (
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
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <p className="mb-2 text-foreground">还没有问答记录</p>
      <p className="mb-6 text-sm text-muted-foreground">去提问吧</p>
      <Link
        href="/chat"
        className="gradient-accent rounded-xl px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
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
      <p className="mb-2 text-foreground">未找到相关记录</p>
      <p className="text-sm text-muted-foreground">
        没有包含"{query}"的问答记录
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
  return (
    <div className="space-y-3">
      {history.map((item) => (
        <HistoryItem key={item.id} item={item} onDelete={onDelete} />
      ))}
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
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      className="glass group relative overflow-hidden rounded-xl transition-all"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Link href={`/chat?history=${item.id}`} className="block p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {item.question}
          </h3>
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
          onDelete(item.id)
        }}
        className={cn(
          "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-all hover:bg-destructive/20 active:scale-95",
          showDelete ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
        )}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
