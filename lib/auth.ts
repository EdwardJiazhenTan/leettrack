import { NextRequest } from 'next/server';

// Mock user database - in a real app, this would be a proper database
const mockUsers = new Map<string, {
  user_id: string;
  email: string;
  username: string;
  password_hash: string;
  leetcode_username?: string;
  created_at: string;
  updated_at: string;
}>();

// User stats tracking - TODO: In production, store this in database with proper indexing
const userStats = new Map<string, {
  total_questions_attempted: number;
  total_questions_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  current_streak: number;
  longest_streak: number;
  enrolled_paths: number;
  completed_paths: number;
  last_activity_date: string;
}>();

// Mock sessions - in a real app, this would use JWT or session store
const mockSessions = new Map<string, string>(); // token -> user_id

// TODO: For production, implement proper authentication:
// 1. Replace with real database (PostgreSQL, MongoDB, etc.)
// 2. Use proper JWT tokens with expiration
// 3. Implement secure session management
// 4. Add password hashing with bcrypt
// 5. Add rate limiting and security headers

// Clean start - no demo users, only real registered users

export async function hashPassword(password: string): Promise<string> {
  // Simple hash simulation - in production, use bcrypt
  return Buffer.from(password).toString('base64');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  leetcode_username?: string;
}) {
  const user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  // Hash the password properly
  const password_hash = await hashPassword(userData.password);

  const user = {
    user_id,
    email: userData.email,
    username: userData.username,
    password_hash,
    leetcode_username: userData.leetcode_username,
    created_at: now,
    updated_at: now,
  };

  // Initialize user stats
  userStats.set(user_id, {
    total_questions_attempted: 0,
    total_questions_solved: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    current_streak: 0,
    longest_streak: 0,
    enrolled_paths: 0,
    completed_paths: 0,
    last_activity_date: now,
  });

  mockUsers.set(user_id, user);
  return {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    leetcode_username: user.leetcode_username,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export function findUserByEmail(email: string) {
  for (const [id, user] of mockUsers) {
    if (user.email === email) {
      return {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        password_hash: user.password_hash,
        leetcode_username: user.leetcode_username,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
  }
  return null;
}

export function findUserById(user_id: string) {
  const user = mockUsers.get(user_id);
  if (!user) return null;

  return {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    leetcode_username: user.leetcode_username,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export function updateUser(user_id: string, updates: {
  username?: string;
  leetcode_username?: string;
  email?: string;
}) {
  const user = mockUsers.get(user_id);
  if (!user) return null;

  const updatedUser = {
    ...user,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  mockUsers.set(user_id, updatedUser);

  return {
    user_id: updatedUser.user_id,
    email: updatedUser.email,
    username: updatedUser.username,
    leetcode_username: updatedUser.leetcode_username,
    created_at: updatedUser.created_at,
    updated_at: updatedUser.updated_at,
  };
}

export function createSession(user_id: string): string {
  const token = generateToken();
  mockSessions.set(token, user_id);
  return token;
}

export function validateSession(token: string): string | null {
  return mockSessions.get(token) || null;
}

export function destroySession(token: string): void {
  mockSessions.delete(token);
}

export function getUserFromRequest(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice(7);
  return validateSession(token);
}

export function checkEmailExists(email: string): boolean {
  return findUserByEmail(email) !== null;
}

export function checkUsernameExists(username: string): boolean {
  for (const [id, user] of mockUsers) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
}

export function checkLeetCodeUsernameExists(leetcode_username: string): boolean {
  for (const [id, user] of mockUsers) {
    if (user.leetcode_username === leetcode_username) {
      return true;
    }
  }
  return false;
}

// User stats functions
export function getUserStats(user_id: string) {
  return userStats.get(user_id) || {
    total_questions_attempted: 0,
    total_questions_solved: 0,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    current_streak: 0,
    longest_streak: 0,
    enrolled_paths: 0,
    completed_paths: 0,
    last_activity_date: new Date().toISOString(),
  };
}

export function updateUserStats(user_id: string, updates: Partial<{
  total_questions_attempted: number;
  total_questions_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  current_streak: number;
  longest_streak: number;
  enrolled_paths: number;
  completed_paths: number;
}>) {
  const currentStats = getUserStats(user_id);
  const updatedStats = {
    ...currentStats,
    ...updates,
    last_activity_date: new Date().toISOString(),
  };

  // Update longest streak if current streak is higher
  if (updates.current_streak && updates.current_streak > currentStats.longest_streak) {
    updatedStats.longest_streak = updates.current_streak;
  }

  userStats.set(user_id, updatedStats);
  return updatedStats;
}

export function recordQuestionSolved(user_id: string, difficulty: 'easy' | 'medium' | 'hard') {
  const currentStats = getUserStats(user_id);
  const updates: any = {
    total_questions_solved: currentStats.total_questions_solved + 1,
    total_questions_attempted: currentStats.total_questions_attempted + 1,
  };

  // Update difficulty-specific counter
  updates[`${difficulty}_solved`] = currentStats[`${difficulty}_solved` as keyof typeof currentStats] + 1;

  // TODO: For production, implement proper streak calculation based on consecutive days
  // For now, just increment streak
  updates.current_streak = currentStats.current_streak + 1;

  return updateUserStats(user_id, updates);
}

// Function to clear all mock data (useful for testing)
export function clearMockData(): void {
  mockUsers.clear();
  mockSessions.clear();
  userStats.clear();
}

// Export for testing/debugging
export { mockUsers, mockSessions, userStats };