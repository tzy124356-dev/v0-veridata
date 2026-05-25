"use client"

import { ThumbsUp, ThumbsDown } from "lucide-react"

interface FirstFeedbackModalProps {
  onClose: (feedback?: "good" | "bad") => void
}

export function FirstFeedbackModal({ onClose }: FirstFeedbackModalProps) {
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
