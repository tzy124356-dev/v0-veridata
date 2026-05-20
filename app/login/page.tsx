"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Lock, Eye, EyeOff, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"phone" | "password">("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(false)

  const handleSendCode = () => {
    if (countdown > 0 || !phone) return
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogin = () => {
    if (!agreed) return
    // 模拟登录
    router.push("/")
  }

  const isPhoneValid = phone.length === 11
  const isCodeValid = code.length === 6
  const isPasswordValid = password.length >= 6
  const canLogin =
    agreed &&
    (loginMethod === "phone"
      ? isPhoneValid && isCodeValid
      : isPhoneValid && isPasswordValid)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 深蓝渐变头部 */}
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#2563eb] px-5 pt-12 pb-16">
        <header className="mb-8 flex items-center">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
        </header>

        {/* 品牌区域 */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">械</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">欢迎使用械研</h1>
          <p className="text-sm text-white/70">医疗器械注册，让每一步都有据可查</p>
        </div>
      </div>

      {/* 白色内容区域 */}
      <main className="-mt-6 flex-1 rounded-t-3xl bg-background px-5 py-8">
        {/* 登录方式切换 */}
        <div className="mb-6 flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => setLoginMethod("phone")}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
              loginMethod === "phone"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            验证码登录
          </button>
          <button
            onClick={() => setLoginMethod("password")}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
              loginMethod === "password"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            密码登录
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          {/* 手机号输入 */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 11))}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {loginMethod === "phone" ? (
            /* 验证码输入 */
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSendCode}
                disabled={!isPhoneValid || countdown > 0}
                className={cn(
                  "shrink-0 text-sm font-medium transition-colors",
                  isPhoneValid && countdown === 0
                    ? "text-[#1e40af]"
                    : "text-muted-foreground"
                )}
              >
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
              </button>
            </div>
          ) : (
            /* 密码输入 */
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* 忘记密码 */}
        {loginMethod === "password" && (
          <div className="mt-3 text-right">
            <Link href="/forgot-password" className="text-sm text-[#1e40af]">
              忘记密码？
            </Link>
          </div>
        )}

        {/* 用户协议 */}
        <div className="mt-6 flex items-start gap-3">
          <button
            onClick={() => setAgreed(!agreed)}
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
              agreed
                ? "border-[#1e40af] bg-[#1e40af]"
                : "border-muted-foreground"
            )}
          >
            {agreed && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            我已阅读并同意
            <Link href="/terms" className="text-[#1e40af]">
              《用户服务协议》
            </Link>
            和
            <Link href="/privacy" className="text-[#1e40af]">
              《隐私政策》
            </Link>
          </p>
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          disabled={!canLogin}
          className={cn(
            "mt-8 w-full rounded-xl py-3.5 text-sm font-medium transition-all",
            canLogin
              ? "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white active:scale-[0.98]"
              : "bg-secondary text-muted-foreground"
          )}
        >
          登录
        </button>

        {/* 注册入口 */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          还没有账号？
          <Link href="/register" className="font-medium text-[#1e40af]">
            立即注册
          </Link>
        </p>
      </main>
    </div>
  )
}
