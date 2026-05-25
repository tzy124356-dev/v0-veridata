"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Bell,
  Gift,
  BookOpen,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/use-auth-guard"

// 通知类型
type NotificationType = "all" | "feedback" | "points" | "update"

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    type: "feedback" as const,
    title: "你的反馈已被采纳",
    content: "你的反馈已被械研采纳，相关内容将纳入知识库优化，积分已到账，请查收。",
    time: "今天 10:30",
    isRead: false,
  },
  {
    id: 2,
    type: "points" as const,
    title: "积分到账通知",
    content: "恭喜你获得了 50 枚械研积分，可前往小程序积分中心查看和使用。",
    time: "昨天 16:00",
    isRead: false,
  },
  {
    id: 3,
    type: "update" as const,
    title: "知识库更新完成",
    content: "械研知识库更新完成，新增《医疗器械临床评价技术指导原则（2024修订版）》等 12 份文件已收录完毕。",
    time: "3天前",
    isRead: true,
  },
  {
    id: 4,
    type: "update" as const,
    title: "知识库更新完成",
    content: "械研知识库更新完成，新增医美针剂相关审评要点已收录完毕。",
    time: "1周前",
    isRead: true,
  },
]

const tabs = [
  { id: "all" as const, label: "全部" },
  { id: "feedback" as const, label: "反馈采纳" },
  { id: "points" as const, label: "积分" },
  { id: "update" as const, label: "知识库更新" },
]

export default function NotificationsPage() {
  const { isChecking } = useAuthGuard()
  const [activeTab, setActiveTab] = useState<NotificationType>("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isEmpty = filteredNotifications.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航 */}
      <header className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-3">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">通知中心</h1>
          {unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary/50"
            >
              <CheckCheck className="h-5 w-5 text-muted-foreground" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-1 px-5 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 py-4">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <NotificationList
            notifications={filteredNotifications}
            onMarkRead={handleMarkRead}
          />
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
        <Bell className="h-8 w-8 text-primary" />
      </div>
      <p className="mb-2 text-foreground">暂无通知</p>
      <p className="text-sm text-muted-foreground">有新消息时会在这里通知你</p>
    </div>
  )
}

// 通知列表
function NotificationList({
  notifications,
  onMarkRead,
}: {
  notifications: typeof mockNotifications
  onMarkRead: (id: number) => void
}) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  )
}

// 通知项
function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: (typeof mockNotifications)[0]
  onMarkRead: (id: number) => void
}) {
  const router = useRouter()

  const handleClick = () => {
    onMarkRead(notification.id)
    // 积分类型跳转到积分中心
    if (notification.type === "points") {
      router.push("/points")
    }
    // feedback 和 update 类型仅标记已读，不跳转
  }

  const getIcon = () => {
    switch (notification.type) {
      case "feedback":
        return <Check className="h-5 w-5" />
      case "points":
        return <Gift className="h-5 w-5" />
      case "update":
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getIconBgColor = () => {
    switch (notification.type) {
      case "feedback":
        return "bg-green-500/10 text-green-500"
      case "points":
        return "bg-amber-500/10 text-amber-500"
      case "update":
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "glass w-full rounded-xl p-4 text-left transition-all hover:bg-secondary/30 active:scale-[0.99]",
        !notification.isRead && "ring-1 ring-primary/30"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
            getIconBgColor()
          )}
        >
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <p className="mb-2 text-sm leading-relaxed text-secondary-foreground line-clamp-2">
            {notification.content}
          </p>
          <p className="text-xs text-muted-foreground">{notification.time}</p>
        </div>
      </div>
    </button>
  )
}
