-- LeetTrack Database Schema
-- PostgreSQL database schema for questions, paths, and user progress tracking

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extending existing auth system)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    leetcode_username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leetcode_id VARCHAR(10), -- LeetCode problem number (e.g., "1", "2", "1000")
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly version (e.g., "two-sum")
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    description TEXT,
    url TEXT, -- Direct link to LeetCode problem
    is_custom BOOLEAN DEFAULT FALSE, -- True if user-created, false if from LeetCode
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS question_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(question_id, tag)
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_hours INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Path tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS path_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID NOT NULL REFERENCES paths(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(path_id, tag)
);

-- Questions in paths (many-to-many with ordering)
CREATE TABLE IF NOT EXISTS path_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID NOT NULL REFERENCES paths(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL, -- Order of question in the path
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(path_id, question_id),
    UNIQUE(path_id, order_index)
);

-- User progress on paths
CREATE TABLE IF NOT EXISTS user_path_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    path_id UUID NOT NULL REFERENCES paths(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, path_id)
);

-- User progress on individual questions within paths
CREATE TABLE IF NOT EXISTS user_question_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    path_id UUID REFERENCES paths(id) ON DELETE CASCADE, -- Optional: track which path this was completed in
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    attempts INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    notes TEXT, -- User's notes about the solution
    solution_url TEXT, -- Link to user's solution (e.g., GitHub, LeetCode)
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id, path_id)
);

-- User statistics (aggregated data for performance)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    total_questions_attempted INTEGER DEFAULT 0,
    total_questions_solved INTEGER DEFAULT 0,
    easy_solved INTEGER DEFAULT 0,
    medium_solved INTEGER DEFAULT 0,
    hard_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    enrolled_paths INTEGER DEFAULT 0,
    completed_paths INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_leetcode_id ON questions(leetcode_id);
CREATE INDEX IF NOT EXISTS idx_questions_slug ON questions(slug);
CREATE INDEX IF NOT EXISTS idx_questions_is_custom ON questions(is_custom);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);

CREATE INDEX IF NOT EXISTS idx_question_tags_question_id ON question_tags(question_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_tag ON question_tags(tag);

CREATE INDEX IF NOT EXISTS idx_paths_difficulty ON paths(difficulty);
CREATE INDEX IF NOT EXISTS idx_paths_is_public ON paths(is_public);
CREATE INDEX IF NOT EXISTS idx_paths_created_by ON paths(created_by);

CREATE INDEX IF NOT EXISTS idx_path_tags_path_id ON path_tags(path_id);
CREATE INDEX IF NOT EXISTS idx_path_tags_tag ON path_tags(tag);

CREATE INDEX IF NOT EXISTS idx_path_questions_path_id ON path_questions(path_id);
CREATE INDEX IF NOT EXISTS idx_path_questions_question_id ON path_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_path_questions_order ON path_questions(path_id, order_index);

CREATE INDEX IF NOT EXISTS idx_user_path_progress_user_id ON user_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_path_progress_path_id ON user_path_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_user_path_progress_enrolled_at ON user_path_progress(enrolled_at);

CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_id ON user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_question_id ON user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_path_id ON user_question_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_status ON user_question_progress(status);

-- Triggers to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paths_updated_at BEFORE UPDATE ON paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_question_progress_updated_at BEFORE UPDATE ON user_question_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user stats when question progress changes
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user stats when question progress changes
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Recalculate user statistics
        INSERT INTO user_stats (
            user_id,
            total_questions_attempted,
            total_questions_solved,
            easy_solved,
            medium_solved,
            hard_solved,
            last_activity_date,
            updated_at
        )
        SELECT
            NEW.user_id,
            COUNT(*) FILTER (WHERE uqp.status IN ('in_progress', 'completed')),
            COUNT(*) FILTER (WHERE uqp.status = 'completed'),
            COUNT(*) FILTER (WHERE uqp.status = 'completed' AND q.difficulty = 'Easy'),
            COUNT(*) FILTER (WHERE uqp.status = 'completed' AND q.difficulty = 'Medium'),
            COUNT(*) FILTER (WHERE uqp.status = 'completed' AND q.difficulty = 'Hard'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        FROM user_question_progress uqp
        JOIN questions q ON uqp.question_id = q.id
        WHERE uqp.user_id = NEW.user_id
        GROUP BY uqp.user_id
        ON CONFLICT (user_id) DO UPDATE SET
            total_questions_attempted = EXCLUDED.total_questions_attempted,
            total_questions_solved = EXCLUDED.total_questions_solved,
            easy_solved = EXCLUDED.easy_solved,
            medium_solved = EXCLUDED.medium_solved,
            hard_solved = EXCLUDED.hard_solved,
            last_activity_date = EXCLUDED.last_activity_date,
            updated_at = EXCLUDED.updated_at;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT OR UPDATE ON user_question_progress
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();
