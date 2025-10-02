import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const userAuth = getUserFromRequest(request);
  if (!userAuth) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;

  // Get path_id from query params
  const { searchParams } = new URL(request.url);
  const path_id = searchParams.get("path_id");

  if (!path_id) {
    return NextResponse.json(
      { success: false, message: "path_id is required" },
      { status: 400 },
    );
  }

  try {
    // Get all questions marked for review in this path
    const reviewQuestions = await query<{
      id: string;
      leetcode_id: string | null;
      title: string;
      slug: string;
      difficulty: string;
      url: string | null;
      tags: string[];
      wants_review: boolean;
      next_review_date: string | null;
      review_count: number;
      last_attempted_at: string | null;
    }>(
      `SELECT
        q.id,
        q.leetcode_id,
        q.title,
        q.slug,
        q.difficulty,
        q.url,
        COALESCE(array_agg(DISTINCT qt.tag) FILTER (WHERE qt.tag IS NOT NULL), ARRAY[]::VARCHAR[]) as tags,
        uqp.wants_review,
        uqp.next_review_date,
        uqp.review_count,
        uqp.last_attempted_at
      FROM user_question_progress uqp
      JOIN questions q ON uqp.question_id = q.id
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      WHERE uqp.user_id = $1
        AND uqp.path_id = $2
        AND uqp.wants_review = true
        AND uqp.status = 'needs_review'
      GROUP BY q.id, q.leetcode_id, q.title, q.slug, q.difficulty, q.url,
               uqp.wants_review, uqp.next_review_date, uqp.review_count, uqp.last_attempted_at
      ORDER BY uqp.next_review_date ASC NULLS LAST, uqp.last_attempted_at DESC`,
      [user_id, path_id],
    );

    return NextResponse.json({
      success: true,
      questions: reviewQuestions,
      total: reviewQuestions.length,
    });
  } catch (error) {
    console.error("Get path review questions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch review questions" },
      { status: 500 },
    );
  }
}
