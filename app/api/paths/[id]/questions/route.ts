import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../../lib/auth';
import {
  findPathById,
  addQuestionToPath,
  removeQuestionFromPath,
} from '../../../../../lib/paths';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: pathId } = await context.params;

    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;
    const body = await request.json();

    if (!body.question_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Question ID is required'
        },
        { status: 400 }
      );
    }

    // Check if path exists and user owns it
    const path = findPathById(pathId);
    if (!path) {
      return NextResponse.json(
        {
          success: false,
          message: 'Path not found'
        },
        { status: 404 }
      );
    }

    if (path.created_by !== user_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only modify paths you created'
        },
        { status: 403 }
      );
    }

    const updatedPath = addQuestionToPath(pathId, body.question_id);

    return NextResponse.json(
      {
        success: true,
        message: 'Question added to path',
        path: updatedPath
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while adding question to path'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: pathId } = await context.params;

    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const user_id = typeof userAuth === "string" ? userAuth : userAuth.user_id;
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Question ID is required'
        },
        { status: 400 }
      );
    }

    // Check if path exists and user owns it
    const path = findPathById(pathId);
    if (!path) {
      return NextResponse.json(
        {
          success: false,
          message: 'Path not found'
        },
        { status: 404 }
      );
    }

    if (path.created_by !== user_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only modify paths you created'
        },
        { status: 403 }
      );
    }

    const updatedPath = removeQuestionFromPath(pathId, questionId);

    return NextResponse.json(
      {
        success: true,
        message: 'Question removed from path',
        path: updatedPath
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while removing question from path'
      },
      { status: 500 }
    );
  }
}
