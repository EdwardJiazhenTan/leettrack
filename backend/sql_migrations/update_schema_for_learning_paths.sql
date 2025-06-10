-- SQL migration script for updating the learning path schema
-- To be executed on the AWS PostgreSQL database

-- 1. Update the learning_paths table with new columns
ALTER TABLE learning_paths
ADD COLUMN creator_id INTEGER REFERENCES users(user_id),
ADD COLUMN is_public BOOLEAN DEFAULT TRUE,
ADD COLUMN difficulty_level VARCHAR(20),
ADD COLUMN estimated_hours INTEGER,
ADD COLUMN tags VARCHAR(500),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

COMMENT ON COLUMN learning_paths.creator_id IS 'Creator ID, can be a system or user';
COMMENT ON COLUMN learning_paths.is_public IS 'Whether the path is publicly visible';
COMMENT ON COLUMN learning_paths.difficulty_level IS 'Path difficulty level: Beginner, Intermediate, Advanced';
COMMENT ON COLUMN learning_paths.estimated_hours IS 'Estimated completion hours';
COMMENT ON COLUMN learning_paths.tags IS 'Comma-separated list of tags';
COMMENT ON COLUMN learning_paths.updated_at IS 'Last updated timestamp';

-- 2. Create the user_learning_paths table
CREATE TABLE user_learning_paths (
    user_path_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    path_id INTEGER REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    completion_percentage FLOAT DEFAULT 0,
    UNIQUE (user_id, path_id)
);

COMMENT ON TABLE user_learning_paths IS 'User learning path progress tracking';
COMMENT ON COLUMN user_learning_paths.started_at IS 'When the user started learning';
COMMENT ON COLUMN user_learning_paths.completed_at IS 'When the user completed the path';
COMMENT ON COLUMN user_learning_paths.is_active IS 'Whether this is an active path for the user';
COMMENT ON COLUMN user_learning_paths.completion_percentage IS 'Percentage of completion';

-- 3. Update the path_questions table with new columns
ALTER TABLE path_questions
ADD COLUMN notes TEXT,
ADD COLUMN estimated_minutes INTEGER,
ADD COLUMN importance INTEGER CHECK (importance BETWEEN 1 AND 5);

COMMENT ON COLUMN path_questions.notes IS 'Specific notes about this question in this path';
COMMENT ON COLUMN path_questions.estimated_minutes IS 'Estimated time to complete in minutes';
COMMENT ON COLUMN path_questions.importance IS 'Importance level in the path (1-5)';

-- 4. Create the user_path_questions table
CREATE TABLE user_path_questions (
    user_path_question_id SERIAL PRIMARY KEY,
    user_path_id INTEGER REFERENCES user_learning_paths(user_path_id) ON DELETE CASCADE,
    path_question_id INTEGER REFERENCES path_questions(path_question_id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_path_id, path_question_id)
);

COMMENT ON TABLE user_path_questions IS 'User progress on individual questions in a learning path';
COMMENT ON COLUMN user_path_questions.is_completed IS 'Whether the question is completed';
COMMENT ON COLUMN user_path_questions.completed_at IS 'When the question was completed';

-- 5. Create indexes for performance optimization
-- User learning paths indexes
CREATE INDEX idx_user_learning_paths_user_id ON user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_path_id ON user_learning_paths(path_id);
CREATE INDEX idx_user_learning_paths_is_active ON user_learning_paths(is_active);

-- Path question progress indexes
CREATE INDEX idx_user_path_questions_user_path_id ON user_path_questions(user_path_id);
CREATE INDEX idx_user_path_questions_completion ON user_path_questions(is_completed);

-- Learning paths indexes
CREATE INDEX idx_learning_paths_creator ON learning_paths(creator_id);
CREATE INDEX idx_learning_paths_public ON learning_paths(is_public);
CREATE INDEX idx_learning_paths_difficulty ON learning_paths(difficulty_level);

-- 6. Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_learning_path_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_learning_path_timestamp
BEFORE UPDATE ON learning_paths
FOR EACH ROW
EXECUTE FUNCTION update_learning_path_timestamp();

-- 7. Rollback script (for reference, not to be executed unless needed)
/*
DROP TRIGGER IF EXISTS update_learning_path_timestamp ON learning_paths;
DROP FUNCTION IF EXISTS update_learning_path_timestamp();

DROP INDEX IF EXISTS idx_learning_paths_difficulty;
DROP INDEX IF EXISTS idx_learning_paths_public;
DROP INDEX IF EXISTS idx_learning_paths_creator;
DROP INDEX IF EXISTS idx_user_path_questions_completion;
DROP INDEX IF EXISTS idx_user_path_questions_user_path_id;
DROP INDEX IF EXISTS idx_user_learning_paths_is_active;
DROP INDEX IF EXISTS idx_user_learning_paths_path_id;
DROP INDEX IF EXISTS idx_user_learning_paths_user_id;

DROP TABLE IF EXISTS user_path_questions;

ALTER TABLE path_questions 
DROP COLUMN IF EXISTS notes,
DROP COLUMN IF EXISTS estimated_minutes,
DROP COLUMN IF EXISTS importance;

DROP TABLE IF EXISTS user_learning_paths;

ALTER TABLE learning_paths
DROP COLUMN IF EXISTS creator_id,
DROP COLUMN IF EXISTS is_public,
DROP COLUMN IF EXISTS difficulty_level,
DROP COLUMN IF EXISTS estimated_hours,
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS updated_at;
*/ 