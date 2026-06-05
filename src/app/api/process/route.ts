import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase"
import { removeFurniture, virtualStage, convertToTwilight, enhancePhoto } from "@/lib/replicate"
import { uploadImageFromUrl, generateImageKey } from "@/lib/storage"
import { CREDIT_COSTS } from "@/lib/constants"
import { ProcessType } from "@/types"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId, processType, roomType, designStyle } = await req.json() as {
    projectId: string
    processType: ProcessType
    roomType?: string
    designStyle?: string
  }

  if (!projectId || !processType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Verify project belongs to user and get image URL
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single()

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  // Check and deduct credits
  const cost = CREDIT_COSTS[processType] ?? 1
  const { data: success } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: cost,
    p_process_type: processType,
    p_project_id: projectId,
  })

  if (!success) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
  }

  // Update status
  await supabase.from("projects").update({ status: "staging" }).eq("id", projectId)

  try {
    const sourceUrl = project.empty_room_image_url || project.original_image_url
    let resultUrl: string

    switch (processType) {
      case "furniture_removal":
        resultUrl = await removeFurniture(sourceUrl)
        break
      case "virtual_staging":
        if (!roomType || !designStyle) throw new Error("Room type and design style required")
        resultUrl = await virtualStage(sourceUrl, roomType, designStyle)
        break
      case "twilight":
        resultUrl = await convertToTwilight(project.original_image_url)
        break
      case "enhancement":
        resultUrl = await enhancePhoto(sourceUrl)
        break
      default:
        throw new Error(`Unknown process type: ${processType}`)
    }

    // Upload result to R2
    const key = generateImageKey(userId, projectId, processType)
    const storedUrl = await uploadImageFromUrl(resultUrl, key)

    // Save result URL
    const updateField: Record<ProcessType, string> = {
      furniture_removal: "empty_room_image_url",
      virtual_staging: "staged_image_url",
      twilight: "twilight_image_url",
      enhancement: "enhanced_image_url",
      sky_replacement: "staged_image_url",
      item_removal: "empty_room_image_url",
    }

    await supabase
      .from("projects")
      .update({
        [updateField[processType]]: storedUrl,
        status: "completed",
        design_style: designStyle || project.design_style,
      })
      .eq("id", projectId)

    return NextResponse.json({ resultUrl: storedUrl })
  } catch (err) {
    await supabase
      .from("projects")
      .update({ status: "failed", error_message: String(err) })
      .eq("id", projectId)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
