export interface User {
  user_id: string;
  email: string;
  username: string;
  leetcode_username?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  leetcode_username?: string;
}

export interface UpdateUserRequest {
  username?: string;
  leetcode_username?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface UserProfile {
  user: User;
  stats: UserStats;
}

export interface UserStats {
  total_questions_attempted: number;
  total_questions_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  current_streak: number;
  longest_streak: number;
  enrolled_paths: number;
  completed_paths: number;
}

export interface ApiError {
  status: 'error';
  message: string;
  details?: string;
}