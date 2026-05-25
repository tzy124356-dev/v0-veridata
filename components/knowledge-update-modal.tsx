"use client"

import { BookOpen } from "lucide-react"

interface KnowledgeUpdateModalProps {
  onClose: () => void
}

export function KnowledgeUpdateModal({ onClose }: KnowledgeUpdateModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e40af]/10">
            <BookOpen className="h-6 w-6 text-[#1e40af]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">知识库已更新</h3>
          <p className="mt-2 text-sm text-gray-500">
            械研 VERIDATA 官方知识库内容已进一步完善
          </p>
        </div>

        <p className="mb-5 text-center text-xs text-gray-400">
          本内容由械研 VERIDATA 官方知识库维护，仅用于专业参考。
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}
