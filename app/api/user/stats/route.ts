import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user stats
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch test results
    const { data: testResults } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    // Fetch team memberships
    const { data: teams } = await supabase.from("team_members").select("*, teams(*)").eq("user_id", user.id)

    return NextResponse.json({
      user: userData,
      testResults: testResults || [],
      teams: teams || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
