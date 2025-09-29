export interface Path {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question_ids: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  estimated_hours: number;
  tags: string[];
}

export interface CreatePathRequest {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question_ids: string[];
  is_public: boolean;
  estimated_hours: number;
  tags: string[];
}

export interface UpdatePathRequest {
  title?: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  question_ids?: string[];
  is_public?: boolean;
  estimated_hours?: number;
  tags?: string[];
}

export interface UserPathProgress {
  id: string;
  user_id: string;
  path_id: string;
  completed_questions: string[];
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string;
  last_activity: string;
}

export interface PathListResponse {
  paths: Path[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface PathStats {
  total_paths: number;
  beginner_count: number;
  intermediate_count: number;
  advanced_count: number;
  most_popular: Path[];
  recently_created: Path[];
}
