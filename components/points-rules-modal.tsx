"use client"

import { X } from "lucide-react"

interface PointsRulesModalProps {
  onClose: () => void
}

export function PointsRulesModal({ onClose }: PointsRulesModalProps) {
  const rules = [
    {
      num: 1,
      title: "什么是积分？",
      desc: "1 积分 = 1 次提问机会，是您在械研获取专业回答的凭证。",
    },
    {
      num: 2,
      title: "如何获取积分？",
      desc: "通过订阅会员、平台免费赠送，以及分享好友、补充知识库等活动均可获得。",
    },
    {
      num: 3,
      title: "积分扣减顺序",
      desc: "按免费 → 赠送 → 会员的顺序依次扣减，让您付费购买的积分尽量晚被使用。",
    },
    {
      num: 4,
      title: "积分有效期",
      desc: "会员积分仅在订阅周期内有效；免费积分和赠送积分长期有效，无过期顾虑。",
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 mx-auto max-w-lg animate-in slide-in-from-bottom rounded-t-3xl bg-white p-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">积分使用说明</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          {rules.map((rule) => (
            <div key={rule.num} className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1e40af]/10 text-xs font-semibold text-[#1e40af]">
                {rule.num}
              </div>
              <div>
                <p className="font-medium text-gray-900">{rule.title}</p>
                <p className="mt-1 text-sm text-gray-500">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-3.5 font-medium text-white"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}
