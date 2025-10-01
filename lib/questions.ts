// This module intelligently switches between database and mock storage
// Uses database in production, mock storage in tests

const USE_DATABASE =
  process.env.NODE_ENV !== "test" && !!process.env.DATABASE_URL;

// Import both modules
import * as questionsDb from "./questions-db";
import * as questionsMock from "./questions-mock";

// Select the appropriate module
const questionsModule = USE_DATABASE ? questionsDb : questionsMock;

// Re-export all functions
export const createQuestion = questionsModule.createQuestion;
export const findQuestionById = questionsModule.findQuestionById;
export const findQuestionBySlug = questionsModule.findQuestionBySlug;
export const findQuestionByLeetCodeId =
  questionsModule.findQuestionByLeetCodeId;
export const updateQuestion = questionsModule.updateQuestion;
export const deleteQuestion = questionsModule.deleteQuestion;
export const searchQuestions = questionsModule.searchQuestions;
export const getQuestionStats = questionsModule.getQuestionStats;
export const checkSlugExists = questionsModule.checkSlugExists;
export const getAllQuestions = questionsModule.getAllQuestions;

// Mock utilities (only available in test mode)
export const clearMockQuestions = (questionsMock as any).clearMockQuestions;
export const seedSampleQuestions = (questionsMock as any).seedSampleQuestions;
export const mockQuestions = (questionsMock as any).mockQuestions;
