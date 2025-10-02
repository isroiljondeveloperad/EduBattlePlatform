import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { calculatePoints } from "@/lib/scoring"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { testId, answers, tournamentId, teamId, mode = "regular" } = body

    // Get test questions
    const { data: questions, error: questionsError } = await supabase
      .from("test_questions")
      .select("*")
      .eq("test_id", testId)
      .order("order_number")

    if (questionsError || !questions) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Calculate score
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++
      }
    })

    const pointsEarned = calculatePoints(correctAnswers, mode)

    // Save test result
    const { data: result, error: resultError } = await supabase
      .from("test_results")
      .insert({
        test_id: testId,
        user_id: user.id,
        tournament_id: tournamentId || null,
        team_id: teamId || null,
        score: (correctAnswers / questions.length) * 100,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        points_earned: pointsEarned,
      })
      .select()
      .single()

    if (resultError) {
      return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
    }

    // Update user points
    const { error: updateError } = await supabase.rpc("increment_user_points", {
      user_id: user.id,
      points: pointsEarned,
    })

    // If in team tournament, update team points
    if (teamId) {
      await supabase.rpc("increment_team_points", {
        team_id: teamId,
        points: pointsEarned,
      })
    }

    // Update tournament participant score
    if (tournamentId) {
      await supabase
        .from("tournament_participants")
        .update({ score: supabase.raw(`score + ${pointsEarned}`) })
        .eq("tournament_id", tournamentId)
        .eq("user_id", user.id)
    }

    return NextResponse.json({
      success: true,
      result: {
        correctAnswers,
        totalQuestions: questions.length,
        pointsEarned,
        score: result.score,
      },
    })
  } catch (error) {
    console.error("[v0] Error submitting test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
