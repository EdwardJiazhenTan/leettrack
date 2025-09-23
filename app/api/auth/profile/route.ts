import { NextRequest, NextResponse } from 'next/server';
import {
  getUserFromRequest,
  findUserById,
  updateUser,
  checkUsernameExists,
  checkEmailExists,
  getUserStats
} from '../../../../lib/auth';
import { getUserProfile as getLeetCodeProfile } from '../../../../lib/leetcode-client';
import type { UpdateUserRequest, UserProfile, ApiError } from '../../../../types/user';

export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    // Handle backward compatibility - userAuth might be string or object
    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    const user = await findUserById(user_id);
    if (!user) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    let stats = await getUserStats(user_id);

    // If user has a LeetCode username, fetch real stats from LeetCode
    if (user.leetcode_username) {
      try {
        const leetcodeData = await getLeetCodeProfile(user.leetcode_username);

        if (!('error' in leetcodeData)) {
          // Extract stats from LeetCode API response
          const { user: leetcodeUser, allQuestionsCount } = leetcodeData;

          // Map LeetCode stats to our format
          const totalEasy = allQuestionsCount.find((q: any) => q.difficulty === 'Easy')?.count || 0;
          const totalMedium = allQuestionsCount.find((q: any) => q.difficulty === 'Medium')?.count || 0;
          const totalHard = allQuestionsCount.find((q: any) => q.difficulty === 'Hard')?.count || 0;

          const solvedEasy = leetcodeUser.submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'Easy')?.count || 0;
          const solvedMedium = leetcodeUser.submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'Medium')?.count || 0;
          const solvedHard = leetcodeUser.submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'Hard')?.count || 0;

          const totalSolved = solvedEasy + solvedMedium + solvedHard;
          const totalQuestions = totalEasy + totalMedium + totalHard;

          // TODO: For production, implement proper streak calculation from submission calendar
          // For now, use stored streak data or calculate from submission calendar
          const currentStreak = stats.current_streak; // Keep existing streak logic
          const longestStreak = stats.longest_streak; // Keep existing streak logic

          stats = {
            total_questions_attempted: totalSolved, // LeetCode doesn't track attempts separately
            total_questions_solved: totalSolved,
            easy_solved: solvedEasy,
            medium_solved: solvedMedium,
            hard_solved: solvedHard,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            enrolled_paths: stats.enrolled_paths, // Keep app-specific data
            completed_paths: stats.completed_paths, // Keep app-specific data
            last_activity_date: new Date().toISOString(),
          };
        } else {
          console.warn(`Failed to fetch LeetCode stats for ${user.leetcode_username}:`, leetcodeData.error);
          // Fall back to stored stats if LeetCode API fails
        }
      } catch (error) {
        console.error('Error fetching LeetCode profile:', error);
        // Fall back to stored stats if there's an error
      }
    }

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
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json<ApiError>(
        {
          status: 'error',
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    // Handle backward compatibility - userAuth might be string or object
    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    const user = await findUserById(user_id);
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
      const existingUser = await checkEmailExists(body.email);
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
      const existingUser = await checkUsernameExists(body.username);
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

    const updatedUser = await updateUser(user_id, body);
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