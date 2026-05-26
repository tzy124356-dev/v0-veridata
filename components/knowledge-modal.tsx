"use client"

import { X } from "lucide-react"

interface KnowledgeModalProps {
  onClose: () => void
}

export function KnowledgeModal({ onClose }: KnowledgeModalProps) {
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
