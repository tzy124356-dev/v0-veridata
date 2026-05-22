"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Gift, Sparkles, CheckCircle2, UserPlus } from "lucide-react"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const handleRegister = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("invited_by", code)
    }
    router.push("/login")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb]">
      {/* 顶部装饰光晕 */}
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-400/20 blur-[60px]" />
      <div className="absolute -left-10 top-40 h-32 w-32 rounded-full bg-cyan-400/20 blur-[60px]" />

      {/* 主体内容区 */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-32 pt-16">
        {/* Logo 与品牌区 */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative h-20 w-20">
            <Image
              src="/crab-logo.png"
              alt="械研"
              fill
              className="object-contain brightness-0 invert drop-shadow-lg"
              priority
            />
          </div>
          <p className="mt-4 text-xs tracking-[3px] text-white/80">VERIDATA</p>
          <p className="mt-1 text-base font-medium text-white">械研</p>
        </div>

        {/* 邀请文案区 */}
        <div className="mb-8 text-center">
          <p className="text-base text-white/70">您的朋友邀请您使用</p>
          <p className="mt-1 text-2xl font-bold text-white">械研 · 让 AI 有据而行</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
            <UserPlus className="h-3.5 w-3.5 text-white/80" />
            <span className="text-xs text-white/80">邀请人编号 #{code}</span>
          </div>
        </div>

        {/* 福利卡片 */}
        <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
          <h3 className="mb-4 text-center text-sm font-semibold text-gray-900">双方福利同享</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* 左卡片 - 新用户福利 */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 text-center">
              <Gift className="mx-auto mb-2 h-6 w-6 text-[#1e40af]" />
              <p className="text-[10px] text-gray-500">您可获得</p>
              <p className="mt-1 text-xl font-bold text-[#1e40af]">30 积分</p>
              <p className="mt-0.5 text-[10px] text-gray-500">新人礼包</p>
            </div>
            {/* 右卡片 - 邀请人福利 */}
            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-orange-500" />
              <p className="text-[10px] text-gray-500">邀请人获得</p>
              <p className="mt-1 text-xl font-bold text-orange-600">100 积分</p>
              <p className="mt-0.5 text-[10px] text-gray-500">分享奖励</p>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-gray-400">注册成功后积分立即到账</p>
        </div>

        {/* 产品价值简介 */}
        <div className="mx-auto mt-6 w-full max-w-sm space-y-2.5">
          <div className="flex items-start gap-2.5 text-sm text-white/90">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-300" />
            <span>基于官方法规知识库，每条回答有据可查</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-white/90">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-300" />
            <span>医美针剂注册问题深度问答，专业可靠</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-white/90">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-300" />
            <span>上传个人档案，构建您的专属知识库</span>
          </div>
        </div>
      </div>

      {/* 底部固定 CTA 区 */}
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#1e3a8a] to-transparent px-6 pb-8 pt-4">
        <button
          onClick={handleRegister}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07c160] py-4 text-base font-semibold text-white"
        >
          <MessageCircle className="h-5 w-5" />
          微信一键注册领取
        </button>
        <p className="mt-3 text-center text-xs text-white/60">
          已有账号？
          <Link href="/login" className="text-white underline">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
