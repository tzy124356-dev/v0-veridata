"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Clock,
  Send,
  Copy,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Loader2,
  X,
  Sparkles,
  Lightbulb,
  FolderOpen,
  Share2,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShareCardModal } from "@/components/share-card-modal"
import { useError } from "@/components/error-states"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { 
  isFavorited, 
  addFavorite, 
  removeFavoriteByMessageId, 
  addHistory, 
  addFeedback,
  getHistoryById,
  getFavoriteById,
  getPoints,
  getTotalPoints,
  deductOnePoint,
  type PointsData,
} from "@/lib/storage"

// 场景标签数据
const scenarioTags = [
  { id: 1, label: "注册申报准备中", hint: "要申报了，不知道从哪里开始" },
  { id: 2, label: "收到发补通知", hint: "收到发补通知了，怎么办" },
  { id: 3, label: "产品分类界定困惑", hint: "产品分类搞不清楚，帮我判断一下" },
  { id: 4, label: "技术指导原则查询", hint: "找不到对应的技术指导原则" },
]

// 推荐问题
const suggestedQuestions = [
  "注册申报流程是怎样的？",
  "需要准备哪些检测报告？",
  "临床试验周期一般多久？",
]

// 模拟消息类型
interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  conclusion?: string
  legalBasis?: Array<{
    title: string
    clause: string
    content: string
    url?: string
  }>
  reasoning?: string
  timestamp: Date
}

// 模拟AI回答数据
const mockAIResponse: Omit<Message, "id" | "timestamp"> = {
  type: "assistant",
  content: "",
  conclusion:
    "医美注射类产品（如玻尿酸填充剂）在中国按第三类医疗器械管理，需要向国家药品监督管理局（NMPA）申请注册。",
  legalBasis: [
    {
      title: "《医疗器械监督管理条例》",
      clause: "第十三条",
      content:
        "第三类医疗器械实行产品注册管理。境内第三类医疗器械由国务院药品监督管理部门审查批准，并发给医疗器械注册证。",
      url: "https://www.nmpa.gov.cn",
    },
    {
      title: "《医疗器械注册与备案管理办法》",
      clause: "第四条",
      content:
        "医疗器械注册是指医疗器械注册申请人依照法定程序和要求提出医疗器械注册申请，药品监督管理部门依据法律法规，对其安全性、有效性研究及其结果进行系统评价。",
      url: "https://www.nmpa.gov.cn",
    },
    {
      title: "《医疗器械分类目录》",
      clause: "整形及普通外科植入物-13",
      content:
        "注射用交联透明质酸钠凝胶属于13-09-02类别，管理类别为III类。",
      url: "https://www.nmpa.gov.cn",
    },
  ],
  reasoning:
    "根据《医疗器械监督管理条例》的规定，医疗器械按照风险程度分为三类管理。玻尿酸注射填充剂作为植入人体的产品，具有较高风险，因此被归类为第三类医疗器械。\n\n申请注册需要准备：\n1. 产品技术要求及检验报告\n2. 临床评价资料（通常需要临床试验）\n3. 产品说明书和标签样稿\n4. 质量管理体系文件\n5. 生产许可证或备案凭证\n\n整个注册周期通常需要2-3年，其中临床试验是最耗时的环节。建议提前规划，确保各项资料的完整性和规范性。",
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageLoading />}>
      <ChatPageContent />
    </Suspense>
  )
}

function ChatPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function ChatPageContent() {
  const { isChecking } = useAuthGuard()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [knowledgeSource, setKnowledgeSource] = useState<"official" | "myVault">("official")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  // 积分相关状态
  const [currentPoints, setCurrentPoints] = useState<PointsData>({ free: 0, gift: 0, member: 0 })
  const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false)
  const [showLowPointsHint, setShowLowPointsHint] = useState(false)
  const [lastDeductResult, setLastDeductResult] = useState<{ remaining: number } | null>(null)

  // 用户消息气泡颜色
  const bubbleColor = "bg-[#4284ff]"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 处理URL中的预设问题、知识库来源、历史记录和收藏
  useEffect(() => {
    if (hasInitialized || isChecking) return
    const presetQuestion = searchParams.get("q")
    const source = searchParams.get("source")
    const historyId = searchParams.get("history")
    const favoriteId = searchParams.get("favorite")
    
    if (presetQuestion) {
      setInputValue(presetQuestion)
      inputRef.current?.focus()
    }
    if (source === "myVault") {
      setKnowledgeSource("myVault")
    }
    // 加载历史对话时不弹窗
    if (historyId) {
      const historyItem = getHistoryById(historyId)
      if (historyItem?.messages) {
        setMessages(historyItem.messages as Message[])
        setHasInitialized(true)
        return
      }
    }
    // 加载收藏对话时不弹窗
    if (favoriteId) {
      const favoriteItem = getFavoriteById(favoriteId)
      if (favoriteItem) {
        // 从收藏重建消息列表
        const msgs: Message[] = [
          { id: `${favoriteId}-user`, type: "user", content: favoriteItem.question },
          { 
            id: favoriteItem.messageId, 
            type: "assistant", 
            content: favoriteItem.answer,
            conclusion: favoriteItem.answer,
            reasoning: favoriteItem.reasoning,
            legalBasis: favoriteItem.source ? [{ title: favoriteItem.source, clause: "", content: "", url: "https://www.nmpa.gov.cn" }] : undefined,
          }
        ]
        setMessages(msgs)
        setHasInitialized(true)
        return
      }
    }
    // 仅首次进入时弹出知识库选择弹窗
    if (typeof window !== "undefined" && !localStorage.getItem("knowledge_modal_shown")) {
      setShowKnowledgeModal(true)
    }
    setHasInitialized(true)
  }, [searchParams, hasInitialized, isChecking])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化积分并检查是否需要提示
  useEffect(() => {
    if (typeof window === "undefined" || isChecking) return
    const points = getPoints()
    setCurrentPoints(points)
    const total = points.free + points.gift + points.member
    
    // 首次进入时，如果积分 <= 3，显示低积分提示
    if (total <= 3 && !localStorage.getItem("low_points_hint_shown")) {
      setShowLowPointsHint(true)
      localStorage.setItem("low_points_hint_shown", "true")
    }
  }, [isChecking])

  // 刷新积分（用于 visibilitychange）
  const refreshPoints = () => {
    if (typeof window !== "undefined") {
      setCurrentPoints(getPoints())
    }
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refreshPoints()
      }
    })
  }, [])

  // Auth guard loading state - must be after all hooks
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    // 检查积分是否足够
    const total = getTotalPoints()
    if (total <= 0) {
      setShowInsufficientPointsModal(true)
      return
    }

    const userQuestion = inputValue.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userQuestion,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // 扣减积分
    const deductResult = deductOnePoint()
    setLastDeductResult(deductResult)
    setCurrentPoints(getPoints())

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        ...mockAIResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => {
        const newMessages = [...prev, aiMessage]
        
        // 自动保存到历史记录
        addHistory({
          id: `hist-${Date.now()}`,
          question: userQuestion,
          answerSummary: (mockAIResponse.conclusion || mockAIResponse.content || "").slice(0, 50) + "...",
          source: knowledgeSource === "official" ? "官方知识库" : "我的知识库",
          createdAt: new Date().toISOString(),
          messages: newMessages.map(m => ({
            id: m.id,
            type: m.type,
            content: m.content,
            conclusion: m.conclusion,
            reasoning: m.reasoning,
            legalBasis: m.legalBasis,
          })),
        })
        
        return newMessages
      })
      setIsLoading(false)
    }, 2000)
  }

  const handleScenarioClick = (hint: string) => {
    setInputValue(hint)
    inputRef.current?.focus()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 版本A：结构化专业版 */}
      <ChatVersionA
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        handleSend={handleSend}
        handleScenarioClick={handleScenarioClick}
        inputRef={inputRef}
        messagesEndRef={messagesEndRef}
        knowledgeSource={knowledgeSource}
        setKnowledgeSource={setKnowledgeSource}
        bubbleColor={bubbleColor}
        currentPoints={currentPoints}
        showInsufficientPointsModal={showInsufficientPointsModal}
        setShowInsufficientPointsModal={setShowInsufficientPointsModal}
        showLowPointsHint={showLowPointsHint}
        setShowLowPointsHint={setShowLowPointsHint}
        lastDeductResult={lastDeductResult}
      />

      {/* 知识库范围弹窗 */}
      {showKnowledgeModal && (
        <KnowledgeModal onClose={() => {
          setShowKnowledgeModal(false)
          if (typeof window !== "undefined") {
            localStorage.setItem("knowledge_modal_shown", "true")
          }
        }} />
      )}
    </div>
  )
}

