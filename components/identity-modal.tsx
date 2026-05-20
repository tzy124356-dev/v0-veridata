"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// 职位方向选项
const positionOptions = [
  { id: "engineer", label: "注册工程师" },
  { id: "specialist", label: "注册专员" },
  { id: "regulatory", label: "法规事务" },
  { id: "entrepreneur", label: "企业主/创业者" },
  { id: "other", label: "其他" },
]

// 关注领域选项
const fieldOptions = [
  { id: "aesthetics", label: "医美针剂" },
  { id: "device", label: "医疗器械（其他品类）" },
  { id: "ivd", label: "体外诊断试剂" },
  { id: "other", label: "其他" },
]

interface IdentityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { position: string; fields: string[] }) => void
}

export function IdentityModal({ isOpen, onClose, onSubmit }: IdentityModalProps) {
  const [position, setPosition] = useState<string>("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleSubmit = () => {
    if (position) {
      onSubmit({ position, fields: selectedFields })
      onClose()
    }
  }

  const canSubmit = position !== ""

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
        <div className="rounded-t-3xl bg-background">
          {/* 拖拽指示条 */}
          <div className="flex justify-center py-3">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="px-6 pb-8">
            {/* 头部 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                完善你的身份信息
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/50"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* 职位方向 - 单选 */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">
                你的职位方向
                <span className="ml-1 text-xs text-muted-foreground">（单选）</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {positionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPosition(option.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition-all active:scale-95",
                      position === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 关注领域 - 多选 */}
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-medium text-foreground">
                主要关注领域
                <span className="ml-1 text-xs text-muted-foreground">（可多选）</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {fieldOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFieldToggle(option.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all active:scale-95",
                      selectedFields.includes(option.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    )}
                  >
                    {selectedFields.includes(option.id) && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm font-medium transition-all",
                canSubmit
                  ? "gradient-accent text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              完成
            </button>

            {/* 跳过提示 */}
            <button
              onClick={onClose}
              className="mt-3 w-full py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              暂不填写，之后可在"我的"中修改
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
