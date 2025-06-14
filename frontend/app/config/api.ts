// API Configuration
const API_CONFIG = {
  development: "http://localhost:5000",
  production: "http://44.205.249.75:5000",
};

// Get the current environment
const getEnvironment = (): "development" | "production" => {
  // In Next.js, we can use NODE_ENV or check if we're in browser
  if (typeof window !== "undefined") {
    // Browser environment - check hostname
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "development";
    }
  }

  // Server environment or production
  return process.env.NODE_ENV === "development" ? "development" : "production";
};

// Export the API base URL
export const API_BASE_URL = API_CONFIG[getEnvironment()];

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  ME: "/api/v1/auth/me",

  // User
  USER_DASHBOARD: "/api/v1/auth/user/dashboard/summary",
  USER_SETTINGS: "/api/v1/auth/user/settings",
  USER_QUESTIONS_NEED_RATING: "/api/v1/auth/user/questions/need-rating",
  USER_REVIEWS_TODAY: "/api/v1/auth/user/reviews/today",
  USER_RECENT_SUBMISSIONS_NEED_RATING:
    "/api/v1/auth/user/recent-submissions/need-rating",

  // LeetCode
  LEETCODE_PROFILE_STATS: "/api/v1/leetcode/profile/stats",

  // Learning Paths
  LEARNING_PATHS: "/api/v1/learning-paths",

  // Admin
  ADMIN_LEARNING_PATHS: "/api/v1/admin/learning-paths",
  ADMIN_LEARNING_PATHS_BULK_CREATE: "/api/v1/admin/learning-paths/bulk-create",
};
