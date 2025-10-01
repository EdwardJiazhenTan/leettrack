import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query, queryOne } from "@/lib/database";

// Fetch LeetCode's daily challenge
async function fetchLeetCodeDaily() {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              questionId
              title
              titleSlug
              difficulty
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  return data.data?.activeDailyCodingChallengeQuestion;
}

export async function POST(request: NextRequest) {
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

    // Fetch LeetCode's daily challenge
    const dailyChallenge = await fetchLeetCodeDaily();

    if (!dailyChallenge) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch LeetCode daily challenge" },
        { status: 500 },
      );
    }

    const { question } = dailyChallenge;

    // Check if question exists in database, if not, add it
    let dbQuestion = await queryOne<{ id: string }>(
      "SELECT id FROM questions WHERE slug = $1",
      [question.titleSlug],
    );

    if (!dbQuestion) {
      // Add the question to database
      dbQuestion = await queryOne<{ id: string }>(
        `INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
         VALUES ($1, $2, $3, $4, $5, false)
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
         RETURNING id`,
        [
          question.title,
          question.titleSlug,
          question.difficulty,
          `https://leetcode.com${dailyChallenge.link}`,
          question.questionId,
        ],
      );
    }

    if (!dbQuestion) {
      return NextResponse.json(
        { success: false, message: "Failed to add question to database" },
        { status: 500 },
      );
    }

    // Check if user already has this as today's daily recommendation
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM daily_recommendations
       WHERE user_id = $1 AND question_id = $2 AND date = $3`,
      [user_id, dbQuestion.id, today],
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Daily challenge already added",
        question: {
          id: dbQuestion.id,
          title: question.title,
          slug: question.titleSlug,
          difficulty: question.difficulty,
        },
      });
    }

    // Add to daily recommendations
    await query(
      `INSERT INTO daily_recommendations (user_id, question_id, date, recommendation_type, priority_score)
       VALUES ($1, $2, $3, 'new', 1.0)`,
      [user_id, dbQuestion.id, today],
    );

    return NextResponse.json({
      success: true,
      message: "Daily challenge added successfully",
      question: {
        id: dbQuestion.id,
        title: question.title,
        slug: question.titleSlug,
        difficulty: question.difficulty,
      },
    });
  } catch (error) {
    console.error("Sync daily challenge error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync daily challenge" },
      { status: 500 },
    );
  }
}
