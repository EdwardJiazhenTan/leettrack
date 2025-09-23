import { NextRequest, NextResponse } from 'next/server';
import { getQuestionStats } from '../../../../lib/questions';
import type { QuestionStats, ApiError } from '../../../../types/question';

export async function GET(request: NextRequest) {
  try {
    const stats = getQuestionStats();
    return NextResponse.json<QuestionStats>(stats, { status: 200 });

  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: 'error',
        message: 'An error occurred while fetching question statistics'
      },
      { status: 500 }
    );
  }
}