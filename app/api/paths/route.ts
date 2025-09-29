import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../lib/auth';
import {
  createPath,
  searchPaths,
} from '../../../lib/paths';
import type { CreatePathRequest, PathListResponse } from '../../../types/path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const params = {
      query: searchParams.get('query') || undefined,
      difficulty: (searchParams.get('difficulty') as 'Beginner' | 'Intermediate' | 'Advanced') || undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',').map(tag => tag.trim()) : undefined,
      is_public: searchParams.get('is_public') ? searchParams.get('is_public') === 'true' : undefined,
      created_by: searchParams.get('created_by') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined,
    };

    // Validate limit
    if (params.limit && params.limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Limit cannot exceed 100'
        },
        { status: 400 }
      );
    }

    const result = searchPaths(params);
    return NextResponse.json<PathListResponse>(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching paths'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const body: CreatePathRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.difficulty) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, description, and difficulty are required'
        },
        { status: 400 }
      );
    }

    // Validate difficulty
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(body.difficulty)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Difficulty must be Beginner, Intermediate, or Advanced'
        },
        { status: 400 }
      );
    }

    // Ensure required fields have default values
    const pathData: CreatePathRequest = {
      ...body,
      question_ids: body.question_ids || [],
      tags: body.tags || [],
      estimated_hours: body.estimated_hours || 1,
      is_public: body.is_public !== undefined ? body.is_public : false,
    };

    const path = createPath(pathData, user_id);
    return NextResponse.json(
      {
        success: true,
        path
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while creating the path'
      },
      { status: 500 }
    );
  }
}
