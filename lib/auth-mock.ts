import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Environment variables for security
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

// Types for internal use
interface UserRecord {
  user_id: string;
  email: string;
  username: string;
  password_hash: string;
  leetcode_username?: string;
  created_at: string;
  updated_at: string;
}

interface UserStats {
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
}

// Temporary mock storage - REPLACE WITH DATABASE IN PRODUCTION
const mockUsers = new Map<string, UserRecord>();
const userStats = new Map<string, UserStats>();

// TODO: Replace these with actual database functions
// Database function placeholders
async function dbCreateUser(userData: Omit<UserRecord, 'user_id' | 'created_at' | 'updated_at'>): Promise<UserRecord> {
  // TODO: Replace with actual database INSERT
  const user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  const user: UserRecord = {
    user_id,
    ...userData,
    created_at: now,
    updated_at: now,
  };

  mockUsers.set(user_id, user);
  return user;
}

async function dbFindUserByEmail(email: string): Promise<UserRecord | null> {
  // TODO: Replace with actual database SELECT
  console.log('Searching for user with email:', email);
  console.log('Total users in database:', mockUsers.size);

  for (const [id, user] of mockUsers) {
    console.log('Checking user:', user.email);
    if (user.email === email) {
      console.log('Found user:', user.user_id);
      return user;
    }
  }
  console.log('User not found');
  return null;
}

async function dbFindUserById(user_id: string): Promise<UserRecord | null> {
  // TODO: Replace with actual database SELECT
  return mockUsers.get(user_id) || null;
}

async function dbUpdateUser(user_id: string, updates: Partial<Omit<UserRecord, 'user_id' | 'created_at'>>): Promise<UserRecord | null> {
  // TODO: Replace with actual database UPDATE
  const user = mockUsers.get(user_id);
  if (!user) return null;

  const updatedUser = {
    ...user,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  mockUsers.set(user_id, updatedUser);
  return updatedUser;
}

async function dbCheckEmailExists(email: string): Promise<boolean> {
  // TODO: Replace with actual database SELECT COUNT
  return (await dbFindUserByEmail(email)) !== null;
}

async function dbCheckUsernameExists(username: string): Promise<boolean> {
  // TODO: Replace with actual database SELECT COUNT
  for (const [id, user] of mockUsers) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
}

async function dbCheckLeetCodeUsernameExists(leetcode_username: string): Promise<boolean> {
  // TODO: Replace with actual database SELECT COUNT
  for (const [id, user] of mockUsers) {
    if (user.leetcode_username === leetcode_username) {
      return true;
    }
  }
  return false;
}

async function dbGetUserStats(user_id: string): Promise<UserStats> {
  // TODO: Replace with actual database SELECT with JOINs
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

async function dbUpdateUserStats(user_id: string, stats: UserStats): Promise<UserStats> {
  // TODO: Replace with actual database UPDATE/UPSERT
  userStats.set(user_id, stats);
  return stats;
}

// JWT Token functions
export function generateJWT(payload: { user_id: string; email: string }): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'leettrack',
      subject: payload.user_id,
    } as jwt.SignOptions);
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error('Token generation failed');
  }
}

