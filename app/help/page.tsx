"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  Send,
  X,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 常见问题数据
const faqCategories = [
  {
    id: "usage",
    title: "使用问题",
    icon: HelpCircle,
    questions: [
      {
        q: "如何开始提问？",
        a: "进入问答页面，在底部输入框输入您的问题，点击发送即可。系统会基于官方知识库或您的档案库为您生成专业回答。",
      },
      {
        q: "问答次数用完了怎么办？",
        a: "您可以升级会员套餐获取更多问答次数。轻度版每月300次，重度版每月1000次。",
      },
      {
        q: "如何切换知识库来源？",
        a: "在问答页面顶部可以选择"官方知识库"或"我的档案库"，系统将基于选择的来源生成回答。",
      },
    ],
  },
  {
    id: "vault",
    title: "档案库",
    icon: FileText,
    questions: [
      {
        q: "支持上传哪些文件格式？",
        a: "目前支持PDF、Word（.doc/.docx）、Excel（.xls/.xlsx）等常见文档格式。",
      },
      {
        q: "档案库空间不够用了怎么办？",
        a: "升级会员可获得更多存储空间。免费版2G，轻度版5G，重度版20G。",
      },
      {
        q: "上传的文件安全吗？",
        a: "您的文件经过加密存储，仅您本人可以访问。我们严格保护用户数据隐私。",
      },
    ],
  },
  {
    id: "membership",
    title: "会员相关",
    icon: MessageSquare,
    questions: [
      {
        q: "如何升级会员？",
        a: "进入"我的"页面，点击会员信息卡片，选择适合您的套餐进行订阅。",
      },
      {
        q: "支持哪些支付方式？",
        a: "目前支持微信支付。",
      },
      {
        q: "可以退款吗？",
        a: "支持7天无理由退款，如需退款请联系客服处理。",
      },
    ],
  },
]

export default function HelpPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("usage")
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="text-base font-semibold text-gray-900">帮助与反馈</span>
        <div className="w-9" />
      </header>

      <div className="flex-1 px-4 pb-24 pt-4">
        {/* 快捷入口 */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
              <MessageSquare className="h-6 w-6 -scale-x-100 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">问题反馈</span>
          </button>
          <a
            href="mailto:support@veridata.com"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6]">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">联系客服</span>
          </a>
        </div>

        {/* 常见问题 */}
        <div className="mb-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">常见问题</h2>
          <div className="space-y-3">
            {faqCategories.map((category) => {
              const Icon = category.icon
              const isExpanded = expandedCategory === category.id
              return (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <button
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category.id)
                    }
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e40af]/10">
                        <Icon className="h-4.5 w-4.5 text-[#1e40af]" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gray-50 px-4 pb-3">
                      {category.questions.map((item, index) => {
                        const questionId = `${category.id}-${index}`
                        const isQuestionExpanded = expandedQuestion === questionId
                        return (
                          <div
                            key={index}
                            className="border-b border-gray-50 last:border-0"
                          >
                            <button
                              onClick={() =>
                                setExpandedQuestion(
                                  isQuestionExpanded ? null : questionId
                                )
                              }
                              className="flex w-full items-center justify-between py-3 text-left"
                            >
                              <span className="text-sm text-gray-700">
                                {item.q}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 flex-shrink-0 text-gray-300 transition-transform",
                                  isQuestionExpanded && "rotate-90"
                                )}
                              />
                            </button>
                            {isQuestionExpanded && (
                              <p className="pb-3 text-sm leading-relaxed text-gray-500">
                                {item.a}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">联系我们</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">客服邮箱</p>
                <p className="text-sm text-gray-700">support@veridata.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">服务时间</p>
                <p className="text-sm text-gray-700">工作日 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 反馈弹窗 */}
      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  )
}

// 反馈弹窗组件
function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = [
    "功能建议",
    "问题反馈",
    "内容错误",
    "使用体验",
    "其他",
  ]

  const handleSubmit = () => {
    if (!feedbackType || !feedbackText) return
    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">感谢您的反馈</p>
          <p className="mt-1 text-xs text-gray-400">我们会尽快处理</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50">
      <div
        className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6"
        style={{ maxHeight: "85vh" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">问题反馈</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-3 text-sm text-gray-500">反馈类型</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {feedbackTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFeedbackType(type)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-all",
                feedbackType === type
                  ? "bg-[#1e40af] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <p className="mb-2 text-sm text-gray-500">详细描述</p>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="请详细描述您遇到的问题或建议..."
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
          rows={4}
        />

        <p className="mb-2 text-sm text-gray-500">联系方式（选填）</p>
        <input
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="手机号或邮箱，方便我们与您联系"
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
        />

        <button
          onClick={handleSubmit}
          disabled={!feedbackType || !feedbackText}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all",
            feedbackType && feedbackText
              ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          )}
        >
          <Send className="h-4 w-4" />
          提交反馈
        </button>
      </div>
    </div>
  )
}
