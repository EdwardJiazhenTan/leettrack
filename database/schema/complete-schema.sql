-- ============================================
-- LeetTrack Complete Database Schema
-- For Neon PostgreSQL Deployment
-- ============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS daily_recommendations CASCADE;
DROP TABLE IF EXISTS daily_study_plans CASCADE;
DROP TABLE IF EXISTS user_question_progress CASCADE;
DROP TABLE IF EXISTS user_path_enrollments CASCADE;
DROP TABLE IF EXISTS path_questions CASCADE;
DROP TABLE IF EXISTS question_tags CASCADE;
DROP TABLE IF EXISTS path_tags CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS difficulty_level CASCADE;
DROP TYPE IF EXISTS question_difficulty CASCADE;
DROP TYPE IF EXISTS progress_status CASCADE;
DROP TYPE IF EXISTS recommendation_type CASCADE;

-- ============================================
-- Custom Types
-- ============================================

CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE question_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'needs_review');
CREATE TYPE recommendation_type AS ENUM ('new', 'review');

-- ============================================
-- Core Tables
-- ============================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  leetcode_username VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
  CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_-]{3,50}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_leetcode_username ON users(leetcode_username);

-- Learning Paths Table
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty difficulty_level NOT NULL,
  estimated_hours INTEGER CHECK (estimated_hours > 0),
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_title CHECK (LENGTH(TRIM(title)) >= 3)
);

CREATE INDEX idx_learning_paths_public ON learning_paths(is_public);
CREATE INDEX idx_learning_paths_difficulty ON learning_paths(difficulty);
CREATE INDEX idx_learning_paths_created_by ON learning_paths(created_by);

-- Learning Path Tags
CREATE TABLE path_tags (
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (path_id, tag)
);

CREATE INDEX idx_path_tags_tag ON path_tags(tag);

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leetcode_id VARCHAR(10) UNIQUE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  difficulty question_difficulty NOT NULL,
  description TEXT,
  url VARCHAR(500),
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
  CONSTRAINT valid_title CHECK (LENGTH(TRIM(title)) >= 3),
  CONSTRAINT valid_url CHECK (url IS NULL OR url ~* '^https?://.*')
);

CREATE INDEX idx_questions_leetcode_id ON questions(leetcode_id);
CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_is_custom ON questions(is_custom);
CREATE INDEX idx_questions_created_by ON questions(created_by);

-- Question Tags Table
CREATE TABLE question_tags (
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (question_id, tag)
);

CREATE INDEX idx_question_tags_question_id ON question_tags(question_id);
CREATE INDEX idx_question_tags_tag ON question_tags(tag);

-- Path Questions (Junction Table with Ordering)
CREATE TABLE path_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(path_id, question_id),
  UNIQUE(path_id, order_index)
);

CREATE INDEX idx_path_questions_path_id ON path_questions(path_id);
CREATE INDEX idx_path_questions_question_id ON path_questions(question_id);
CREATE INDEX idx_path_questions_order ON path_questions(path_id, order_index);

-- ============================================
-- User Progress Tables
-- ============================================

-- User Path Enrollments
CREATE TABLE user_path_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);

CREATE INDEX idx_user_path_enrollments_user_id ON user_path_enrollments(user_id);
CREATE INDEX idx_user_path_enrollments_path_id ON user_path_enrollments(path_id);
CREATE INDEX idx_user_path_enrollments_active ON user_path_enrollments(user_id, is_active);

-- User Question Progress
CREATE TABLE user_question_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  status progress_status NOT NULL DEFAULT 'not_started',
  wants_review BOOLEAN DEFAULT FALSE,
  review_count INTEGER DEFAULT 0,
  next_review_date DATE,
  first_attempted_at TIMESTAMP WITH TIME ZONE,
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id, path_id)
);

CREATE INDEX idx_user_question_progress_user_id ON user_question_progress(user_id);
CREATE INDEX idx_user_question_progress_question_id ON user_question_progress(question_id);
CREATE INDEX idx_user_question_progress_path_id ON user_question_progress(path_id);
CREATE INDEX idx_user_question_progress_status ON user_question_progress(status);
CREATE INDEX idx_user_question_progress_review ON user_question_progress(user_id, wants_review, next_review_date);

-- Daily Recommendations
CREATE TABLE daily_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  recommendation_type recommendation_type NOT NULL,
  priority_score DECIMAL(3,2) DEFAULT 0.50 CHECK (priority_score BETWEEN 0 AND 1),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, question_id, recommendation_type),
  CONSTRAINT completed_timestamp CHECK (
    (NOT is_completed) OR (completed_at IS NOT NULL)
  )
);

CREATE INDEX idx_daily_recommendations_user_date ON daily_recommendations(user_id, date);
CREATE INDEX idx_daily_recommendations_user_type ON daily_recommendations(user_id, recommendation_type);
CREATE INDEX idx_daily_recommendations_priority ON daily_recommendations(user_id, date, priority_score DESC);
CREATE INDEX idx_daily_recommendations_completion ON daily_recommendations(user_id, is_completed);

-- Daily Study Plans
CREATE TABLE daily_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  target_questions INTEGER DEFAULT 3 CHECK (target_questions BETWEEN 1 AND 20),
  completed_questions INTEGER DEFAULT 0 CHECK (completed_questions >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_study_plans_user_date ON daily_study_plans(user_id, date);

-- User Settings Table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  path_questions_per_day INTEGER DEFAULT 3 CHECK (path_questions_per_day BETWEEN 1 AND 10),
  review_interval_mode VARCHAR(20) DEFAULT 'standard' CHECK (review_interval_mode IN ('short', 'standard', 'long')),
  review_randomized BOOLEAN DEFAULT FALSE,
  path_randomized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_path_enrollments_updated_at
  BEFORE UPDATE ON user_path_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_question_progress_updated_at
  BEFORE UPDATE ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_study_plans_updated_at
  BEFORE UPDATE ON daily_study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments for Documentation
-- ============================================

COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON TABLE learning_paths IS 'Curated learning paths containing sequences of questions';
COMMENT ON TABLE questions IS 'LeetCode questions and custom practice problems';
COMMENT ON TABLE user_path_enrollments IS 'Tracks which paths users are actively studying';
COMMENT ON TABLE user_question_progress IS 'Individual question progress and review status';
COMMENT ON TABLE daily_recommendations IS 'Daily question recommendations for each user';
COMMENT ON TABLE user_settings IS 'User preferences for study behavior and question delivery';

COMMENT ON COLUMN user_settings.review_interval_mode IS 'short=[1], standard=[1,7], long=[1,7,21] days';
COMMENT ON COLUMN user_settings.path_randomized IS 'If true, path questions shown in random order instead of sequential';
COMMENT ON COLUMN user_settings.review_randomized IS 'If true, review questions shown in random order';

-- ============================================
-- Complete! Database schema ready for Neon
-- ============================================
