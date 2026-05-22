"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-white px-4 shadow-sm">
        <Link
          href="/login"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-base font-medium text-gray-900">隐私政策</h1>
        <div className="w-9" />
      </header>

      {/* 内容区域 */}
      <main className="flex-1 px-5 py-6">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            械研 VERIDATA（以下简称"本平台"）非常重视用户隐私保护。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">一、我们收集的信息</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            我们可能收集以下信息：微信头像、昵称、手机号授权信息、身份标签（如注册工程师、法规专员等）、关注领域、提问记录、收藏记录、上传文件信息、积分与会员记录等。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">二、收集目的</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            我们收集信息的目的包括：登录识别与账号管理、提供知识库问答服务、实现个性化推荐、管理积分与会员权益、优化产品体验、安全风控与合规管理。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">三、文档与问答数据</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户上传的文件和提问内容用于提供档案库问答、历史记录、收藏等功能。我们承诺不会将您的文档内容用于其他商业目的或向无关第三方披露。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">四、信息存储与保护</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            我们采用行业通行的安全技术和管理措施保护您的个人信息，防止数据遭到未经授权的访问、泄露、篡改或破坏。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">五、第三方共享</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            除实现登录、支付、云存储、AI 服务等必要功能场景外，我们不会将您的个人信息与无关第三方共享。如因法律法规要求或政府部门依法要求，我们可能依法披露相关信息。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">六、用户权利</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            您有权查看、修改、删除您的部分个人信息。如需行使相关权利或有任何疑问，可通过帮助与反馈页面联系我们处理。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">七、未成年人保护</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台面向医疗器械注册领域专业人士，不建议未成年人使用。如未成年人使用本平台，应在监护人指导下进行。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">八、政策更新与联系方式</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台可能根据法律法规变化或业务发展更新本隐私政策。更新后的政策一经发布即生效。如有问题，请通过帮助与反馈页面联系我们。
          </p>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
              生效日期：2026年1月1日
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
