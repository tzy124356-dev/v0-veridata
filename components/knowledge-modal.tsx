"use client"

import { X } from "lucide-react"

interface KnowledgeModalProps {
  onClose: () => void
}

const items = [
  {
    title: "医疗器械注册产品",
    subtitle: "境内 + 进口",
    count: "第13类",
    extra: "13-09-01 / 02.1 / 02.2",
  },
  {
    title: "IVD 注册产品",
    subtitle: "境内 + 进口",
    count: "数据接入中",
    pending: true,
  },
  {
    title: "审评依据",
    subtitle: "指导原则 · 法规政策",
    count: "1,998 份",
  },
  {
    title: "审评结果",
    subtitle: "审评报告 · 批件公告",
    count: "11,538 份",
  },
]

export function KnowledgeModal({ onClose }: KnowledgeModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div
        className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6"
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
              <p className="text-sm font-semibold leading-tight text-gray-900">{item.title}</p>
              <p className="text-xs leading-tight text-gray-400">{item.subtitle}</p>
              <p
                className={`mt-1 text-base font-bold leading-tight ${
                  item.pending ? "text-gray-400" : "text-[#1e40af]"
                }`}
              >
                {item.count}
              </p>
              {item.extra && (
                <p className="text-[11px] font-medium leading-tight text-gray-500">{item.extra}</p>
              )}
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
      </div>
    </div>
  )
}
