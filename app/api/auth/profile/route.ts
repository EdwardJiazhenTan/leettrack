import { NextRequest, NextResponse } from "next/server";
import {
  getUserFromRequest,
  findUserById,
  getUserStats,
  updateUser,
  checkEmailExists,
  checkUsernameExists,
  validateEmail,
} from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);

    if (!userAuth) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    // Handle backward compatibility - userAuth might be string or object
    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;

    const user = await findUserById(user_id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const stats = await getUserStats(user_id);

    return NextResponse.json(
      {
        success: true,
        user,
        stats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching profile",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;
    const body = await request.json();

    // Validate email format if provided
    if (body.email && !validateEmail(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 },
      );
    }

    // Get current user data
    const currentUser = await findUserById(user_id);
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Check if email is being changed and if it's already taken
    if (body.email && body.email !== currentUser.email) {
      if (await checkEmailExists(body.email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already taken",
          },
          { status: 409 },
        );
      }
    }

    // Check if username is being changed and if it's already taken
    if (body.username && body.username !== currentUser.username) {
      if (await checkUsernameExists(body.username)) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
          },
          { status: 409 },
        );
      }
    }

    // Update user
    const updatedUser = await updateUser(user_id, {
      username: body.username,
      email: body.email,
      leetcode_username: body.leetcode_username,
    });

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update user",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        message: "Profile updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating profile",
      },
      { status: 500 },
    );
  }
}
