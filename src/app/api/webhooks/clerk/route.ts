import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { createServiceClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: "No webhook secret" }, { status: 500 })

  const svixId = req.headers.get("svix-id")
  const svixTimestamp = req.headers.get("svix-timestamp")
  const svixSignature = req.headers.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(webhookSecret)

  let event: { type: string; data: { id: string; email_addresses: { email_address: string }[] } }
  try {
    event = wh.verify(body, { "svix-id": svixId, "svix-timestamp": svixTimestamp, "svix-signature": svixSignature }) as typeof event
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === "user.created") {
    const { id, email_addresses } = event.data
    const email = email_addresses[0]?.email_address
    if (email) {
      await supabase.from("users").insert({ id, email, credits: 3, plan: "free" })
    }
  }

  if (event.type === "user.deleted") {
    await supabase.from("users").delete().eq("id", event.data.id)
  }

  return NextResponse.json({ success: true })
}
