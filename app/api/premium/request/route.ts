import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { paymentAmount, paymentMethod, paymentProof, notes } = body

    // Create subscription request
    const { data, error } = await supabase
      .from("subscription_requests")
      .insert({
        user_id: user.id,
        payment_amount: paymentAmount,
        payment_method: paymentMethod,
        payment_proof: paymentProof,
        notes,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating subscription request:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Premium request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
