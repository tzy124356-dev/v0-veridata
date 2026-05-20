"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Send,
  Copy,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 模拟消息类型
interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  conclusion?: string
  sources?: Array<{
    fileName: string
    excerpt: string
  }>
  reasoning?: string
  timestamp: Date
}

// 模拟AI回答数据
const mockAIResponse: Omit<Message, "id" | "timestamp"> = {
  type: "assistant",
  content: "",
  conclusion:
    "根据您上传的《医疗器械注册申报资料要求》文件，第三类医疗器械注册申报需要准备以下核心材料清单。",
  sources: [
    {
      fileName: "医疗器械注册申报资料要求.docx",
      excerpt:
        "第三类医疗器械注册申报资料包括：申请表、证明性文件、产品技术要求、检验报告、临床评价资料、产品说明书、质量管理体系文件等。",
    },
    {
      fileName: "玻尿酸产品临床评价指导原则.docx",
      excerpt:
        "注射用交联透明质酸钠凝胶产品的临床评价应当基于同品种比对或临床试验数据。",
    },
  ],
  reasoning:
    "我从您上传的文件中检索到了相关信息：\n\n1. 《医疗器械注册申报资料要求》中明确了第三类医疗器械的完整申报资料清单\n2. 《玻尿酸产品临床评价指导原则》补充了临床评价的具体要求\n\n建议您按照文件中的顺序逐项准备材料，确保完整性。",
}

export default function VaultChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部导航 */}
      <header className="glass fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border/50 px-4 py-3">
        <Link
          href="/vault"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div className="text-center">
          <h1 className="text-base font-medium text-foreground">档案库问答</h1>
          <p className="text-xs text-muted-foreground">仅检索我的档案库</p>
        </div>
        <div className="w-9" />
      </header>

      {/* 消息区域 */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-36">
        {messages.length === 0 ? (
          <EmptyState />
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
            placeholder="向你的档案库提问..."
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
          本内容由械研AI基于您的档案库生成，仅供专业参考
        </p>
      </div>
    </div>
  )
}

// 空状态
function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <FolderOpen className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-lg font-medium text-foreground">
        向你的档案库提问
      </h2>
      <p className="mb-4 max-w-xs text-center text-sm text-muted-foreground">
        AI将仅从你上传的文件中检索和回答
      </p>

      <div className="glass-subtle mt-4 max-w-sm rounded-xl p-4">
        <p className="text-center text-sm text-secondary-foreground">
          试试问：&quot;申报资料清单有哪些？&quot;或&quot;临床评价需要注意什么？&quot;
        </p>
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

      {/* 文件来源 - 第二层 */}
      {message.sources && message.sources.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">
              来源文件
            </span>
          </div>
          <div className="space-y-3">
            {message.sources.map((source, index) => (
              <div key={index} className="rounded-xl bg-secondary/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {source.fileName}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-secondary-foreground">
                  {source.excerpt}
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
        本内容由械研AI基于您的档案库生成，仅供专业参考
      </p>
    </div>
  )
}

// 加载指示器
function LoadingIndicator() {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">正在检索您的档案库…</span>
    </div>
  )
}
