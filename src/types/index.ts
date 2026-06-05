export type RoomType = "living_room" | "bedroom" | "kitchen" | "bathroom" | "dining_room" | "office" | "other"

export type DesignStyle = "modern" | "minimalist" | "scandinavian" | "luxury" | "bohemian" | "traditional" | "industrial"

export type ColorPalette = "neutral" | "warm" | "cool" | "colorful"

export type ProjectStatus = "pending" | "analyzing" | "removing" | "staging" | "completed" | "failed"

export type ProcessType = "virtual_staging" | "furniture_removal" | "twilight" | "sky_replacement" | "enhancement" | "item_removal"

export interface Project {
  id: string
  userId: string
  name: string
  status: ProjectStatus
  roomType?: RoomType
  designStyle?: DesignStyle
  originalImageUrl: string
  emptyRoomImageUrl?: string
  stagedImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  type: "purchase" | "usage" | "refund"
  processType?: ProcessType
  projectId?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  credits: number
  plan: "free" | "starter" | "pro" | "agency"
  createdAt: string
}

export interface AnalysisResult {
  roomType: RoomType
  furnitureDetected: boolean
  furnitureCount: number
  furnitureItems: string[]
  lightCondition: "bright" | "normal" | "dark"
  qualityScore: number
}
