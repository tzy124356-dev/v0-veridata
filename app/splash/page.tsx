"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashPage() {
  const router = useRouter()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // 1.5秒后开始淡出
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1500)

    // 2秒后跳转到登录页
    const redirectTimer = setTimeout(() => {
      router.push("/login")
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1e40af] to-[#3b82f6] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo 区域 */}
      <div className="mb-8 flex items-center justify-center">
        {/* 像素风格螃蟹 Logo */}
        <div className="relative h-24 w-24">
          <svg
            viewBox="0 0 64 64"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 螃蟹身体 - 像素风格 */}
            <rect x="20" y="24" width="24" height="16" fill="white" />
            <rect x="16" y="28" width="4" height="8" fill="white" />
            <rect x="44" y="28" width="4" height="8" fill="white" />
            {/* 眼睛 */}
            <rect x="24" y="20" width="4" height="4" fill="white" />
            <rect x="36" y="20" width="4" height="4" fill="white" />
            <rect x="25" y="21" width="2" height="2" fill="#1e40af" />
            <rect x="37" y="21" width="2" height="2" fill="#1e40af" />
            {/* 钳子 */}
            <rect x="8" y="24" width="8" height="4" fill="white" />
            <rect x="8" y="28" width="4" height="8" fill="white" />
            <rect x="48" y="24" width="8" height="4" fill="white" />
            <rect x="52" y="28" width="4" height="8" fill="white" />
            {/* 腿 */}
            <rect x="22" y="40" width="4" height="6" fill="white" />
            <rect x="30" y="40" width="4" height="8" fill="white" />
            <rect x="38" y="40" width="4" height="6" fill="white" />
          </svg>
        </div>
      </div>

      {/* 品牌名称 */}
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-wider text-white">械研</h1>
        <p className="mt-1 text-sm tracking-widest text-white/80">VERIDATA</p>
      </div>

      {/* 分割线 */}
      <div
        className="my-6 h-px w-16"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Slogan */}
      <p className="text-lg font-medium tracking-wide text-white/90">
        让 AI 有据而行
      </p>

      {/* 底部加载指示器 */}
      <div className="absolute bottom-20 flex items-center gap-2">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  )
}
