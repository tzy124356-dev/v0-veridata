"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
      {/* Logo 区域 - 使用首页相同的 crab-logo.png */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative h-32 w-32">
          <Image
            src="/crab-logo.png"
            alt="械研 Logo"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
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
