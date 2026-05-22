"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { 
  WifiOff, 
  AlertCircle, 
  RefreshCw, 
  FileQuestion,
  ServerCrash,
  X,
  Loader2
} from "lucide-react"

// 错误类型
type ErrorType = "network" | "loadFailed" | "empty" | "serverError" | null

interface ErrorState {
  type: ErrorType
  title?: string
  message?: string
  retryAction?: () => void
}

interface ErrorContextType {
  showError: (error: ErrorState) => void
  hideError: () => void
  currentError: ErrorState | null
}

const ErrorContext = createContext<ErrorContextType | null>(null)

// Provider 组件
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [currentError, setCurrentError] = useState<ErrorState | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showError = (error: ErrorState) => {
    setCurrentError(error)
    setIsVisible(true)
  }

  const hideError = () => {
    setIsVisible(false)
    setTimeout(() => setCurrentError(null), 300)
  }

  return (
    <ErrorContext.Provider value={{ showError, hideError, currentError }}>
      {children}
      {currentError && (
        <ErrorModal 
          error={currentError} 
          isVisible={isVisible}
          onClose={hideError} 
        />
      )}
    </ErrorContext.Provider>
  )
}

// Hook
export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error("useError must be used within ErrorProvider")
  }
  return context
}

// 错误配置
const errorConfig = {
  network: {
    icon: WifiOff,
    title: "网络连接失败",
    message: "请检查您的网络连接后重试",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  loadFailed: {
    icon: AlertCircle,
    title: "加载失败",
    message: "数据加载出现问题，请稍后重试",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  empty: {
    icon: FileQuestion,
    title: "暂无内容",
    message: "这里还没有任何内容",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
  },
  serverError: {
    icon: ServerCrash,
    title: "服务器错误",
    message: "服务暂时不可用，请稍后再试",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
}

// 错误弹窗组件
function ErrorModal({ 
  error, 
  isVisible,
  onClose 
}: { 
  error: ErrorState
  isVisible: boolean
  onClose: () => void 
}) {
  const [isRetrying, setIsRetrying] = useState(false)
  
  if (!error.type) return null
  
  const config = errorConfig[error.type]
  const Icon = config.icon

  const handleRetry = async () => {
    if (error.retryAction) {
      setIsRetrying(true)
      try {
        await error.retryAction()
        onClose()
      } catch {
        // 重试失败，保持弹窗
      } finally {
        setIsRetrying(false)
      }
    }
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[300] flex items-center justify-center bg-black/50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 图标 */}
        <div className="flex justify-center">
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", config.iconBg)}>
            <Icon className={cn("h-8 w-8", config.iconColor)} />
          </div>
        </div>

        {/* 标题和消息 */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {error.title || config.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {error.message || config.message}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            关闭
          </button>
          {error.retryAction && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-70"
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isRetrying ? "重试中..." : "重试"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// 内联空状态组件（用于页面内嵌入）
export function EmptyState({ 
  title = "暂无内容",
  message = "这里还没有任何内容",
  icon: CustomIcon,
  action,
  actionText = "刷新",
}: {
  title?: string
  message?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: () => void
  actionText?: string
}) {
  const Icon = CustomIcon || FileQuestion
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="mt-4 text-base font-medium text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
      {action && (
        <button
          onClick={action}
          className="mt-4 flex items-center gap-2 rounded-lg bg-[#1e40af]/10 px-4 py-2 text-sm font-medium text-[#1e40af] transition-colors hover:bg-[#1e40af]/20"
        >
          <RefreshCw className="h-4 w-4" />
          {actionText}
        </button>
      )}
    </div>
  )
}

// 内联加载失败组件
export function LoadFailedState({
  title = "加载失败",
  message = "数据加载出现问题",
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-400" />
      </div>
      <h3 className="mt-4 text-base font-medium text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" />
          重新加载
        </button>
      )}
    </div>
  )
}

// 网络断开状态组件
export function NetworkErrorState({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
        <WifiOff className="h-10 w-10 text-orange-400" />
      </div>
      <h3 className="mt-4 text-base font-medium text-gray-700">网络连接失败</h3>
      <p className="mt-1 text-sm text-gray-400">请检查您的网络连接</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100"
        >
          <RefreshCw className="h-4 w-4" />
          重新连接
        </button>
      )}
    </div>
  )
}

// Toast 提示组件
export function Toast({
  message,
  type = "info",
  isVisible,
  onClose,
}: {
  message: string
  type?: "success" | "error" | "info" | "warning"
  isVisible: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-[#1e40af]",
    warning: "bg-orange-500",
  }

  return (
    <div
      className={cn(
        "fixed left-1/2 top-20 z-[400] -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white shadow-lg transition-all duration-300",
        typeStyles[type],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      {message}
    </div>
  )
}
