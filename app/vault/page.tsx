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
    <div className="flex min-h-screen flex-col bg-background">
      {/* 深蓝渐变头部 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-6">
        <header className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">我的档案库</h1>
            <p className="text-xs text-white/70">VeriVault</p>
          </div>
          <div className="w-9" />
        </header>

        {/* 存储空间指示 */}
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/70">存储空间</span>
            <span className="text-white">
              已用 {usedStorage.toFixed(1)}G / 共 {totalStorage}G
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                (usedStorage / totalStorage) * 100 > 80
                  ? "bg-red-400"
                  : "bg-white"
              )}
              style={{ width: `${Math.min((usedStorage / totalStorage) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 白色内容区域 */}
      <main className="flex-1 overflow-y-auto bg-background px-5 py-6 pb-24">
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
          className="fixed right-5 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] shadow-lg transition-all hover:opacity-90 active:scale-95"
        >
          <Plus className="h-6 w-6 text-white" />
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

// 空状态 - 包含3个设计方案供选择
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
  const [designVersion, setDesignVersion] = useState<"A" | "B" | "C">("A")

  return (
    <div
      className={cn("transition-all", isDragging && "opacity-80")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 设计方案切换器 - 开发时使用，正式版删除 */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">方案：</span>
        {(["A", "B", "C"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setDesignVersion(v)}
            className={cn(
              "h-8 w-8 rounded-lg text-xs font-medium transition-all",
              designVersion === v
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {designVersion === "A" && (
        <EmptyStateVersionA
          onUploadClick={onUploadClick}
          onLoadDemo={onLoadDemo}
          isDragging={isDragging}
        />
      )}
      {designVersion === "B" && (
        <EmptyStateVersionB
          onUploadClick={onUploadClick}
          onLoadDemo={onLoadDemo}
          isDragging={isDragging}
        />
      )}
      {designVersion === "C" && (
        <EmptyStateVersionC
          onUploadClick={onUploadClick}
          onLoadDemo={onLoadDemo}
          isDragging={isDragging}
        />
      )}
    </div>
  )
}

// 方案A：极简列表式 - 用简洁的列表展示功能点
function EmptyStateVersionA({
  onUploadClick,
  onLoadDemo,
  isDragging,
}: {
  onUploadClick: () => void
  onLoadDemo: () => void
  isDragging: boolean
}) {
  const features = [
    "统一管理，告别文件散落",
    "智能解析，快速定位关键信息",
    "随时提问，知识一问即得",
  ]

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-all",
        isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* 图标和标题 */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#2563eb]">
          <FolderOpen className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          构建你的专属知识库
        </h2>
        <p className="text-sm text-muted-foreground">
          上传文件，AI 帮你读透每一页
        </p>
      </div>

      {/* 功能列表 - 简洁列表 */}
      <div className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e40af]/10">
              <CheckCircle className="h-4 w-4 text-[#1e40af]" />
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {/* 按钮组 */}
      <div className="space-y-3">
        <button
          onClick={onUploadClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] py-3.5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
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

      {/* 底部提示 */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        支持 Word、PDF 格式，单个文件最大 20MB
      </p>
    </div>
  )
}

// 方案B：流程步骤式 - 展示上传到使用的流程
function EmptyStateVersionB({
  onUploadClick,
  onLoadDemo,
  isDragging,
}: {
  onUploadClick: () => void
  onLoadDemo: () => void
  isDragging: boolean
}) {
  const steps = [
    { step: "1", title: "上传", desc: "上传你的文档资料" },
    { step: "2", title: "解析", desc: "AI 智能解析内容" },
    { step: "3", title: "提问", desc: "随时向文档提问" },
  ]

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-all",
        isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* 图标和标题 */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#2563eb]">
          <FolderOpen className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          构建你的专属知识库
        </h2>
        <p className="text-sm text-muted-foreground">
          三步开启智能文档问答
        </p>
      </div>

      {/* 步骤流程 - 横向 */}
      <div className="mb-6 flex items-start justify-between px-2">
        {steps.map((item, index) => (
          <div key={item.step} className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-lg font-bold text-white">
                {item.step}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-full h-0.5 w-8 -translate-y-1/2 bg-gradient-to-r from-[#1e40af]/50 to-[#2563eb]/20" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium text-foreground">{item.title}</span>
            <span className="mt-0.5 text-center text-xs text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* 价值主张 */}
      <div className="mb-6 rounded-xl bg-secondary/50 p-4 text-center">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-[#1e40af]">VeriVault</span>
          {" "}让你上传一次，随时调用
        </p>
        <p className="mt-1 text-xs text-muted-foreground">关键信息一问即得</p>
      </div>

      {/* 按钮组 */}
      <div className="space-y-3">
        <button
          onClick={onUploadClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] py-3.5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Upload className="h-4 w-4" />
          开始上传
        </button>

        <button
          onClick={onLoadDemo}
          className="w-full rounded-xl border border-border bg-background py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground active:scale-[0.98]"
        >
          查看演示
        </button>
      </div>

      {/* 底部提示 */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        支持 Word、PDF 格式，单个文件最大 20MB
      </p>
    </div>
  )
}

// 方案C：极简纯净式 - 去除痛点，只保留核心
function EmptyStateVersionC({
  onUploadClick,
  onLoadDemo,
  isDragging,
}: {
  onUploadClick: () => void
  onLoadDemo: () => void
  isDragging: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-8 transition-all",
        isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* 大图标 */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1e40af]/10 to-[#2563eb]/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#2563eb]">
            <FolderOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          VeriVault
        </h2>
        <p className="mb-1 text-base text-foreground">
          你的专属知识库
        </p>
        <p className="text-sm text-muted-foreground">
          上传文件，AI 帮你读透每一页，随时提问
        </p>
      </div>

      {/* 虚线上传区域 */}
      <div
        onClick={onUploadClick}
        className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-[#1e40af]/30 bg-[#1e40af]/5 p-6 text-center transition-all hover:border-[#1e40af]/50 hover:bg-[#1e40af]/10"
      >
        <Upload className="mx-auto mb-2 h-8 w-8 text-[#1e40af]" />
        <p className="text-sm font-medium text-[#1e40af]">点击或拖拽上传文件</p>
        <p className="mt-1 text-xs text-muted-foreground">
          支持 Word、PDF 格式，最大 20MB
        </p>
      </div>

      {/* 查看演示 */}
      <button
        onClick={onLoadDemo}
        className="w-full rounded-xl border border-border bg-background py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground active:scale-[0.98]"
      >
        查看演示
      </button>
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
      {/* 开始问答入口 */}
      {hasReadyFiles && (
        <Link
          href="/vault/chat"
          className="flex items-center justify-between rounded-xl border border-[#1e40af]/20 bg-gradient-to-r from-[#1e40af]/5 to-[#2563eb]/5 p-4 transition-all hover:from-[#1e40af]/10 hover:to-[#2563eb]/10 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#2563eb]">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                向你的专属库提问
              </p>
              <p className="text-xs text-muted-foreground">
                {files.filter((f) => f.status === "ready").length} 个文件已就绪
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-3 py-1.5 text-xs font-medium text-white">
            开始提问
          </div>
        </Link>
      )}

      {/* 文件列表标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          已上传文件
        </h3>
        <span className="text-xs text-muted-foreground">{files.length} 个文件</span>
      </div>

      {/* 文件列表 */}
      <div className="space-y-3">
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
          icon: <Loader2 className="h-4 w-4 animate-spin text-amber-500" />,
          text: "上传中",
          color: "text-amber-500",
        }
      case "processing":
        return {
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          text: "处理中",
          color: "text-blue-500",
        }
      case "ready":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: "已就绪",
          color: "text-green-500",
        }
    }
  }

  const statusInfo = getStatusInfo(file.status)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="h-5 w-5 text-[#1e40af]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="mb-1 truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{file.size}</span>
              <span>{file.uploadTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className={cn("flex items-center gap-1 shrink-0", statusInfo.color)}>
            {statusInfo.icon}
            <span className="text-xs">{statusInfo.text}</span>
          </div>
          {file.status === "ready" && (
            <button
              onClick={() => onDelete(file.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
                  file.status === "uploading" ? "bg-amber-500" : "bg-blue-500"
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
