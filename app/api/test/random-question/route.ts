import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByTag } from '@/lib/leetcode-client';

/**
 * GET /api/test/random-question
 * Fetches a random question from LeetCode by topic and difficulty
 *
 * Query parameters:
 * - topic: string (e.g., "binary-search", "dynamic-programming")
 * - difficulty: "Easy" | "Medium" | "Hard"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    // Validate parameters
    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic parameter is required' },
        { status: 400 }
      );
    }

    if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return NextResponse.json(
        { success: false, message: 'Valid difficulty parameter is required (Easy, Medium, or Hard)' },
        { status: 400 }
      );
    }

    console.log(`Fetching questions for topic: ${topic}, difficulty: ${difficulty}`);

    // Fetch questions from LeetCode API
    // We'll fetch up to 100 questions to have a good pool for random selection
    const result = await getQuestionsByTag([topic], 100, 0, difficulty);

    // Check for errors
    if ('error' in result) {
      console.error('LeetCode API error:', result);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch questions from LeetCode',
          error: result.error,
          details: result.details
        },
        { status: 500 }
      );
    }

    // Check if we have questions
    if (!result.questions || result.questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No ${difficulty} questions found for topic: ${topic}`,
          total: 0
        },
        { status: 404 }
      );
    }

    // Filter out paid-only questions
    const freeQuestions = result.questions.filter((q: any) => !q.paidOnly);

    if (freeQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No free ${difficulty} questions found for topic: ${topic}`,
          total: result.questions.length,
          totalFree: 0
        },
        { status: 404 }
      );
    }

    // Select a random question
    const randomIndex = Math.floor(Math.random() * freeQuestions.length);
    const randomQuestion = freeQuestions[randomIndex];

    console.log(`Selected random question: ${randomQuestion.title} (${randomIndex + 1} of ${freeQuestions.length})`);

    // Format the response
    return NextResponse.json({
      success: true,
      question: {
        id: randomQuestion.frontendQuestionId,
        title: randomQuestion.title,
        titleSlug: randomQuestion.titleSlug,
        difficulty: randomQuestion.difficulty,
        url: `https://leetcode.com/problems/${randomQuestion.titleSlug}/`,
        acRate: randomQuestion.acRate,
        topicTags: randomQuestion.topicTags.map((tag: any) => ({
          name: tag.name,
          slug: tag.slug
        })),
        hasSolution: randomQuestion.hasSolution,
        hasVideoSolution: randomQuestion.hasVideoSolution
      },
      metadata: {
        topic,
        difficulty,
        totalAvailable: freeQuestions.length,
        totalWithPaid: result.total
      }
    });
  } catch (error) {
    console.error('Error fetching random question:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
