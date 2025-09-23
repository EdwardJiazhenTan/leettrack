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

// Mock sessions - in a real app, this would use JWT or session store
const mockSessions = new Map<string, string>(); // token -> user_id

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

export function createUser(userData: {
  email: string;
  username: string;
  password: string;
  leetcode_username?: string;
}) {
  const user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  const user = {
    user_id,
    email: userData.email,
    username: userData.username,
    password_hash: userData.password, // This would be hashed in production
    leetcode_username: userData.leetcode_username,
    created_at: now,
    updated_at: now,
  };

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

// Function to clear all mock data (useful for testing)
export function clearMockData(): void {
  mockUsers.clear();
  mockSessions.clear();
}