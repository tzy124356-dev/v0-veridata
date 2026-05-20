"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  Bookmark,
  Copy,
  Trash2,
  Clock,
  FileText,
  Check,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 模拟收藏数据
const mockFavorites = [
  {
    id: 1,
    question: "医美针剂注册申报需要准备哪些材料？",
    answer:
      "根据《医疗器械注册与备案管理办法》，医美针剂作为第三类医疗器械，注册申报需要准备以下材料：1. 注册申请表；2. 证明性文件；3. 医疗器械安全有效基本要求清单...",
    source: "《医疗器械注册与备案管理办法》第十五条",
    savedTime: "今天 14:30",
  },
  {
    id: 2,
    question: "透明质酸类产品的分类界定标准是什么？",
    answer:
      "透明质酸类产品的分类主要依据其预期用途和作用机理。用于注射填充的透明质酸钠产品，按照第三类医疗器械管理...",
    source: "《医疗器械分类目录》",
    savedTime: "昨天 16:42",
  },
  {
    id: 3,
    question: "注射用透明质酸钠的有效期验证方法？",
    answer:
      "有效期验证应按照《医疗器械稳定性研究技术审查指导原则》进行，包括实时稳定性研究和加速稳定性研究...",
    source: "《医疗器械稳定性研究技术审查指导原则》",
    savedTime: "3天前",
  },
]

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState(mockFavorites)

  const filteredFavorites = favorites.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  const isEmpty = favorites.length === 0

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
          <h1 className="text-lg font-semibold text-white">我的收藏</h1>
          <div className="w-9" />
        </header>

        {/* 统计 */}
        <div className="mb-4 text-center">
          <p className="text-2xl font-bold text-white">{favorites.length}</p>
          <p className="text-sm text-white/70">条收藏</p>
        </div>

        {/* 搜索框 */}
        {!isEmpty && (
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索收藏内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {/* 白色内容区域 */}
      <main className="flex-1 bg-background px-5 py-6">
        {isEmpty ? (
          <EmptyState />
        ) : filteredFavorites.length === 0 ? (
          <NoResultsState query={searchQuery} />
        ) : (
          <FavoritesList favorites={filteredFavorites} onDelete={handleDelete} />
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
        <Bookmark className="h-8 w-8 text-[#1e40af]" />
      </div>
      <p className="mb-2 font-medium text-foreground">还没有收藏</p>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        问答后可收藏你觉得有价值的回答
      </p>
      <Link
        href="/chat"
        className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
      >
        去提问
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
      <p className="mb-2 font-medium text-foreground">未找到相关收藏</p>
      <p className="text-sm text-muted-foreground">
        没有包含&quot;{query}&quot;的收藏内容
      </p>
    </div>
  )
}

// 收藏列表
function FavoritesList({
  favorites,
  onDelete,
}: {
  favorites: typeof mockFavorites
  onDelete: (id: number) => void
}) {
  return (
    <div className="space-y-4">
      {favorites.map((item) => (
        <FavoriteItem key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}

// 收藏项
function FavoriteItem({
  item,
  onDelete,
}: {
  item: (typeof mockFavorites)[0]
  onDelete: (id: number) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `问：${item.question}\n\n答：${item.answer}\n\n来源：${item.source}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* 问题 */}
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-medium leading-snug text-foreground">
          {item.question}
        </h3>
      </div>

      {/* 回答摘要 */}
      <div className="p-4">
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {item.answer}
        </p>

        {/* 来源 */}
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5 text-[#1e40af]" />
          <span>{item.source}</span>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>收藏于 {item.savedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-secondary active:scale-95",
                copied && "text-green-500"
              )}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-destructive/70 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 查看完整回答 */}
      <Link
        href={`/chat?favorite=${item.id}`}
        className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 text-sm text-[#1e40af] transition-colors hover:bg-secondary/50"
      >
        查看完整回答
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
