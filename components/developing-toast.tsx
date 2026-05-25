"use client"

interface DevelopingToastProps {
  message?: string
}

export function DevelopingToast({ message = "该功能正在开发中" }: DevelopingToastProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="rounded-xl bg-gray-800/90 px-6 py-3 text-sm text-white shadow-lg">
        {message}
      </div>
    </div>
  )
}
