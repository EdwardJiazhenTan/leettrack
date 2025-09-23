import type { User, CreateUserRequest, LoginRequest, AuthResponse, UserProfile } from '../../types/user';

export const mockUser: User = {
  user_id: 'user_123',
  email: 'test@example.com',
  username: 'testuser',
  leetcode_username: 'leetcode_user',
  created_at: '2025-01-15T10:00:00.000Z',
  updated_at: '2025-01-15T10:00:00.000Z',
};

export const mockUserProfile: UserProfile = {
  user: mockUser,
  stats: {
    total_questions_attempted: 0,
    total_questions_solved: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    current_streak: 0,
    longest_streak: 0,
    enrolled_paths: 0,
    completed_paths: 0,
  }
};

export const mockCreateUserRequest: CreateUserRequest = {
  email: 'newuser@example.com',
  username: 'newuser',
  password: 'password123',
  leetcode_username: 'new_leetcode_user'
};

export const mockLoginRequest: LoginRequest = {
  email: 'test@example.com',
  password: 'password123'
};

export const mockAuthResponse: AuthResponse = {
  success: true,
  user: mockUser,
  token: 'mock_token_123',
  message: 'Success'
};

export const mockToken = 'Bearer mock_token_123';