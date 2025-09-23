# LeetTrack Database Design

## Overview

LeetTrack uses a PostgreSQL database designed to support:
- **Multi-path learning** with admin-created curricula
- **Personalized daily planning** with smart recommendations
- **Progress tracking** with spaced repetition
- **Performance analytics** across all learning activities

## Entity Relationship Diagram

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    Users    │    │ LearningPaths    │    │   Questions     │
│             │    │                  │    │                 │
│ user_id (PK)│    │ path_id (PK)     │    │ question_id(PK) │
│ email       │    │ title            │    │ leetcode_id     │
│ username    │    │ description      │    │ title           │
│ is_admin    │    │ difficulty_level │    │ difficulty      │
└─────────────┘    │ created_by (FK)  │    │ tags[]          │
       │           └──────────────────┘    │ is_custom       │
       │                     │             └─────────────────┘
       │                     │                       │
       │           ┌─────────────────────┐           │
       │           │   PathQuestions     │           │
       │           │                     │           │
       │           │ path_id (FK)        │───────────┘
       │           │ question_id (FK)    │
       │           │ order_index         │
       │           └─────────────────────┘
       │                     │
       │           ┌─────────────────────┐
       └───────────│UserPathEnrollments │
                   │                     │
                   │ user_id (FK)        │
                   │ path_id (FK)        │
                   │ enrolled_at         │
                   │ completion_%        │
                   └─────────────────────┘
                             │
                   ┌─────────────────────┐
                   │UserQuestionProgress │
                   │                     │
                   │ user_id (FK)        │
                   │ question_id (FK)    │
                   │ path_id (FK)        │
                   │ status              │
                   │ next_review_date    │
                   │ wants_review        │
                   └─────────────────────┘
                             │
                   ┌─────────────────────┐
                   │ DailyStudyPlans     │
                   │                     │
                   │ user_id (FK)        │
                   │ date                │
                   │ target_new_questions│
                   │ target_reviews      │
                   └─────────────────────┘
                             │
                   ┌─────────────────────┐
                   │DailyRecommendations │
                   │                     │
                   │ user_id (FK)        │
                   │ question_id (FK)    │
                   │ recommendation_type │
                   │ priority_score      │
                   └─────────────────────┘
```

## Table Definitions

### 1. Users
Stores user account information and admin privileges.

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

### 2. Learning Paths
Admin-created structured learning curricula.

```sql
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

CREATE TABLE learning_paths (
  path_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty_level difficulty_level NOT NULL,
  estimated_duration_days INTEGER CHECK (estimated_duration_days > 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_title CHECK (LENGTH(TRIM(title)) >= 3)
);

CREATE INDEX idx_learning_paths_active ON learning_paths(is_active);
CREATE INDEX idx_learning_paths_difficulty ON learning_paths(difficulty_level);
CREATE INDEX idx_learning_paths_created_by ON learning_paths(created_by);
```

### 3. Questions
Both LeetCode and custom questions.

```sql
CREATE TYPE question_difficulty AS ENUM ('Easy', 'Medium', 'Hard');

CREATE TABLE questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leetcode_id VARCHAR(10) UNIQUE, -- LeetCode's question ID
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  difficulty question_difficulty NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}', -- Array of topic tags
  url VARCHAR(500),
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
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
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_questions_created_by ON questions(created_by);
```

### 4. Path Questions
Ordered curriculum within each learning path.

```sql
CREATE TABLE path_questions (
  path_question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES learning_paths(path_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(path_id, question_id), -- Prevent duplicate questions in same path
  UNIQUE(path_id, order_index), -- Ensure unique ordering within path
  CONSTRAINT valid_order_index CHECK (order_index >= 0)
);

CREATE INDEX idx_path_questions_path ON path_questions(path_id, order_index);
CREATE INDEX idx_path_questions_question ON path_questions(question_id);
```

### 5. User Path Enrollments
Tracks which paths users are enrolled in.

```sql
CREATE TABLE user_path_enrollments (
  enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  path_id UUID NOT NULL REFERENCES learning_paths(path_id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage BETWEEN 0 AND 100),
  estimated_completion_date DATE,

  UNIQUE(user_id, path_id) -- User can only enroll once per path
);

CREATE INDEX idx_user_path_enrollments_user ON user_path_enrollments(user_id);
CREATE INDEX idx_user_path_enrollments_path ON user_path_enrollments(path_id);
CREATE INDEX idx_user_path_enrollments_active ON user_path_enrollments(user_id, is_active);
```

### 6. User Question Progress
Detailed progress tracking for each question.

```sql
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'needs_review');

