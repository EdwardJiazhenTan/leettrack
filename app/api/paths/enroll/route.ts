import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { query, queryOne } from '@/lib/database';

export async function POST(request: NextRequest) {
  const userAuth = getUserFromRequest(request);
  if (!userAuth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;
  const body = await request.json();
  const { path_id } = body;

  if (!path_id) {
    return NextResponse.json(
      { success: false, message: 'path_id is required' },
      { status: 400 }
    );
  }

  try {
    const path = await queryOne<{ id: string; is_public: boolean }>(
      'SELECT id, is_public FROM learning_paths WHERE id = $1',
      [path_id]
    );

    if (!path) {
      return NextResponse.json(
        { success: false, message: 'Path not found' },
        { status: 404 }
      );
    }

    if (!path.is_public) {
      return NextResponse.json(
        { success: false, message: 'This path is not available for enrollment' },
        { status: 403 }
      );
    }

    const existing = await queryOne<{ id: string }>(
      'SELECT id FROM user_path_enrollments WHERE user_id = $1 AND path_id = $2',
      [user_id, path_id]
    );

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Already enrolled in this path' },
        { status: 409 }
      );
    }

    const enrollment = await queryOne<{
      id: string;
      user_id: string;
      path_id: string;
      enrolled_at: string;
    }>(
      `INSERT INTO user_path_enrollments (user_id, path_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, path_id]
    );

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Successfully enrolled in path'
    });
  } catch (error) {
    console.error('Path enrollment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to enroll in path' },
      { status: 500 }
    );
  }
}
