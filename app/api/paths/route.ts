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

  try {
    // Get all public learning paths
    const paths = await query<{
      id: string;
      title: string;
      description: string;
      difficulty: string;
      estimated_hours: number;
      is_public: boolean;
      created_at: string;
      total_questions: number;
    }>(
      `SELECT
        lp.id,
        lp.title,
        lp.description,
        lp.difficulty,
        lp.estimated_hours,
        lp.is_public,
        lp.created_at,
        (SELECT COUNT(*) FROM path_questions WHERE path_id = lp.id) as total_questions
      FROM learning_paths lp
      WHERE lp.is_public = true
      ORDER BY lp.created_at DESC`,
    );

    return NextResponse.json({
      success: true,
      paths,
      total: paths.length,
    });
  } catch (error) {
    console.error("Get paths error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch paths" },
      { status: 500 },
    );
  }
}
