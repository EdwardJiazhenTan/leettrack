import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query, queryOne } from '@/lib/database';

export async function POST(request: NextRequest) {
  const userAuth = getUserFromRequest(request);
  if (!userAuth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;
  const body = await request.json();
  const { question_id, path_id, source_type } = body;

  if (!question_id) {
    return NextResponse.json(
      { success: false, message: 'question_id is required' },
      { status: 400 }
    );
  }

  try {
    await query(
      `INSERT INTO user_question_progress (user_id, question_id, path_id, status, last_attempted_at, completed_at, first_attempted_at)
       VALUES ($1, $2, $3, 'completed', NOW(), NOW(), NOW())
       ON CONFLICT (user_id, question_id, path_id)
       DO UPDATE SET 
         status = 'completed', 
         last_attempted_at = NOW(), 
         completed_at = NOW(),
         first_attempted_at = COALESCE(user_question_progress.first_attempted_at, NOW())`,
      [user_id, question_id, path_id || null]
    );

    if (path_id && source_type === 'path') {
      const stats = await queryOne<{
        total_questions: number;
        completed_questions: number;
      }>(
        `SELECT 
          (SELECT COUNT(*) FROM path_questions WHERE path_id = $2) as total_questions,
          (SELECT COUNT(*) FROM user_question_progress 
           WHERE user_id = $1 AND path_id = $2 AND status = 'completed') as completed_questions`,
        [user_id, path_id]
      );

      if (stats && stats.total_questions > 0) {
        const percentage = (stats.completed_questions / stats.total_questions) * 100;
        
        await query(
          `UPDATE user_path_enrollments 
           SET completion_percentage = $1
           WHERE user_id = $2 AND path_id = $3`,
          [percentage, user_id, path_id]
        );
      }
    }

    if (source_type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      await query(
        `UPDATE daily_recommendations 
         SET is_completed = true, completed_at = NOW()
         WHERE user_id = $1 AND question_id = $2 AND date = $3 AND is_completed = false`,
        [user_id, question_id, today]
      );
    }

    if (source_type === 'review') {
      await query(
        `UPDATE user_question_progress
         SET wants_review = false, next_review_date = NULL
         WHERE user_id = $1 AND question_id = $2`,
        [user_id, question_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Question marked as complete'
    });
  } catch (error) {
    console.error('Error marking question as complete:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark question as complete' },
      { status: 500 }
    );
  }
}