// 版本A：结构化专业版 - 结论、法规依据、推理过程分层展示
function ChatVersionA({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  handleSend,
  handleScenarioClick,
  inputRef,
  messagesEndRef,
  knowledgeSource,
  setKnowledgeSource,
  bubbleColor,
  currentPoints,
  showInsufficientPointsModal,
  setShowInsufficientPointsModal,
  showLowPointsHint,
  setShowLowPointsHint,
  lastDeductResult,
}: {
  messages: Message[]
  inputValue: string
  setInputValue: (v: string) => void
  isLoading: boolean
  handleSend: () => void
  handleScenarioClick: (hint: string) => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  knowledgeSource: "official" | "myVault"
  setKnowledgeSource: (source: "official" | "myVault") => void
  bubbleColor: string
  currentPoints: PointsData
  showInsufficientPointsModal: boolean
  setShowInsufficientPointsModal: (v: boolean) => void
  showLowPointsHint: boolean
  setShowLowPointsHint: (v: boolean) => void
  lastDeductResult: { remaining: number } | null
}) {
  const searchParams = useSearchParams()
  const { showError } = useError()
  const router = useRouter()
  const [showFirstFeedback, setShowFirstFeedback] = useState(false)

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const hasAnswer = messages.some(m => m.type === "assistant")
    const done = typeof window !== "undefined" && localStorage.getItem("first_feedback_done") === "true"
    if (hasAnswer && !done) {
      setShowFirstFeedback(true)
    } else {
      router.back()
    }
  }

  return (
    <>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
        <button
          onClick={handleBackClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        {/* 中间：积分角标 + 标题 */}
        <div className="flex items-center gap-2">
          <Link 
            href="/points" 
            className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100"
          >
            <Zap className="h-3 w-3" />
            <span>{currentPoints.free + currentPoints.gift + currentPoints.member}</span>
          </Link>
          <span className="text-sm font-medium text-gray-700">Veridata</span>
        </div>
        
        <Link 
          href="/history" 
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <Clock className="h-5 w-5 text-gray-400" />
        </Link>
      </header>

      {/* Debug 模式入口 */}
      {searchParams.get("debug") === "1" && (
        <div className="border-b border-dashed border-gray-200 bg-yellow-50 px-4 py-2">
          <p className="mb-1 text-[10px] text-gray-500">错误状态预览（debug 模式）</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => showError({ type: "network" })} className="rounded-md bg-white px-2 py-1 text-[10px] text-gray-700 ring-1 ring-gray-200">网络断开</button>
            <button onClick={() => showError({ type: "serverError" })} className="rounded-md bg-white px-2 py-1 text-[10px] text-gray-700 ring-1 ring-gray-200">AI 超时</button>
            <button onClick={() => showError({ type: "loadFailed" })} className="rounded-md bg-white px-2 py-1 text-[10px] text-gray-700 ring-1 ring-gray-200">上传失败</button>
            <button onClick={() => showError({ type: "empty" })} className="rounded-md bg-white px-2 py-1 text-[10px] text-gray-700 ring-1 ring-gray-200">知识库无答案</button>
          </div>
        </div>
      )}

      {/* 消息区域 */}
      <main className="flex-1 overflow-y-auto px-4 pb-44 pt-4">
        {messages.length === 0 ? (
          <EmptyStateA 
            knowledgeSource={knowledgeSource}
            setKnowledgeSource={setKnowledgeSource}
          />
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const relatedQuestion = message.type === "user"
                ? undefined
                : messages.slice(0, index).reverse().find(m => m.type === "user")?.content
              return (
                <MessageBubbleA key={message.id} message={message} bubbleColor={bubbleColor} relatedQuestion={relatedQuestion} />
              )
            })}
            {isLoading && <LoadingIndicatorA />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 底部输入区 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="px-4 pb-6 pt-3">
          <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-[#1e40af]/30 focus-within:ring-2 focus-within:ring-[#1e40af]/10">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="输入您的问题..."
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                inputValue.trim()
                  ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-md"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            本内容由 Veridata AI 基于知识库生成，仅供专业参考
          </p>
        </div>
      </div>

      {/* 低积分提示 */}
      {showLowPointsHint && (
        <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl bg-amber-50 p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm text-amber-700">
                演示积分已不多，可在「我的-升级」补充
              </p>
            </div>
            <button 
              onClick={() => setShowLowPointsHint(false)}
              className="text-amber-400 hover:text-amber-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 积分不足弹窗 */}
      {showInsufficientPointsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white">
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                积分不足
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                您的积分已用完，无法继续提问。升级会员可获得更多积分。
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setShowInsufficientPointsModal(false)}
                className="flex-1 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                取消
              </button>
              <div className="w-px bg-gray-100" />
              <Link
                href="/upgrade"
                className="flex-1 py-3 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                立即升级
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 首次反馈弹窗 */}
      {showFirstFeedback && (
        <FirstFeedbackModal
          onClose={(feedback) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("first_feedback_done", "true")
              if (feedback) {
                localStorage.setItem("first_feedback_value", feedback)
              }
            }
            setShowFirstFeedback(false)
            router.back()
          }}
        />
      )}
    </>
  )
}

