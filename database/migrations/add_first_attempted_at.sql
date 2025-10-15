-- Migration: Add first_attempted_at column to user_question_progress table
-- Date: 2025-10-15
-- Description: This column tracks when a user first attempted a question,
--              used by both the complete and review APIs

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_question_progress'
        AND column_name = 'first_attempted_at'
    ) THEN
        ALTER TABLE user_question_progress
        ADD COLUMN first_attempted_at TIMESTAMP WITH TIME ZONE;

        -- For existing records, set first_attempted_at to the earliest available timestamp
        UPDATE user_question_progress
        SET first_attempted_at = COALESCE(completed_at, last_attempted_at, created_at)
        WHERE first_attempted_at IS NULL;

        RAISE NOTICE 'Column first_attempted_at added successfully';
    ELSE
        RAISE NOTICE 'Column first_attempted_at already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_question_progress'
AND column_name = 'first_attempted_at';
