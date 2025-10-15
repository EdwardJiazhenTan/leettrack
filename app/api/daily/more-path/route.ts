import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;
    const today = new Date().toISOString().split('T')[0];

    // Get next path question (just 1 more)
    const pathQuestions = await query<{
      question_id: string;
      title: string;
      slug: string;
      difficulty: string;
      url: string;
      leetcode_id: string;
      path_id: string;
      path_title: string;
      order_index: number;
    }>(`
      WITH user_paths AS (
        SELECT path_id FROM user_path_enrollments
        WHERE user_id = $1 AND is_active = true
      ),
      completed_questions AS (
        SELECT question_id, path_id FROM user_question_progress
        WHERE user_id = $1 AND status = 'completed'
      ),
      todays_shown AS (
        SELECT question_id FROM daily_recommendations
        WHERE user_id = $1 AND date = $2 AND recommendation_type = 'new' AND path_id IS NOT NULL
      )
      SELECT DISTINCT
        q.id as question_id,
        q.title,
        q.slug,
        q.difficulty,
        q.url,
        q.leetcode_id,
        pq.path_id,
        lp.title as path_title,
        pq.order_index
      FROM user_paths up
      JOIN learning_paths lp ON up.path_id = lp.id
      JOIN path_questions pq ON pq.path_id = lp.id
      JOIN questions q ON pq.question_id = q.id
      LEFT JOIN completed_questions cq ON cq.question_id = q.id AND cq.path_id = pq.path_id
      LEFT JOIN todays_shown ts ON ts.question_id = q.id
      WHERE cq.question_id IS NULL
        AND ts.question_id IS NULL
      ORDER BY pq.path_id, pq.order_index
      LIMIT 1
    `, [user_id, today]);

    if (pathQuestions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No more path questions available',
        questions: [],
      });
    }

    // Get tags for the question
    const question = pathQuestions[0];
    const tags = await query<{ tag: string }>(
      `SELECT tag FROM question_tags WHERE question_id = $1`,
      [question.question_id]
    );

    // Save this question to daily_recommendations so it's tracked
    await query(
      `INSERT INTO daily_recommendations (user_id, date, question_id, path_id, recommendation_type, priority_score, is_completed)
       VALUES ($1, $2, $3, $4, 'new', 1.0, false)
       ON CONFLICT (user_id, date, question_id, recommendation_type) DO NOTHING`,
      [user_id, today, question.question_id, question.path_id]
    );

    const formattedQuestion = {
      id: question.question_id,
      title: question.title,
      slug: question.slug,
      difficulty: question.difficulty,
      url: question.url || `https://leetcode.com/problems/${question.slug}/`,
      leetcode_id: question.leetcode_id,
      tags: tags.map(t => t.tag),
      source_type: 'path' as const,
      path_id: question.path_id,
      path_title: question.path_title,
      priority_score: 1.0
    };

    return NextResponse.json({
      success: true,
      question: formattedQuestion,
    });
  } catch (error) {
    console.error('Get more path questions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch more path questions' },
      { status: 500 }
    );
  }
}
