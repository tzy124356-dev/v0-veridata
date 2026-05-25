"use client"

import { useState } from "react"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// 导入所有弹窗组件
import { IdentityModal } from "@/components/identity-modal"
import { KnowledgeModal } from "@/components/knowledge-modal"
import { FirstFeedbackModal } from "@/components/first-feedback-modal"
import { InsufficientPointsModal, LowPointsHint } from "@/components/insufficient-points-modal"
import { PointsRulesModal } from "@/components/points-rules-modal"
import { TeamContactModal } from "@/components/team-contact-modal"
import { AnswerFeedbackModal } from "@/components/answer-feedback-modal"
import { ShareCardModal } from "@/components/share-card-modal"
import { ClearCacheModal, LogoutModal } from "@/components/logout-modal"
import { FeedbackModal } from "@/components/feedback-modal"
import { HelpFeedbackModal } from "@/components/help-feedback-modal"
import { useError } from "@/components/error-states"

// 弹窗配置
const modalGroups = [
  {
    title: "引导类弹窗",
    modals: [
      {
        id: "identity",
        name: "身份选择",
        englishId: "IdentityModal",
        trigger: "首次进首页 0.9s 自动弹；或 profile 点铅笔图标",
      },
      {
        id: "knowledge",
        name: "知识库范围",
        englishId: "KnowledgeModal",
        trigger: "首次进 chat 页时弹一次",
      },
      {
        id: "firstFeedback",
        name: "首次反馈",
        englishId: "FirstFeedbackModal",
        trigger: "chat 有 AI 回答后首次返回时弹",
      },
    ],
  },
  {
    title: "积分与升级类",
    modals: [
      {
        id: "insufficientPoints",
        name: "积分不足提示",
        englishId: "InsufficientPointsModal",
        trigger: "chat 提问且积分=0 时弹",
      },
      {
        id: "lowPointsHint",
        name: "低积分提示",
        englishId: "LowPointsHint",
        trigger: "首次进 chat 且积分≤3 时弹（底部条样式）",
      },
      {
        id: "pointsRules",
        name: "积分规则说明",
        englishId: "PointsRulesModal",
        trigger: "points 页点 ? 时弹",
      },
      {
        id: "teamContact",
        name: "团队版预约",
        englishId: "TeamContactModal",
        trigger: "upgrade 页点「团队版即将上线」卡时弹",
      },
    ],
  },
  {
    title: "消息操作类",
    modals: [
      {
        id: "answerFeedback",
        name: "反馈表单（回答级）",
        englishId: "AnswerFeedbackModal",
        trigger: "chat 点 AI 回答的 ThumbsDown 时弹",
      },
      {
        id: "shareCard",
        name: "分享卡片",
        englishId: "ShareCardModal",
        trigger: "chat 点分享时弹",
      },
      {
        id: "copyToast",
        name: "复制成功 Toast",
        englishId: "CopyToast",
        trigger: "点复制按钮后中央闪现",
      },
      {
        id: "likeToast",
        name: "反馈成功 Toast（点赞后）",
        englishId: "LikeToast",
        trigger: "点 ThumbsUp 后中央闪现",
      },
    ],
  },
  {
    title: "操作确认类",
    modals: [
      {
        id: "logout",
        name: "退出登录",
        englishId: "LogoutModal",
        trigger: "profile/settings 点退出登录时弹",
      },
      {
        id: "clearCache",
        name: "清除缓存",
        englishId: "ClearCacheModal",
        trigger: "settings 点清除缓存时弹",
      },
    ],
  },
  {
    title: "反馈类",
    modals: [
      {
        id: "globalFeedback",
        name: "全局反馈（FAB 版）",
        englishId: "FeedbackModal",
        trigger: "点右下悬浮反馈按钮时弹",
      },
      {
        id: "helpFeedback",
        name: "帮助页反馈",
        englishId: "HelpFeedbackModal",
        trigger: "help 页点「问题反馈」快捷入口时弹",
      },
    ],
  },
  {
    title: "错误状态类",
    modals: [
      {
        id: "errorNetwork",
        name: "错误状态 - 网络断开",
        englishId: "ErrorModal",
        trigger: "通过 useError().showError() 触发",
        errorType: "network",
      },
      {
        id: "errorTimeout",
        name: "错误状态 - AI 超时",
        englishId: "ErrorModal",
        trigger: "通过 useError().showError() 触发",
        errorType: "serverError",
      },
      {
        id: "errorUpload",
        name: "错误状态 - 上传失败",
        englishId: "ErrorModal",
        trigger: "通过 useError().showError() 触发",
        errorType: "loadFailed",
      },
      {
        id: "errorEmpty",
        name: "错误状态 - 知识库无答案",
        englishId: "ErrorModal",
        trigger: "通过 useError().showError() 触发",
        errorType: "empty",
      },
    ],
  },
]

