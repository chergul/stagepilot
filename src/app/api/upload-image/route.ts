import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

fal.config({ credentials: process.env.FAL_KEY })

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const url = await fal.storage.upload(file)
  return NextResponse.json({ url })
}
