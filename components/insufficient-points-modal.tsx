"use client"

import { Zap } from "lucide-react"
import Link from "next/link"

// 积分不足弹窗 - 积分=0时提问触发
export function InsufficientPointsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <Zap className="h-7 w-7 text-amber-500" />
          </div>
        </div>
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
          积分不足
        </h3>
        <p className="mb-5 text-center text-sm text-gray-500">
          您的积分已用完，无法继续提问。
          <br />
          获取更多积分以继续使用。
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="block rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] py-3 text-center text-sm font-medium text-white transition-all hover:opacity-90"
            onClick={onClose}
          >
            获取更多积分
          </Link>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            稍后再说
          </button>
        </div>
      </div>
    </div>
  )
}
