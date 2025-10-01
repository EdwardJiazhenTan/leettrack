-- LeetTrack Database Schema
-- Based on docs/DATABASE.md

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS daily_recommendations CASCADE;
DROP TABLE IF EXISTS daily_study_plans CASCADE;
DROP TABLE IF EXISTS user_question_progress CASCADE;
DROP TABLE IF EXISTS user_path_enrollments CASCADE;
DROP TABLE IF EXISTS path_questions CASCADE;
DROP TABLE IF EXISTS question_tags CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS difficulty_level CASCADE;
DROP TYPE IF EXISTS question_difficulty CASCADE;
DROP TYPE IF EXISTS progress_status CASCADE;
DROP TYPE IF EXISTS recommendation_type CASCADE;

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE question_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'needs_review');
CREATE TYPE recommendation_type AS ENUM ('new', 'review');

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

-- Learning Path Tags (denormalized for simplicity)
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

CREATE INDEX idx_question_tags_tag ON question_tags(tag);

-- Path Questions (Ordered curriculum)
CREATE TABLE path_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(path_id, question_id),
  UNIQUE(path_id, order_index),
  CONSTRAINT valid_order_index CHECK (order_index >= 0)
);

CREATE INDEX idx_path_questions_path ON path_questions(path_id, order_index);
CREATE INDEX idx_path_questions_question ON path_questions(question_id);

-- User Path Enrollments
CREATE TABLE user_path_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage BETWEEN 0 AND 100),
  estimated_completion_date DATE,

  UNIQUE(user_id, path_id)
);

CREATE INDEX idx_user_path_enrollments_user ON user_path_enrollments(user_id);
CREATE INDEX idx_user_path_enrollments_path ON user_path_enrollments(path_id);
CREATE INDEX idx_user_path_enrollments_active ON user_path_enrollments(user_id, is_active);

-- User Question Progress
CREATE TABLE user_question_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  status progress_status DEFAULT 'not_started',
  first_attempted_at TIMESTAMP WITH TIME ZONE,
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  next_review_date DATE,
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  notes TEXT,
  wants_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, question_id, path_id),
  CONSTRAINT valid_timestamps CHECK (
    (first_attempted_at IS NULL) OR
    (last_attempted_at IS NULL) OR
    (first_attempted_at <= last_attempted_at)
  ),
  CONSTRAINT completed_timestamp CHECK (
    (status != 'completed') OR (completed_at IS NOT NULL)
  )
);

CREATE INDEX idx_user_question_progress_user ON user_question_progress(user_id);
CREATE INDEX idx_user_question_progress_question ON user_question_progress(question_id);
CREATE INDEX idx_user_question_progress_path ON user_question_progress(path_id);
CREATE INDEX idx_user_question_progress_status ON user_question_progress(user_id, status);
CREATE INDEX idx_user_question_progress_review_date ON user_question_progress(next_review_date)
  WHERE next_review_date IS NOT NULL;
CREATE INDEX idx_user_question_progress_wants_review ON user_question_progress(user_id, wants_review);

-- Daily Study Plans
CREATE TABLE daily_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  target_new_questions INTEGER DEFAULT 0 CHECK (target_new_questions >= 0),
  target_review_questions INTEGER DEFAULT 0 CHECK (target_review_questions >= 0),
  actual_new_completed INTEGER DEFAULT 0 CHECK (actual_new_completed >= 0),
  actual_review_completed INTEGER DEFAULT 0 CHECK (actual_review_completed >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_study_plans_user_date ON daily_study_plans(user_id, date);
CREATE INDEX idx_daily_study_plans_date ON daily_study_plans(date);

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

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_question_progress_updated_at
  BEFORE UPDATE ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_study_plans_updated_at
  BEFORE UPDATE ON daily_study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
