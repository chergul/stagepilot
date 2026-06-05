import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase"
import { uploadImageFile, generateImageKey } from "@/lib/storage"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const allowedTypes = ["image/jpeg", "image/png", "image/heic", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Create project record
  const { data: project, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name: file.name.replace(/\.[^.]+$/, ""), status: "analyzing" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: "Failed to create project" }, { status: 500 })

  // Upload to R2
  const key = generateImageKey(userId, project.id, "original")
  const buffer = await file.arrayBuffer()
  const imageUrl = await uploadImageFile(buffer, key, file.type)

  // Update project with image URL
  await supabase
    .from("projects")
    .update({ original_image_url: imageUrl })
    .eq("id", project.id)

  return NextResponse.json({ projectId: project.id, imageUrl })
}
