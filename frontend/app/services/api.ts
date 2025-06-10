/**
 * API service for making requests to the backend
 */

// Use environment variable for API URL if available, or default to localhost
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

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
