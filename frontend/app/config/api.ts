// API Configuration - Use Next.js environment variable consistently
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
}

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL to avoid double slashes
  const cleanBaseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

// For backward compatibility - export a simple function that other files can use
export const getApiUrl = (endpoint: string): string => {
  return buildApiUrl(endpoint);
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
