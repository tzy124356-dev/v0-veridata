"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { FeedbackModal } from "@/components/feedback-modal"

export function FeedbackFab() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })
  const startOffset = useRef({ x: 0, y: 0 })

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setHasMoved(false)
    startPos.current = { x: clientX, y: clientY }
    startOffset.current = { x: position.x, y: position.y }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    
    const deltaX = clientX - startPos.current.x
    const deltaY = clientY - startPos.current.y
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setHasMoved(true)
    }
    
    const newX = startOffset.current.x + deltaX
    const newY = startOffset.current.y + deltaY
    
    const maxX = typeof window !== "undefined" ? window.innerWidth - 60 : 300
    const maxY = typeof window !== "undefined" ? window.innerHeight - 180 : 500
    
    setPosition({
      x: Math.max(-maxX + 60, Math.min(0, newX)),
      y: Math.max(-maxY + 60, Math.min(0, newY)),
    })
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!hasMoved) {
      setShowModal(true)
    }
  }

  // 监听全局鼠标事件
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseUp = () => handleEnd()

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [isDragging])

  return (
    <>
      <div
        className={cn(
          "fixed right-4 bottom-[100px] z-40 flex h-[52px] w-[52px] cursor-grab flex-col items-center justify-center rounded-full border-[3px] border-white text-white shadow-xl select-none",
          isDragging && "cursor-grabbing"
        )}
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35), 0 2px 6px rgba(0,0,0,0.12)',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 200ms',
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          handleStart(touch.clientX, touch.clientY)
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0]
          handleMove(touch.clientX, touch.clientY)
        }}
        onTouchEnd={handleEnd}
        onClick={handleClick}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="mt-0.5 text-[9px] leading-none">反馈</span>
      </div>
      <FeedbackModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
