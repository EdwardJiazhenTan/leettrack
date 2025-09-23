import { NextRequest, NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyPassword,
  createSession
} from '../../../../lib/auth';
import type { LoginRequest, AuthResponse } from '../../../../types/user';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Find user by email
    const userWithPassword = findUserByEmail(body.email);
    if (!userWithPassword) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(body.password, userWithPassword.password_hash);
    if (!isValidPassword) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSession(userWithPassword.user_id);

    // Return user data (without password)
    const user = {
      user_id: userWithPassword.user_id,
      email: userWithPassword.email,
      username: userWithPassword.username,
      leetcode_username: userWithPassword.leetcode_username,
      created_at: userWithPassword.created_at,
      updated_at: userWithPassword.updated_at,
    };

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user,
        token,
        message: 'Login successful'
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: 'An error occurred during login'
      },
      { status: 500 }
    );
  }
}