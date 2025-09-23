import { NextRequest, NextResponse } from 'next/server';
import {
  createUser,
  checkEmailExists,
  checkUsernameExists,
  createSession
} from '../../../../lib/auth';
import type { CreateUserRequest, AuthResponse } from '../../../../types/user';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Email, username, and password are required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (checkEmailExists(body.email)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Email already registered'
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    if (checkUsernameExists(body.username)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Username already taken'
        },
        { status: 409 }
      );
    }

    // Create user
    const user = createUser({
      email: body.email,
      username: body.username,
      password: body.password,
      leetcode_username: body.leetcode_username
    });

    // Create session token
    const token = createSession(user.user_id);

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user,
        token,
        message: 'User registered successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'An error occurred during registration'
      },
      { status: 500 }
    );
  }
}