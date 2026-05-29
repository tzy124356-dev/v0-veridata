"use client"

import { useEffect, useState } from "react"
import { Check, Loader2, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type PayStatus = "processing" | "success" | "failed"

interface WechatPayModalProps {
  /** 套餐名称，例如「轻度版」 */
  planName: string
  /** 支付金额（元） */
  amount: number
  /** 计费周期文案，例如「月」「年」 */
  cycleLabel: string
  /** 关闭弹窗 */
  onClose: () => void
  /** 支付成功后点击「完成」回调 */
  onSuccess: () => void
}

export function WechatPayModal({ planName, amount, cycleLabel, onClose, onSuccess }: WechatPayModalProps) {
  const [status, setStatus] = useState<PayStatus>("processing")

  // 模拟调起微信支付并轮询结果
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("success")
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  const retry = () => {
    setStatus("processing")
    setTimeout(() => setStatus("success"), 2200)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-8">
      <div className="w-full max-w-sm animate-in zoom-in-95 fade-in duration-200 rounded-3xl bg-white p-6 text-center">
        {/* 处理中 */}
        {status === "processing" && (
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#07c160]/10">
              <Loader2 className="h-8 w-8 animate-spin text-[#07c160]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">正在调起微信支付</h2>
            <p className="mt-1.5 text-sm text-gray-500">请在微信中完成付款，请勿关闭页面</p>
            <div className="mt-5 w-full rounded-xl bg-gray-50 px-4 py-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{planName}</span>
                <span className="text-sm font-medium text-gray-900">
                  ¥{amount} / {cycleLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 支付成功 */}
        {status === "success" && (
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#07c160]">
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">支付成功</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              已开通{planName}，积分已到账
            </p>
            <div className="mt-5 w-full space-y-2 rounded-xl bg-gray-50 px-4 py-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">支付方式</span>
                <span className="text-sm text-gray-900">微信支付</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">实付金额</span>
                <span className="text-sm font-semibold text-[#07c160]">¥{amount}</span>
              </div>
            </div>
            <button
              onClick={onSuccess}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 text-base font-semibold text-white transition-all active:scale-[0.98]"
            >
              完成
            </button>
          </div>
        )}

        {/* 支付失败 */}
        {status === "failed" && (
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-9 w-9 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">支付未完成</h2>
            <p className="mt-1.5 text-sm text-gray-500">支付已取消或超时，您可以重新尝试</p>
            <div className="mt-5 flex w-full gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-all active:scale-[0.98]"
              >
                关闭
              </button>
              <button
                onClick={retry}
                className={cn(
                  "flex-1 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]",
                )}
              >
                重新支付
              </button>
            </div>
          </div>
        )}

        {/* 处理中右上角关闭 */}
        {status === "processing" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            aria-label="取消支付"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}
