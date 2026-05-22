"use client"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  FolderOpen,
  Upload,
  FileText,
  Trash2,
  MessageSquare,
  Loader2,
  CheckCircle,
  Clock,
  Plus,
  MessageCircle,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 文件状态类型
type FileStatus = "uploading" | "processing" | "ready"

// 文件类型
interface VaultFile {
  id: string
  name: string
  size: string
  uploadTime: string
  status: FileStatus
  progress?: number
}

// 模拟文件数据
const mockFiles: VaultFile[] = [
  {
    id: "1",
    name: "医疗器械注册申报资料要求.docx",
    size: "2.3 MB",
    uploadTime: "2024-01-15",
    status: "ready",
  },
  {
    id: "2",
    name: "玻尿酸产品临床评价指导原则.docx",
    size: "1.8 MB",
    uploadTime: "2024-01-14",
    status: "ready",
  },
  {
    id: "3",
    name: "发补通知回复模板.docx",
    size: "856 KB",
    uploadTime: "2024-01-14",
    status: "processing",
    progress: 65,
  },
]

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmpty = files.length === 0
  const hasReadyFiles = files.some((f) => f.status === "ready")

  // 存储使用情况
  const usedStorage = files.reduce((acc, file) => {
    const match = file.size.match(/(\d+\.?\d*)\s*(KB|MB|GB)/i)
    if (match) {
      const value = parseFloat(match[1])
      const unit = match[2].toUpperCase()
      if (unit === "KB") return acc + value / 1024 / 1024
      if (unit === "MB") return acc + value / 1024
      if (unit === "GB") return acc + value
    }
    return acc
  }, 0)
  const totalStorage = 5 // GB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const newFiles: VaultFile[] = Array.from(selectedFiles)
        .slice(0, 5)
        .map((file, index) => ({
          id: Date.now().toString() + index,
          name: file.name,
          size: formatFileSize(file.size),
          uploadTime: new Date().toISOString().split("T")[0],
          status: "uploading" as FileStatus,
          progress: 0,
        }))

      setFiles((prev) => [...prev, ...newFiles])
      newFiles.forEach((file) => simulateUpload(file.id))
    }
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "processing", progress: 0 } : f
          )
        )
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "ready", progress: undefined } : f
            )
          )
        }, 2000)
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        )
      }
    }, 500)
  }

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const newFiles: VaultFile[] = Array.from(droppedFiles)
        .slice(0, 5)
        .map((file, index) => ({
          id: Date.now().toString() + index,
          name: file.name,
          size: formatFileSize(file.size),
          uploadTime: new Date().toISOString().split("T")[0],
          status: "uploading" as FileStatus,
          progress: 0,
        }))

      setFiles((prev) => [...prev, ...newFiles])
      newFiles.forEach((file) => simulateUpload(file.id))
    }
  }

  const loadDemoData = () => {
    setFiles(mockFiles)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 浅蓝渐变头部 */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 shadow-sm transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">我的档案库</h1>
            <p className="text-[10px] text-[#1e40af]/60">VeriVault · 文件与知识管理</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* 存储空间卡片 */}
      <div className="mx-5 mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">存储空间</span>
          <span className="font-medium text-gray-700">
            {usedStorage.toFixed(1)}G / {totalStorage}G
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1e40af]/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] transition-all"
            style={{ width: `${Math.min((usedStorage / totalStorage) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto px-5 pb-20 scrollbar-hide">
        {isEmpty ? (
          <EmptyState
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onUploadClick={() => fileInputRef.current?.click()}
          />
        ) : (
          <FileListView files={files} onDelete={handleDelete} hasReadyFiles={hasReadyFiles} />
        )}
      </main>

      {/* 悬浮上传按钮 */}
      {!isEmpty && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="fixed right-5 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] shadow-lg shadow-[#1e40af]/25 transition-all active:scale-95"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".doc,.docx,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 悬浮反馈按钮 */}
      <FeedbackButton />

      {/* 底部导航 */}
      <BottomNavigation activeTab="vault" />
    </div>
  )
}

// 空状态组件 - 轻渐变医疗科技风
function EmptyState({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
}: {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onUploadClick: () => void
}) {
  return (
    <div
      className={cn("transition-all", isDragging && "opacity-80")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 主卡片 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* 标题区域 - 简洁居中式 */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af]/10 to-[#3b82f6]/10">
            <FolderOpen className="h-7 w-7 text-[#1e40af]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            专属知识库
          </h2>
        </div>

        {/* 能力点 - 列表 */}
        <div className="mb-6 space-y-2.5">
          {[
            "统一管理，告别文件散落",
            "智能解析，快速定位关键信息",
            "随时提问，知识一问即得",
          ].map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-[#f8fafc] px-4 py-3"
            >
              <CheckCircle className="h-4 w-4 text-[#1e40af]" />
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>

        {/* 上传按钮 */}
        <button
          onClick={onUploadClick}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]",
            isDragging && "ring-2 ring-[#1e40af] ring-offset-2"
          )}
        >
          <Upload className="h-4 w-4" />
          上传文件
        </button>
      </div>

      {/* 底部说明 */}
      <p className="mt-4 text-center text-xs text-gray-400">
        支持 Word、PDF，单文件最大 20MB
      </p>
    </div>
  )
}

// 文件列表视图 - 包含3个设计版本
function FileListView({
  files,
  onDelete,
  hasReadyFiles,
}: {
  files: VaultFile[]
  onDelete: (id: string) => void
  hasReadyFiles: boolean
}) {
  const [version, setVersion] = useState<"A" | "B" | "C">("A")

  return (
    <div>
      {/* 版本切换器 - 选定后删除 */}
      <div className="mb-4 flex items-center justify-center gap-2">
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

      {version === "A" && (
        <FileListVersionA files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
      )}
      {version === "B" && (
        <FileListVersionB files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
      )}
      {version === "C" && (
        <FileListVersionC files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
      )}
    </div>
  )
}

// 版本A：简约卡片式 - 更大的文件图标，清晰的状态标签，操作按钮底部排列
function FileListVersionA({
  files,
  onDelete,
  hasReadyFiles,
}: {
  files: VaultFile[]
  onDelete: (id: string) => void
  hasReadyFiles: boolean
}) {
  return (
    <div className="space-y-3">
      {/* 顶部提示 */}
      {hasReadyFiles && (
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-4 py-3"
        >
          <span className="text-sm font-medium text-white">
            文件已就绪，开始提问
          </span>
          <MessageSquare className="h-4 w-4 text-white/80" />
        </Link>
      )}

      {/* 文件数量 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">共 {files.length} 个文件</span>
      </div>

      {/* 文件列表 */}
      {files.map((file) => (
        <div key={file.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            {/* 大文件图标 */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af]/10 to-[#3b82f6]/5">
              <FileText className="h-6 w-6 text-[#1e40af]" />
            </div>

            {/* 文件信息 */}
            <div className="min-w-0 flex-1">
              <p className="mb-1 truncate text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{file.size}</span>
                <span>{file.uploadTime}</span>
                {/* 状态标签 */}
                {file.status === "ready" && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    就绪
                  </span>
                )}
                {file.status === "processing" && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-600">
                    <Clock className="h-3 w-3" />
                    解析中
                  </span>
                )}
                {file.status === "uploading" && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {Math.round(file.progress || 0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 - 底部 */}
          {file.status === "ready" && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
              <Link
                href={`/chat?file=${file.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1e40af]/5 py-2 text-xs font-medium text-[#1e40af] transition-colors hover:bg-[#1e40af]/10"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                向此文档提问
              </Link>
              <button
                onClick={() => onDelete(file.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* 上传进度 */}
          {file.status === "uploading" && (
            <div className="mt-3">
              <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#1e40af] transition-all"
                  style={{ width: `${file.progress || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// 版本B：紧凑列表式 - 无边框卡片，左侧彩色状态条，右滑操作
function FileListVersionB({
  files,
  onDelete,
  hasReadyFiles,
}: {
  files: VaultFile[]
  onDelete: (id: string) => void
  hasReadyFiles: boolean
}) {
  return (
    <div>
      {/* 顶部提示 */}
      {hasReadyFiles && (
        <div className="mb-4 rounded-lg border border-[#1e40af]/20 bg-[#1e40af]/5 px-4 py-2.5">
          <p className="text-xs text-[#1e40af]">
            <span className="font-medium">{files.filter(f => f.status === "ready").length} 个文件</span>已就绪，可前往智能问答提问
          </p>
        </div>
      )}

      {/* 文件列表 - 紧凑无边框 */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {files.map((file, index) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              index !== files.length - 1 && "border-b border-gray-50"
            )}
          >
            {/* 左侧状态条 */}
            <div
              className={cn(
                "h-10 w-1 shrink-0 rounded-full",
                file.status === "ready" && "bg-green-500",
                file.status === "processing" && "bg-amber-500",
                file.status === "uploading" && "bg-blue-500"
              )}
            />

            {/* 文件图标 */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <FileText className="h-4 w-4 text-gray-500" />
            </div>

            {/* 文件信息 */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{file.size}</span>
                <span>·</span>
                <span>{file.uploadTime}</span>
                {file.status === "uploading" && (
                  <span className="text-blue-500">{Math.round(file.progress || 0)}%</span>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1">
              {file.status === "ready" && (
                <Link
                  href={`/chat?file=${file.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1e40af] transition-colors hover:bg-[#1e40af]/5"
                >
                  <MessageSquare className="h-4 w-4" />
                </Link>
              )}
              <button
                onClick={() => onDelete(file.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 底部统计 */}
      <p className="mt-3 text-center text-xs text-gray-400">
        共 {files.length} 个文件
      </p>
    </div>
  )
}

// 版本C：信息丰富式 - 显示更多文件信息，带预览缩略图占位
function FileListVersionC({
  files,
  onDelete,
  hasReadyFiles,
}: {
  files: VaultFile[]
  onDelete: (id: string) => void
  hasReadyFiles: boolean
}) {
  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          文件列表 ({files.length})
        </span>
        {hasReadyFiles && (
          <Link
            href="/"
            className="text-xs font-medium text-[#1e40af]"
          >
            去提问 →
          </Link>
        )}
      </div>

      {/* 文件列表 */}
      {files.map((file) => (
        <div key={file.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {/* 文件头部 - 带背景色 */}
          <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                file.status === "ready" && "bg-green-100",
                file.status === "processing" && "bg-amber-100",
                file.status === "uploading" && "bg-blue-100"
              )}
            >
              <FileText
                className={cn(
                  "h-5 w-5",
                  file.status === "ready" && "text-green-600",
                  file.status === "processing" && "text-amber-600",
                  file.status === "uploading" && "text-blue-600"
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {file.name}
              </p>
            </div>
            {/* 状态徽章 */}
            <div
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                file.status === "ready" && "bg-green-500 text-white",
                file.status === "processing" && "bg-amber-500 text-white",
                file.status === "uploading" && "bg-blue-500 text-white"
              )}
            >
              {file.status === "ready" && "已就绪"}
              {file.status === "processing" && "解析中"}
              {file.status === "uploading" && `${Math.round(file.progress || 0)}%`}
            </div>
          </div>

          {/* 文件详情 */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-gray-400">大小</span>
                <p className="font-medium text-gray-700">{file.size}</p>
              </div>
              <div>
                <span className="text-gray-400">上传时间</span>
                <p className="font-medium text-gray-700">{file.uploadTime}</p>
              </div>
            </div>

            {/* 上传进度 */}
            {file.status === "uploading" && (
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${file.progress || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 操作栏 */}
          <div className="flex border-t border-gray-100">
            {file.status === "ready" && (
              <Link
                href={`/chat?file=${file.id}`}
                className="flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium text-[#1e40af] transition-colors hover:bg-[#1e40af]/5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                提问
              </Link>
            )}
            {file.status !== "ready" && <div className="flex-1" />}
            <button
              onClick={() => onDelete(file.id)}
              className="flex items-center justify-center gap-2 border-l border-gray-100 px-4 py-2.5 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
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

// 底部导航 - 与首���完全一致
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
