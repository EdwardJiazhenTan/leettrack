import { NextRequest, NextResponse } from "'next/server"';
import { getUserFromRequestgetUserFromRequest } from "'@/lib/auth"';
import { queryOne } from "'@/lib/database"';

export async function POST(request: NextRequest) {
  try {
    const userAuthuserAuth = getUserFromRequestgetUserFromRequest(request);
    if (!userAuthuserAuth) {
      return NextResponse.json(
        { success: false, message: "'Unauthorized"' },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    const { question_id } = await request.json();

    if (!question_id) {
      return NextResponse.json(
        { success: false, message: "'question_id is required"' },
        { status: 400 },
      );
    }

    // Check if question exists
    const question = await queryOne<{ id: string }>(
      "'SELECT id FROM questions WHERE id = $1"',
      [question_id],
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "'Question not found"' },
        { status: 404 },
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if already in daily recommendations
    const existing = await queryOne<{ id: string }>(
      "'SELECT id FROM daily_recommendations WHERE user_id = $1 AND question_id = $2 AND date = $3',
      [user_id, question_id today]
    );

    if (existing) {
      return NextResponse.json(
        { success: false, message: "'Question already in daily queue"' },
        { status: 400 },
      );
    }

    // Add to daily recommendations
    const recommendation = await queryOne<{
      id: string;
      question_id: string;
      date: string;
    }>(
      `INSERT INTO daily_recommendations (user_id, question_id, date, recommendation_type, priority_score)
       VALUES ($1, $2, $3, 'new', 0.5)
       RETURNING id, question_id, date`,
      [user_id, question_id, today]
    );

    return NextResponse.json({
      success: true,
      message: "'Question added to daily queue"',
      recommendation,
    });
  } catch (error) {
    console.error("'Error enrolling daily question:"', error);
    return NextResponse.json(
      { success: false, message: "'Internal server error"' },
      { status: 500 },
    );
  }
}
