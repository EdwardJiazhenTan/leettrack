/**
 * API service for making requests to the backend
 */

// Use environment variable for API URL if available, or default to EC2 server
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://44.205.249.75:5000/api/v1";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

interface QuestionForReview {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  confidence: string;
  times_reviewed: number;
  last_reviewed: string | null;
  next_review: string | null;
}

interface QuestionNeedingRating {
  user_question_id: number;
  question_id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solved_at: string | null;
  times_reviewed: number;
}

interface DailyQuestionData {
  question: {
    titleSlug: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
  };
}

interface DashboardData {
  new_questions_available: number;
  reviews_due_today: number;
  questions_needing_rating: number;
}

interface NextQuestionResult {
  type: "review" | "daily" | "rating" | "study";
  url: string;
  title: string;
  source: "reviews_due" | "daily_challenge" | "needs_rating" | "study_plan";
}

/**
 * Make a GET request to the API
 */
export async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      mode: "cors", // Explicitly set CORS mode
    });

    // Handle CORS or network errors
    if (response.status === 0 || response.type === "opaque") {
      console.error("CORS error or network failure");
      return {
        data: null,
        error: "Cross-origin request blocked. CORS issue detected.",
        status: 0,
      };
    }

    let data;
    try {
      data = await response.json();
    } catch {
      // Ignore JSON parsing errors
      data = null;
    }

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data?.message || "An error occurred",
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * Make an authenticated GET request to the API with JWT token
 */
export async function fetchApiWithAuth<T>(
  endpoint: string
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        data: null,
        error: "No access token found",
        status: 401,
      };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      mode: "cors",
    });

    // Handle CORS or network errors
    if (response.status === 0 || response.type === "opaque") {
      console.error("CORS error or network failure");
      return {
        data: null,
        error: "Cross-origin request blocked. CORS issue detected.",
        status: 0,
      };
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data?.message || "An error occurred",
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * Make a POST request to the API
 */
export async function postApi<T, D>(
  endpoint: string,
  data: D
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      mode: "cors", // Explicitly set CORS mode
      body: JSON.stringify(data),
    });

    // Handle CORS or network errors
    if (response.status === 0 || response.type === "opaque") {
      console.error("CORS error or network failure");
      return {
        data: null,
        error: "Cross-origin request blocked. CORS issue detected.",
        status: 0,
      };
    }

    const responseData = await response.json();

    return {
      data: response.ok ? responseData : null,
      error: response.ok ? null : responseData.message || "An error occurred",
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * Make a POST request to the API with authentication
 */
export async function postApiWithAuth<T, D>(
  endpoint: string,
  data: D
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        data: null,
        error: "No access token found",
        status: 401,
      };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    });

    // Handle CORS or network errors
    if (response.status === 0 || response.type === "opaque") {
      console.error("CORS error or network failure");
      return {
        data: null,
        error: "Cross-origin request blocked. CORS issue detected.",
        status: 0,
      };
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    return {
      data: response.ok ? responseData : null,
      error: response.ok ? null : responseData?.message || "An error occurred",
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * API functions for LeetCode
 */
export const leetcodeApi = {
  getDailyQuestion: () => fetchApi("/leetcode/daily"),
  getProblems: (limit = 20, skip = 0, tags?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("skip", skip.toString());
    if (tags) params.append("tags", tags);
    if (difficulty) params.append("difficulty", difficulty);

    return fetchApi(`/leetcode/problems?${params.toString()}`);
  },
  getProblemBySlug: (titleSlug: string) =>
    fetchApi(`/leetcode/problem/${titleSlug}`),
  getUserProfileStats: () => fetchApiWithAuth("/leetcode/profile/stats"),
};

/**
 * API functions for Learning Paths
 */
export const learningPathsApi = {
  getPaths: (params?: {
    source?: string;
    difficulty?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return fetchApi(`/learning-paths?${queryParams.toString()}`);
  },
  getPathDetails: (pathId: number) => fetchApi(`/learning-paths/${pathId}`),
};

/**
 * API functions for Authentication and User Data
 */
export const authApi = {
  getTodaysReviews: () => fetchApiWithAuth("/auth/user/reviews/today"),
  getQuestionsNeedingRating: () =>
    fetchApiWithAuth("/auth/user/questions/need-rating"),
  getDashboardSummary: () => fetchApiWithAuth("/auth/user/dashboard/summary"),
  rateQuestion: (
    userQuestionId: number,
    data: { confidence: string; notes?: string }
  ) => postApiWithAuth(`/auth/user/questions/${userQuestionId}/rate`, data),
  completeReview: (
    userQuestionId: number,
    data: { confidence?: string; notes?: string }
  ) =>
    postApiWithAuth(
      `/auth/user/questions/${userQuestionId}/complete-review`,
      data
    ),
  /**
   * Get the next question to solve based on priority: reviews → daily → study plan
   */
  getNextQuestion: async (): Promise<NextQuestionResult | null> => {
    try {
      // Fetch all necessary data in parallel
      const [reviewsResponse, dailyResponse, dashboardResponse] =
        await Promise.all([
          authApi.getTodaysReviews(),
          leetcodeApi.getDailyQuestion(),
          authApi.getDashboardSummary(),
        ]);

      // Check for reviews due today (highest priority)
      if (!reviewsResponse.error && reviewsResponse.data) {
        const reviewsData = reviewsResponse.data as {
          data?: { reviews?: QuestionForReview[] };
        };
        const reviews = reviewsData?.data?.reviews || [];
        if (reviews.length > 0) {
          const firstReview = reviews[0];
          return {
            type: "review",
            url: firstReview.url,
            title: firstReview.title,
            source: "reviews_due",
          };
        }
      }

      // Check for daily challenge (second priority)
      if (!dailyResponse.error && dailyResponse.data) {
        const dailyData = dailyResponse.data as DailyQuestionData;
        if (dailyData?.question?.titleSlug) {
          return {
            type: "daily",
            url: `https://leetcode.com/problems/${dailyData.question.titleSlug}/`,
            title: dailyData.question.title,
            source: "daily_challenge",
          };
        }
      }

      // Check for questions needing rating (third priority)
      const ratingsResponse = await authApi.getQuestionsNeedingRating();
      if (!ratingsResponse.error && ratingsResponse.data) {
        const ratingsData = ratingsResponse.data as {
          data?: { questions?: QuestionNeedingRating[] };
        };
        const questions = ratingsData?.data?.questions || [];
        if (questions.length > 0) {
          const firstQuestion = questions[0];
          return {
            type: "rating",
            url: firstQuestion.url,
            title: firstQuestion.title,
            source: "needs_rating",
          };
        }
      }

      // Check for new questions in study plan (lowest priority)
      if (!dashboardResponse.error && dashboardResponse.data) {
        const dashboardData = dashboardResponse.data as DashboardData;
        if (dashboardData?.new_questions_available > 0) {
          return {
            type: "study",
            url: "/paths",
            title: "Browse Learning Paths",
            source: "study_plan",
          };
        }
      }

      // No questions available
      return null;
    } catch (error) {
      console.error("Error finding next question:", error);
      return null;
    }
  },
};
