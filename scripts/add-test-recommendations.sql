-- Add test recommendations for today
-- Replace USER_ID_HERE with your actual user ID from the users table

-- First, let's check what user IDs exist
SELECT id, email, username FROM users;

-- Insert some test recommendations for today (uncomment and replace USER_ID_HERE)
-- INSERT INTO daily_recommendations (user_id, question_id, date, recommendation_type, priority_score)
-- SELECT
--   'USER_ID_HERE',
--   id,
--   CURRENT_DATE,
--   CASE
--     WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 0 THEN 'review'
--     WHEN ROW_NUMBER() OVER (ORDER BY id) % 3 = 1 THEN 'new'
--     ELSE 'spaced_repetition'
--   END,
--   (ROW_NUMBER() OVER (ORDER BY RANDOM())) * 10
-- FROM questions
-- LIMIT 5
-- ON CONFLICT (user_id, question_id, date) DO NOTHING;