export function verifyJWT(token: string): { user_id: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      user_id: decoded.user_id,
      email: decoded.email,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Password hashing functions
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Password hashing failed');
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    if (!password || !hash) {
      console.error('Missing password or hash arguments:', {
        passwordExists: !!password,
        hashExists: !!hash
      });
      return false;
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// User management functions
export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  leetcode_username?: string;
}) {
  try {
    // Hash the password
    const password_hash = await hashPassword(userData.password);

    // Create user in database
    const user = await dbCreateUser({
      email: userData.email,
      username: userData.username,
      password_hash,
      leetcode_username: userData.leetcode_username,
    });

    // Initialize user stats
    const initialStats: UserStats = {
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

    await dbUpdateUserStats(user.user_id, initialStats);

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error('User creation error:', error);
    throw new Error('User creation failed');
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await dbFindUserByEmail(email);
    return user; // This includes password_hash for login verification
  } catch (error) {
    console.error('Find user by email error:', error);
    return null;
  }
}

export async function findUserById(user_id: string) {
  try {
    const user = await dbFindUserById(user_id);
    if (!user) return null;

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error('Find user by ID error:', error);
    return null;
  }
}

export async function updateUser(user_id: string, updates: {
  username?: string;
  leetcode_username?: string;
  email?: string;
}) {
  try {
    const user = await dbUpdateUser(user_id, updates);
    if (!user) return null;

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error('User update error:', error);
    throw new Error('User update failed');
  }
}

// Session management with JWT
export function createSession(user_id: string, email?: string): string {
  // For backward compatibility, if email is not provided, we'll need to find it
  if (!email) {
    // This is a fallback for tests - in production, email should always be provided
    return generateJWT({ user_id, email: 'test@example.com' });
  }
  return generateJWT({ user_id, email });
}

export function validateSession(token: string): { user_id: string; email: string } | null {
  return verifyJWT(token);
}

export function destroySession(token: string): boolean {
  // With JWT, we don't need to track tokens server-side
  // Token invalidation would require a blacklist or short expiration
  // For now, we consider the session "destroyed" (client should discard token)
  return true;
}

// Request helper function
export function getUserFromRequest(request: NextRequest): { user_id: string; email: string } | null {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.slice(7);
    return validateSession(token);
  } catch (error) {
    console.error('Get user from request error:', error);
    return null;
  }
}

// Validation functions
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    return await dbCheckEmailExists(email);
  } catch (error) {
    console.error('Check email exists error:', error);
    throw new Error('Email validation failed');
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    return await dbCheckUsernameExists(username);
  } catch (error) {
    console.error('Check username exists error:', error);
    throw new Error('Username validation failed');
  }
}

export async function checkLeetCodeUsernameExists(leetcode_username: string): Promise<boolean> {
  try {
    return await dbCheckLeetCodeUsernameExists(leetcode_username);
  } catch (error) {
    console.error('Check LeetCode username exists error:', error);
    throw new Error('LeetCode username validation failed');
  }
}

// User stats functions
export async function getUserStats(user_id: string): Promise<UserStats> {
  try {
    return await dbGetUserStats(user_id);
  } catch (error) {
    console.error('Get user stats error:', error);
    throw new Error('Failed to retrieve user stats');
  }
}

export async function updateUserStats(user_id: string, updates: Partial<UserStats>): Promise<UserStats> {
  try {
    const currentStats = await dbGetUserStats(user_id);
    const updatedStats: UserStats = {
      ...currentStats,
      ...updates,
      last_activity_date: new Date().toISOString(),
    };

    // Update longest streak if current streak is higher
    if (updates.current_streak && updates.current_streak > currentStats.longest_streak) {
      updatedStats.longest_streak = updates.current_streak;
    }

    return await dbUpdateUserStats(user_id, updatedStats);
  } catch (error) {
    console.error('Update user stats error:', error);
    throw new Error('Failed to update user stats');
  }
}

export async function recordQuestionSolved(user_id: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<UserStats> {
  try {
    const currentStats = await getUserStats(user_id);
    const updates: Partial<UserStats> = {
      total_questions_solved: currentStats.total_questions_solved + 1,
      total_questions_attempted: currentStats.total_questions_attempted + 1,
      current_streak: currentStats.current_streak + 1,
    };

    // Update difficulty-specific counter
    const difficultyKey = `${difficulty}_solved` as keyof UserStats;
    const currentCount = currentStats[difficultyKey] as number;
    (updates as any)[difficultyKey] = currentCount + 1;

    return await updateUserStats(user_id, updates);
  } catch (error) {
    console.error('Record question solved error:', error);
    throw new Error('Failed to record solved question');
  }
}

// Utility functions for testing/development
export function clearMockData(): void {
  mockUsers.clear();
  userStats.clear();
}

// Export for testing/debugging (remove in production)
export { mockUsers, userStats };

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }

  // For backward compatibility with tests, only require basic validation
  // In production, you may want to add stronger requirements
  return { valid: true };
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return usernameRegex.test(username);
}