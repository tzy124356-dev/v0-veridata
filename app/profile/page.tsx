"use client"

import { useState, useRef } from "react"
import {
  User,
  ChevronRight,
  Clock,
  Bookmark,
  FileText,
  HelpCircle,
  Settings,
  Crown,
  LogOut,
  MessageSquare,
  FolderOpen,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 用户数据统计
const userStats = {
  questions: 28,
  favorites: 12,
  documents: 5,
}

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [version, setVersion] = useState<"A" | "B" | "C">("A")

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 顶部头部区域 */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-center text-lg font-semibold text-gray-900">我的</h1>
      </header>

      {/* 版本切换器 - 选定后删除 */}
      <div className="mb-4 flex items-center justify-center gap-2 px-5">
        <span className="text-xs text-gray-400">版本：</span>
        {(["A", "B", "C"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={cn(
              "h-7 w-7 rounded-lg text-xs font-medium transition-all",
              version === v
                ? "bg-[#1e40af] text-white"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto px-5 pb-20 scrollbar-hide">
        {version === "A" && (
          <ProfileVersionA isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
        )}
        {version === "B" && (
          <ProfileVersionB isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
        )}
        {version === "C" && (
          <ProfileVersionC isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
        )}
      </main>

      {/* 悬浮反馈按钮 */}
      <FeedbackButton />

      {/* 底部导航 */}
      <BottomNavigation activeTab="profile" />
    </div>
  )
}

// 版本A：简洁卡片式 - 用户卡片 + 精简菜单 + 大按钮退出
function ProfileVersionA({
  isLoggedIn,
  onLogout,
}: {
  isLoggedIn: boolean
  onLogout: () => void
}) {
  const menuItems = [
    { icon: Clock, label: "历史记录", href: "/history" },
    { icon: Bookmark, label: "我的收藏", href: "/favorites", badge: userStats.favorites },
    { icon: FileText, label: "我的档案库", href: "/vault", badge: userStats.documents },
  ]

  const settingsItems = [
    { icon: HelpCircle, label: "帮助与反馈", href: "/help" },
    { icon: Settings, label: "设置", href: "/settings" },
  ]

  return (
    <>
      {/* 用户信息卡片 */}
      {isLoggedIn ? (
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">张工程师</h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  专业版
                </span>
              </div>
              <p className="text-xs text-gray-500">注册专员 · 医美针剂方向</p>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3">
            <div className="text-center">
              <p className="text-lg font-bold text-[#1e40af]">{userStats.questions}</p>
              <p className="text-[10px] text-gray-400">累计提问</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-lg font-bold text-[#1e40af]">{userStats.favorites}</p>
              <p className="text-[10px] text-gray-400">收藏回答</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1e40af]">{userStats.documents}</p>
              <p className="text-[10px] text-gray-400">档案文件</p>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <User className="h-7 w-7 text-gray-400" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-base font-semibold text-gray-900">点击登录</h2>
            <p className="text-xs text-gray-500">登录后享受更多功能</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      )}

      {/* 功能菜单 */}
      <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm">
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50",
              index !== menuItems.length - 1 && "border-b border-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af]/5">
                <item.icon className="h-4 w-4 text-[#1e40af]" />
              </div>
              <span className="text-sm text-gray-900">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="text-xs text-gray-400">{item.badge}</span>
              )}
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* 设置菜单 */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {settingsItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50",
              index !== settingsItems.length - 1 && "border-b border-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                <item.icon className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-sm text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        ))}
      </div>

      {/* 退出登录 */}
      {isLoggedIn && (
        <button
          onClick={onLogout}
          className="w-full rounded-2xl bg-white py-3.5 text-sm text-gray-400 shadow-sm transition-colors hover:text-red-500"
        >
          退出登录
        </button>
      )}

      <p className="mt-6 text-center text-xs text-gray-300">v1.0.0</p>
    </>
  )
}

// 版本B：紧凑网格式 - 顶部用户条 + 网格功能入口 + 底部设置
function ProfileVersionB({
  isLoggedIn,
  onLogout,
}: {
  isLoggedIn: boolean
  onLogout: () => void
}) {
  const quickActions = [
    { icon: Clock, label: "历史记录", href: "/history", count: userStats.questions },
    { icon: Bookmark, label: "我的收藏", href: "/favorites", count: userStats.favorites },
    { icon: FileText, label: "档案库", href: "/vault", count: userStats.documents },
    { icon: HelpCircle, label: "帮助", href: "/help", count: null },
  ]

  return (
    <>
      {/* 用户信息条 */}
      {isLoggedIn ? (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900">张工程师</h2>
            <p className="text-xs text-gray-400">注册专员 · 医美针剂</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">专业版</span>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900">点击登录</h2>
            <p className="text-xs text-gray-400">解锁全部功能</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </Link>
      )}

      {/* 快捷功能网格 */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {quickActions.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e40af]/5">
                <item.icon className="h-5 w-5 text-[#1e40af]" />
              </div>
              {item.count !== null && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1e40af] px-1 text-[10px] font-medium text-white">
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* 设置区域 */}
      <div className="rounded-2xl bg-white shadow-sm">
        <Link
          href="/settings"
          className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">设置</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
        {isLoggedIn && (
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">退出登录</span>
            </div>
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-300">械研 VERIDATA v1.0.0</p>
    </>
  )
}

// 版本C：信息突出式 - 大头像居中 + 横向统计 + 分组菜单
function ProfileVersionC({
  isLoggedIn,
  onLogout,
}: {
  isLoggedIn: boolean
  onLogout: () => void
}) {
  return (
    <>
      {/* 用户信息 - 居中大头像 */}
      {isLoggedIn ? (
        <div className="mb-5 flex flex-col items-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] shadow-lg shadow-[#1e40af]/20">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">张工程师</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">注册专员 · 医美针剂</span>
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2 py-0.5 text-[10px] font-medium text-white">
              专业版
            </span>
          </div>
        </div>
      ) : (
        <Link href="/login" className="mb-5 flex flex-col items-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">点击登录</h2>
          <p className="text-xs text-gray-500">登录后享受更多功能</p>
        </Link>
      )}

      {/* 数据统计横条 */}
      {isLoggedIn && (
        <div className="mb-4 flex items-center justify-around rounded-2xl bg-white p-4 shadow-sm">
          <Link href="/history" className="flex flex-col items-center">
            <p className="text-xl font-bold text-[#1e40af]">{userStats.questions}</p>
            <p className="text-[10px] text-gray-400">累计提问</p>
          </Link>
          <div className="h-8 w-px bg-gray-100" />
          <Link href="/favorites" className="flex flex-col items-center">
            <p className="text-xl font-bold text-[#1e40af]">{userStats.favorites}</p>
            <p className="text-[10px] text-gray-400">收藏回答</p>
          </Link>
          <div className="h-8 w-px bg-gray-100" />
          <Link href="/vault" className="flex flex-col items-center">
            <p className="text-xl font-bold text-[#1e40af]">{userStats.documents}</p>
            <p className="text-[10px] text-gray-400">档案文件</p>
          </Link>
        </div>
      )}

      {/* 功能菜单 */}
      <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm">
        <Link
          href="/history"
          className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-[#1e40af]" />
            <span className="text-sm text-gray-900">历史问答记录</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
        <Link
          href="/favorites"
          className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="h-4 w-4 text-[#1e40af]" />
            <span className="text-sm text-gray-900">我的收藏</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
        <Link
          href="/vault"
          className="flex items-center justify-between px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-[#1e40af]" />
            <span className="text-sm text-gray-900">我的档案库</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
      </div>

      {/* 其他菜单 */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <Link
          href="/help"
          className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">帮助与反馈</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
        <Link
          href="/settings"
          className="flex items-center justify-between px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">设置</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
      </div>

      {/* 退出登录 */}
      {isLoggedIn && (
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm text-gray-400 shadow-sm transition-colors hover:text-red-500"
        >
          退出登录
        </button>
      )}

      <p className="mt-6 text-center text-xs text-gray-300">械研 VERIDATA v1.0.0</p>
    </>
  )
}

// 可拖动的悬浮反馈按钮 - 与首页完全一致
function FeedbackButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })
  const startOffset = useRef({ x: 0, y: 0 })

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setHasMoved(false)
    startPos.current = { x: clientX, y: clientY }
    startOffset.current = { x: position.x, y: position.y }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    
    const deltaX = clientX - startPos.current.x
    const deltaY = clientY - startPos.current.y
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setHasMoved(true)
    }
    
    const newX = startOffset.current.x + deltaX
    const newY = startOffset.current.y + deltaY
    
    const maxX = window.innerWidth - 60
    const maxY = window.innerHeight - 180
    
    setPosition({
      x: Math.max(-maxX + 60, Math.min(0, newX)),
      y: Math.max(-maxY + 60, Math.min(0, newY)),
    })
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!hasMoved) {
      // TODO: 打开反馈弹窗
    }
  }

  return (
    <div
      className={cn(
        "fixed right-4 bottom-[100px] z-40 flex h-[52px] w-[52px] cursor-grab flex-col items-center justify-center rounded-full border-[3px] border-white text-white shadow-xl select-none",
        isDragging ? "cursor-grabbing" : ""
      )}
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35), 0 2px 6px rgba(0,0,0,0.12)',
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 200ms',
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        handleStart(e.clientX, e.clientY)
      }}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        const touch = e.touches[0]
        handleStart(touch.clientX, touch.clientY)
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0]
        handleMove(touch.clientX, touch.clientY)
      }}
      onTouchEnd={handleEnd}
      onClick={handleClick}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="mt-0.5 text-[9px] leading-none">反馈</span>
    </div>
  )
}

// 底部导航 - 与首页完全一致
type TabType = "chat" | "vault" | "profile"

function BottomNavigation({ activeTab }: { activeTab: TabType }) {
  const tabs = [
    { id: "chat" as const, icon: MessageSquare, label: "智能问答", href: "/" },
    { id: "vault" as const, icon: FolderOpen, label: "我的档案库", href: "/vault" },
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
