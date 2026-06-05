"use client"

import { useState } from "react"
import { RoomType, DesignStyle } from "@/types"
import { ROOM_TYPES, DESIGN_STYLES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

interface StyleSelectorProps {
  onGenerate: (roomType: RoomType, style: DesignStyle) => void
  isLoading: boolean
}

export function StyleSelector({ onGenerate, isLoading }: StyleSelectorProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null)

  const handleGenerate = () => {
    if (selectedRoom && selectedStyle) {
      onGenerate(selectedRoom, selectedStyle)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-700">Room Type</p>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((room) => (
            <button
              key={room.value}
              onClick={() => setSelectedRoom(room.value)}
              className={cn(
                "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                selectedRoom === room.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              )}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-700">Design Style</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DESIGN_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all",
                selectedStyle === style.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              <p className={cn("font-medium", selectedStyle === style.value ? "text-indigo-700" : "text-zinc-900")}>
                {style.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={!selectedRoom || !selectedStyle || isLoading}
        className="w-full gap-2"
      >
        <Zap className="h-4 w-4" />
        {isLoading ? "Generating..." : "Generate Staged Image — 1 Credit"}
      </Button>
    </div>
  )
}
