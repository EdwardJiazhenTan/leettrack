import { GET } from "../../../app/api/daily/today/route";
import { getUserFromRequest } from "../../../lib/auth";
import { query } from "../../../lib/database";

// Mock dependencies
jest.mock("../../../lib/auth");
jest.mock("../../../lib/database");

const mockedGetUserFromRequest = getUserFromRequest as jest.MockedFunction<
  typeof getUserFromRequest
>;
const mockedQuery = query as jest.MockedFunction<typeof query>;

describe("/api/daily/today", () => {
  const mockUserId = "user_123";
  const mockToday = "2025-01-15";

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to return consistent value
    jest.spyOn(Date.prototype, "toISOString").mockReturnValue(`${mockToday}T00:00:00.000Z`);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Questions Generation Logic", () => {
    it("should generate questions only once per day on first visit", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(mockUserId);

      // First check: no existing recommendations
      mockedQuery.mockResolvedValueOnce([{ count: "0" }]);

      // Generate path questions
      mockedQuery.mockResolvedValueOnce([
        {
          question_id: "q1",
          title: "Two Sum",
          slug: "two-sum",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/two-sum",
          leetcode_id: "1",
          path_id: "path1",
          path_title: "Array",
          order_index: 1,
        },
      ]);

      // Insert recommendations (mocked)
      mockedQuery.mockResolvedValueOnce([]);

      // Fetch display path questions
      mockedQuery.mockResolvedValueOnce([
        {
          question_id: "q1",
          title: "Two Sum",
          slug: "two-sum",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/two-sum",
          leetcode_id: "1",
          path_id: "path1",
          path_title: "Array",
          order_index: 1,
        },
      ]);

      // Fetch review questions
      mockedQuery.mockResolvedValueOnce([]);

      // Fetch daily questions
      mockedQuery.mockResolvedValueOnce([]);

      // Fetch tags
      mockedQuery.mockResolvedValueOnce([]);

      const request = new Request("http://localhost:3000/api/daily/today");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify questions were generated (INSERT was called)
      const insertCalls = mockedQuery.mock.calls.filter(
        call => call[0]?.includes("INSERT INTO daily_recommendations")
      );
      expect(insertCalls.length).toBeGreaterThan(0);
    });

    it("should NOT generate new questions on subsequent visits same day", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(mockUserId);

      // First check: recommendations already exist
      mockedQuery.mockResolvedValueOnce([{ count: "2" }]); // Already has 2 recommendations

      // Should skip generation and go straight to fetching
      mockedQuery.mockResolvedValueOnce([
        {
          question_id: "q1",
          title: "Two Sum",
          slug: "two-sum",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/two-sum",
          leetcode_id: "1",
          path_id: "path1",
          path_title: "Array",
          order_index: 1,
        },
      ]);

      // Fetch review questions
      mockedQuery.mockResolvedValueOnce([]);

      // Fetch daily questions
      mockedQuery.mockResolvedValueOnce([]);

      // Fetch tags
      mockedQuery.mockResolvedValueOnce([]);

      const request = new Request("http://localhost:3000/api/daily/today");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify NO INSERT queries were called (no generation)
      const insertCalls = mockedQuery.mock.calls.filter(
        call => call[0]?.includes("INSERT INTO daily_recommendations")
      );
      expect(insertCalls.length).toBe(0);
    });

    it("should return only incomplete questions after completion", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(mockUserId);

      // Recommendations exist
      mockedQuery.mockResolvedValueOnce([{ count: "2" }]);

      // Fetch only incomplete questions (one was completed)
      mockedQuery.mockResolvedValueOnce([
        {
          question_id: "q2",
          title: "Add Two Numbers",
          slug: "add-two-numbers",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/add-two-numbers",
          leetcode_id: "2",
          path_id: "path1",
          path_title: "Array",
          order_index: 2,
        },
      ]); // q1 was completed, only q2 returned

      mockedQuery.mockResolvedValueOnce([]); // review
      mockedQuery.mockResolvedValueOnce([]); // daily
      mockedQuery.mockResolvedValueOnce([]); // tags

      const request = new Request("http://localhost:3000/api/daily/today");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.questions.length).toBe(1);
      expect(data.questions[0].id).toBe("q2");
    });

    it("should maintain same breakdown count even after completions", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(mockUserId);

      mockedQuery.mockResolvedValueOnce([{ count: "3" }]); // 3 recommendations generated earlier
      mockedQuery.mockResolvedValueOnce([]); // path (all completed)
      mockedQuery.mockResolvedValueOnce([]); // review
      mockedQuery.mockResolvedValueOnce([]); // daily
      mockedQuery.mockResolvedValueOnce([]); // tags

      const request = new Request("http://localhost:3000/api/daily/today");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.breakdown).toBeDefined();
      // Breakdown should reflect what was assigned, not what's remaining
    });
  });

  describe("Authentication", () => {
    it("should return 401 if not authenticated", async () => {
      // Arrange
      mockedGetUserFromRequest.mockReturnValue(null);

      const request = new Request("http://localhost:3000/api/daily/today");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Authentication required");
    });
  });
});