// 版本A - 空状态
function EmptyStateA({ 
  knowledgeSource, 
  setKnowledgeSource 
}: { 
  knowledgeSource: "official" | "myVault"
  setKnowledgeSource: (source: "official" | "myVault") => void 
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-gray-900">
        <Image
          src="/crab-logo.png"
          alt="Logo"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        有什么可以帮到你？
      </h2>
      
      {/* 知识库选择器 */}
      <div className="mb-3 flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setKnowledgeSource("official")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
            knowledgeSource === "official"
              ? "bg-white text-[#1e40af] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <FileText className="h-4 w-4" />
          官方知识库
        </button>
        <button
          onClick={() => setKnowledgeSource("myVault")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
            knowledgeSource === "myVault"
              ? "bg-white text-[#1e40af] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <FolderOpen className="h-4 w-4" />
          我的知识库
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-500">
        {knowledgeSource === "official" 
          ? "基于行业官方数据库，每条回答有出处" 
          : "基于您上传的档案文件生成回答"}
      </p>
    </div>
  )
}

// 版本A - 消息气泡（结构化）
function MessageBubbleA({ message, bubbleColor, relatedQuestion }: { message: Message; bubbleColor: string; relatedQuestion?: string }) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window !== "undefined" && message.type === "assistant") {
      return isFavorited(message.id)
    }
    return false
  })
  const [liked, setLiked] = useState(false)
  const [showLikeToast, setShowLikeToast] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [inviteCode, setInviteCode] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteCode(localStorage.getItem("user_invite_code") ?? "")
    }
  }, [])

  const handleCopy = () => {
    const text = message.conclusion || message.content
    // 无论复制是否成功都显示已复制状态
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    
    // 尝试复制到剪贴板
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  const handleBookmark = () => {
    const newBookmarked = !bookmarked
    setBookmarked(newBookmarked)
    
    if (newBookmarked) {
      // 添加到收藏
      addFavorite({
        id: `fav-${Date.now()}`,
        messageId: message.id,
        question: relatedQuestion || "未知问题",
        answer: message.conclusion || message.content,
        source: message.legalBasis?.[0]?.title,
        reasoning: message.reasoning,
        savedTime: new Date().toISOString(),
      })
    } else {
      // 从收藏移除
      removeFavoriteByMessageId(message.id)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    if (!liked) {
      setShowLikeToast(true)
      setTimeout(() => setShowLikeToast(false), 1000)
    }
  }

  const handleDislike = () => {
    setShowFeedbackModal(true)
  }

  const handleFeedbackSubmit = (data: { type: string; content: string }) => {
    addFeedback({
      id: `feedback-${Date.now()}`,
      type: data.type,
      content: data.content,
      relatedQuestion: relatedQuestion,
      createdAt: new Date().toISOString(),
    })
  }

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[85%] rounded-2xl rounded-tr-md ${bubbleColor} px-4 py-3 text-sm text-white shadow-md`}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 结论 */}
      {message.conclusion && (
        <div className="rounded-2xl border border-[#1e40af]/10 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#1e40af]" />
            <span className="text-xs font-medium text-[#1e40af]">综合研判</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{message.conclusion}</p>
        </div>
      )}

      {/* 法规依据 */}
      {message.legalBasis && message.legalBasis.length > 0 && (
        <div className="rounded-2xl border border-[#1e40af]/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">法规依据</span>
          </div>
          <div className="space-y-3">
            {message.legalBasis.map((basis, index) => (
              <div key={index} className="rounded-xl bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{basis.title}</span>
                  {basis.url && (
                    <a 
                      href={basis.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white text-[#1e40af] shadow-sm transition-colors hover:bg-gray-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <p className="mb-1 text-xs text-gray-400">{basis.clause}</p>
                <p className="text-xs leading-relaxed text-gray-600">{basis.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 推导逻辑 */}
      {message.reasoning && (
        <div className="rounded-2xl border border-[#1e40af]/10 bg-white p-4 shadow-sm">
          <button onClick={() => setShowReasoning(!showReasoning)} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {showReasoning ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              <span className="text-xs font-medium text-gray-400">{showReasoning ? "收起推理过程" : "展开推理过程"}</span>
            </div>
          </button>
          {showReasoning && (
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{message.reasoning}</div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <Copy className="h-3.5 w-3.5" />
            {copied ? "已复制" : "复制"}
          </button>
          <button 
            onClick={handleBookmark}
            className={cn(
              "flex h-8 items-center gap-1 rounded-lg px-2 text-xs transition-colors",
              bookmarked 
                ? "text-amber-500 bg-amber-50" 
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            )}
          >
            <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
            {bookmarked ? "已收藏" : "收藏"}
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <Share2 className="h-3.5 w-3.5" />
            分享
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleLike}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              liked 
                ? "text-[#1e40af] bg-[#1e40af]/10" 
                : "text-gray-400 hover:bg-[#1e40af]/10 hover:text-[#1e40af]"
            )}
          >
            <ThumbsUp className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          </button>
          <button 
            onClick={handleDislike}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 复制成功 Toast */}
      {copied && (
        <div className="fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/70 px-4 py-2 text-sm text-white">
          已复制到剪贴板
        </div>
      )}

      {/* 点赞成功 Toast */}
      {showLikeToast && (
        <div className="fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/70 px-4 py-2 text-sm text-white">
          反馈成功
        </div>
      )}

      {/* 反馈弹窗 */}
      {showFeedbackModal && (
        <FeedbackModal 
          onClose={() => setShowFeedbackModal(false)} 
          onSubmit={handleFeedbackSubmit}
          relatedQuestion={relatedQuestion}
        />
      )}

      {/* 分享卡片弹窗 */}
      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        question={relatedQuestion ?? message.conclusion ?? "深度问答 by 械研"}
        answer={message.conclusion ?? message.content ?? ""}
        inviteCode={inviteCode || "YJ00000"}
      />
    </div>
  )
}

// 版本A - 加载指示器
function LoadingIndicatorA() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#1e40af]/10 bg-white p-4 shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      </div>
      <span className="text-sm text-gray-500">正在检索知���库...</span>
    </div>
  )
}

// 反馈弹窗
function FeedbackModal({ onClose, onSubmit, relatedQuestion }: { onClose: () => void; onSubmit?: (data: { type: string; content: string }) => void; relatedQuestion?: string }) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [feedbackText, setFeedbackText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const feedbackReasons = [
    "回答不准确",
    "引用法规有误",
    "内容不完整",
    "与问题不相关",
    "格式混乱",
    "其他问题",
  ]

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    )
  }

  const handleSubmit = () => {
    // 调用 onSubmit 回调保存反馈
    if (onSubmit) {
      onSubmit({
        type: selectedReasons.join(", ") || "其他",
        content: feedbackText || selectedReasons.join(", "),
      })
    }
    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-6 text-center">
          <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-green-100">
            <ThumbsUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-700">感谢您的反馈</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6" style={{ maxHeight: "80vh" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">问题反馈</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-3 text-sm text-gray-500">请选择问题类型（可多选）</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {feedbackReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => toggleReason(reason)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-all",
                selectedReasons.includes(reason)
                  ? "bg-[#2d61d3] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {reason}
            </button>
          ))}
        </div>

        <p className="mb-2 text-sm text-gray-500">补充说明（可选）</p>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="请描述您遇到的具体问题..."
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
          rows={3}
        />

        <button
          onClick={handleSubmit}
          disabled={selectedReasons.length === 0}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-medium transition-all",
            selectedReasons.length > 0
              ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          提交反馈
        </button>
      </div>
    </div>
  )
}

// 知识库范围弹窗
function KnowledgeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6" style={{ maxHeight: "70vh" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">当前械研知识库覆盖范围</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-700">
            当前聚焦<span className="font-medium text-[#1e40af]">医美针剂注册</span>领域
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-semibold text-gray-900">13大类</p>
              <p className="text-xs text-gray-400">医疗器械分类</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-semibold text-gray-900">IVD</p>
              <p className="text-xs text-gray-400">体外诊断试剂</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-semibold text-gray-900">128 份</p>
              <p className="text-xs text-gray-400">法规规章</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-semibold text-gray-900">45 份</p>
              <p className="text-xs text-gray-400">技术指导原则</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-[#1e40af]/5 p-3">
          <p className="text-xs leading-relaxed text-gray-600">
            知识库持续扩充中，暂未覆盖的类目我们正在收录。如果找不到你需要的内容，欢迎通过反馈告诉我们，我们会优先补充。
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          我知道了，开始提问
        </button>
      </div>
    </div>
  )
}

// 首次反馈弹���
function FirstFeedbackModal({ onClose }: { onClose: (feedback?: "good" | "bad") => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6">
        <div className="mb-2 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e40af]/10">
            <ThumbsUp className="h-6 w-6 text-[#1e40af]" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">今天的回答对您有帮助吗？</h3>
          <p className="mt-1 text-xs text-gray-400">你的反馈将帮助我们持续优化知识库</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => onClose("bad")}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm text-gray-600 hover:bg-gray-50"
          >
            <ThumbsDown className="h-4 w-4" />
            还需改进
          </button>
          <button
            onClick={() => onClose("good")}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3 text-sm font-medium text-white"
          >
            <ThumbsUp className="h-4 w-4" />
            很有帮助
          </button>
        </div>
        <button
          onClick={() => onClose()}
          className="mt-3 w-full py-2 text-center text-xs text-gray-400"
        >
          暂不评价
        </button>
      </div>
    </div>
  )
}
