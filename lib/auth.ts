// This module intelligently switches between database and mock storage
// Uses database in production, mock storage in tests

const USE_DATABASE =
  process.env.NODE_ENV !== "test" && !!process.env.DATABASE_URL;

// Import both modules
import * as authDb from "./auth-db";
import * as authMock from "./auth-mock";

// Select the appropriate module
const authModule = USE_DATABASE ? authDb : authMock;

// Re-export all functions
export const generateJWT = authModule.generateJWT;
export const verifyJWT = authModule.verifyJWT;
export const hashPassword = authModule.hashPassword;
export const verifyPassword = authModule.verifyPassword;
export const createUser = authModule.createUser;
export const findUserByEmail = authModule.findUserByEmail;
export const findUserById = authModule.findUserById;
export const updateUser = authModule.updateUser;
export const createSession = authModule.createSession;
export const validateSession = authModule.validateSession;
export const destroySession = authModule.destroySession;
export const getUserFromRequest = authModule.getUserFromRequest;
export const checkEmailExists = authModule.checkEmailExists;
export const checkUsernameExists = authModule.checkUsernameExists;
export const checkLeetCodeUsernameExists =
  authModule.checkLeetCodeUsernameExists;
export const getUserStats = authModule.getUserStats;
export const updateUserStats = authModule.updateUserStats;
export const recordQuestionSolved = authModule.recordQuestionSolved;
export const validateEmail = authModule.validateEmail;
export const validatePassword = authModule.validatePassword;
export const validateUsername = authModule.validateUsername;

// Mock utilities (only available in test mode)
export const clearMockData = (authMock as any).clearMockData;
export const mockUsers = (authMock as any).mockUsers;
export const userStats = (authMock as any).userStats;

export type { User } from "./auth-db";
