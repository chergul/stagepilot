import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase"
import { AnalysisResult } from "@/types"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId, imageUrl } = await req.json()
  if (!projectId || !imageUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Verify project belongs to user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single()

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  // Use GPT-4 Vision or a dedicated model to analyze the image
  // For now returning a structured mock — replace with real vision API call
  const analysis: AnalysisResult = await analyzeImageWithAI(imageUrl)

  // Save analysis to project
  await supabase
    .from("projects")
    .update({ analysis_data: analysis, room_type: analysis.roomType })
    .eq("id", projectId)

  return NextResponse.json({ analysis })
}

async function analyzeImageWithAI(imageUrl: string): Promise<AnalysisResult> {
  // Replace this with a real API call to OpenAI vision or similar
  // Example with OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [{ role: "user", content: [
  //     { type: "image_url", image_url: { url: imageUrl } },
  //     { type: "text", text: "Analyze this room photo. Return JSON with: roomType, furnitureDetected, furnitureCount, furnitureItems[], lightCondition, qualityScore (0-100)" }
  //   ]}]
  // })

  // Mock response for development
  return {
    roomType: "living_room",
    furnitureDetected: true,
    furnitureCount: 5,
    furnitureItems: ["sofa", "coffee table", "armchair", "floor lamp", "bookshelf"],
    lightCondition: "bright",
    qualityScore: 87,
  }
}
