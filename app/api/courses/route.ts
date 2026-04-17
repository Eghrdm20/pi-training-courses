import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ courses: data ?? [] }, { status: 200 })
  } catch (error) {
    console.error("GET /api/courses failed:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
