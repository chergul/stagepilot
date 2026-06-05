import { NextRequest, NextResponse } from "next/server"
import { uploadToFalStorage } from "@/lib/fal"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const url = await uploadToFalStorage(file)
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
