import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { queryOne } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;

    const user = await queryOne<{
      id: string;
      email: string;
      username: string;
      leetcode_username: string | null;
    }>(
      "SELECT id, email, username, leetcode_username FROM users WHERE id = $1",
      [user_id],
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        leetcode_username: user.leetcode_username,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
