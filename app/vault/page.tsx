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
  Files,
  Search,
  MessageCircleQuestion,
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

// 设计方案类型
type DesignVersion = "1" | "2" | "3"

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
  const [designVersion, setDesignVersion] = useState<DesignVersion>("1")
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

  // 根据设计方案选择不同的头部和空状态组件
  if (designVersion === "1") {
    return (
      <DesignVersion1
        files={files}
        isEmpty={isEmpty}
        hasReadyFiles={hasReadyFiles}
        usedStorage={usedStorage}
        totalStorage={totalStorage}
        isDragging={isDragging}
        fileInputRef={fileInputRef}
        onUploadClick={() => fileInputRef.current?.click()}
        onLoadDemo={loadDemoData}
        onDelete={handleDelete}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        handleFileSelect={handleFileSelect}
        designVersion={designVersion}
        setDesignVersion={setDesignVersion}
      />
    )
  }

  if (designVersion === "2") {
    return (
      <DesignVersion2
        files={files}
        isEmpty={isEmpty}
        hasReadyFiles={hasReadyFiles}
        usedStorage={usedStorage}
        totalStorage={totalStorage}
        isDragging={isDragging}
        fileInputRef={fileInputRef}
        onUploadClick={() => fileInputRef.current?.click()}
        onLoadDemo={loadDemoData}
        onDelete={handleDelete}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        handleFileSelect={handleFileSelect}
        designVersion={designVersion}
        setDesignVersion={setDesignVersion}
      />
    )
  }

  return (
    <DesignVersion3
      files={files}
      isEmpty={isEmpty}
      hasReadyFiles={hasReadyFiles}
      usedStorage={usedStorage}
      totalStorage={totalStorage}
      isDragging={isDragging}
      fileInputRef={fileInputRef}
      onUploadClick={() => fileInputRef.current?.click()}
      onLoadDemo={loadDemoData}
      onDelete={handleDelete}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      handleFileSelect={handleFileSelect}
      designVersion={designVersion}
      setDesignVersion={setDesignVersion}
    />
  )
}

