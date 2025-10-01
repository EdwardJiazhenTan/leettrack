import { GET, POST } from "../../../app/api/questions/route";
import {
  mockQuestion,
  mockCustomQuestion,
  mockCreateQuestionRequest,
  mockQuestionListResponse,
  mockToken,
} from "../../mocks/questions";

// Mock the modules
jest.mock("../../../lib/auth");
jest.mock("../../../lib/questions", () => ({
  createQuestion: jest.fn(),
  searchQuestions: jest.fn(),
  checkSlugExists: jest.fn(),
}));

import { getUserFromRequest } from "../../../lib/auth";
import {
  createQuestion,
  searchQuestions,
  checkSlugExists,
} from "../../../lib/questions";

const mockedGetUserFromRequest = getUserFromRequest as jest.MockedFunction<
  typeof getUserFromRequest
>;
const mockedCreateQuestion = createQuestion as jest.MockedFunction<
  typeof createQuestion
>;
const mockedSearchQuestions = searchQuestions as jest.MockedFunction<
  typeof searchQuestions
>;
const mockedCheckSlugExists = checkSlugExists as jest.MockedFunction<
  typeof checkSlugExists
>;

describe("/api/questions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return questions list with default parameters", async () => {
      // Arrange
      mockedSearchQuestions.mockReturnValue(mockQuestionListResponse);

      const request = new Request("http://localhost:3000/api/questions");

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedSearchQuestions).toHaveBeenCalledWith({
        query: undefined,
        difficulty: undefined,
        tags: undefined,
        is_custom: undefined,
        created_by: undefined,
        limit: undefined,
        offset: undefined,
        sort_by: undefined,
        sort_order: undefined,
      });
    });

    it("should return questions list with search parameters", async () => {
      // Arrange
      mockedSearchQuestions.mockReturnValue(mockQuestionListResponse);

      const request = new Request(
        "http://localhost:3000/api/questions?query=array&difficulty=Easy&tags=Array,Hash Table&limit=10&offset=5&sort_by=title&sort_order=asc",
      );

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockQuestionListResponse);
      expect(mockedSearchQuestions).toHaveBeenCalledWith({
        query: "array",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        is_custom: undefined,
        created_by: undefined,
        limit: 10,
        offset: 5,
        sort_by: "title",
        sort_order: "asc",
      });
    });

    it("should return 400 error when limit exceeds maximum", async () => {
      // Arrange
      const request = new Request(
        "http://localhost:3000/api/questions?limit=150",
      );

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe("Limit cannot exceed 100");
    });

    it("should handle is_custom parameter correctly", async () => {
      // Arrange
      mockedSearchQuestions.mockReturnValue(mockQuestionListResponse);

      const request = new Request(
        "http://localhost:3000/api/questions?is_custom=true",
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      expect(mockedSearchQuestions).toHaveBeenCalledWith({
        query: undefined,
        difficulty: undefined,
        tags: undefined,
        is_custom: true,
        created_by: undefined,
        limit: undefined,
        offset: undefined,
        sort_by: undefined,
        sort_order: undefined,
      });
    });

    it("should return 500 error when an exception occurs", async () => {
      // Arrange
      mockedSearchQuestions.mockImplementation(() => {
        throw new Error("Database error");
      });

      const request = new Request("http://localhost:3000/api/questions");

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "An error occurred while fetching questions",
      );
    });
  });

  describe("POST", () => {
    it("should create a new question successfully", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");
      mockedCheckSlugExists.mockReturnValue(false);
      mockedCreateQuestion.mockReturnValue(mockQuestion);

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(mockCreateQuestionRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseData).toEqual(mockQuestion);
      expect(mockedGetUserFromRequest).toHaveBeenCalledWith(request);
      expect(mockedCheckSlugExists).toHaveBeenCalledWith(
        mockCreateQuestionRequest.slug,
      );
      expect(mockedCreateQuestion).toHaveBeenCalledWith(
        mockCreateQuestionRequest,
        "user_123",
      );
    });

    it("should return 401 error when not authenticated", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockCreateQuestionRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe("Authentication required");
    });

    it("should return 400 error when required fields are missing", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");

      const incompleteRequest = {
        title: "Test Question",
        // missing slug and difficulty
      };

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(incompleteRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "Title, slug, and difficulty are required",
      );
    });

    it("should return 400 error for invalid difficulty", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");

      const invalidRequest = {
        ...mockCreateQuestionRequest,
        difficulty: "Invalid",
      };

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(invalidRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "Difficulty must be Easy, Medium, or Hard",
      );
    });

    it("should return 400 error for invalid slug format", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");

      const invalidRequest = {
        ...mockCreateQuestionRequest,
        slug: "Invalid Slug!",
      };

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(invalidRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "Slug must contain only lowercase letters, numbers, and hyphens",
      );
    });

    it("should return 409 error when slug already exists", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");
      mockedCheckSlugExists.mockReturnValue(true);

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(mockCreateQuestionRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "A question with this slug already exists",
      );
    });

    it("should return 400 error when tags is not an array", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");
      mockedCheckSlugExists.mockReturnValue(false);

      const invalidRequest = {
        ...mockCreateQuestionRequest,
        tags: "not-an-array",
      };

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(invalidRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe("Tags must be an array");
    });

    it("should return 500 error when an exception occurs", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue("user_123");
      mockedCheckSlugExists.mockReturnValue(false);
      mockedCreateQuestion.mockImplementation(() => {
        throw new Error("Database error");
      });

      const request = new Request("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockToken,
        },
        body: JSON.stringify(mockCreateQuestionRequest),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.status).toBe("error");
      expect(responseData.message).toBe(
        "An error occurred while creating the question",
      );
    });
  });
});
