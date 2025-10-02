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
    const {
      title,
      titleUz,
      description,
      descriptionUz,
      subject,
      difficulty,
      timeLimit,
      language = "en",
      questions,
    } = body

    // Create test
    const { data: test, error: testError } = await supabase
      .from("tests")
      .insert({
        title,
        title_uz: titleUz,
        description,
        description_uz: descriptionUz,
        subject,
        difficulty,
        time_limit: timeLimit,
        language,
        created_by: user.id,
      })
      .select()
      .single()

    if (testError) {
      return NextResponse.json({ error: "Failed to create test" }, { status: 500 })
    }

    // Create questions
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, index: number) => ({
        test_id: test.id,
        question: q.question,
        question_uz: q.questionUz,
        option_a: q.optionA,
        option_a_uz: q.optionAUz,
        option_b: q.optionB,
        option_b_uz: q.optionBUz,
        option_c: q.optionC,
        option_c_uz: q.optionCUz,
        option_d: q.optionD,
        option_d_uz: q.optionDUz,
        correct_answer: q.correctAnswer,
        order_number: index + 1,
      }))

      await supabase.from("test_questions").insert(questionsToInsert)
    }

    return NextResponse.json({ success: true, test })
  } catch (error) {
    console.error("[v0] Error creating test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
