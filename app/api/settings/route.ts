import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { queryOne, query } from '@/lib/database';

// GET user settings
export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    // Get user info including leetcode_username
    const user = await queryOne<{
      id: string;
      email: string;
      username: string;
      leetcode_username: string | null;
    }>(
      'SELECT id, email, username, leetcode_username FROM users WHERE id = $1',
      [user_id]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user settings (create default if doesn't exist)
    let settings = await queryOne<{
      user_id: string;
      path_questions_per_day: number;
      review_interval_mode: string;
      review_randomized: boolean;
      path_randomized: boolean;
    }>(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [user_id]
    );

    if (!settings) {
      // Create default settings
      settings = await queryOne<{
        user_id: string;
        path_questions_per_day: number;
        review_interval_mode: string;
        review_randomized: boolean;
        path_randomized: boolean;
      }>(
        `INSERT INTO user_settings (user_id) VALUES ($1)
         RETURNING *`,
        [user_id]
      );
    }

    return NextResponse.json({
      success: true,
      settings: {
        leetcode_username: user.leetcode_username,
        path_questions_per_day: settings?.path_questions_per_day || 3,
        review_interval_mode: settings?.review_interval_mode || 'standard',
        review_randomized: settings?.review_randomized || false,
        path_randomized: settings?.path_randomized || false,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user settings
export async function PUT(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    const {
      leetcode_username,
      path_questions_per_day,
      review_interval_mode,
      review_randomized,
      path_randomized,
    } = await request.json();

    // Update leetcode_username if provided
    if (leetcode_username !== undefined) {
      await query(
        'UPDATE users SET leetcode_username = $1 WHERE id = $2',
        [leetcode_username || null, user_id]
      );
    }

    // Update user settings
    const settings = await queryOne<{
      user_id: string;
      path_questions_per_day: number;
      review_interval_mode: string;
      review_randomized: boolean;
      path_randomized: boolean;
    }>(
      `INSERT INTO user_settings (
        user_id,
        path_questions_per_day,
        review_interval_mode,
        review_randomized,
        path_randomized
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        path_questions_per_day = COALESCE($2, user_settings.path_questions_per_day),
        review_interval_mode = COALESCE($3, user_settings.review_interval_mode),
        review_randomized = COALESCE($4, user_settings.review_randomized),
        path_randomized = COALESCE($5, user_settings.path_randomized),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        user_id,
        path_questions_per_day,
        review_interval_mode,
        review_randomized,
        path_randomized,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
