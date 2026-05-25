"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuthGuard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("wechat_logged_in") === "true"
      setIsLoggedIn(loggedIn)
      setIsChecking(false)
      
      if (!loggedIn) {
        router.replace("/login")
      }
    }
  }, [router])

  return { isLoggedIn, isChecking }
}

// 退出登录时清除所有登录相关的 localStorage
export function clearAuthStorage() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wechat_logged_in")
    localStorage.removeItem("user_points")
    localStorage.removeItem("user_invite_code")
    localStorage.removeItem("user_identity")
    localStorage.removeItem("identity_modal_shown")
    localStorage.removeItem("knowledge_modal_shown")
    localStorage.removeItem("first_feedback_done")
    localStorage.removeItem("first_feedback_value")
  }
}
