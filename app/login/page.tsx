"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // 完成登录逻辑
  const completeLogin = () => {
    // 设置登录状态和初始化数据
    if (typeof window !== "undefined") {
      localStorage.setItem("wechat_logged_in", "true")
      
      // 清除身份弹窗标记，确保新用户首次登录后显示身份选择弹窗
      localStorage.removeItem("identity_modal_shown")
      
      // 初始化积分（未购买会员）
      if (!localStorage.getItem("user_points")) {
        localStorage.setItem("user_points", JSON.stringify({ free: 5, gift: 0, member: 0 }))
      }
      
      // 生成邀请码
      if (!localStorage.getItem("user_invite_code")) {
        const code = "YJ" + Math.floor(10000 + Math.random() * 90000)
        localStorage.setItem("user_invite_code", code)
      }

      // 检测邀请关系，发放新人礼包
      const invitedBy = localStorage.getItem("invited_by")
      if (invitedBy) {
        // 新用户获得 30 积分新人礼
        const pointsRaw = localStorage.getItem("user_points")
        if (pointsRaw) {
          try {
            const points = JSON.parse(pointsRaw)
            points.gift = (points.gift ?? 0) + 30
            localStorage.setItem("user_points", JSON.stringify(points))
          } catch {}
        }
        localStorage.setItem("invited_by_used", invitedBy)
        localStorage.removeItem("invited_by")
      }
    }

    // 跳转到首页
    router.push("/")
  }

  // 模拟微信授权登录
  const handleWechatLogin = async () => {
    setIsLoading(true)

    // 模拟微信授权过程
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoginSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 微信授权成功后直接完成登录
    setIsLoading(false)
    completeLogin()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* 顶部品牌区域 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {/* Logo - 使用首页相同的 crab-logo.png */}
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] shadow-lg">
          <div className="relative h-20 w-20">
            <Image
              src="/crab-logo.png"
              alt="械研 Logo"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
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
            "mb-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-medium transition-all active:scale-[0.98]",
            "bg-[#07c160] text-white hover:bg-[#06ad56]"
          )}
        >
          {isLoading ? (
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
