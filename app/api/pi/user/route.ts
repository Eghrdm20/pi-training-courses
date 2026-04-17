import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { uid, username } = await req.json()

    if (!uid || !username) {
      return NextResponse.json(
        { error: "uid and username are required" },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServerClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("pi_users")
      .upsert(
        [
          {
            uid,
            username,
            updated_at: now,
          },
        ],
        { onConflict: "uid" }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: data }, { status: 200 })
  } catch (error) {
    console.error("POST /api/pi/user failed:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
