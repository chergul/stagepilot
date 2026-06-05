"use client"

import { useState, useRef } from "react"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeAfterProps {
  beforeUrl: string
  afterUrl: string
}

export function BeforeAfter({ beforeUrl, afterUrl }: BeforeAfterProps) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100)
    setSliderPos(pos)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    updateSlider(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX)
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-xl cursor-col-resize"
        style={{ aspectRatio: "4/3" }}
        onMouseMove={handleMouseMove}
        onMouseDown={() => { isDragging.current = true }}
        onMouseUp={() => { isDragging.current = false }}
        onMouseLeave={() => { isDragging.current = false }}
        onTouchMove={handleTouchMove}
      >
        <img src={afterUrl} alt="After" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          <img src={beforeUrl} alt="Before" className="h-full object-cover" style={{ width: containerRef.current?.offsetWidth }} />
        </div>

        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl">
            <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>

        <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Before
        </div>
        <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          After
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" asChild>
          <a href={afterUrl} download="staged-image.jpg">
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
