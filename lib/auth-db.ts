import { query, queryOne } from "./database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Environment variables for security
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12");

// Types for internal use
interface UserRecord {
  user_id: string;
  email: string;
  username: string;
  password_hash: string;
  leetcode_username?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  email: string;
  username: string;
  leetcode_username?: string;
  is_admin: boolean;
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
}

// Database functions
async function dbCreateUser(
  userData: Omit<UserRecord, "user_id" | "created_at" | "updated_at" | "is_admin">,
): Promise<UserRecord> {
  const user = await queryOne<UserRecord>(
    `INSERT INTO users (email, username, password_hash, leetcode_username)
     VALUES ($1, $2, $3, $4)
     RETURNING id as user_id, email, username, password_hash, leetcode_username, is_admin, created_at, updated_at`,
    [
      userData.email,
      userData.username,
      userData.password_hash,
      userData.leetcode_username || null,
    ],
  );

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

async function dbFindUserByEmail(email: string): Promise<UserRecord | null> {
  return await queryOne<UserRecord>("SELECT id as user_id, email, username, password_hash, leetcode_username, is_admin, created_at, updated_at FROM users WHERE email = $1", [
    email,
  ]);
}

async function dbFindUserById(user_id: string): Promise<UserRecord | null> {
  return await queryOne<UserRecord>("SELECT id as user_id, email, username, password_hash, leetcode_username, is_admin, created_at, updated_at FROM users WHERE id = $1", [
    user_id,
  ]);
}

async function dbUpdateUser(
  user_id: string,
  updates: Partial<Omit<UserRecord, "user_id" | "created_at" | "password_hash">>,
): Promise<UserRecord | null> {
  const user = await queryOne<UserRecord>(
    `UPDATE users
     SET username = COALESCE($2, username),
         email = COALESCE($3, email),
         leetcode_username = COALESCE($4, leetcode_username),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      user_id,
      updates.username || null,
      updates.email || null,
      updates.leetcode_username || null,
    ],
  );

  return user;
}

async function dbCheckEmailExists(email: string): Promise<boolean> {
  const result = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM users WHERE email = $1",
    [email],
  );
  return parseInt(result?.count || "0") > 0;
}

async function dbCheckUsernameExists(username: string): Promise<boolean> {
  const result = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM users WHERE username = $1",
    [username],
  );
  return parseInt(result?.count || "0") > 0;
}

async function dbCheckLeetCodeUsernameExists(
  leetcode_username: string,
): Promise<boolean> {
  const result = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM users WHERE leetcode_username = $1",
    [leetcode_username],
  );
  return parseInt(result?.count || "0") > 0;
}

async function dbGetUserStats(user_id: string): Promise<UserStats> {
  // Get basic progress stats from user_question_progress
  const progressStats = await queryOne<{
    total_attempted: string;
    total_solved: string;
    easy_solved: string;
    medium_solved: string;
    hard_solved: string;
  }>(
    `
    SELECT
      COUNT(DISTINCT uqp.question_id) as total_attempted,
      COUNT(DISTINCT CASE WHEN uqp.status = 'completed' THEN uqp.question_id END) as total_solved,
      COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Easy' THEN uqp.question_id END) as easy_solved,
      COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Medium' THEN uqp.question_id END) as medium_solved,
      COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Hard' THEN uqp.question_id END) as hard_solved
    FROM user_question_progress uqp
    LEFT JOIN questions q ON uqp.question_id = q.id
    WHERE uqp.user_id = $1
  `,
    [user_id],
  );

  // Get path enrollment stats
  const pathStats = await queryOne<{
    enrolled_paths: string;
    completed_paths: string;
  }>(
    `
    SELECT
      COUNT(*) as enrolled_paths,
      COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as completed_paths
    FROM user_path_enrollments
    WHERE user_id = $1 AND is_active = true
  `,
    [user_id],
  );

  return {
    total_questions_attempted: parseInt(progressStats?.total_attempted || "0"),
    total_questions_solved: parseInt(progressStats?.total_solved || "0"),
    easy_solved: parseInt(progressStats?.easy_solved || "0"),
    medium_solved: parseInt(progressStats?.medium_solved || "0"),
    hard_solved: parseInt(progressStats?.hard_solved || "0"),
    current_streak: 0, // TODO: Calculate from daily activity
    longest_streak: 0, // TODO: Calculate from daily activity
    enrolled_paths: parseInt(pathStats?.enrolled_paths || "0"),
    completed_paths: parseInt(pathStats?.completed_paths || "0"),
  };
}

// JWT Token functions
export function generateJWT(payload: {
  user_id: string;
  email: string;
}): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "leettrack",
      subject: String(payload.user_id), // Ensure it's a string
    } as jwt.SignOptions);
  } catch (error) {
    console.error("JWT generation error:", error);
    throw new Error("Token generation failed");
  }
}

export function verifyJWT(
  token: string,
): { user_id: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      user_id: decoded.user_id,
      email: decoded.email,
    };
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

// Password hashing functions
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Password hashing failed");
  }
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    if (!password || !hash) {
      console.error("Missing password or hash arguments");
      return false;
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

// User management functions
export async function createUser(userData: {
  email: string;
  username: string;
  password: string;
  leetcode_username?: string;
}): Promise<User> {
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

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username || undefined,
      is_admin: user.is_admin,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error("User creation error:", error);
    throw new Error("User creation failed");
  }
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  try {
    return await dbFindUserByEmail(email);
  } catch (error) {
    console.error("Find user by email error:", error);
    return null;
  }
}

export async function findUserById(user_id: string): Promise<User | null> {
  try {
    const user = await dbFindUserById(user_id);
    if (!user) return null;

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username || undefined,
      is_admin: user.is_admin,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error("Find user by ID error:", error);
    return null;
  }
}

export async function updateUser(
  user_id: string,
  updates: {
    username?: string;
    leetcode_username?: string;
    email?: string;
  },
): Promise<User | null> {
  try {
    const user = await dbUpdateUser(user_id, updates);
    if (!user) return null;

    // Return user without password
    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      leetcode_username: user.leetcode_username || undefined,
      is_admin: user.is_admin,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error("User update error:", error);
    throw new Error("User update failed");
  }
}

// Session management with JWT
export function createSession(user_id: string, email: string): string {
  return generateJWT({ user_id, email });
}

export function validateSession(
  token: string,
): { user_id: string; email: string } | null {
  return verifyJWT(token);
}

export function destroySession(token: string): boolean {
  // With JWT, we don't need to track tokens server-side
  return true;
}

// Request helper function
export function getUserFromRequest(
  request: NextRequest,
): { user_id: string; email: string } | null {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return null;
    }
    const token = authorization.slice(7);
    return validateSession(token);
  } catch (error) {
    console.error("Get user from request error:", error);
    return null;
  }
}

// Validation functions
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    return await dbCheckEmailExists(email);
  } catch (error) {
    console.error("Check email exists error:", error);
    throw new Error("Email validation failed");
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    return await dbCheckUsernameExists(username);
  } catch (error) {
    console.error("Check username exists error:", error);
    throw new Error("Username validation failed");
  }
}

export async function checkLeetCodeUsernameExists(
  leetcode_username: string,
): Promise<boolean> {
  try {
    return await dbCheckLeetCodeUsernameExists(leetcode_username);
  } catch (error) {
    console.error("Check LeetCode username exists error:", error);
    throw new Error("LeetCode username validation failed");
  }
}

// User stats functions
export async function getUserStats(user_id: string): Promise<UserStats> {
  try {
    return await dbGetUserStats(user_id);
  } catch (error) {
    console.error("Get user stats error:", error);
    throw new Error("Failed to retrieve user stats");
  }
}

export async function updateUserStats(
  user_id: string,
  updates: Partial<UserStats>,
): Promise<UserStats> {
  try {
    // Stats are now calculated from database tables, not stored separately
    // This function is kept for backward compatibility
    return await dbGetUserStats(user_id);
  } catch (error) {
    console.error("Update user stats error:", error);
    throw new Error("Failed to update user stats");
  }
}

export async function recordQuestionSolved(
  user_id: string,
  difficulty: "easy" | "medium" | "hard",
): Promise<UserStats> {
  try {
    // This will be handled by the progress tracking system
    // For now, just return current stats
    return await getUserStats(user_id);
  } catch (error) {
    console.error("Record question solved error:", error);
    throw new Error("Failed to record solved question");
  }
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { valid: true };
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return usernameRegex.test(username);
}