export default function DevModalsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [showLikeToast, setShowLikeToast] = useState(false)
  const { showError } = useError()

  const handleResetLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleModalClick = (modalId: string, errorType?: string) => {
    if (modalId === "copyToast") {
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 1500)
      return
    }
    if (modalId === "likeToast") {
      setShowLikeToast(true)
      setTimeout(() => setShowLikeToast(false), 1500)
      return
    }
    if (errorType) {
      showError({ 
        type: errorType as "network" | "serverError" | "loadFailed" | "empty",
        message: "这是调试预览的错误消息"
      })
      return
    }
    setActiveModal(modalId)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 警示条 */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">此页面仅用于开发调试，正式版本将隐藏</span>
        </div>
      </div>

      {/* 页面头部 */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">弹窗预览面板</h1>
            <p className="mt-1 text-sm text-gray-500">开发调试用，点击任意按钮即可预览对应弹窗</p>
          </div>
          <button
            onClick={handleResetLocalStorage}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4" />
            重置所有 localStorage
          </button>
        </div>

        {/* 弹窗分组卡片 */}
        <div className="space-y-6">
          {modalGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-medium text-gray-500">{group.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {group.modals.map((modal) => (
                  <div
                    key={modal.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-900">{modal.name}</h3>
                      <p className="text-xs text-gray-400">{modal.englishId}</p>
                    </div>
                    <p className="mb-3 text-xs text-gray-500 line-clamp-2">{modal.trigger}</p>
                    <button
                      onClick={() => handleModalClick(modal.id, (modal as { errorType?: string }).errorType)}
                      className="w-full rounded-lg bg-gradient-to-r from-[#1e40af] to-[#3b82f6] py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      预览此弹窗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 弹窗渲染 */}
      {activeModal === "identity" && (
        <IdentityModal
          isOpen={true}
          onSubmit={closeModal}
          onClose={closeModal}
        />
      )}

      {activeModal === "knowledge" && (
        <KnowledgeModal onClose={closeModal} />
      )}

      {activeModal === "firstFeedback" && (
        <FirstFeedbackModal onClose={closeModal} />
      )}

      {activeModal === "insufficientPoints" && (
        <InsufficientPointsModal onClose={closeModal} />
      )}

      {activeModal === "lowPointsHint" && (
        <LowPointsHint onClose={closeModal} />
      )}

      {activeModal === "pointsRules" && (
        <PointsRulesModal onClose={closeModal} />
      )}

      {activeModal === "teamContact" && (
        <TeamContactModal onClose={closeModal} />
      )}

      {activeModal === "answerFeedback" && (
        <AnswerFeedbackModal 
          onClose={closeModal} 
          relatedQuestion="这是一个演示问题"
        />
      )}

      {activeModal === "shareCard" && (
        <ShareCardModal
          isOpen={true}
          onClose={closeModal}
          question="演示问题"
          answer="演示回答"
          inviteCode="YJ12345"
        />
      )}

      {activeModal === "logout" && (
        <LogoutModal onClose={closeModal} onConfirm={closeModal} />
      )}

      {activeModal === "clearCache" && (
        <ClearCacheModal 
          onClose={closeModal} 
          onConfirm={closeModal}
          cacheCleared={false}
        />
      )}

      {activeModal === "globalFeedback" && (
        <FeedbackModal isOpen={true} onClose={closeModal} />
      )}

      {activeModal === "helpFeedback" && (
        <HelpFeedbackModal onClose={closeModal} />
      )}

      {/* 复制成功 Toast */}
      {showCopyToast && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          <div className="rounded-lg bg-gray-900/80 px-4 py-2 text-sm text-white">
            复制成功
          </div>
        </div>
      )}

      {/* 点赞成功 Toast */}
      {showLikeToast && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          <div className="rounded-lg bg-gray-900/80 px-4 py-2 text-sm text-white">
            感谢您的反馈
          </div>
        </div>
      )}
    </div>
  )
}
