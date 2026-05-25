"use client"

import { useState } from "react"
import { X, Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface HelpFeedbackModalProps {
  onClose: () => void
}

export function HelpFeedbackModal({ onClose }: HelpFeedbackModalProps) {
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
