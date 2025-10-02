import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params

    // Fetch test with questions
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*, test_questions(*)")
      .eq("id", id)
      .single()

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json({ test })
  } catch (error) {
    console.error("[v0] Error fetching test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
