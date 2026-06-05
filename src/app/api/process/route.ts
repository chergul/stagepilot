import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import { removeFurnitureWithFal, virtualStageWithFal, convertToTwilightWithFal, enhancePhotoWithFal } from "@/lib/fal"
import { uploadImageFromUrl, generateImageKey } from "@/lib/storage"
import { CREDIT_COSTS } from "@/lib/constants"
import { ProcessType } from "@/types"

export async function POST(req: NextRequest) {
  const { projectId, processType, roomType, designStyle, imageUrl, userId } = await req.json() as {
    projectId: string
    processType: ProcessType
    roomType?: string
    designStyle?: string
    imageUrl: string
    userId: string
  }

  if (!projectId || !processType || !imageUrl || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    let resultUrl: string

    switch (processType) {
      case "furniture_removal":
        resultUrl = await removeFurnitureWithFal(imageUrl)
        break
      case "virtual_staging":
        if (!roomType || !designStyle) throw new Error("Room type and design style required")
        resultUrl = await virtualStageWithFal(imageUrl, roomType, designStyle)
        break
      case "twilight":
        resultUrl = await convertToTwilightWithFal(imageUrl)
        break
      case "enhancement":
        resultUrl = await enhancePhotoWithFal(imageUrl)
        break
      default:
        throw new Error(`Unknown process type: ${processType}`)
    }

    return NextResponse.json({ resultUrl })
  } catch (err) {
    console.error("Processing error:", err)
    return NextResponse.json({ error: "Processing failed", details: String(err) }, { status: 500 })
  }
}
