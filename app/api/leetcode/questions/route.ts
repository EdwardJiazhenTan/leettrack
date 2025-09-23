import { NextResponse } from 'next/server';
import { getQuestionsByTag } from '@/lib/leetcode-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tagsParam = searchParams.get('tags');
    const limitParam = searchParams.get('limit');
    const skipParam = searchParams.get('skip');
    const difficultyParam = searchParams.get('difficulty');

    const tags = tagsParam ? tagsParam.split(',').map(tag => tag.trim()) : [];
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    const skip = skipParam ? parseInt(skipParam, 10) : 0;
    const difficulty = difficultyParam || undefined;

    if (limit > 100) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Limit cannot exceed 100'
        },
        { status: 400 }
      );
    }

    const result = await getQuestionsByTag(tags, limit, skip, difficulty);

    if ('error' in result) {
      return NextResponse.json(
        {
          status: 'error',
          message: result.error,
          details: result.details
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while fetching questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}