CREATE TABLE user_question_progress (
  progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(path_id) ON DELETE SET NULL, -- Which path context
  status progress_status DEFAULT 'not_started',
  first_attempted_at TIMESTAMP WITH TIME ZONE,
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  next_review_date DATE,
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5), -- User's perceived difficulty
  notes TEXT,
  wants_review BOOLEAN DEFAULT FALSE, -- User preference for review
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, question_id, path_id), -- Unique progress per question per path
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
```

### 7. Daily Study Plans
User-defined daily study goals.

```sql
CREATE TABLE daily_study_plans (
  plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  target_new_questions INTEGER DEFAULT 0 CHECK (target_new_questions >= 0),
  target_review_questions INTEGER DEFAULT 0 CHECK (target_review_questions >= 0),
  actual_new_completed INTEGER DEFAULT 0 CHECK (actual_new_completed >= 0),
  actual_review_completed INTEGER DEFAULT 0 CHECK (actual_review_completed >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date) -- One plan per user per day
);

CREATE INDEX idx_daily_study_plans_user_date ON daily_study_plans(user_id, date);
CREATE INDEX idx_daily_study_plans_date ON daily_study_plans(date);
```

### 8. Daily Recommendations
System-generated daily question recommendations.

```sql
CREATE TYPE recommendation_type AS ENUM ('new', 'review');

CREATE TABLE daily_recommendations (
  recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(path_id) ON DELETE SET NULL,
  recommendation_type recommendation_type NOT NULL,
  priority_score DECIMAL(3,2) DEFAULT 0.50 CHECK (priority_score BETWEEN 0 AND 1),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date, question_id, recommendation_type), -- Prevent duplicate recommendations
  CONSTRAINT completed_timestamp CHECK (
    (NOT is_completed) OR (completed_at IS NOT NULL)
  )
);

CREATE INDEX idx_daily_recommendations_user_date ON daily_recommendations(user_id, date);
CREATE INDEX idx_daily_recommendations_user_type ON daily_recommendations(user_id, recommendation_type);
CREATE INDEX idx_daily_recommendations_priority ON daily_recommendations(user_id, date, priority_score DESC);
CREATE INDEX idx_daily_recommendations_completion ON daily_recommendations(user_id, is_completed);
```

## Views and Functions

### User Progress Summary View
```sql
CREATE VIEW user_progress_summary AS
SELECT
  u.user_id,
  u.username,
  COUNT(DISTINCT upe.path_id) as enrolled_paths,
  COUNT(DISTINCT CASE WHEN upe.completion_percentage = 100 THEN upe.path_id END) as completed_paths,
  COUNT(DISTINCT uqp.question_id) as total_attempted,
  COUNT(DISTINCT CASE WHEN uqp.status = 'completed' THEN uqp.question_id END) as total_solved,
  COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Easy' THEN uqp.question_id END) as easy_solved,
  COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Medium' THEN uqp.question_id END) as medium_solved,
  COUNT(DISTINCT CASE WHEN uqp.status = 'completed' AND q.difficulty = 'Hard' THEN uqp.question_id END) as hard_solved
FROM users u
LEFT JOIN user_path_enrollments upe ON u.user_id = upe.user_id AND upe.is_active = true
LEFT JOIN user_question_progress uqp ON u.user_id = uqp.user_id
LEFT JOIN questions q ON uqp.question_id = q.question_id
GROUP BY u.user_id, u.username;
```

### Daily Recommendation Generation Function
```sql
CREATE OR REPLACE FUNCTION generate_daily_recommendations(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
  question_id UUID,
  path_id UUID,
  recommendation_type recommendation_type,
  priority_score DECIMAL
) AS $$
DECLARE
  target_new INTEGER;
  target_review INTEGER;
