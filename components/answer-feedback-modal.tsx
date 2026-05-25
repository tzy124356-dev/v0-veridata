"use client"

import { useState } from "react"
import { X, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnswerFeedbackModalProps {
  onClose: () => void
  onSubmit?: (data: { type: string; content: string }) => void
  relatedQuestion?: string
}

export function AnswerFeedbackModal({ onClose, onSubmit, relatedQuestion }: AnswerFeedbackModalProps) {
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
