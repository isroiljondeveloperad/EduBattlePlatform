import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get current week start
    const now = new Date()
    const dayOfWeek = now.getDay()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayOfWeek)
    weekStart.setHours(0, 0, 0, 0)

    // Fetch rankings for current week
    const { data: rankings, error } = await supabase
      .from("weekly_rankings")
      .select("*, users(name, email, avatar_url)")
      .eq("week_start", weekStart.toISOString().split("T")[0])
      .order("rank", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching rankings:", error)
      return NextResponse.json({ rankings: [] })
    }

    return NextResponse.json({ rankings: rankings || [] })
  } catch (error) {
    console.error("[v0] Error in weekly rankings:", error)
    return NextResponse.json({ rankings: [] })
  }
}