// 通用Props类型
interface DesignProps {
  files: VaultFile[]
  isEmpty: boolean
  hasReadyFiles: boolean
  usedStorage: number
  totalStorage: number
  isDragging: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onUploadClick: () => void
  onLoadDemo: () => void
  onDelete: (id: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  designVersion: DesignVersion
  setDesignVersion: (v: DesignVersion) => void
}

// 方案切换器组件（开发用，正式版删除）
function DesignSwitcher({
  current,
  onChange,
}: {
  current: DesignVersion
  onChange: (v: DesignVersion) => void
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-lg bg-white/90 p-1 shadow-lg backdrop-blur-sm">
      {(["1", "2", "3"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "h-7 w-7 rounded-md text-xs font-medium transition-all",
            current === v
              ? "bg-[#1e40af] text-white"
              : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

// ============================================
// 方案一：极简白底科技风
// ============================================
function DesignVersion1(props: DesignProps) {
  const {
    files,
    isEmpty,
    hasReadyFiles,
    usedStorage,
    totalStorage,
    isDragging,
    fileInputRef,
    onUploadClick,
    onLoadDemo,
    onDelete,
    onDragOver,
    onDragLeave,
    onDrop,
    handleFileSelect,
    designVersion,
    setDesignVersion,
  } = props

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 方案切换器 */}
      <DesignSwitcher current={designVersion} onChange={setDesignVersion} />

      {/* 简洁白色头部 */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">我的档案库</h1>
            <p className="text-[10px] text-gray-400">VeriVault · 文件与知识管理</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* 存储空间 - 轻量条形 */}
      <div className="border-b border-gray-50 bg-gray-50/50 px-5 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">存储空间</span>
          <span className="text-gray-600">
            {usedStorage.toFixed(1)}G / {totalStorage}G
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#1e40af] transition-all"
            style={{ width: `${Math.min((usedStorage / totalStorage) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto px-5 py-6 pb-24">
        {isEmpty ? (
          <EmptyStateV1
            isDragging={isDragging}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onUploadClick={onUploadClick}
            onLoadDemo={onLoadDemo}
          />
        ) : (
          <FileListView files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
        )}
      </main>

      {/* 悬浮上传按钮 */}
      {!isEmpty && (
        <button
          onClick={onUploadClick}
          className="fixed right-5 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e40af] shadow-lg shadow-[#1e40af]/25 transition-all hover:bg-[#1e3a8a] active:scale-95"
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
    </div>
  )
}

// 方案一的空状态
function EmptyStateV1({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
  onLoadDemo,
}: {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onUploadClick: () => void
  onLoadDemo: () => void
}) {
  const capabilities = [
    { icon: Files, text: "统一管理文件" },
    { icon: Search, text: "快速提取关键信息" },
    { icon: MessageCircleQuestion, text: "支持边看边问" },
  ]

  return (
    <div
      className={cn("transition-all", isDragging && "opacity-80")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 主标题区域 */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e40af]/5">
          <FolderOpen className="h-8 w-8 text-[#1e40af]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          构建你的专属知识库
        </h2>
        <p className="text-sm leading-relaxed text-gray-500">
          上传法规、标准或注册资料
          <br />
          AI 帮你快速检索、解析与问答
        </p>
      </div>

      {/* 能力点 - 横向排列 */}
      <div className="mb-8 flex justify-center gap-6">
        {capabilities.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
              <item.icon className="h-5 w-5 text-[#1e40af]" />
            </div>
            <span className="text-xs text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>

      {/* 上传区域 */}
      <div
        onClick={onUploadClick}
        className={cn(
          "mb-4 cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-all hover:border-[#1e40af]/30 hover:bg-[#1e40af]/5",
          isDragging && "border-[#1e40af] bg-[#1e40af]/10"
        )}
      >
        <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="mb-1 text-sm font-medium text-gray-700">
          点击或拖拽上传文件
        </p>
        <p className="text-xs text-gray-400">
          支持 Word、PDF，单文件最大 20MB
        </p>
      </div>

      {/* 查看示例 */}
      <button
        onClick={onLoadDemo}
        className="w-full py-3 text-sm text-gray-500 transition-colors hover:text-[#1e40af]"
      >
        查看示例
      </button>
    </div>
  )
}

// ============================================
// 方案二：轻渐变医疗科技风
// ============================================
function DesignVersion2(props: DesignProps) {
  const {
    files,
    isEmpty,
    hasReadyFiles,
    usedStorage,
    totalStorage,
    isDragging,
    fileInputRef,
    onUploadClick,
    onLoadDemo,
    onDelete,
    onDragOver,
    onDragLeave,
    onDrop,
    handleFileSelect,
    designVersion,
    setDesignVersion,
  } = props

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 方案切换器 */}
      <DesignSwitcher current={designVersion} onChange={setDesignVersion} />

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
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {isEmpty ? (
          <EmptyStateV2
            isDragging={isDragging}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onUploadClick={onUploadClick}
            onLoadDemo={onLoadDemo}
          />
        ) : (
          <FileListView files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
        )}
      </main>

      {/* 悬浮上传按钮 */}
      {!isEmpty && (
        <button
          onClick={onUploadClick}
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
    </div>
  )
}

// 方案二的空状态
function EmptyStateV2({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
  onLoadDemo,
}: {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onUploadClick: () => void
  onLoadDemo: () => void
}) {
  const capabilities = [
    { icon: Files, text: "统一管理文件" },
    { icon: Search, text: "快速提取关键信息" },
    { icon: MessageCircleQuestion, text: "支持边看边问" },
  ]

  return (
    <div
      className={cn("transition-all", isDragging && "opacity-80")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 主卡片 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* 标题区域 */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af]/10 to-[#3b82f6]/10">
            <FolderOpen className="h-7 w-7 text-[#1e40af]" />
          </div>
          <h2 className="mb-1.5 text-lg font-semibold text-gray-900">
            构建你的专属知识库
          </h2>
          <p className="text-sm text-gray-500">
            上传法规、标准或注册资料，AI 帮你快速检索与问答
          </p>
        </div>

        {/* 能力点 - 列表 */}
        <div className="mb-6 space-y-2.5">
          {capabilities.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-[#f8fafc] px-4 py-3"
            >
              <item.icon className="h-4 w-4 text-[#1e40af]" />
              <span className="text-sm text-gray-700">{item.text}</span>
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

        {/* 查看示例 */}
        <button
          onClick={onLoadDemo}
          className="mt-3 w-full py-2.5 text-sm text-gray-500 transition-colors hover:text-[#1e40af]"
        >
          查看示例
        </button>
      </div>

      {/* 底部说明 */}
      <p className="mt-4 text-center text-xs text-gray-400">
        支持 Word、PDF，单文件最大 20MB
      </p>
    </div>
  )
}

// ============================================
// 方案三：卡片式专业工作台风
// ============================================
function DesignVersion3(props: DesignProps) {
  const {
    files,
    isEmpty,
    hasReadyFiles,
    usedStorage,
    totalStorage,
    isDragging,
    fileInputRef,
    onUploadClick,
    onLoadDemo,
    onDelete,
    onDragOver,
    onDragLeave,
    onDrop,
    handleFileSelect,
    designVersion,
    setDesignVersion,
  } = props

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa]">
      {/* 方案切换器 */}
      <DesignSwitcher current={designVersion} onChange={setDesignVersion} />

      {/* 简洁头部 */}
      <header className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">我的档案库</h1>
          </div>
          <div className="w-9" />
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          VeriVault · 文件与知识管理
        </p>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* 存储空间卡片 */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e40af]/5">
              <FolderOpen className="h-5 w-5 text-[#1e40af]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">存储空间</span>
                <span className="text-gray-500">
                  {usedStorage.toFixed(1)}G / {totalStorage}G
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#1e40af] transition-all"
                  style={{ width: `${Math.min((usedStorage / totalStorage) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <EmptyStateV3
            isDragging={isDragging}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onUploadClick={onUploadClick}
            onLoadDemo={onLoadDemo}
          />
        ) : (
          <FileListView files={files} onDelete={onDelete} hasReadyFiles={hasReadyFiles} />
        )}
      </main>

      {/* 悬浮上传按钮 */}
      {!isEmpty && (
        <button
          onClick={onUploadClick}
          className="fixed right-4 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e40af] shadow-lg transition-all active:scale-95"
        >
          <Plus className="h-5 w-5 text-white" />
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
    </div>
  )
}

// 方案三的空状态
function EmptyStateV3({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
  onLoadDemo,
}: {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onUploadClick: () => void
  onLoadDemo: () => void
}) {
  const capabilities = [
    { icon: Files, label: "统一管理", desc: "文件集中存储" },
    { icon: Search, label: "智能检索", desc: "快速定位信息" },
    { icon: MessageCircleQuestion, label: "问答交互", desc: "边看边问" },
  ]

  return (
    <div
      className={cn("space-y-4 transition-all", isDragging && "opacity-80")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 主操作卡片 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">
          构建你的专属知识库
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          上传法规、标准或注册资料，AI 帮你快速检索与问答
        </p>

        {/* 上传区域 */}
        <div
          onClick={onUploadClick}
          className={cn(
            "mb-4 cursor-pointer rounded-xl border border-dashed border-gray-200 bg-[#f8fafc] p-6 text-center transition-all hover:border-[#1e40af]/40 hover:bg-[#1e40af]/5",
            isDragging && "border-[#1e40af] bg-[#1e40af]/10"
          )}
        >
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e40af]/10">
            <Upload className="h-6 w-6 text-[#1e40af]" />
          </div>
          <p className="mb-0.5 text-sm font-medium text-gray-700">
            点击或拖拽上传
          </p>
          <p className="text-xs text-gray-400">
            Word、PDF，最大 20MB
          </p>
        </div>

        {/* 查看示例 */}
        <button
          onClick={onLoadDemo}
          className="w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          查看示例
        </button>
      </div>

      {/* 能力说明卡片 */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-medium text-gray-400">核心能力</h3>
        <div className="grid grid-cols-3 gap-3">
          {capabilities.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8fafc]">
                <item.icon className="h-5 w-5 text-[#1e40af]" />
              </div>
              <p className="text-xs font-medium text-gray-700">{item.label}</p>
              <p className="text-[10px] text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 通用组件
// ============================================

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
          className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e40af]/10">
              <MessageSquare className="h-5 w-5 text-[#1e40af]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                向你的专属库提问
              </p>
              <p className="text-xs text-gray-500">
                {files.filter((f) => f.status === "ready").length} 个文件已就绪
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-[#1e40af] px-3 py-1.5 text-xs font-medium text-white">
            开始提问
          </div>
        </Link>
      )}

      {/* 文件列表标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">已上传文件</h3>
        <span className="text-xs text-gray-400">{files.length} 个文件</span>
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
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <FileText className="h-5 w-5 text-[#1e40af]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 truncate text-sm font-medium text-gray-900">
              {file.name}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{file.size}</span>
              <span>{file.uploadTime}</span>
            </div>
          </div>
        </div>
        <div className="ml-2 flex items-center gap-2">
          <div className={cn("flex shrink-0 items-center gap-1", statusInfo.color)}>
            {statusInfo.icon}
            <span className="text-xs">{statusInfo.text}</span>
          </div>
          {file.status === "ready" && (
            <button
              onClick={() => onDelete(file.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
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
            <div className="h-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  file.status === "uploading"
                    ? "bg-amber-400"
                    : "bg-blue-400"
                )}
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        )}
    </div>
  )
}

// 文件大小格式化
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
