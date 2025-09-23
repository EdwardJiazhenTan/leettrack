import type { Question, CreateQuestionRequest, UpdateQuestionRequest, QuestionListResponse, QuestionStats } from '../../types/question';

export const mockQuestion: Question = {
  id: 'question_123',
  leetcode_id: '1',
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'Easy',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  tags: ['Array', 'Hash Table'],
  url: 'https://leetcode.com/problems/two-sum/',
  is_custom: false,
  created_by: 'user_123',
  created_at: '2025-01-15T10:00:00.000Z',
  updated_at: '2025-01-15T10:00:00.000Z',
};

export const mockCustomQuestion: Question = {
  id: 'question_456',
  title: 'Custom Array Problem',
  slug: 'custom-array-problem',
  difficulty: 'Medium',
  description: 'A custom problem for array manipulation.',
  tags: ['Array', 'Custom'],
  is_custom: true,
  created_by: 'user_123',
  created_at: '2025-01-15T10:00:00.000Z',
  updated_at: '2025-01-15T10:00:00.000Z',
};

export const mockCreateQuestionRequest: CreateQuestionRequest = {
  title: 'New Custom Question',
  slug: 'new-custom-question',
  difficulty: 'Hard',
  description: 'A new custom question for testing.',
  tags: ['Algorithm', 'Test'],
  url: 'https://example.com/problem',
};

export const mockUpdateQuestionRequest: UpdateQuestionRequest = {
  title: 'Updated Question Title',
  description: 'Updated description',
  tags: ['Updated', 'Tags'],
};

export const mockQuestionListResponse: QuestionListResponse = {
  questions: [mockQuestion, mockCustomQuestion],
  total: 2,
  limit: 20,
  offset: 0,
  has_more: false,
};

export const mockQuestionStats: QuestionStats = {
  total_questions: 10,
  easy_count: 4,
  medium_count: 4,
  hard_count: 2,
  custom_questions: 3,
  leetcode_questions: 7,
  popular_tags: [
    { tag: 'Array', count: 5 },
    { tag: 'Hash Table', count: 3 },
    { tag: 'Dynamic Programming', count: 2 },
  ],
};

export const mockToken = 'Bearer mock_token_123';