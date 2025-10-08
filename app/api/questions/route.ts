import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/auth";
import {
  createQuestion,
  searchQuestions,
  checkSlugExists,
  getQuestionStats,
} from "../../../lib/questions";
import type {
  CreateQuestionRequest,
  QuestionSearchParams,
  QuestionListResponse,
  QuestionStats,
} from "../../../types/question";
import type { ApiError } from "../../../types/user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const params: QuestionSearchParams = {
      query: searchParams.get("query") || undefined,
      difficulty:
        (searchParams.get("difficulty") as "Easy" | "Medium" | "Hard") ||
        undefined,
      tags: searchParams.get("tags")
        ? searchParams
            .get("tags")!
            .split(",")
            .map((tag) => tag.trim())
        : undefined,
      is_custom: searchParams.get("is_custom")
        ? searchParams.get("is_custom") === "true"
        : undefined,
      created_by: searchParams.get("created_by") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!, 10)
        : undefined,
      sort_by:
        (searchParams.get("sort_by") as
          | "title"
          | "difficulty"
          | "created_at"
          | "updated_at") || undefined,
      sort_order:
        (searchParams.get("sort_order") as "asc" | "desc") || undefined,
    };

    // Validate limit
    if (params.limit && params.limit > 100) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Limit cannot exceed 100",
        },
        { status: 400 },
      );
    }

    const result = await searchQuestions(params);
    console.log("Questions API - Search params:", params);
    console.log("Questions API - Result:", result);

    return NextResponse.json<QuestionListResponse>(result, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "An error occurred while fetching questions",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userAuth = getUserFromRequest(request);
    if (!userAuth) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const user_id = typeof userAuth === 'string' ? userAuth : userAuth.user_id;

    const body: CreateQuestionRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.difficulty) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Title, slug, and difficulty are required",
        },
        { status: 400 },
      );
    }

    // Validate difficulty
    if (!["Easy", "Medium", "Hard"].includes(body.difficulty)) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Difficulty must be Easy, Medium, or Hard",
        },
        { status: 400 },
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message:
            "Slug must contain only lowercase letters, numbers, and hyphens",
        },
        { status: 400 },
      );
    }

    // Check if slug already exists
    if (await checkSlugExists(body.slug)) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "A question with this slug already exists",
        },
        { status: 409 },
      );
    }

    // Ensure tags is an array
    if (!Array.isArray(body.tags)) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Tags must be an array",
        },
        { status: 400 },
      );
    }

    const question = await createQuestion(body, user_id);

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "An error occurred while creating the question",
      },
      { status: 500 },
    );
  }
}
