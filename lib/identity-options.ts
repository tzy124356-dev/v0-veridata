export const positionOptions = [
  { id: "regulatory", label: "法规注册" },
  { id: "rnd", label: "器械研发" },
  { id: "quality", label: "质量管理" },
  { id: "clinical", label: "临床医学" },
  { id: "consulting", label: "咨询与服务机构" },
  { id: "management", label: "企业管理者" },
  { id: "testing", label: "检测与认证机构" },
  { id: "other", label: "其他" },
]

export const fieldOptions = [
  { id: "aesthetics", label: "医疗美容" },
  { id: "energy", label: "能量外科平台" },
  { id: "ortho", label: "骨科与运动医学" },
  { id: "vascular", label: "血管/非血管植介入" },
  { id: "ophthalmology", label: "眼科" },
  { id: "dental", label: "口腔" },
  { id: "rehab", label: "康复器械" },
  { id: "reproduction", label: "妇产与辅助生殖" },
  { id: "imaging", label: "医用成像器械" },
  { id: "software", label: "医疗软件/AI" },
  { id: "ivd", label: "体外诊断" },
  { id: "other", label: "其他" },
]

export interface UserIdentity {
  position: string
  fields: string[]
  customPosition?: string
  customField?: string
}

export function getPositionLabel(id: string, customPosition?: string): string {
  if (id === "other") return customPosition?.trim() || "其他"
  return positionOptions.find((o) => o.id === id)?.label ?? "未设置"
}

export function getFieldLabels(ids: string[], customField?: string): string[] {
  return ids
    .map((id) => {
      if (id === "other") return customField?.trim() || "其他"
      return fieldOptions.find((o) => o.id === id)?.label
    })
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
