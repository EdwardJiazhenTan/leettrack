import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/leetcode-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Username is required'
        },
        { status: 400 }
      );
    }

    const result = await getUserProfile(username);

    if ('error' in result) {
      return NextResponse.json(
        {
          status: 'error',
          message: result.error,
          details: result.details
        },
        { status: result.error === 'User not found' ? 404 : 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'An error occurred while fetching user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}