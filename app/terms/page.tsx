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
            欢迎使用械研 VERIDATA（以下简称"本平台"）。请您在使用本平台服务之前，仔细阅读以下服务协议。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">一、服务说明</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            械研 VERIDATA 是面向医疗器械注册领域的 AI 辅助工具，为注册工程师、法规事务人员、医美针剂相关企业主等专业人士提供知识库问答、档案管理、政策查询等功能支持。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">二、使用范围</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台的回答内容基于专业知识库和 AI 算法生成，仅供专业参考使用。本平台内容不替代法规原文、监管部门意见、律师意见或注册审评结论。用户在做出任何决策前，应自行核实相关信息并咨询相关专业人士。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">三、账号与授权</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户通过微信或手机号授权登录本平台，需保证所提供信息的真实性。用户应妥善保管账号信息，因账号泄露导致的损失由用户自行承担。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">四、用户行为规范</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户不得上传违法、侵权、恶意、涉密或无权处理的资料。不得利用本平台从事任何违反法律法规或损害他人合法权益的行为。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">五、知识库与上传内容</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户上传的文档仅用于其本人的知识库问答与功能体验，本平台承诺不会将用户上传内容用于其他商业目的或向第三方泄露。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">六、积分与会员</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台的积分可用于问答次数或相关功能权益，具体规则以积分中心及会员页面展示为准。积分不可兑换现金，会员权益以实际购买时的说明为准。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">七、责任限制</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            因用户对 AI 生成内容的理解、使用所造成的决策后果，由用户自行结合专业判断承担。本平台不对因使用或无法使用本平台服务而导致的任何直接、间接损害承担责任。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">八、协议更新</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台可根据产品迭代和法律法规变化更新本协议。更新后的协议一经发布即生效，继续使用本平台服务即表示您接受更新后的协议。
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
