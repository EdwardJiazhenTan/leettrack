import { NextRequest, NextResponse } from 'next/server';
import { getQuestionStats } from '../../../../lib/questions';
import { getAllQuestionsCount } from '../../../../lib/leetcode-client';
import type { QuestionStats, ApiError } from '../../../../types/question';

export async function GET(request: NextRequest) {
  try {
    // Try to get real stats from LeetCode first
    const leetcodeStats = await getAllQuestionsCount();

    if (!('error' in leetcodeStats)) {
      // Use real LeetCode data
      const easyCount = leetcodeStats.find((q: any) => q.difficulty === 'Easy')?.count || 0;
      const mediumCount = leetcodeStats.find((q: any) => q.difficulty === 'Medium')?.count || 0;
      const hardCount = leetcodeStats.find((q: any) => q.difficulty === 'Hard')?.count || 0;
      const totalQuestions = easyCount + mediumCount + hardCount;

      const stats: QuestionStats = {
        total_questions: totalQuestions,
        easy_count: easyCount,
        medium_count: mediumCount,
        hard_count: hardCount,
        custom_questions: 0, // LeetCode doesn't have custom questions
        leetcode_questions: totalQuestions,
        popular_tags: [
          { tag: 'Array', count: 1500 },
          { tag: 'Dynamic Programming', count: 500 },
          { tag: 'String', count: 800 },
          { tag: 'Hash Table', count: 400 },
          { tag: 'Math', count: 300 },
          { tag: 'Two Pointers', count: 250 },
          { tag: 'Greedy', count: 200 },
          { tag: 'Tree', count: 350 },
          { tag: 'Binary Search', count: 180 },
          { tag: 'Graph', count: 150 }
        ]
      };

      return NextResponse.json<QuestionStats>(stats, { status: 200 });
    } else {
      console.warn('Failed to fetch LeetCode stats, falling back to mock data:', leetcodeStats.error);
      // Fall back to mock data if LeetCode API fails
      const stats = getQuestionStats();
      return NextResponse.json<QuestionStats>(stats, { status: 200 });
    }

  } catch (error) {
    console.error('Error in question stats API:', error);
    // Fall back to mock data on error
    const stats = getQuestionStats();
    return NextResponse.json<QuestionStats>(stats, { status: 200 });
  }
}