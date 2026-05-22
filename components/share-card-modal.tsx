"use client"

import Image from "next/image"
import { X, MessageCircle, Share2, Download, Gift } from "lucide-react"

interface ShareCardModalProps {
  isOpen: boolean
  onClose: () => void
  question: string
  answer: string
  inviteCode: string
}

export function ShareCardModal({
  isOpen,
  onClose,
  question,
  answer,
  inviteCode,
}: ShareCardModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = () => {
    onClose()
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-white p-5"
        onClick={handleContentClick}
      >
        {/* 头部 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-semibold">分享回答</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* 分享预览卡片 */}
        <div className="mx-auto w-[280px] overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* 顶部品牌区 */}
          <div className="flex items-center gap-2 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-4 py-4">
            <div className="relative h-7 w-7">
              <Image
                src="/crab-logo.png"
                alt="械研"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">械研 VERIDATA</span>
              <span className="text-[10px] tracking-wider text-white/60">让 AI 有据而行</span>
            </div>
          </div>

          {/* 中部内容区 */}
          <div className="bg-white px-4 py-4">
            <p className="mb-1 text-[10px] text-gray-400">问题</p>
            <p className="mb-3 line-clamp-2 text-sm font-medium text-gray-900">{question}</p>
            <div className="my-3 border-t border-dashed border-gray-200" />
            <p className="mb-1 text-[10px] text-gray-400">AI 回答摘要</p>
            <p className="line-clamp-4 text-xs leading-relaxed text-gray-600">{answer}</p>
          </div>

          {/* 底部二维码区 */}
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <div>
              <p className="text-[10px] text-gray-400">邀请码</p>
              <p className="text-lg font-bold text-[#1e40af]">{inviteCode}</p>
              <p className="mt-1 text-[10px] text-gray-500">扫码注册得积分</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
              {/* Mock 二维码 SVG */}
              <svg viewBox="0 0 8 8" className="h-full w-full">
                {/* 左上定位框 */}
                <rect x="0" y="0" width="3" height="3" fill="#000" />
                <rect x="0.5" y="0.5" width="2" height="2" fill="#fff" />
                <rect x="1" y="1" width="1" height="1" fill="#000" />
                {/* 右上定位框 */}
                <rect x="5" y="0" width="3" height="3" fill="#000" />
                <rect x="5.5" y="0.5" width="2" height="2" fill="#fff" />
                <rect x="6" y="1" width="1" height="1" fill="#000" />
                {/* 左下定位框 */}
                <rect x="0" y="5" width="3" height="3" fill="#000" />
                <rect x="0.5" y="5.5" width="2" height="2" fill="#fff" />
                <rect x="1" y="6" width="1" height="1" fill="#000" />
                {/* 随机数据点 */}
                <rect x="4" y="0" width="0.5" height="0.5" fill="#000" />
                <rect x="0" y="4" width="0.5" height="0.5" fill="#000" />
                <rect x="4" y="4" width="0.5" height="0.5" fill="#000" />
                <rect x="3.5" y="3" width="0.5" height="0.5" fill="#000" />
                <rect x="4.5" y="3.5" width="0.5" height="0.5" fill="#000" />
                <rect x="3" y="4.5" width="0.5" height="0.5" fill="#000" />
                <rect x="5" y="4" width="0.5" height="0.5" fill="#000" />
                <rect x="4" y="5" width="0.5" height="0.5" fill="#000" />
                <rect x="5.5" y="5.5" width="0.5" height="0.5" fill="#000" />
                <rect x="6.5" y="4" width="0.5" height="0.5" fill="#000" />
                <rect x="7" y="5" width="0.5" height="0.5" fill="#000" />
                <rect x="4" y="6.5" width="0.5" height="0.5" fill="#000" />
                <rect x="5" y="7" width="0.5" height="0.5" fill="#000" />
                <rect x="7" y="7" width="0.5" height="0.5" fill="#000" />
                <rect x="3" y="6" width="0.5" height="0.5" fill="#000" />
                <rect x="6" y="6" width="0.5" height="0.5" fill="#000" />
              </svg>
            </div>
          </div>
        </div>

        {/* 分享方式按钮区 */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <button
            onClick={() => alert("微信好友：已模拟唤起微信分享面板")}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 py-3 hover:bg-gray-100"
          >
            <MessageCircle className="h-6 w-6 text-[#07c160]" />
            <span className="text-xs text-gray-700">微信好友</span>
          </button>
          <button
            onClick={() => alert("朋友圈：已模拟分享至朋友圈")}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 py-3 hover:bg-gray-100"
          >
            <Share2 className="h-6 w-6 text-[#07c160]" />
            <span className="text-xs text-gray-700">朋友圈</span>
          </button>
          <button
            onClick={() => alert("保存图片：已模拟保存到本地相册")}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 py-3 hover:bg-gray-100"
          >
            <Download className="h-6 w-6 text-[#1e40af]" />
            <span className="text-xs text-gray-700">保存图片</span>
          </button>
        </div>

        {/* 底部奖励说明 */}
        <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
            <p className="text-xs leading-relaxed text-gray-600">
              邀请新用户通过此卡片扫码注册成功，您将获得 100 积分奖励，对方也可获得 30 积分新人礼包。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
