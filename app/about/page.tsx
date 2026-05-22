"use client"

import { ArrowLeft, Sparkles, BookOpen, FolderOpen, Clock, Star, Coins, Bell, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-white px-4 shadow-sm">
        <Link
          href="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-base font-medium text-gray-900">关于我们</h1>
        <div className="w-9" />
      </header>

      {/* 内容区域 */}
      <main className="flex-1 px-5 py-6">
        {/* Logo 和 Slogan */}
        <div className="mb-6 flex flex-col items-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-6 text-white shadow-sm">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="mb-1 text-xl font-bold">械研 VERIDATA</h2>
          <p className="text-sm text-white/80">让 AI 有据而行</p>
        </div>

        <div className="space-y-4">
          {/* 产品定位 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">产品定位</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              械研 VERIDATA 是面向医疗器械注册工程师、注册专员、法规事务人员、医美针剂相关企业主及创业者的 AI 辅助工具，帮助专业人士快速获取法规政策、技术指导原则等专业信息。
            </p>
          </div>

          {/* V1 聚焦 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">V1 聚焦领域</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              当前版本聚焦于医美针剂注册领域，覆盖玻尿酸、胶原蛋白等注射类产品的注册申报、临床评价、发补处理等核心场景。
            </p>
          </div>

          {/* 核心能力 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">核心能力</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <BookOpen className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">官方知识库问答</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <FolderOpen className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">个人档案库问答</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Clock className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">历史记录</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Star className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">收藏管理</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Coins className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">积分会员</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Bell className="h-4 w-4 text-[#1e40af]" />
                <span className="text-xs text-gray-700">通知反馈</span>
              </div>
            </div>
          </div>

          {/* 当前阶段 */}
          <div className="rounded-xl bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-amber-800">当前阶段说明</h3>
            <p className="text-sm leading-relaxed text-amber-700">
              当前为产品原型及测试阶段，部分功能将持续迭代优化。如您在使用过程中遇到问题或有任何建议，欢迎通过帮助与反馈页面提交反馈。
            </p>
          </div>

          {/* 联系方式 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">联系我们</h3>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">
              如需反馈问题或提出建议，请通过帮助与反馈页面提交，我们将认真评估每一条反馈。
            </p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1e40af]/10 px-4 py-2 text-sm font-medium text-[#1e40af] transition-colors hover:bg-[#1e40af]/20"
            >
              <MessageSquare className="h-4 w-4" />
              前往帮助与反馈
            </Link>
          </div>
        </div>

        {/* 版本信息 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          版本 v1.0.0
        </p>
      </main>
    </div>
  )
}
