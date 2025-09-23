import type { Question, CreateQuestionRequest, UpdateQuestionRequest, QuestionSearchParams, QuestionListResponse, QuestionStats } from '../types/question';

// Mock question database - in a real app, this would be a proper database
const mockQuestions = new Map<string, Question>();

export function createQuestion(questionData: CreateQuestionRequest, created_by?: string): Question {
  const id = `question_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  const question: Question = {
    id,
    leetcode_id: questionData.leetcode_id,
    title: questionData.title,
    slug: questionData.slug,
    difficulty: questionData.difficulty,
    description: questionData.description,
    tags: questionData.tags,
    url: questionData.url,
    is_custom: !questionData.leetcode_id, // If no leetcode_id, it's custom
    created_by,
    created_at: now,
    updated_at: now,
  };

  mockQuestions.set(id, question);
  return question;
}

export function findQuestionById(id: string): Question | null {
  return mockQuestions.get(id) || null;
}

export function findQuestionBySlug(slug: string): Question | null {
  for (const [id, question] of mockQuestions) {
    if (question.slug === slug) {
      return question;
    }
  }
  return null;
}

export function findQuestionByLeetCodeId(leetcode_id: string): Question | null {
  for (const [id, question] of mockQuestions) {
    if (question.leetcode_id === leetcode_id) {
      return question;
    }
  }
  return null;
}

export function updateQuestion(id: string, updates: UpdateQuestionRequest): Question | null {
  const question = mockQuestions.get(id);
  if (!question) return null;

  const updatedQuestion: Question = {
    ...question,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  mockQuestions.set(id, updatedQuestion);
  return updatedQuestion;
}

export function deleteQuestion(id: string): boolean {
  return mockQuestions.delete(id);
}

export function searchQuestions(params: QuestionSearchParams): QuestionListResponse {
  let questions = Array.from(mockQuestions.values());

  // Apply filters
  if (params.query) {
    const query = params.query.toLowerCase();
    questions = questions.filter(q =>
      q.title.toLowerCase().includes(query) ||
      q.description?.toLowerCase().includes(query) ||
      q.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (params.difficulty) {
    questions = questions.filter(q => q.difficulty === params.difficulty);
  }

  if (params.tags && params.tags.length > 0) {
    questions = questions.filter(q =>
      params.tags!.some(tag => q.tags.includes(tag))
    );
  }

  if (params.is_custom !== undefined) {
    questions = questions.filter(q => q.is_custom === params.is_custom);
  }

  if (params.created_by) {
    questions = questions.filter(q => q.created_by === params.created_by);
  }

  // Apply sorting
  const sortBy = params.sort_by || 'created_at';
  const sortOrder = params.sort_order || 'desc';

  questions.sort((a, b) => {
    let aVal: any = a[sortBy as keyof Question];
    let bVal: any = b[sortBy as keyof Question];

    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      aVal = difficultyOrder[a.difficulty];
      bVal = difficultyOrder[b.difficulty];
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  // Apply pagination
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const total = questions.length;
  const paginatedQuestions = questions.slice(offset, offset + limit);

  return {
    questions: paginatedQuestions,
    total,
    limit,
    offset,
    has_more: offset + limit < total,
  };
}

export function getQuestionStats(): QuestionStats {
  const questions = Array.from(mockQuestions.values());

  const easy_count = questions.filter(q => q.difficulty === 'Easy').length;
  const medium_count = questions.filter(q => q.difficulty === 'Medium').length;
  const hard_count = questions.filter(q => q.difficulty === 'Hard').length;
  const custom_questions = questions.filter(q => q.is_custom).length;
  const leetcode_questions = questions.filter(q => !q.is_custom).length;

  // Calculate popular tags
  const tagCounts = new Map<string, number>();
  questions.forEach(q => {
    q.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const popular_tags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total_questions: questions.length,
    easy_count,
    medium_count,
    hard_count,
    custom_questions,
    leetcode_questions,
    popular_tags,
  };
}

export function checkSlugExists(slug: string, excludeId?: string): boolean {
  for (const [id, question] of mockQuestions) {
    if (question.slug === slug && id !== excludeId) {
      return true;
    }
  }
  return false;
}

export function getAllQuestions(): Question[] {
  return Array.from(mockQuestions.values());
}

// Function to clear all mock data (useful for testing)
export function clearMockQuestions(): void {
  mockQuestions.clear();
}

// Function to seed with sample data
export function seedSampleQuestions(): void {
  const sampleQuestions = [
    {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy" as const,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      tags: ["Array", "Hash Table"],
      url: "https://leetcode.com/problems/two-sum/",
      leetcode_id: "1"
    },
    {
      title: "Add Two Numbers",
      slug: "add-two-numbers",
      difficulty: "Medium" as const,
      description: "You are given two non-empty linked lists representing two non-negative integers.",
      tags: ["Linked List", "Math", "Recursion"],
      url: "https://leetcode.com/problems/add-two-numbers/",
      leetcode_id: "2"
    },
    {
      title: "Custom Array Problem",
      slug: "custom-array-problem",
      difficulty: "Hard" as const,
      description: "A custom problem for advanced array manipulation.",
      tags: ["Array", "Dynamic Programming"],
    }
  ];

  sampleQuestions.forEach(q => createQuestion(q));
}