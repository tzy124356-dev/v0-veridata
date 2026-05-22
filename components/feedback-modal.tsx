"use client"

import { useState } from "react"
import { X, Send, Check, AlertCircle, Lightbulb, HelpCircle, FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

// 反馈类型
const feedbackTypes = [
  { id: "inaccurate", label: "回答不准确", icon: AlertCircle },
  { id: "missing", label: "知识库内容缺失", icon: FileQuestion },
  { id: "suggestion", label: "功能建议", icon: Lightbulb },
  { id: "other", label: "其他", icon: HelpCircle },
]

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { type: string; content: string }) => void
  relatedQuestion?: string
}

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  relatedQuestion,
}: FeedbackModalProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return

    setIsSubmitting(true)
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)

    onSubmit({ type: selectedType, content })

    // 延迟关闭
    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedType("")
      setContent("")
      onClose()
    }, 2000)
  }

  const canSubmit = selectedType !== "" && content.trim() !== ""

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background">
          {/* 拖拽指示条 */}
          <div className="sticky top-0 flex justify-center bg-background py-3">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="px-6 pb-8">
            {isSubmitted ? (
              <SubmittedState />
            ) : (
              <>
                {/* 头部 */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    提交反馈
                  </h2>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/50"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* 关联问题 */}
                {relatedQuestion && (
                  <div className="mb-6 rounded-xl bg-secondary/50 p-4">
                    <p className="mb-1 text-xs text-muted-foreground">关联问题</p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {relatedQuestion}
                    </p>
                  </div>
                )}

                {/* 反馈类型 */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    反馈类型
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl p-3 text-left transition-all active:scale-[0.98]",
                          selectedType === type.id
                            ? "bg-[#2d61d3] text-white"
                            : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                        )}
                      >
                        <type.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 反馈内容 */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    详细描述
                  </h3>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请详细描述你遇到的问题或建议..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-border bg-secondary/30 p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background"
                  />
                </div>

                {/* 奖励说明 */}
                <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    你的反馈一旦被采纳，或提交的知识库缺失内容被补充入库，均可获得械研积分奖励，积分可在小程序积分中心查看使用。
                  </p>
                </div>

                {/* 提交按钮 */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all",
                    canSubmit && !isSubmitting
                      ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white hover:opacity-90 active:scale-[0.98]"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      提交反馈
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// 提交成功状态
function SubmittedState() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <Check className="h-8 w-8 text-green-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">反馈已提交</h3>
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        你的反馈已进入械研审核队列
        <br />
        我们将认真评估，采纳后第一时间通知你
        <br />
        并赠送积分奖励
      </p>
    </div>
  )
}
