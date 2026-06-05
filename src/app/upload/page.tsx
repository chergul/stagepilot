"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Dropzone } from "@/components/upload/dropzone"
import { AnalysisResultCard } from "@/components/staging/analysis-result"
import { StyleSelector } from "@/components/staging/style-selector"
import { BeforeAfter } from "@/components/staging/before-after"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnalysisResult, RoomType, DesignStyle } from "@/types"
import { CheckCircle2, Loader2, ArrowRight, RotateCcw, Download } from "lucide-react"

type Step = "upload" | "analyzing" | "furniture_decision" | "removing" | "empty_room_preview" | "style_select" | "generating" | "result"

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "furniture_decision", label: "Furniture" },
  { id: "empty_room_preview", label: "Empty Room" },
  { id: "style_select", label: "Style" },
  { id: "result", label: "Result" },
]

const stepIndex: Record<Step, number> = {
  upload: 0,
  analyzing: 0,
  furniture_decision: 1,
  removing: 1,
  empty_room_preview: 2,
  style_select: 3,
  generating: 4,
  result: 4,
}

export default function UploadPage() {
  const [step, setStep] = useState<Step>("upload")
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [emptyRoomImage, setEmptyRoomImage] = useState<string | null>(null)
  const [stagedImage, setStagedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")

  const handleFileSelected = async (file: File) => {
    const url = URL.createObjectURL(file)
    setOriginalImage(url)
    setStep("analyzing")
    setProgress(20)
    setStatusText("Analyzing your photo...")

    await new Promise((r) => setTimeout(r, 2000))
    setProgress(100)

    const mockAnalysis: AnalysisResult = {
      roomType: "living_room",
      furnitureDetected: true,
      furnitureCount: 5,
      furnitureItems: ["sofa", "coffee table", "armchair", "lamp", "bookshelf"],
      lightCondition: "bright",
      qualityScore: 87,
    }
    setAnalysis(mockAnalysis)
    setStep("furniture_decision")
    setProgress(0)
  }

  const handleAutoRemove = async () => {
    setStep("removing")
    setProgress(10)
    setStatusText("Detecting furniture masks...")
    await new Promise((r) => setTimeout(r, 1000))
    setProgress(40)
    setStatusText("Removing furniture...")
    await new Promise((r) => setTimeout(r, 1500))
    setProgress(80)
    setStatusText("Reconstructing surfaces...")
    await new Promise((r) => setTimeout(r, 1000))
    setProgress(100)
    // Mock empty room — replace with real API result
    setEmptyRoomImage(originalImage)
    setStep("empty_room_preview")
    setProgress(0)
  }

  const handleKeepFurniture = () => {
    setEmptyRoomImage(originalImage)
    setStep("style_select")
  }

  const handleGenerate = async (roomType: RoomType, style: DesignStyle) => {
    setStep("generating")
    setProgress(10)
    setStatusText("Preparing your room...")
    await new Promise((r) => setTimeout(r, 1000))
    setProgress(50)
    setStatusText(`Staging with ${style} furniture...`)
    await new Promise((r) => setTimeout(r, 2000))
    setProgress(90)
    setStatusText("Finalizing details...")
    await new Promise((r) => setTimeout(r, 1000))
    setProgress(100)
    // Mock result — replace with real Replicate/Fal.ai response
    setStagedImage(originalImage)
    setStep("result")
    setProgress(0)
  }

  const currentStepIndex = stepIndex[step]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                i < currentStepIndex
                  ? "bg-indigo-600 text-white"
                  : i === currentStepIndex
                  ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400"
                  : "bg-zinc-200 text-zinc-400"
              }`}>
                {i < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-sm sm:block ${i === currentStepIndex ? "font-medium text-zinc-900" : "text-zinc-400"}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-8 bg-zinc-200" />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">

          {step === "upload" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Upload your photo</h2>
                <p className="mt-1 text-sm text-zinc-500">JPG, PNG or HEIC · Max 20MB · Best results with well-lit interiors</p>
              </div>
              <Dropzone onFileSelected={handleFileSelected} />
            </div>
          )}

          {step === "analyzing" && (
            <div className="flex flex-col items-center gap-6 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <div className="w-full max-w-xs space-y-2 text-center">
                <p className="font-medium text-zinc-900">{statusText}</p>
                <Progress value={progress} />
              </div>
            </div>
          )}

          {step === "furniture_decision" && analysis && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900">Analysis complete</h2>
              <AnalysisResultCard
                result={analysis}
                onAutoRemove={handleAutoRemove}
                onManualRemove={handleAutoRemove}
                onKeepFurniture={handleKeepFurniture}
              />
            </div>
          )}

          {step === "removing" && (
            <div className="flex flex-col items-center gap-6 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <div className="w-full max-w-xs space-y-2 text-center">
                <p className="font-medium text-zinc-900">{statusText}</p>
                <Progress value={progress} />
                <p className="text-xs text-zinc-400">This usually takes 20–40 seconds</p>
              </div>
            </div>
          )}

          {step === "empty_room_preview" && originalImage && emptyRoomImage && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Furniture removed</h2>
                  <p className="mt-1 text-sm text-zinc-500">Drag the slider to compare before & after</p>
                </div>
                <Badge variant="success">Empty Room Ready</Badge>
              </div>

              <BeforeAfter beforeUrl={originalImage} afterUrl={emptyRoomImage} />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setStep("furniture_decision")}
                >
                  <RotateCcw className="h-4 w-4" />
                  Redo Removal
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  asChild
                >
                  <a href={emptyRoomImage} download="empty-room.jpg">
                    <Download className="h-4 w-4" />
                    Download Empty Room
                  </a>
                </Button>
                <Button
                  className="ml-auto gap-2"
                  onClick={() => setStep("style_select")}
                >
                  Continue to Staging
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "style_select" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Choose your style</h2>
                <p className="mt-1 text-sm text-zinc-500">Select the room type and design style for staging</p>
              </div>
              {emptyRoomImage && (
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <img src={emptyRoomImage} alt="Empty room" className="w-full object-cover max-h-48" />
                  <div className="bg-zinc-50 px-4 py-2 text-xs text-zinc-500">
                    This empty room will be staged
                  </div>
                </div>
              )}
              <StyleSelector onGenerate={handleGenerate} isLoading={false} />
            </div>
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center gap-6 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <div className="w-full max-w-xs space-y-2 text-center">
                <p className="font-medium text-zinc-900">{statusText}</p>
                <Progress value={progress} />
                <p className="text-xs text-zinc-400">This usually takes 30–60 seconds</p>
              </div>
            </div>
          )}

          {step === "result" && originalImage && stagedImage && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Your staged photo</h2>
                  <p className="mt-1 text-sm text-zinc-500">Drag the slider to compare original & staged</p>
                </div>
                <Badge variant="success">Complete</Badge>
              </div>
              <BeforeAfter beforeUrl={originalImage} afterUrl={stagedImage} />
              <div className="flex gap-3 border-t border-zinc-100 pt-4">
                <Button variant="outline" className="gap-2" onClick={() => setStep("style_select")}>
                  <RotateCcw className="h-4 w-4" />
                  Try Another Style
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={emptyRoomImage || "#"} download="empty-room.jpg">
                    <Download className="h-4 w-4" />
                    Empty Room
                  </a>
                </Button>
                <Button className="ml-auto gap-2" asChild>
                  <a href={stagedImage} download="staged.jpg">
                    <Download className="h-4 w-4" />
                    Download Staged
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
