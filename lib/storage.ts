// localStorage 持久化存储工具

export interface FavoriteItem {
  id: string
  messageId: string
  question: string
  answer: string // conclusion
  source?: string // legalBasis[0].title
  reasoning?: string
  savedTime: string
}

export interface HistoryItem {
  id: string
  question: string
  answerSummary: string
  source?: string
  createdAt: string
  messages?: Array<{
    id: string
    type: "user" | "assistant"
    content: string
    conclusion?: string
    reasoning?: string[]
    legalBasis?: Array<{
      title: string
      clause: string
      content: string
      url?: string
    }>
  }>
}

export interface FeedbackItem {
  id: string
  type: string
  content: string
  relatedQuestion?: string
  createdAt: string
}

const FAVORITES_KEY = "veridata_favorites"
const HISTORY_KEY = "veridata_history"
const FEEDBACKS_KEY = "veridata_feedbacks"

// ============ Favorites ============

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addFavorite(item: FavoriteItem): void {
  if (typeof window === "undefined") return
  try {
    const favorites = getFavorites()
    // 避免重复添加
    if (!favorites.some(f => f.messageId === item.messageId)) {
      favorites.unshift(item)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  } catch (e) {
    console.error("Failed to add favorite:", e)
  }
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return
  try {
    const favorites = getFavorites()
    const filtered = favorites.filter(f => f.id !== id)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error("Failed to remove favorite:", e)
  }
}

export function removeFavoriteByMessageId(messageId: string): void {
  if (typeof window === "undefined") return
  try {
    const favorites = getFavorites()
    const filtered = favorites.filter(f => f.messageId !== messageId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error("Failed to remove favorite:", e)
  }
}

export function isFavorited(messageId: string): boolean {
  if (typeof window === "undefined") return false
  const favorites = getFavorites()
  return favorites.some(f => f.messageId === messageId)
}

export function getFavoriteById(id: string): FavoriteItem | undefined {
  const favorites = getFavorites()
  return favorites.find(f => f.id === id)
}

// ============ History ============

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addHistory(item: HistoryItem): void {
  if (typeof window === "undefined") return
  try {
    const history = getHistory()
    // 最多保留 50 条历史
    if (history.length >= 50) {
      history.pop()
    }
    history.unshift(item)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (e) {
    console.error("Failed to add history:", e)
  }
}

export function removeHistory(id: string): void {
  if (typeof window === "undefined") return
  try {
    const history = getHistory()
    const filtered = history.filter(h => h.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
  } catch (e) {
    console.error("Failed to remove history:", e)
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (e) {
    console.error("Failed to clear history:", e)
  }
}

export function getHistoryById(id: string): HistoryItem | undefined {
  const history = getHistory()
  return history.find(h => h.id === id)
}

// ============ Feedbacks ============

export function getFeedbacks(): FeedbackItem[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(FEEDBACKS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addFeedback(item: FeedbackItem): void {
  if (typeof window === "undefined") return
  try {
    const feedbacks = getFeedbacks()
    feedbacks.unshift(item)
    localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(feedbacks))
  } catch (e) {
    console.error("Failed to add feedback:", e)
  }
}

// ============ Demo Data ============

export function loadDemoFavorites(): void {
  if (typeof window === "undefined") return
  const demoFavorites: FavoriteItem[] = [
    {
      id: "demo-fav-1",
      messageId: "demo-msg-1",
      question: "医美注射类产品需要什么资质？",
      answer: "医美注射类产品（如玻尿酸填充剂）在中国按第三类医疗器械管理，需要向国家药品监督管理局（NMPA）申请注册。",
      source: "《医疗器械监督管理条例》",
      reasoning: "根据《医疗器械分类目录》，注射用交联透明质酸钠凝胶属于13-09-02类别，管理类别为III类。",
      savedTime: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "demo-fav-2",
      messageId: "demo-msg-2",
      question: "医疗器械临床试验需要多少例？",
      answer: "临床试验样本量需根据产品特性、预期用途、统计学要求等因素综合确定，一般III类器械需要更大样本量。",
      source: "《医疗器械临床试验质量管理规范》",
      savedTime: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "demo-fav-3",
      messageId: "demo-msg-3",
      question: "进口医疗器械如何在中国注册？",
      answer: "进口医疗器械需通过境内代理人向NMPA申请注册，提交产品技术资料、临床评价资料、质量管理体系文件等。",
      source: "《医疗器械注册与备案管理办法》",
      savedTime: new Date(Date.now() - 259200000).toISOString(),
    },
  ]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(demoFavorites))
}

export function loadDemoHistory(): void {
  if (typeof window === "undefined") return
  const demoHistory: HistoryItem[] = [
    {
      id: "demo-hist-1",
      question: "医美注射类产品需要什么资质？",
      answerSummary: "医美注射类产品在中国按第三类医疗器械管理...",
      source: "官方知识库",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        { id: "u1", type: "user", content: "医美注射类产品需要什么资质？" },
        { 
          id: "a1", 
          type: "assistant", 
          content: "医美注射类产品（如玻尿酸填充剂）在中国按第三类医疗器械管理，需要向国家药品监督管理局（NMPA）申请注册。",
          conclusion: "医美注射类产品（如玻尿酸填充剂）在中国按第三类医疗器械管理，需要向国家药品监督管理局（NMPA）申请注册。",
          reasoning: ["根据《医疗器械监督管理条例》第十三条，第三类医疗器械实行产品注册管理", "玻尿酸填充剂属于植入人体的高风险医疗器械"],
          legalBasis: [{ title: "《医疗器械监督管理条例》", clause: "第十三条", content: "第三类医疗器械实行产品注册管理。", url: "https://www.nmpa.gov.cn" }]
        }
      ]
    },
    {
      id: "demo-hist-2",
      question: "什么是医疗器械的分类管理？",
      answerSummary: "医疗器械按风险程度分为一类、二类、三类...",
      source: "官方知识库",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        { id: "u2", type: "user", content: "什么是医疗器械的分类管理？" },
        { 
          id: "a2", 
          type: "assistant", 
          content: "医疗器械按风险程度分为一类、二类、三类，分别实行备案管理、注册管理和注册管理。",
          conclusion: "医疗器械按风险程度分为一类、二类、三类管理。",
        }
      ]
    },
    {
      id: "demo-hist-3",
      question: "医疗器械注册证有效期是多久？",
      answerSummary: "医疗器械注册证有效期为5年...",
      source: "官方知识库",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "demo-hist-4",
      question: "如何申请医疗器械生产许可证？",
      answerSummary: "申请医疗器械生产许可证需要具备相应的生产条件...",
      source: "官方知识库",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "demo-hist-5",
      question: "医疗器械不良事件如何报告？",
      answerSummary: "医疗器械不良事件应通过国家医疗器械不良事件监测信息系统报告...",
      source: "官方知识库",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ]
  localStorage.setItem(HISTORY_KEY, JSON.stringify(demoHistory))
}
