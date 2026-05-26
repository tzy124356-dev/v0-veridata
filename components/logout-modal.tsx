"use client"

import { Trash2, Database, LogOut } from "lucide-react"

interface ClearCacheModalProps {
  onClose: () => void
  onConfirm: () => void
  cacheCleared: boolean
}

export function ClearCacheModal({ onClose, onConfirm, cacheCleared }: ClearCacheModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white">
        {cacheCleared ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">缓存已清除</p>
          </div>
        ) : (
          <>
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e40af]/10">
                <Trash2 className="h-6 w-6 text-[#1e40af]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                清除缓存
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                确定要清除所有缓存数据吗？这不会删除您的账号及自建知识库数据。
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                取消
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={onConfirm}
                className="flex-1 py-3 text-sm font-medium text-[#1e40af] transition-colors hover:bg-[#1e40af]/5"
              >
                确定
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface LogoutModalProps {
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ onClose, onConfirm }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white">
        <div className="p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            退出登录
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            确定要退出当前账号吗？
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            取消
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            退出
          </button>
        </div>
      </div>
    </div>
  )
}
