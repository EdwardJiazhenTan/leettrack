import { NextRequest, NextResponse } from 'next/server';
import {
  getUserFromRequest,
  recordQuestionSolved,
  updateUserStats
} from '../../../lib/auth';

interface ProgressUpdateRequest {
  action: 'question_solved' | 'update_stats';
  difficulty?: 'easy' | 'medium' | 'hard';
  stats?: {
    enrolled_paths?: number;
    completed_paths?: number;
    current_streak?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const user_id = getUserFromRequest(request);
    if (!user_id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: ProgressUpdateRequest = await request.json();

    if (body.action === 'question_solved' && body.difficulty) {
      // Record that user solved a question
      const updatedStats = recordQuestionSolved(user_id, body.difficulty);
      return NextResponse.json({
        success: true,
        stats: updatedStats
      });
    } else if (body.action === 'update_stats' && body.stats) {
      // Update specific stats (like learning paths progress)
      const updatedStats = updateUserStats(user_id, body.stats);
      return NextResponse.json({
        success: true,
        stats: updatedStats
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide action and required fields.' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}