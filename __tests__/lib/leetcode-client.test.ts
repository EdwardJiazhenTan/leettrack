import {
  getDailyProblem,
  getQuestionBySlug,
  getQuestionsByTag,
  getUserProfile,
} from "../../lib/leetcode-client";

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
const mockFetch = global.fetch;

describe("leetcode-client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDailyProblem", () => {
    it("should return daily problem data when API call succeeds", async () => {
      // Arrange
      const mockResponse = {
        data: {
          activeDailyCodingChallengeQuestion: {
            date: "2025-01-15",
            userStatus: "NotStarted",
            link: "https://leetcode.com/problems/two-sum/",
            question: {
              title: "Two Sum",
              titleSlug: "two-sum",
              difficulty: "Easy",
            },
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getDailyProblem();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining("questionOfToday"),
      });
    });

    it("should return error when HTTP request fails", async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      // Act
      const result = await getDailyProblem();

      // Assert
      expect(result).toEqual({
        error: "HTTP 500: Internal Server Error",
        details: "Failed to fetch from leetcode api",
      });
    });

    it("should return error when GraphQL API returns errors", async () => {
      // Arrange
      const mockResponse = {
        errors: [{ message: "GraphQL error message" }],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getDailyProblem();

      // Assert
      expect(result).toEqual({
        error: "graphql api error",
        details: "GraphQL error message",
      });
    });

    it("should return error when network request throws", async () => {
      // Arrange
      const errorMessage = "Network error";
      mockFetch.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await getDailyProblem();

      // Assert
      expect(result).toEqual({
        error: "Network error",
        details: errorMessage,
      });
    });
  });

  describe("getQuestionBySlug", () => {
    it("should return question details when API call succeeds", async () => {
      // Arrange
      const titleSlug = "two-sum";
      const mockQuestion = {
        questionId: "1",
        questionFrontendId: "1",
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
      };

      const mockResponse = {
        data: {
          question: mockQuestion,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getQuestionBySlug(titleSlug);

      // Assert
      expect(result).toEqual(mockQuestion);
      expect(mockFetch).toHaveBeenCalledWith("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining(titleSlug),
      });
    });

    it("should return error when question is not found", async () => {
      // Arrange
      const titleSlug = "non-existent-question";
      const mockResponse = {
        data: {
          question: null,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getQuestionBySlug(titleSlug);

      // Assert
      expect(result).toEqual({
        error: "Question not found",
        details: `No question found with slug: ${titleSlug}`,
      });
    });
  });

  describe("getQuestionsByTag", () => {
    it("should return questions list when API call succeeds", async () => {
      // Arrange
      const tags = ["array", "hash-table"];
      const limit = 10;
      const skip = 0;
      const difficulty = "Easy";

      const mockResponse = {
        data: {
          problemsetQuestionList: {
            total: 100,
            questions: [
              {
                title: "Two Sum",
                titleSlug: "two-sum",
                difficulty: "Easy",
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getQuestionsByTag(tags, limit, skip, difficulty);

      // Assert
      expect(result).toEqual(mockResponse.data.problemsetQuestionList);
      expect(mockFetch).toHaveBeenCalledWith("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining("problemsetQuestionList"),
      });
    });

    it("should handle empty tags array", async () => {
      // Arrange
      const mockResponse = {
        data: {
          problemsetQuestionList: {
            total: 2500,
            questions: [],
          },
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getQuestionsByTag([]);

      // Assert
      expect(result).toEqual(mockResponse.data.problemsetQuestionList);
    });
  });

  describe("getUserProfile", () => {
    it("should return user profile when API call succeeds", async () => {
      // Arrange
      const username = "testuser";
      const mockUser = {
        username: "testuser",
        profile: {
          realName: "Test User",
          ranking: 150000,
        },
      };

      const mockQuestionsCount = [{ difficulty: "Easy", count: 850 }];

      const mockResponse = {
        data: {
          matchedUser: mockUser,
          allQuestionsCount: mockQuestionsCount,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getUserProfile(username);

      // Assert
      expect(result).toEqual({
        user: mockUser,
        allQuestionsCount: mockQuestionsCount,
      });
      expect(mockFetch).toHaveBeenCalledWith("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining(username),
      });
    });

    it("should return error when user is not found", async () => {
      // Arrange
      const username = "nonexistentuser";
      const mockResponse = {
        data: {
          matchedUser: null,
          allQuestionsCount: [],
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await getUserProfile(username);

      // Assert
      expect(result).toEqual({
        error: "User not found",
        details: `No user found with username: ${username}`,
      });
    });
  });
});
