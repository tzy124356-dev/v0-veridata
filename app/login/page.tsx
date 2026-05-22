"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MessageCircle, Phone, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState<"wechat" | "phone" | null>(null)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // 模拟微信授权登录
  const handleWechatLogin = async () => {
    setLoginType("wechat")
    setIsLoading(true)

    // 模拟授权过程
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoginSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 跳转到首页
    router.push("/")
  }

  // 模拟手机号授权登录
  const handlePhoneLogin = async () => {
    setLoginType("phone")
    setIsLoading(true)

    // 模拟授权过程
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoginSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 跳转到首页
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 顶部品牌区域 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {/* Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] shadow-lg">
          <svg
            viewBox="0 0 64 64"
            className="h-12 w-12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 像素风格螃蟹 Logo */}
            <rect x="20" y="24" width="24" height="16" fill="white" />
            <rect x="16" y="28" width="4" height="8" fill="white" />
            <rect x="44" y="28" width="4" height="8" fill="white" />
            <rect x="24" y="20" width="4" height="4" fill="white" />
            <rect x="36" y="20" width="4" height="4" fill="white" />
            <rect x="25" y="21" width="2" height="2" fill="#1e40af" />
            <rect x="37" y="21" width="2" height="2" fill="#1e40af" />
            <rect x="8" y="24" width="8" height="4" fill="white" />
            <rect x="8" y="28" width="4" height="8" fill="white" />
            <rect x="48" y="24" width="8" height="4" fill="white" />
            <rect x="52" y="28" width="4" height="8" fill="white" />
            <rect x="22" y="40" width="4" height="6" fill="white" />
            <rect x="30" y="40" width="4" height="8" fill="white" />
            <rect x="38" y="40" width="4" height="6" fill="white" />
          </svg>
        </div>

        {/* 品牌名 */}
        <h1 className="mb-1 text-2xl font-bold text-gray-900">械研</h1>
        <p className="mb-2 text-sm tracking-widest text-gray-500">VERIDATA</p>

        {/* Slogan */}
        <p className="text-sm text-gray-600">让 AI 有据而行</p>
      </div>

      {/* 登录按钮区域 */}
      <div className="px-6 pb-8">
        {/* 微信授权登录按钮 */}
        <button
          onClick={handleWechatLogin}
          disabled={isLoading}
          className={cn(
            "mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-medium transition-all active:scale-[0.98]",
            isLoading && loginType === "wechat"
              ? "bg-[#07c160] text-white"
              : "bg-[#07c160] text-white hover:bg-[#06ad56]"
          )}
        >
          {isLoading && loginType === "wechat" ? (
            loginSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                授权成功
              </>
            ) : (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                正在授权...
              </>
            )
          ) : (
            <>
              <MessageCircle className="h-5 w-5" />
              微信一键登录
            </>
          )}
        </button>

        {/* 手机号授权登录按钮 */}
        <button
          onClick={handlePhoneLogin}
          disabled={isLoading}
          className={cn(
            "mb-6 flex w-full items-center justify-center gap-2 rounded-xl border py-4 text-base font-medium transition-all active:scale-[0.98]",
            isLoading && loginType === "phone"
              ? "border-[#1e40af] bg-[#1e40af]/5 text-[#1e40af]"
              : "border-gray-200 bg-white text-gray-700 hover:border-[#1e40af] hover:text-[#1e40af]"
          )}
        >
          {isLoading && loginType === "phone" ? (
            loginSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-[#1e40af]" />
                授权成功
              </>
            ) : (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1e40af] border-t-transparent" />
                正在授权...
              </>
            )
          ) : (
            <>
              <Phone className="h-5 w-5" />
              手机号一键登录
            </>
          )}
        </button>

        {/* 协议说明 */}
        <p className="text-center text-xs leading-relaxed text-gray-400">
          点击登录即表示您已阅读并同意
        </p>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs">
          <Link href="/terms" className="text-[#1e40af] hover:underline">
            服务协议
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="text-[#1e40af] hover:underline">
            隐私政策
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/disclaimer" className="text-[#1e40af] hover:underline">
            免责声明
          </Link>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="flex items-center justify-center pb-8">
        <div className="h-1 w-32 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}
