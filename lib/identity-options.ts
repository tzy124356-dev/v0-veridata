export const positionOptions = [
  { id: "engineer", label: "注册工程师" },
  { id: "specialist", label: "注册专员" },
  { id: "regulatory", label: "法规事务" },
  { id: "entrepreneur", label: "企业主/创业者" },
  { id: "other", label: "其他" },
]

export const fieldOptions = [
  { id: "aesthetics", label: "医美针剂" },
  { id: "device", label: "医疗器械（其他品类）" },
  { id: "ivd", label: "体外诊断试剂" },
  { id: "other", label: "其他" },
]

export interface UserIdentity {
  position: string
  fields: string[]
}

export function getPositionLabel(id: string): string {
  return positionOptions.find((o) => o.id === id)?.label ?? "未设置"
}

export function getFieldLabels(ids: string[]): string[] {
  return ids
    .map((id) => fieldOptions.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[]
}

// 从 localStorage 读身份，加 SSR 守卫
export function readUserIdentity(): UserIdentity | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("user_identity")
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeUserIdentity(data: UserIdentity): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user_identity", JSON.stringify(data))
}
