import type { Path, CreatePathRequest, UpdatePathRequest, UserPathProgress, PathListResponse, PathStats } from '../types/path';

// Mock path database - in a real app, this would be a proper database
const mockPaths = new Map<string, Path>();
const mockUserProgress = new Map<string, UserPathProgress>();

export function createPath(pathData: CreatePathRequest, created_by?: string): Path {
  const id = `path_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  const path: Path = {
    id,
    title: pathData.title,
    description: pathData.description,
    difficulty: pathData.difficulty,
    question_ids: pathData.question_ids,
    created_by,
    created_at: now,
    updated_at: now,
    is_public: pathData.is_public,
    estimated_hours: pathData.estimated_hours,
    tags: pathData.tags,
  };

  mockPaths.set(id, path);
  return path;
}

export function findPathById(id: string): Path | null {
  return mockPaths.get(id) || null;
}

export function findPathsByCreator(created_by: string): Path[] {
  return Array.from(mockPaths.values()).filter(path => path.created_by === created_by);
}

export function updatePath(id: string, updates: UpdatePathRequest): Path | null {
  const path = mockPaths.get(id);
  if (!path) return null;

  const updatedPath: Path = {
    ...path,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  mockPaths.set(id, updatedPath);
  return updatedPath;
}

export function deletePath(id: string): boolean {
  return mockPaths.delete(id);
}

export function searchPaths(params: {
  query?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  is_public?: boolean;
  created_by?: string;
  limit?: number;
  offset?: number;
}): PathListResponse {
  let paths = Array.from(mockPaths.values());

  // Apply filters
  if (params.query) {
    const query = params.query.toLowerCase();
    paths = paths.filter(path =>
      path.title.toLowerCase().includes(query) ||
      path.description.toLowerCase().includes(query) ||
      path.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (params.difficulty) {
    paths = paths.filter(path => path.difficulty === params.difficulty);
  }

  if (params.tags && params.tags.length > 0) {
    paths = paths.filter(path =>
      params.tags!.some(tag => path.tags.includes(tag))
    );
  }

  if (params.is_public !== undefined) {
    paths = paths.filter(path => path.is_public === params.is_public);
  }

  if (params.created_by) {
    paths = paths.filter(path => path.created_by === params.created_by);
  }

  // Apply pagination
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const total = paths.length;
  const paginatedPaths = paths.slice(offset, offset + limit);

  return {
    paths: paginatedPaths,
    total,
    limit,
    offset,
    has_more: offset + limit < total,
  };
}

export function enrollInPath(user_id: string, path_id: string): UserPathProgress | null {
  const path = findPathById(path_id);
  if (!path) return null;

  const progressId = `progress_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const now = new Date().toISOString();

  const progress: UserPathProgress = {
    id: progressId,
    user_id,
    path_id,
    completed_questions: [],
    progress_percentage: 0,
    enrolled_at: now,
    last_activity: now,
  };

  mockUserProgress.set(progressId, progress);
  return progress;
}

export function updatePathProgress(
  user_id: string,
  path_id: string,
  completed_question_id: string
): UserPathProgress | null {
  const progress = getUserPathProgress(user_id, path_id);
  if (!progress) return null;

  const path = findPathById(path_id);
  if (!path) return null;

  if (!progress.completed_questions.includes(completed_question_id)) {
    progress.completed_questions.push(completed_question_id);
  }

  progress.progress_percentage = Math.round(
    (progress.completed_questions.length / path.question_ids.length) * 100
  );
  progress.last_activity = new Date().toISOString();

  if (progress.progress_percentage === 100 && !progress.completed_at) {
    progress.completed_at = new Date().toISOString();
  }

  mockUserProgress.set(progress.id, progress);
  return progress;
}

export function getUserPathProgress(user_id: string, path_id: string): UserPathProgress | null {
  for (const progress of mockUserProgress.values()) {
    if (progress.user_id === user_id && progress.path_id === path_id) {
      return progress;
    }
  }
  return null;
}

export function getUserEnrolledPaths(user_id: string): UserPathProgress[] {
  return Array.from(mockUserProgress.values()).filter(progress => progress.user_id === user_id);
}

export function getPathStats(): PathStats {
  const paths = Array.from(mockPaths.values());
  const publicPaths = paths.filter(path => path.is_public);

  return {
    total_paths: paths.length,
    beginner_count: paths.filter(path => path.difficulty === 'Beginner').length,
    intermediate_count: paths.filter(path => path.difficulty === 'Intermediate').length,
    advanced_count: paths.filter(path => path.difficulty === 'Advanced').length,
    most_popular: publicPaths.slice(0, 5), // TODO: Implement actual popularity ranking
    recently_created: publicPaths
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
  };
}

export function addQuestionToPath(path_id: string, question_id: string): Path | null {
  const path = findPathById(path_id);
  if (!path) return null;

  if (!path.question_ids.includes(question_id)) {
    path.question_ids.push(question_id);
    path.updated_at = new Date().toISOString();
    mockPaths.set(path_id, path);
  }

  return path;
}

export function removeQuestionFromPath(path_id: string, question_id: string): Path | null {
  const path = findPathById(path_id);
  if (!path) return null;

  path.question_ids = path.question_ids.filter(id => id !== question_id);
  path.updated_at = new Date().toISOString();
  mockPaths.set(path_id, path);

  return path;
}

// Function to clear all mock data (useful for testing)
export function clearMockPaths(): void {
  mockPaths.clear();
  mockUserProgress.clear();
}

// Function to seed with sample paths
export function seedSamplePaths(): void {
  // This would use actual question IDs from the questions database
  const samplePaths = [
    {
      title: "Array Fundamentals",
      description: "Master the basics of array manipulation and algorithms",
      difficulty: "Beginner" as const,
      question_ids: [], // Would be populated with actual question IDs
      is_public: true,
      estimated_hours: 10,
      tags: ["Array", "Fundamentals"],
    },
    {
      title: "Dynamic Programming Mastery",
      description: "Advanced dynamic programming patterns and techniques",
      difficulty: "Advanced" as const,
      question_ids: [], // Would be populated with actual question IDs
      is_public: true,
      estimated_hours: 25,
      tags: ["Dynamic Programming", "Advanced"],
    },
  ];

  samplePaths.forEach(path => createPath(path));
}

export { mockPaths, mockUserProgress };
