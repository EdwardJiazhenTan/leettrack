import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/database";

interface TodayQuestion {
  id: string;
  recommendation_id?: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string;
  leetcode_id?: string;
  tags: string[];
  source_type: "path" | "daily" | "review";
  path_id?: string;
  path_title?: string;
  priority_score: number;
}

export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;
    const today = new Date().toISOString().split("T")[0];

    // Check if user already has questions for today in daily_recommendations
    const existingDailyPath = await query<{ question_id: string }>(
      `SELECT DISTINCT question_id FROM daily_recommendations
       WHERE user_id = $1 AND date = $2 AND recommendation_type = 'new' AND path_id IS NOT NULL`,
      [user_id, today]
    );

    const existingPathQuestionIds = existingDailyPath.map(q => q.question_id);

    // Round-robin selection: Get 1-2 questions from each enrolled path
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
    }>(
      `
      WITH user_paths AS (
        SELECT path_id FROM user_path_enrollments
        WHERE user_id = $1 AND is_active = true
      ),
      completed_questions AS (
        SELECT question_id, path_id FROM user_question_progress
        WHERE user_id = $1 AND status = 'completed'
      ),
      todays_recommendations AS (
        SELECT question_id FROM daily_recommendations
        WHERE user_id = $1 AND date = $2 AND recommendation_type = 'new' AND path_id IS NOT NULL
      ),
      ranked_questions AS (
        SELECT
          q.id as question_id,
          q.title,
          q.slug,
          q.difficulty,
          q.url,
          q.leetcode_id,
          pq.path_id,
          lp.title as path_title,
          pq.order_index,
          ROW_NUMBER() OVER (PARTITION BY pq.path_id ORDER BY pq.order_index) as row_num
        FROM user_paths up
        JOIN learning_paths lp ON up.path_id = lp.id
        JOIN path_questions pq ON pq.path_id = lp.id
        JOIN questions q ON pq.question_id = q.id
        LEFT JOIN completed_questions cq ON cq.question_id = q.id AND cq.path_id = pq.path_id
        LEFT JOIN todays_recommendations tr ON tr.question_id = q.id
        WHERE cq.question_id IS NULL AND tr.question_id IS NULL
      )
      SELECT
        question_id,
        title,
        slug,
        difficulty,
        url,
        leetcode_id,
        path_id,
        path_title,
        order_index
      FROM ranked_questions
      WHERE row_num <= 2
      ORDER BY path_id, order_index
    `,
      [user_id, today],
    );

    // If we got new path questions, save them to daily_recommendations
    if (pathQuestions.length > 0) {
      for (const q of pathQuestions) {
        await query(
          `INSERT INTO daily_recommendations (user_id, date, question_id, path_id, recommendation_type, priority_score, is_completed)
           VALUES ($1, $2, $3, $4, 'new', 1.0, false)
           ON CONFLICT (user_id, date, question_id, recommendation_type) DO NOTHING`,
          [user_id, today, q.question_id, q.path_id]
        );
      }
    }

    // If we already had path questions for today but they've been completed, fetch them
    let displayPathQuestions = pathQuestions;
    if (pathQuestions.length === 0 && existingPathQuestionIds.length > 0) {
      displayPathQuestions = await query<{
        question_id: string;
        title: string;
        slug: string;
        difficulty: string;
        url: string;
        leetcode_id: string;
        path_id: string;
        path_title: string;
        order_index: number;
      }>(
        `SELECT
          q.id as question_id,
          q.title,
          q.slug,
          q.difficulty,
          q.url,
          q.leetcode_id,
          dr.path_id,
          lp.title as path_title,
          0 as order_index
        FROM daily_recommendations dr
        JOIN questions q ON dr.question_id = q.id
        LEFT JOIN learning_paths lp ON dr.path_id = lp.id
        WHERE dr.user_id = $1 AND dr.date = $2 AND dr.is_completed = false AND dr.path_id IS NOT NULL
        ORDER BY dr.created_at`,
        [user_id, today]
      );
    }

    const reviewQuestions = await query<{
      question_id: string;
      title: string;
      slug: string;
      difficulty: string;
      url: string;
      leetcode_id: string;
      review_count: number;
      last_attempted_at: string;
    }>(
      `
      SELECT
        q.id as question_id,
        q.title,
        q.slug,
        q.difficulty,
        q.url,
        q.leetcode_id,
        uqp.review_count,
        uqp.last_attempted_at
      FROM user_question_progress uqp
      JOIN questions q ON uqp.question_id = q.id
      WHERE uqp.user_id = $1
        AND uqp.wants_review = true
        AND uqp.next_review_date <= $2
        AND uqp.status != 'completed'
      ORDER BY uqp.next_review_date, uqp.last_attempted_at
      LIMIT 3
    `,
      [user_id, today],
    );

    const dailyQuestions = await query<{
      recommendation_id: string;
      question_id: string;
      title: string;
      slug: string;
      difficulty: string;
      url: string;
      leetcode_id: string;
      priority_score: number;
    }>(
      `
      SELECT
        dr.id as recommendation_id,
        q.id as question_id,
        q.title,
        q.slug,
        q.difficulty,
        q.url,
        q.leetcode_id,
        dr.priority_score
      FROM daily_recommendations dr
      JOIN questions q ON dr.question_id = q.id
      WHERE dr.user_id = $1
        AND dr.date = $2
        AND dr.is_completed = false
        AND dr.path_id IS NULL
        AND dr.recommendation_type = 'new'
      ORDER BY dr.priority_score DESC
      LIMIT 2
    `,
      [user_id, today],
    );

    const allQuestionIds = [
      ...pathQuestions.map((q) => q.question_id),
      ...reviewQuestions.map((q) => q.question_id),
      ...dailyQuestions.map((q) => q.question_id),
    ];

    const tagsMap = new Map<string, string[]>();
    if (allQuestionIds.length > 0) {
      const tags = await query<{ question_id: string; tag: string }>(
        `SELECT question_id, tag FROM question_tags WHERE question_id = ANY($1)`,
        [allQuestionIds],
      );

      tags.forEach((t) => {
        if (!tagsMap.has(t.question_id)) {
          tagsMap.set(t.question_id, []);
        }
        tagsMap.get(t.question_id)!.push(t.tag);
      });
    }

    const formattedQuestions: TodayQuestion[] = [
      ...displayPathQuestions.map((q) => ({
        id: q.question_id,
        title: q.title,
        slug: q.slug,
        difficulty: q.difficulty,
        url: q.url || `https://leetcode.com/problems/${q.slug}/`,
        leetcode_id: q.leetcode_id,
        tags: tagsMap.get(q.question_id) || [],
        source_type: "path" as const,
        path_id: q.path_id,
        path_title: q.path_title,
        priority_score: 1.0,
      })),
      ...reviewQuestions.map((q) => ({
        id: q.question_id,
        title: q.title,
        slug: q.slug,
        difficulty: q.difficulty,
        url: q.url || `https://leetcode.com/problems/${q.slug}/`,
        leetcode_id: q.leetcode_id,
        tags: tagsMap.get(q.question_id) || [],
        source_type: "review" as const,
        priority_score: 0.9,
      })),
      ...dailyQuestions.map((q) => ({
        id: q.question_id,
        recommendation_id: q.recommendation_id,
        title: q.title,
        slug: q.slug,
        difficulty: q.difficulty,
        url: q.url || `https://leetcode.com/problems/${q.slug}/`,
        leetcode_id: q.leetcode_id,
        tags: tagsMap.get(q.question_id) || [],
        source_type: "daily" as const,
        priority_score: q.priority_score,
      })),
    ];

    return NextResponse.json({
      success: true,
      date: today,
      questions: formattedQuestions,
      total: formattedQuestions.length,
      breakdown: {
        path: displayPathQuestions.length,
        review: reviewQuestions.length,
        daily: dailyQuestions.length,
      },
    });
  } catch (error) {
    console.error("Get today questions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch todays questions" },
      { status: 500 },
    );
  }
}
