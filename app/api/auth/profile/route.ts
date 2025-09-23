import { NextRequest, NextResponse } from 'next/server';
import {
  getUserFromRequest,
  findUserById,
  updateUser,
  checkUsernameExists,
  checkEmailExists
} from '../../../../lib/auth';
import type { UpdateUserRequest, UserProfile, ApiError } from '../../../../types/user';

export async function GET(request: NextRequest) {
  try {
    const user_id = getUserFromRequest(request);
    if (!user_id) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const user = findUserById(user_id);
    if (!user) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    // Mock user stats - in a real app, these would come from database queries
    const stats = {
      total_questions_attempted: 75,
      total_questions_solved: 45,
      easy_solved: 20,
      medium_solved: 18,
      hard_solved: 7,
      current_streak: 7,
      longest_streak: 14,
      enrolled_paths: 3,
      completed_paths: 1,
    };

    const profile: UserProfile = {
      user,
      stats
    };

    return NextResponse.json(profile, { status: 200 });

  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: 'error',
        message: 'An error occurred while fetching profile'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user_id = getUserFromRequest(request);
    if (!user_id) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const user = findUserById(user_id);
    if (!user) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    const body: UpdateUserRequest = await request.json();

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json<ApiError>(
          {
            status: 'error',
            message: 'Invalid email format'
          },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = checkEmailExists(body.email);
      if (existingUser && body.email !== user.email) {
        return NextResponse.json<ApiError>(
          {
            status: 'error',
            message: 'Email already in use'
          },
          { status: 409 }
        );
      }
    }

    // Check if username is already taken by another user
    if (body.username) {
      const existingUser = checkUsernameExists(body.username);
      if (existingUser && body.username !== user.username) {
        return NextResponse.json<ApiError>(
          {
            status: 'error',
            message: 'Username already taken'
          },
          { status: 409 }
        );
      }
    }

    const updatedUser = updateUser(user_id, body);
    if (!updatedUser) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'Failed to update user'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: 'error',
        message: 'An error occurred while updating profile'
      },
      { status: 500 }
    );
  }
}