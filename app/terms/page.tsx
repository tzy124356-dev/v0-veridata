"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
        <h1 className="text-base font-medium text-gray-900">用户服务协议</h1>
        <div className="w-9" />
      </header>

      {/* 内容区域 */}
      <main className="flex-1 px-5 py-6">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            欢迎使用械研 VERIDATA。在使用本平台前，请您仔细阅读并理解本协议。您使用本平台，即表示同意本协议内容。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">一、服务说明</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            械研 VERIDATA 是面向医疗器械注册领域的 AI 辅助工具，提供知识库问答、档案管理、政策查询等功能，帮助用户提升资料查询和注册分析效率。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">二、内容说明</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台生成的回答基于知识库、用户输入及 AI 算法，仅供专业参考，不替代法规原文、监管部门意见、律师意见或注册审评结论。用户应自行核实相关信息后再作决策。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">三、账号使用</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户可通过微信登录本平台。用户应保证授权信息真实有效，并妥善保管账号信息。因账号泄露造成的损失，由用户自行承担。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">四、用户规范</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户不得上传违法、侵权、涉密、恶意或无权处理的资料，不得利用本平台从事违反法律法规或损害他人权益的行为。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">五、上传内容</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户上传的资料主要用于本人知识库问答和档案管理。本平台不会将用户上传内容用于无关商业用途，也不会未经授权向第三方泄露，但法律法规另有要求的除外。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">六、积分与会员</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台可能提供积分、会员等服务，具体规则以页面展示为准。积分不可兑换现金，会员权益以购买时说明为准。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">七、责任限制</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户应结合专业判断使用本平台内容。因理解、使用 AI 生成内容所产生的决策后果，由用户自行承担。本平台不承担由此产生的直接或间接损失。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">八、协议更新</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台可根据产品功能、业务发展或法律法规变化更新本协议。更新后继续使用本平台，即视为接受更新内容。
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
