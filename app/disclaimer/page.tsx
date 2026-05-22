"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DisclaimerPage() {
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
        <h1 className="text-base font-medium text-gray-900">免责声明</h1>
        <div className="w-9" />
      </header>

      {/* 内容区域 */}
      <main className="flex-1 px-5 py-6">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            欢迎使用械研 VERIDATA（以下简称"本平台"）。在使用本平台服务之前，请您仔细阅读以下免责声明：
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">一、信息仅供参考</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台提供的所有信息、数据、分析结果及建议仅供参考，不构成任何法律、医疗、商业或专业建议。用户在做出任何决策前，应自行核实相关信息并咨询专业人士。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">二、AI生成内容</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台使用人工智能技术生成回答和建议。AI生成的内容可能存在不准确、不完整或过时的情况。本平台不对AI生成内容的准确性、完整性、及时性或适用性做任何保证。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">三、法规政策变化</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            医疗器械相关法规、政策、指导原则可能随时更新变化。本平台虽努力保持信息更新，但不保证所有信息均为最新版本。用户应以国家药品监督管理局等官方渠道发布的最新信息为准。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">四、责任限制</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            在法律允许的最大范围内，本平台及其运营方不对因使用或无法使用本平台服务而导致的任何直接、间接、附带、特殊或后果性损害承担责任。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">五、用户责任</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            用户应对其使用本平台服务的行为负责，包括但不限于确保上传内容的合法性、保护账户安全等。用户因违反法律法规或本平台规则而产生的一切后果由用户自行承担。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">六、知识产权</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台的所有内容（包括但不限于文字、图片、软件、界面设计等）的知识产权归本平台所有。未经书面许可，用户不得复制、传播或以其他方式使用本平台内容。
          </p>

          <h2 className="mb-2 text-sm font-semibold text-gray-900">七、声明修改</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            本平台保留随时修改本免责声明的权利。修改后的声明一经发布即生效。继续使用本平台服务即表示您接受修改后的免责声明。
          </p>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
              最后更新日期：2024年1月1日
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
