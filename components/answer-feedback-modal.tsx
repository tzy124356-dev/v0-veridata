"use client"

import { useState } from "react"
import { X, Send, Check, AlertCircle, FileQuestion, FileText, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// 反馈类型
const feedbackTypes = [
  { id: "inaccurate", label: "回答不准确", icon: AlertCircle },
  { id: "wrong-regulation", label: "引用法规有误", icon: FileQuestion },
  { id: "incomplete", label: "内容不完整", icon: FileText },
  { id: "other", label: "其他问题", icon: HelpCircle },
]

interface AnswerFeedbackModalProps {
  onClose: () => void
  onSubmit?: (data: { type: string; content: string }) => void
  relatedQuestion?: string
}

export function AnswerFeedbackModal({
  onClose,
  onSubmit,
  relatedQuestion,
}: AnswerFeedbackModalProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)

    if (onSubmit) {
      onSubmit({ type: selectedType, content })
    }

    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedType("")
      setContent("")
      onClose()
    }, 2000)
  }

  const canSubmit = selectedType !== "" && content.trim() !== ""

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[85vh] flex-col rounded-t-3xl bg-background animate-in slide-in-from-bottom duration-300">
        {/* 拖拽指示条 */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* 可滚动内容区 */}
        <div className="flex-1 overflow-y-auto px-6">
          {isSubmitted ? (
            <SubmittedState />
          ) : (
            <>
              {/* 头部 */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  问题反馈
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
                <div className="mb-4 rounded-xl bg-secondary/50 p-3">
                  <p className="mb-1 text-xs text-muted-foreground">关联问题</p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {relatedQuestion}
                  </p>
                </div>
              )}

              {/* 反馈类型 */}
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">
                  反馈类型
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl p-2.5 text-left transition-all active:scale-[0.98]",
                        selectedType === type.id
                          ? "bg-[#2d61d3] text-white"
                          : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                      )}
                    >
                      <type.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 反馈内容 */}
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">
                  详细描述
                </h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请详细描述你遇到的问题或建议..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/30 p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background"
                />
              </div>

              {/* 奖励说明 */}
              <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  反馈被采纳或知识库内容被补充，可获得械研积分奖励。
                </p>
              </div>
            </>
          )}
        </div>

        {/* 固定底部提交按钮 */}
        {!isSubmitted && (
          <div className="border-t border-border bg-background px-6 py-4 pb-safe">
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
          </div>
        )}
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
