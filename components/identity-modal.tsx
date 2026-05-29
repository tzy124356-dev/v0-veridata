"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { positionOptions, fieldOptions } from "@/lib/identity-options"

interface IdentityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    position: string
    fields: string[]
    customPosition?: string
    customField?: string
  }) => void
  initialPosition?: string
  initialFields?: string[]
  initialCustomPosition?: string
  initialCustomField?: string
}

export function IdentityModal({
  isOpen,
  onClose,
  onSubmit,
  initialPosition,
  initialFields,
  initialCustomPosition,
  initialCustomField,
}: IdentityModalProps) {
  const [position, setPosition] = useState<string>(initialPosition ?? "")
  const [selectedFields, setSelectedFields] = useState<string[]>(initialFields ?? [])
  const [customPosition, setCustomPosition] = useState<string>(initialCustomPosition ?? "")
  const [customField, setCustomField] = useState<string>(initialCustomField ?? "")

  // 弹窗打开时重置为最新 initial 值
  useEffect(() => {
    if (isOpen) {
      setPosition(initialPosition ?? "")
      setSelectedFields(initialFields ?? [])
      setCustomPosition(initialCustomPosition ?? "")
      setCustomField(initialCustomField ?? "")
    }
  }, [isOpen, initialPosition, initialFields, initialCustomPosition, initialCustomField])

  const isEditMode = !!initialPosition

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const positionIsOther = position === "other"
  const fieldHasOther = selectedFields.includes("other")

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      position,
      fields: selectedFields,
      customPosition: positionIsOther ? customPosition.trim() : undefined,
      customField: fieldHasOther ? customField.trim() : undefined,
    })
    onClose()
  }

  // 选了职位；若职位为其他需填写；若领域含其他需填写
  const canSubmit =
    position !== "" &&
    (!positionIsOther || customPosition.trim() !== "") &&
    (!fieldHasOther || customField.trim() !== "")

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
        <div className="flex max-h-[88vh] flex-col rounded-t-3xl bg-background">
          {/* 拖拽指示条 */}
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          {/* 头部 */}
          <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-3">
            <h2 className="text-lg font-semibold text-foreground">
              {isEditMode ? "修改身份信息" : "完善你的身份信息"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/50"
              aria-label="关闭"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* 可滚动内容区 */}
          <div className="flex-1 overflow-y-auto px-6">
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
                        ? "bg-[#1e40af] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {positionIsOther && (
                <input
                  type="text"
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  placeholder="请输入你的具体职位"
                  maxLength={20}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1e40af] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1e40af]"
                />
              )}
            </div>

            {/* 关注领域 - 多选 */}
            <div className="mb-6">
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
                        ? "bg-[#1e40af] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {selectedFields.includes(option.id) && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
              {fieldHasOther && (
                <input
                  type="text"
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  placeholder="请输入你关注的具体领域"
                  maxLength={30}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1e40af] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1e40af]"
                />
              )}
            </div>
          </div>

          {/* 底部操作区 */}
          <div className="shrink-0 border-t border-gray-100 px-6 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm font-medium transition-all",
                canSubmit
                  ? "bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white hover:opacity-90 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              完成
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full py-1 text-center text-sm text-gray-400 hover:text-gray-600"
            >
              暂不填写，之后可在"我的"中修改
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
