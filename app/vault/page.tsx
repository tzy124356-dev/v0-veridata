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
  HelpCircle,
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
      // 模拟文件上传
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

      // 模拟上传进度
      newFiles.forEach((file) => {
        simulateUpload(file.id)
      })
    }
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        // 切换到处理状态
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "processing", progress: 0 } : f
          )
        )
        // 模拟处理
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
      // 处理拖放的文件
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

  // 加载演示数据
  const loadDemoData = () => {
    setFiles(mockFiles)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航 */}
      <header className="glass fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border/50 px-4 py-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div className="text-center">
          <h1 className="text-base font-medium text-foreground">我的档案库</h1>
          <p className="text-xs text-muted-foreground">VeriVault</p>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-24">
        {/* 存储空间指示 */}
        <StorageIndicator used={usedStorage} total={totalStorage} />

        {isEmpty ? (
          <EmptyState
            onUploadClick={() => fileInputRef.current?.click()}
            onLoadDemo={loadDemoData}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ) : (
          <FileListView
            files={files}
            onDelete={handleDelete}
            hasReadyFiles={hasReadyFiles}
          />
        )}
      </main>

      {/* 上传按钮 */}
      {!isEmpty && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="gradient-accent fixed right-4 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:opacity-90 active:scale-95"
        >
          <Upload className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".doc,.docx,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

// 存储空间指示器
function StorageIndicator({ used, total }: { used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100)

  return (
    <div className="glass mb-6 rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">存储空间</span>
        <span className="text-foreground">
          已用 {used.toFixed(1)}G / 共 {total}G
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percentage > 80 ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// 空状态
function EmptyState({
  onUploadClick,
  onLoadDemo,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  onUploadClick: () => void
  onLoadDemo: () => void
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
}) {
  const painPoints = [
    { icon: "01", text: "文件散落各处，需要时找不到" },
    { icon: "02", text: "指导原则太长，关键信息难定位" },
    { icon: "03", text: "下载了没时间看，内容不了解" },
    { icon: "04", text: "多年积累的经验，从未真正用起来" },
  ]

  return (
    <div
      className={cn(
        "mt-4 transition-all",
        isDragging && "opacity-80"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 主卡片 */}
      <div className={cn(
        "glass rounded-2xl p-6 transition-all",
        isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}>
        {/* 图标和标题 */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <FolderOpen className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mb-1 text-lg font-semibold text-foreground">
            构建你的专属知识库
          </h2>
          <p className="text-sm text-muted-foreground">
            上传文件，AI 帮你读透每一页
          </p>
        </div>

        {/* 痛点列表 - 2x2网格 */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {painPoints.map((point) => (
            <div
              key={point.icon}
              className="rounded-xl bg-secondary/50 p-3"
            >
              <span className="mb-1 block text-xs font-medium text-primary">
                {point.icon}
              </span>
              <p className="text-xs leading-relaxed text-secondary-foreground">
                {point.text}
              </p>
            </div>
          ))}
        </div>

        {/* 价值主张 */}
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-center text-sm leading-relaxed text-foreground">
            <span className="font-semibold text-primary">VeriVault</span>
            {" "}让你上传一次，随时调用
            <br />
            <span className="text-muted-foreground">关键信息一问即得</span>
          </p>
        </div>

        {/* 按钮组 */}
        <div className="space-y-3">
          <button
            onClick={onUploadClick}
            className="gradient-accent flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Upload className="h-4 w-4" />
            上传文件
          </button>
          
          <button
            onClick={onLoadDemo}
            className="w-full rounded-xl border border-border bg-background py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground active:scale-[0.98]"
          >
            查看演示
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        支持 Word、PDF 格式，单个文件最大 20MB
      </p>
    </div>
  )
}

// 文件列表视图
function FileListView({
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
      {/* 开始问答按钮 */}
      {hasReadyFiles && (
        <Link
          href="/vault/chat"
          className="glass flex items-center justify-between rounded-xl p-4 transition-all hover:bg-secondary/50 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                文件已就绪，开始向你的专属库提问
              </p>
              <p className="text-xs text-muted-foreground">
                仅检索已上传的文件
              </p>
            </div>
          </div>
          <div className="gradient-accent flex h-8 items-center rounded-lg px-3 text-xs font-medium text-primary-foreground">
            开始提问
          </div>
        </Link>
      )}

      {/* 文件列表 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          已上传文件 ({files.length})
        </h3>
        {files.map((file) => (
          <FileItem key={file.id} file={file} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

// 单个文件项
function FileItem({
  file,
  onDelete,
}: {
  file: VaultFile
  onDelete: (id: string) => void
}) {
  const getStatusInfo = (status: FileStatus) => {
    switch (status) {
      case "uploading":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
          text: "上传中",
          color: "text-yellow-500",
        }
      case "processing":
        return {
          icon: <Clock className="h-4 w-4 text-blue-400" />,
          text: "处理中",
          color: "text-blue-400",
        }
      case "ready":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
          text: "已就绪",
          color: "text-green-400",
        }
    }
  }

  const statusInfo = getStatusInfo(file.status)

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="mb-1 line-clamp-1 text-sm font-medium text-foreground">
              {file.name}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{file.size}</span>
              <span>{file.uploadTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1", statusInfo.color)}>
            {statusInfo.icon}
            <span className="text-xs">{statusInfo.text}</span>
          </div>
          {file.status === "ready" && (
            <button
              onClick={() => onDelete(file.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 进度条 */}
      {(file.status === "uploading" || file.status === "processing") &&
        file.progress !== undefined && (
          <div className="mt-3">
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  file.status === "uploading" ? "bg-yellow-500" : "bg-blue-400"
                )}
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        )}
    </div>
  )
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB"
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB"
}