BEGIN
  -- Get user's daily targets
  SELECT target_new_questions, target_review_questions
  INTO target_new, target_review
  FROM daily_study_plans
  WHERE user_id = p_user_id AND date = p_date;

  -- Default targets if no plan exists
  target_new := COALESCE(target_new, 3);
  target_review := COALESCE(target_review, 2);

  -- Return new questions from enrolled paths
  RETURN QUERY
  SELECT DISTINCT
    pq.question_id,
    pq.path_id,
    'new'::recommendation_type,
    (1.0 - (pq.order_index::DECIMAL / 100.0))::DECIMAL(3,2) as priority_score
  FROM user_path_enrollments upe
  JOIN path_questions pq ON upe.path_id = pq.path_id
  LEFT JOIN user_question_progress uqp ON (
    uqp.user_id = p_user_id AND
    uqp.question_id = pq.question_id AND
    uqp.path_id = pq.path_id
  )
  WHERE upe.user_id = p_user_id
    AND upe.is_active = true
    AND (uqp.status IS NULL OR uqp.status = 'not_started')
  ORDER BY priority_score DESC
  LIMIT target_new;

  -- Return review questions
  RETURN QUERY
  SELECT DISTINCT
    uqp.question_id,
    uqp.path_id,
    'review'::recommendation_type,
    CASE
      WHEN uqp.next_review_date <= p_date THEN 1.0
      WHEN uqp.wants_review THEN 0.8
      ELSE 0.5
    END::DECIMAL(3,2) as priority_score
  FROM user_question_progress uqp
  WHERE uqp.user_id = p_user_id
    AND uqp.status = 'completed'
    AND (
      uqp.next_review_date <= p_date OR
      uqp.wants_review = true
    )
  ORDER BY priority_score DESC
  LIMIT target_review;
END;
$$ LANGUAGE plpgsql;
```

## Triggers and Automation

### Update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at columns
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
```

### Auto-calculate Path Completion
```sql
CREATE OR REPLACE FUNCTION update_path_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_questions INTEGER;
  completed_questions INTEGER;
  new_percentage DECIMAL(5,2);
BEGIN
  -- Count total questions in the path
  SELECT COUNT(*) INTO total_questions
  FROM path_questions
  WHERE path_id = COALESCE(NEW.path_id, OLD.path_id);

  -- Count completed questions for this user/path
  SELECT COUNT(*) INTO completed_questions
  FROM user_question_progress uqp
  JOIN path_questions pq ON uqp.question_id = pq.question_id AND uqp.path_id = pq.path_id
  WHERE uqp.user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND uqp.path_id = COALESCE(NEW.path_id, OLD.path_id)
    AND uqp.status = 'completed';

  -- Calculate percentage
  IF total_questions > 0 THEN
    new_percentage := (completed_questions::DECIMAL / total_questions::DECIMAL) * 100;
  ELSE
    new_percentage := 0;
  END IF;

  -- Update enrollment record
  UPDATE user_path_enrollments
  SET completion_percentage = new_percentage
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND path_id = COALESCE(NEW.path_id, OLD.path_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_path_completion_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION update_path_completion();
```

## Sample Data

### Insert Admin User
```sql
INSERT INTO users (email, username, password_hash, is_admin) VALUES
('admin@leettrack.com', 'admin', '$2b$12$...', true);
```

### Create Sample Learning Paths
```sql
INSERT INTO learning_paths (title, description, difficulty_level, created_by) VALUES
('Array Fundamentals', 'Master array manipulation and algorithms', 'Beginner',
  (SELECT user_id FROM users WHERE username = 'admin')),
('Graph Algorithms', 'Comprehensive graph traversal and algorithms', 'Advanced',
  (SELECT user_id FROM users WHERE username = 'admin'));
```

### Seed Popular Questions
```sql
INSERT INTO questions (leetcode_id, title, slug, difficulty, tags) VALUES
('1', 'Two Sum', 'two-sum', 'Easy', ARRAY['Array', 'Hash Table']),
('2', 'Add Two Numbers', 'add-two-numbers', 'Medium', ARRAY['Linked List', 'Math']),
('3', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', ARRAY['Hash Table', 'String', 'Sliding Window']);
```

## Performance Considerations

### Indexing Strategy
- **Primary Keys**: All tables use UUID with btree indexes
- **Foreign Keys**: Indexed for join performance
- **Query Patterns**: Indexes on common filter columns (user_id, date, status)
- **Text Search**: GIN indexes on tag arrays

### Partitioning
For large datasets, consider partitioning:
- `daily_recommendations` by date (monthly partitions)
- `user_question_progress` by user_id (hash partitioning)

### Caching Strategy
- **User Progress**: Cache computed statistics
- **Daily Recommendations**: Cache generated recommendations
- **Path Completion**: Update incrementally via triggers

---

This database design supports the full LeetTrack feature set with proper normalization, performance optimization, and data integrity constraints.