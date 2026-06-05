"use client"

import { AnalysisResult } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sofa, Wand2, MousePointer, ArrowRight } from "lucide-react"

interface AnalysisResultProps {
  result: AnalysisResult
  onAutoRemove: () => void
  onManualRemove: () => void
  onKeepFurniture: () => void
}

export function AnalysisResultCard({ result, onAutoRemove, onManualRemove, onKeepFurniture }: AnalysisResultProps) {
  const qualityLabel = result.qualityScore >= 80 ? "Excellent" : result.qualityScore >= 60 ? "Good" : "Low"
  const qualityVariant = result.qualityScore >= 80 ? "success" : result.qualityScore >= 60 ? "default" : "warning"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-2.5">
          <span className="text-sm text-zinc-500">Room</span>
          <Badge>{result.roomType.replace("_", " ")}</Badge>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-2.5">
          <span className="text-sm text-zinc-500">Quality</span>
          <Badge variant={qualityVariant}>{qualityLabel} ({result.qualityScore}%)</Badge>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-2.5">
          <span className="text-sm text-zinc-500">Light</span>
          <Badge variant="secondary">{result.lightCondition}</Badge>
        </div>
      </div>

      {result.furnitureDetected && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-3">
              <Sofa className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">
                  {result.furnitureCount} furniture item{result.furnitureCount !== 1 ? "s" : ""} detected
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {result.furnitureItems.join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-700">How do you want to handle existing furniture?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={onAutoRemove}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-indigo-50 p-5 text-center transition-all hover:border-indigo-300 hover:bg-indigo-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white group-hover:bg-indigo-700">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Auto Remove</p>
              <p className="mt-1 text-xs text-zinc-500">AI removes all furniture automatically</p>
            </div>
          </button>

          <button
            onClick={onManualRemove}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-zinc-50 p-5 text-center transition-all hover:border-zinc-300 hover:bg-zinc-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-700 text-white group-hover:bg-zinc-800">
              <MousePointer className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Manual Select</p>
              <p className="mt-1 text-xs text-zinc-500">Click to select items to remove</p>
            </div>
          </button>

          <button
            onClick={onKeepFurniture}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-zinc-50 p-5 text-center transition-all hover:border-zinc-300 hover:bg-zinc-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white group-hover:bg-emerald-700">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Keep Furniture</p>
              <p className="mt-1 text-xs text-zinc-500">Stage on top of existing items</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
