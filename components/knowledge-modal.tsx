"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"

interface KnowledgeModalProps {
  onClose: () => void
}

const items = [
  {
    title: "医疗器械注册产品",
    subtitle: "境内 + 进口",
    count: "约 15,000 个",
    showHelp: true,
  },
  {
    title: "IVD 注册产品",
    subtitle: "境内 + 进口",
    count: "数据接入中",
    pending: true,
  },
  {
    title: "法规依据",
    subtitle: "指导原则 · 法规政策",
    count: "约 2,000 份",
  },
  {
    title: "获批文档",
    subtitle: "审评报告 · 批件公告",
    count: "约 12,000 份",
  },
]

const helpDetails = [
  { code: "13-09-01", name: "整形填充材料" },
  { code: "13-09-02.1 / 02.2", name: "整形美容用注射材料" },
]

export function KnowledgeModal({ onClose }: KnowledgeModalProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div
        className="relative w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6"
        style={{ maxHeight: "80vh" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">当前械研知识库覆盖范围</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            aria-label="关闭"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-1 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-1">
                <p className="whitespace-nowrap text-[13px] font-semibold leading-tight text-gray-900">
                  {item.title}
                </p>
                {item.showHelp && (
                  <button
                    onClick={() => setShowHelp(true)}
                    className="ml-0.5 flex-shrink-0 rounded-full p-0.5 transition-colors hover:bg-gray-200"
                    aria-label="查看分类详情"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                )}
              </div>
              <p className="text-xs leading-tight text-gray-400">{item.subtitle}</p>
              <p
                className={`mt-1 font-bold leading-tight ${
                  item.pending ? "text-sm text-gray-400" : "text-base text-[#1e40af]"
                }`}
              >
                {item.count}
              </p>
            </div>
          ))}
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

        {showHelp && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-t-3xl bg-black/40 px-6"
            onClick={() => setShowHelp(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">医疗器械注册产品 · 覆盖范围</p>
                <button
                  onClick={() => setShowHelp(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                  aria-label="关闭说明"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <div className="mb-3 rounded-xl bg-[#1e40af]/5 px-3 py-2">
                <p className="text-sm font-bold text-[#1e40af]">第13类 无源植入器械</p>
              </div>

              <ul className="space-y-2">
                {helpDetails.map((d) => (
                  <li key={d.code} className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <span className="mt-[1px] inline-flex flex-shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-[#1e40af] ring-1 ring-[#1e40af]/15">
                      {d.code}
                    </span>
                    <span className="text-xs leading-relaxed text-gray-700">{d.name}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
