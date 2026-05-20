"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  MessageSquareText,
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 场景标签数据
const scenarioTags = [
  { id: 1, label: "注册申报准备中", hint: "要申报了，不知道从哪里开始" },
  { id: 2, label: "收到发补通知", hint: "收到发补通知了，怎么办" },
  { id: 3, label: "产品分类界定困惑", hint: "产品分类搞不清楚，帮我判断一下" },
  { id: 4, label: "技术指导原则查询", hint: "找不到对应的技术指导原则" },
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
    },
    {
      title: "《医疗器械分类目录》",
      clause: "整形及普通外科植入物-13",
      content:
        "注射用交联透明质酸钠凝胶属于13-09-02类别，管理类别为III类。",
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
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 处理URL中的预设问题
  useEffect(() => {
    if (hasInitialized) return
    const presetQuestion = searchParams.get("q")
    if (presetQuestion) {
      setInputValue(presetQuestion)
      inputRef.current?.focus()
    }
    setHasInitialized(true)
  }, [searchParams, hasInitialized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        ...mockAIResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleScenarioClick = (hint: string) => {
    setInputValue(hint)
    inputRef.current?.focus()
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
        <h1 className="text-base font-medium text-foreground">智能问答</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary">
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* 消息区域 */}
      <main className="flex-1 overflow-y-auto px-4 pt-16 pb-36">
        {messages.length === 0 ? (
          <EmptyState onScenarioClick={handleScenarioClick} />
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 底部输入区 */}
      <div className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/50 px-4 pb-6 pt-3">
        <div className="flex items-end gap-3">
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
            placeholder="输入你的问题..."
            className="flex-1 resize-none rounded-xl bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={1}
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
              inputValue.trim() && !isLoading
                ? "gradient-accent text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          本内容由械研AI基于知识库生成，仅供专业参考
        </p>
      </div>

      {/* 知识库范围弹窗 */}
      {showKnowledgeModal && (
        <KnowledgeModal onClose={() => setShowKnowledgeModal(false)} />
      )}
    </div>
  )
}

// 空状态
function EmptyState({
  onScenarioClick,
}: {
  onScenarioClick: (hint: string) => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <MessageSquareText className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-lg font-medium text-foreground">
        有什么可以帮到你？
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        基于行业官方数据库，每条回答有出处
      </p>

      <div className="w-full max-w-sm space-y-3">
        <p className="text-center text-xs text-muted-foreground">
          选择一个场景开始
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {scenarioTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onScenarioClick(tag.hint)}
              className="glass-subtle rounded-full px-4 py-2 text-sm text-secondary-foreground transition-all hover:bg-secondary/60 active:scale-95"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 消息气泡
function MessageBubble({ message }: { message: Message }) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = message.conclusion || message.content
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 结论 - 第一层 */}
      {message.conclusion && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">结论</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {message.conclusion}
          </p>
        </div>
      )}

      {/* 法规依据 - 第二层 */}
      {message.legalBasis && message.legalBasis.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">法规依据</span>
          </div>
          <div className="space-y-3">
            {message.legalBasis.map((basis, index) => (
              <div
                key={index}
                className="rounded-xl bg-secondary/50 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {basis.title}
                  </span>
                  {basis.url && (
                    <a
                      href={basis.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <p className="mb-1 text-xs text-muted-foreground">
                  {basis.clause}
                </p>
                <p className="text-xs leading-relaxed text-secondary-foreground">
                  {basis.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 推导逻辑 - 第三层（可折叠） */}
      {message.reasoning && (
        <div className="glass rounded-2xl p-4">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {showReasoning ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {showReasoning ? "收起推理过程" : "展开推理过程"}
              </span>
            </div>
          </button>
          {showReasoning && (
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-secondary-foreground">
              {message.reasoning}
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "已复制" : "复制"}
          </button>
          <button className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Bookmark className="h-3.5 w-3.5" />
            收藏
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 免责声明 */}
      <p className="text-center text-xs text-muted-foreground/70">
        本内容由械研AI基于知识库生成，仅供专业参考
      </p>
    </div>
  )
}

// 加载指示器
function LoadingIndicator() {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">正在检索知识库…</span>
    </div>
  )
}

// 知识库范围弹窗
function KnowledgeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div
        className="glass w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl p-6"
        style={{ maxHeight: "70vh" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            当前械研知识库覆盖范围
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm text-foreground">
            当前聚焦<span className="font-medium text-primary">医美针剂注册</span>领域
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-lg font-semibold text-foreground">22大类</p>
              <p className="text-xs text-muted-foreground">医疗器械分类</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-lg font-semibold text-foreground">IVD</p>
              <p className="text-xs text-muted-foreground">体外诊断试剂</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-lg font-semibold text-foreground">XX份</p>
              <p className="text-xs text-muted-foreground">法规规章</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-lg font-semibold text-foreground">XX份</p>
              <p className="text-xs text-muted-foreground">技术指导原则</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-primary/10 p-3">
          <p className="text-xs leading-relaxed text-secondary-foreground">
            知识库持续扩充中，暂未覆盖的类目我们正在收录。如果找不到你需要的内容，欢迎通过反馈告诉我们，我们会优先补充。
          </p>
        </div>

        <button
          onClick={onClose}
          className="gradient-accent w-full rounded-xl py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          我知道了，开始提问
        </button>
      </div>
    </div>
  )
}
