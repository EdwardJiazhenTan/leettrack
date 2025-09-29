import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: true,
        message: "Test profile endpoint works",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Test profile error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Test profile error",
      },
      { status: 500 },
    );
  }
}
