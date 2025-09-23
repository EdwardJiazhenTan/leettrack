import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '../../../../lib/auth';
import type { AuthResponse } from '../../../../types/user';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Authorization token required'
        },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    destroySession(token);

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'An error occurred during logout'
      },
      { status: 500 }
    );
  }
}