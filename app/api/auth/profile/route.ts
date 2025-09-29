import { NextRequest, NextResponse } from "next/server";
import {
  getUserFromRequest,
  findUserById,
  getUserStats,
} from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log("Profile endpoint hit");

    const userAuth = getUserFromRequest(request);
    console.log("User auth:", userAuth);

    if (!userAuth) {
      console.log("No user auth found");
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
    console.log("User ID:", user_id);

    const user = await findUserById(user_id);
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const stats = await getUserStats(user_id);
    console.log("User stats:", stats);

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
