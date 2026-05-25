"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamContactModalProps {
  onClose: () => void
}

export function TeamContactModal({ onClose }: TeamContactModalProps) {
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (phone) {
      setSubmitted(true)
      setTimeout(onClose, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <p className="text-base font-medium text-gray-900">提交成功</p>
          <p className="mt-1 text-sm text-gray-500">我们将尽快与您联系</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">预约团队版</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          留下您的联系方式，团队版上线后我们将第一时间通知您。
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">手机号 *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">公司名称（选填）</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="请输入公司名称"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#1e40af]/30 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!phone}
          className={cn(
            "mt-5 w-full rounded-xl py-3.5 text-base font-semibold transition-all",
            phone
              ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white"
              : "bg-gray-100 text-gray-400"
          )}
        >
          提交预约
        </button>
      </div>
    </div>
  )
}
