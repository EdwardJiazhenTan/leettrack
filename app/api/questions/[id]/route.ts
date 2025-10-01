import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import {
  findQuestionById,
  updateQuestion,
  deleteQuestion,
  checkSlugExists,
} from "../../../../lib/questions";
import type {
  UpdateQuestionRequest,
  ApiError,
} from "../../../../types/question";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question ID is required",
        },
        { status: 400 },
      );
    }

    const question = await findQuestionById(id);

    if (!question) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "An error occurred while fetching the question",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user_id = getUserFromRequest(request);

    if (!user_id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question ID is required",
        },
        { status: 400 },
      );
    }

    const existingQuestion = await findQuestionById(id);

    if (!existingQuestion) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question not found",
        },
        { status: 404 },
      );
    }

    // Check if user owns this question (for custom questions)
    if (existingQuestion.is_custom && existingQuestion.created_by !== user_id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "You can only edit questions you created",
        },
        { status: 403 },
      );
    }

    const body: UpdateQuestionRequest = await request.json();

    // Validate difficulty if provided
    if (
      body.difficulty &&
      !["Easy", "Medium", "Hard"].includes(body.difficulty)
    ) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Difficulty must be Easy, Medium, or Hard",
        },
        { status: 400 },
      );
    }

    // Validate slug format if provided
    if (body.slug) {
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

      // Check if slug already exists (excluding current question)
      const slugExists = await checkSlugExists(body.slug, id);
      if (slugExists) {
        return NextResponse.json<ApiError>(
          {
            status: "error",
            message: "A question with this slug already exists",
          },
          { status: 409 },
        );
      }
    }

    // Validate tags if provided
    if (body.tags && !Array.isArray(body.tags)) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Tags must be an array",
        },
        { status: 400 },
      );
    }

    const updatedQuestion = await updateQuestion(id, body);

    if (!updatedQuestion) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Failed to update question",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "An error occurred while updating the question",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user_id = getUserFromRequest(request);

    if (!user_id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question ID is required",
        },
        { status: 400 },
      );
    }

    const existingQuestion = await findQuestionById(id);

    if (!existingQuestion) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Question not found",
        },
        { status: 404 },
      );
    }

    // Check if user owns this question (for custom questions)
    if (existingQuestion.is_custom && existingQuestion.created_by !== user_id) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "You can only delete questions you created",
        },
        { status: 403 },
      );
    }

    const deleted = await deleteQuestion(id);

    if (!deleted) {
      return NextResponse.json<ApiError>(
        {
          status: "error",
          message: "Failed to delete question",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Question deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        status: "error",
        message: "An error occurred while deleting the question",
      },
      { status: 500 },
    );
  }
}
