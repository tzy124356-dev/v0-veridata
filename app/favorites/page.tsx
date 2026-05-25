"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getFavorites, removeFavorite, loadDemoFavorites, type FavoriteItem } from "@/lib/storage"

export default function FavoritesPage() {
  const { isChecking } = useAuthGuard()
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFavorites(getFavorites())
      setIsLoaded(true)
    }
  }, [])

  const filteredFavorites = favorites.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    removeFavorite(id)
    setFavorites(getFavorites())
  }

  const handleLoadDemo = () => {
    loadDemoFavorites()
    setFavorites(getFavorites())
  }

  const isEmpty = favorites.length === 0

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
          <EmptyState onLoadDemo={handleLoadDemo} />
        ) : filteredFavorites.length === 0 ? (
          <NoResultsState query={searchQuery} />
        ) : (
          <FavoritesList favorites={filteredFavorites} onDelete={handleDelete} formatTime={formatTime} />
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
        <Bookmark className="h-8 w-8 text-[#1e40af]" />
      </div>
      <p className="mb-2 font-medium text-foreground">还没有收藏</p>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        问答后可收藏你觉得有价值的回答
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/chat"
          className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
        >
          去提问
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
  formatTime,
}: {
  favorites: FavoriteItem[]
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}) {
  return (
    <div className="space-y-4">
      {favorites.map((item) => (
        <FavoriteItemCard key={item.id} item={item} onDelete={onDelete} formatTime={formatTime} />
      ))}
    </div>
  )
}

// 收藏项
function FavoriteItemCard({
  item,
  onDelete,
  formatTime,
}: {
  item: FavoriteItem
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `问：${item.question}\n\n答：${item.answer}\n\n来源：${item.source || "未知"}`
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
        {item.source && (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-[#1e40af]" />
            <span>{item.source}</span>
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>收藏于 {formatTime(item.savedTime)}</span>
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
