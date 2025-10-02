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
    const { name, description, maxMembers = 10 } = body

    // Create team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name,
        description,
        captain_id: user.id,
        max_members: maxMembers,
      })
      .select()
      .single()

    if (teamError) {
      return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
    }

    // Add captain as first member
    await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "captain",
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error("[v0] Error creating team:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
