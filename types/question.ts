export interface Question {
  id: string;
  leetcode_id?: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  tags: string[];
  url?: string;
  is_custom: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionRequest {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  tags: string[];
  url?: string;
  leetcode_id?: string;
}

export interface UpdateQuestionRequest {
  title?: string;
  slug?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  tags?: string[];
  url?: string;
}

export interface QuestionSearchParams {
  query?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  is_custom?: boolean;
  created_by?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'title' | 'difficulty' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface QuestionListResponse {
  questions: Question[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface QuestionStats {
  total_questions: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  custom_questions: number;
  leetcode_questions: number;
  popular_tags: Array<{
    tag: string;
    count: number;
  }>;
}