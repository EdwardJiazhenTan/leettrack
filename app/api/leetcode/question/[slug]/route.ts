import { NextResponse } from 'next/server';
import { getQuestionBySlug } from '@/lib/leetcode-client';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Question slug is required'
        },
        { status: 400 }
      );
    }

    const result = await getQuestionBySlug(slug);

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
        message: 'An error occurred while fetching the question',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}