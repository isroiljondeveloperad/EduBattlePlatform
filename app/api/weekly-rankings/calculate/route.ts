import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get current week start and end
    const now = new Date()
    const dayOfWeek = now.getDay()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dayOfWeek)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Calculate rankings using the database function
    const { error } = await supabase.rpc("calculate_weekly_rankings", {
      week_start_date: weekStart.toISOString().split("T")[0],
      week_end_date: weekEnd.toISOString().split("T")[0],
    })

    if (error) {
      console.error("[v0] Error calculating rankings:", error)
      return NextResponse.json({ error: "Failed to calculate rankings" }, { status: 500 })
    }

    // Get top 3 for sticker rewards
    const { data: topRankings } = await supabase
      .from("weekly_rankings")
      .select("*, users(name, email)")
      .eq("week_start", weekStart.toISOString().split("T")[0])
      .order("rank", { ascending: true })
      .limit(3)

    return NextResponse.json({ success: true, topRankings })
  } catch (error) {
    console.error("[v0] Error in weekly rankings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
