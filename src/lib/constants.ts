import { RoomType, DesignStyle } from "@/types"

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "dining_room", label: "Dining Room" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
]

export const DESIGN_STYLES: { value: DesignStyle; label: string; description: string }[] = [
  { value: "modern", label: "Modern", description: "Clean lines, minimal ornamentation" },
  { value: "minimalist", label: "Minimalist", description: "Less is more, functional beauty" },
  { value: "scandinavian", label: "Scandinavian", description: "Light, natural, cozy" },
  { value: "luxury", label: "Luxury", description: "Premium materials, elegant finishes" },
  { value: "bohemian", label: "Bohemian", description: "Eclectic, colorful, artistic" },
  { value: "traditional", label: "Traditional", description: "Classic, timeless elegance" },
  { value: "industrial", label: "Industrial", description: "Raw materials, urban feel" },
]

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 3,
    features: ["3 free credits", "Basic virtual staging", "Web quality download"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 19,
    credits: 20,
    features: ["20 credits/month", "All AI features", "High-res download", "Project history"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    credits: 100,
    features: ["100 credits/month", "All AI features", "Batch processing", "Priority queue", "Before/after comparison"],
  },
  {
    id: "agency",
    name: "Agency",
    price: 149,
    credits: -1,
    features: ["Unlimited credits", "All AI features", "API access", "White-label option", "Dedicated support"],
  },
]

export const CREDIT_COSTS: Record<string, number> = {
  virtual_staging: 1,
  furniture_removal: 1,
  twilight: 1,
  sky_replacement: 1,
  enhancement: 1,
  item_removal: 1,
}
