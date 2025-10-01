import { NextRequest, NextResponse } from "next/server";
import { getQuestionStats } from "../../../../lib/questions";
import type { QuestionStats, ApiError } from "../../../../types/question";

export async function GET(request: NextRequest) {
  try {
    // Get stats from our database (the 150 questions we have stored)
    const stats = await getQuestionStats();
    return NextResponse.json<QuestionStats>(stats, { status: 200 });
  } catch (error) {
    console.error("Error in question stats API:", error);
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "Failed to fetch question statistics",
      },
      { status: 500 },
    );
  }
}
