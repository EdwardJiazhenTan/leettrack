// This module intelligently switches between database and mock storage
// Uses database in production, mock storage in tests

const USE_DATABASE =
  process.env.NODE_ENV !== "test" && !!process.env.DATABASE_URL;

// Import both modules
import * as pathsDb from "./paths-db";
import * as pathsMock from "./paths-mock";

// Select the appropriate module
const pathsModule = USE_DATABASE ? pathsDb : pathsMock;

// Re-export all functions
export const createPath = pathsModule.createPath;
export const findPathById = pathsModule.findPathById;
export const findPathsByCreator = pathsModule.findPathsByCreator;
export const updatePath = pathsModule.updatePath;
export const deletePath = pathsModule.deletePath;
export const searchPaths = pathsModule.searchPaths;
export const enrollInPath = pathsModule.enrollInPath;
export const updatePathProgress = pathsModule.updatePathProgress;
export const getUserPathProgress = pathsModule.getUserPathProgress;
export const getUserEnrolledPaths = pathsModule.getUserEnrolledPaths;
export const getPathStats = pathsModule.getPathStats;
export const addQuestionToPath = pathsModule.addQuestionToPath;
export const removeQuestionFromPath = pathsModule.removeQuestionFromPath;

// Mock utilities (only available in test mode)
export const clearMockPaths = (pathsMock as any).clearMockPaths;
export const seedSamplePaths = (pathsMock as any).seedSamplePaths;
export const mockPaths = (pathsMock as any).mockPaths;
export const mockUserProgress = (pathsMock as any).mockUserProgress;
