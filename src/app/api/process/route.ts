import { NextRequest, NextResponse } from "next/server"
import { removeFurnitureWithFal, virtualStageWithFal, convertToTwilightWithFal, enhancePhotoWithFal } from "@/lib/fal"
import { ProcessType } from "@/types"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 })
    }

    const { processType, roomType, designStyle, imageUrl } = await req.json() as {
      processType: ProcessType
      roomType?: string
      designStyle?: string
      imageUrl: string
    }

    if (!processType || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

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
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
