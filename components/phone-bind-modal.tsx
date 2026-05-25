"use client"

import { useState, useEffect, useRef } from "react"
import { X, Phone, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhoneBindModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function PhoneBindModal({ onClose, onSuccess }: PhoneBindModalProps) {
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const [error, setError] = useState("")
  const codeInputRef = useRef<HTMLInputElement>(null)

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 验证手机号格式
  const isValidPhone = (p: string) => /^1[3-9]\d{9}$/.test(p)

  // 发送验证码
  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      setError("请输入正确的手机号")
      return
    }
    setError("")
    setIsSending(true)
    
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSending(false)
    setCountdown(60)
    // 自动聚焦到验证码输入框
    codeInputRef.current?.focus()
  }

  // 验证并绑定
  const handleVerify = async () => {
    if (!isValidPhone(phone)) {
      setError("请输入正确的手机号")
      return
    }
    if (code.length !== 6) {
      setError("请输入6位验证码")
      return
    }
    setError("")
    setIsVerifying(true)

    // 模拟验证过程
    await new Promise(resolve => setTimeout(resolve, 1200))

    // 演示：任意6位数字都算验证成功
    setVerifySuccess(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    onSuccess()
  }

  if (verifySuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <p className="text-base font-medium text-gray-900">绑定成功</p>
          <p className="mt-1 text-sm text-gray-500">正在进入...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">绑定手机号</h2>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-500">
          为保障账号安全，请绑定手机号完成验证
        </p>

        {/* 手机号输入 */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-gray-600">手机号</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                setError("")
              }}
              placeholder="请输入手机号"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-base placeholder:text-gray-400 focus:border-[#1e40af]/50 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
          </div>
        </div>

        {/* 验证码输入 */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-gray-600">验证码</label>
          <div className="flex gap-3">
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                setError("")
              }}
              placeholder="请输入验证码"
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base placeholder:text-gray-400 focus:border-[#1e40af]/50 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/10"
            />
            <button
              onClick={handleSendCode}
              disabled={countdown > 0 || isSending || !phone}
              className={cn(
                "shrink-0 rounded-xl px-4 py-3.5 text-sm font-medium transition-all",
                countdown > 0 || isSending || !phone
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#1e40af]/10 text-[#1e40af] hover:bg-[#1e40af]/15 active:scale-[0.98]"
              )}
            >
              {isSending ? "发送中..." : countdown > 0 ? `${countdown}s` : "获取验证码"}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}

        {/* 确认按钮 */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || !phone || !code}
          className={cn(
            "mt-2 w-full rounded-xl py-3.5 text-base font-medium transition-all",
            isVerifying || !phone || !code
              ? "bg-gray-100 text-gray-400"
              : "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white hover:opacity-90 active:scale-[0.98]"
          )}
        >
          {isVerifying ? "验证中..." : "确认绑定"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          验证码将发送至您的手机，请注意查收
        </p>
      </div>
    </div>
  )
}
