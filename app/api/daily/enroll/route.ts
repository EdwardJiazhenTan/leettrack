import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { queryOne } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;

    const { question_id } = await request.json();

    if (!question_id) {
      return NextResponse.json(
        { success: false, message: "question_id is required" },
        { status: 400 },
      );
    }

    // Check if question exists
    const question = await queryOne<{ id: string }>(
      "SELECT id FROM questions WHERE id = $1",
      [question_id],
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 },
      );
    }

    // Check if already in daily recommendations
    const existing = await queryOne<{ id: string }>(
      "SELECT id FROM daily_question_recommendations WHERE user_id = $1 AND question_id = $2 AND is_active = true",
      [user_id, question_id],
    );

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Question already in daily queue" },
        { status: 400 },
      );
    }

    // Add to daily recommendations
    const recommendation = await queryOne<{
      id: string;
      question_id: string;
      recommended_date: string;
    }>(
      `INSERT INTO daily_question_recommendations (user_id, question_id, recommended_date)
       VALUES ($1, $2, CURRENT_DATE)
       RETURNING id, question_id, recommended_date`,
      [user_id, question_id],
    );

    return NextResponse.json({
      success: true,
      message: "Question added to daily queue",
      recommendation,
    });
  } catch (error) {
    console.error("Error enrolling daily question:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
