import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';
import { query } from '../../../../lib/database';

interface TodayQuestion {
  id: string;
  recommendation_id: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string;
  leetcode_id?: string;
  tags: string[];
  recommendation_type: 'new' | 'review';
  priority_score: number;
}

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
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get today's recommendations that aren't completed yet
    const recommendations = await query<{
      recommendation_id: string;
      question_id: string;
      recommendation_type: string;
      priority_score: string;
      title: string;
      slug: string;
      difficulty: string;
      url: string;
      leetcode_id: string;
    }>(`
      SELECT
        dr.id as recommendation_id,
        dr.question_id,
        dr.recommendation_type,
        dr.priority_score,
        q.title,
        q.slug,
        q.difficulty,
        q.url,
        q.leetcode_id
      FROM daily_recommendations dr
      JOIN questions q ON dr.question_id = q.id
      WHERE dr.user_id = $1
        AND dr.date = $2
        AND dr.is_completed = false
      ORDER BY dr.priority_score DESC, dr.recommendation_type
    `, [user_id, today]);

    // Get tags for each question
    const questionsWithTags = await Promise.all(
      recommendations.map(async (rec) => {
        const tags = await query<{ tag: string }>(
          'SELECT tag FROM question_tags WHERE question_id = $1',
          [rec.question_id]
        );

        return {
          id: rec.question_id,
          recommendation_id: rec.recommendation_id,
          title: rec.title,
          slug: rec.slug,
          difficulty: rec.difficulty,
          url: rec.url || `https://leetcode.com/problems/${rec.slug}/`,
          leetcode_id: rec.leetcode_id,
          tags: tags.map(t => t.tag),
          recommendation_type: rec.recommendation_type as 'new' | 'review',
          priority_score: parseFloat(rec.priority_score),
        };
      })
    );

    return NextResponse.json({
      success: true,
      date: today,
      questions: questionsWithTags,
      total: questionsWithTags.length,
    });
  } catch (error) {
    console.error('Get today questions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch today\'s questions' },
      { status: 500 }
    );
  }
}
