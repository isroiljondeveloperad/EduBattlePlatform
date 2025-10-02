import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { teamId } = body

    // Check if user is captain
    const { data: team } = await supabase.from("teams").select().eq("id", teamId).single()

    if (team?.captain_id === user.id) {
      return NextResponse.json({ error: "Captain cannot leave team. Transfer captaincy first." }, { status: 400 })
    }

    // Remove member
    await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error leaving team:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
