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

    // Check if team exists and has space
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*, team_members(count)")
      .eq("id", teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    const memberCount = team.team_members[0]?.count || 0
    if (memberCount >= team.max_members) {
      return NextResponse.json({ error: "Team is full" }, { status: 400 })
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select()
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 })
    }

    // Add member
    await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: user.id,
      role: "member",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error joining team:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
