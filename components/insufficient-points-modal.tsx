"use client"

import Link from "next/link"
import { Zap, X } from "lucide-react"

interface InsufficientPointsModalProps {
  onClose: () => void
}

export function InsufficientPointsModal({ onClose }: InsufficientPointsModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white">
        <div className="p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Zap className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            积分不足
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            您的积分已用完，无法继续提问。升级会员可获得更多积分。
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            取消
          </button>
          <div className="w-px bg-gray-100" />
          <Link
            href="/upgrade"
            className="flex-1 py-3 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            立即升级
          </Link>
        </div>
      </div>
    </div>
  )
}

interface LowPointsHintProps {
  onClose: () => void
}

export function LowPointsHint({ onClose }: LowPointsHintProps) {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl bg-amber-50 p-3 shadow-lg">
      <div className="flex items-start gap-2">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm text-amber-700">
            演示积分已不多，可在「我的-升级」补充
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-amber-400 hover:text-amber-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
