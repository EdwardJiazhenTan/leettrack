import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query, queryOne } from '@/lib/database';

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60, 90];

function calculateNextReviewDate(reviewCount: number): string {
  const today = new Date();
  const intervalIndex = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  const daysToAdd = REVIEW_INTERVALS[intervalIndex];
  
  today.setDate(today.getDate() + daysToAdd);
  return today.toISOString().split('T')[0];
}

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
    const currentProgress = await queryOne<{
      review_count: number;
      path_id: string | null;
    }>(
      `SELECT review_count, path_id FROM user_question_progress 
       WHERE user_id = $1 AND question_id = $2 AND (path_id = $3 OR (path_id IS NULL AND $3 IS NULL))`,
      [user_id, question_id, path_id || null]
    );

    const reviewCount = currentProgress ? currentProgress.review_count : 0;
    const nextReviewDate = calculateNextReviewDate(reviewCount);

    await query(
      `INSERT INTO user_question_progress 
        (user_id, question_id, path_id, status, wants_review, next_review_date, last_attempted_at, review_count, first_attempted_at)
       VALUES ($1, $2, $3, 'needs_review', true, $4, NOW(), $5, NOW())
       ON CONFLICT (user_id, question_id, path_id)
       DO UPDATE SET 
         wants_review = true, 
         next_review_date = $4, 
         status = 'needs_review', 
         last_attempted_at = NOW(),
         review_count = $5,
         first_attempted_at = COALESCE(user_question_progress.first_attempted_at, NOW())`,
      [user_id, question_id, path_id || null, nextReviewDate, reviewCount + 1]
    );

    if (source_type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      await query(
        `UPDATE daily_recommendations 
         SET is_completed = true, completed_at = NOW()
         WHERE user_id = $1 AND question_id = $2 AND date = $3 AND is_completed = false`,
        [user_id, question_id, today]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Question scheduled for review on ${nextReviewDate}`,
      next_review_date: nextReviewDate,
      review_count: reviewCount + 1
    });
  } catch (error) {
    console.error('Error scheduling question for review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to schedule question for review' },
      { status: 500 }
    );
  }
}
