import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/database";

export async function GET(request: NextRequest) {
  const userAuth = getUserFromRequest(request);
  if (!userAuth) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 },
    );
  }

  const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;

  try {
    // Get all enrolled paths with progress
    const enrolledPaths = await query<{
      enrollment_id: string;
      path_id: string;
      title: string;
      description: string;
      difficulty: string;
      estimated_hours: number;
      total_questions: number;
      completed_questions: number;
      is_active: boolean;
      enrolled_at: string;
      completion_percentage: number;
    }>(
      `SELECT
        upe.id as enrollment_id,
        lp.id as path_id,
        lp.title,
        lp.description,
        lp.difficulty,
        lp.estimated_hours,
        (SELECT COUNT(*) FROM path_questions WHERE path_id = lp.id) as total_questions,
        (SELECT COUNT(*) FROM user_question_progress
         WHERE user_id = $1 AND path_id = lp.id AND status = 'completed') as completed_questions,
        upe.is_active,
        upe.enrolled_at,
        upe.completion_percentage
      FROM user_path_enrollments upe
      JOIN learning_paths lp ON upe.path_id = lp.id
      WHERE upe.user_id = $1
      ORDER BY upe.enrolled_at DESC`,
      [user_id],
    );

    return NextResponse.json({
      success: true,
      paths: enrolledPaths,
      total: enrolledPaths.length,
    });
  } catch (error) {
    console.error("Get enrolled paths error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enrolled paths" },
      { status: 500 },
    );
  }
}
