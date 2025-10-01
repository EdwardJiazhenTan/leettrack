-- Clear old daily recommendations
DELETE FROM daily_recommendations WHERE user_id = '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15';

-- Add fresh daily recommendations for today
INSERT INTO daily_recommendations (user_id, question_id, date, recommendation_type, priority_score)
SELECT
  '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15',
  id,
  CURRENT_DATE,
  'new'::recommendation_type,
  0.8
FROM questions
WHERE slug IN ('median-of-two-sorted-arrays', 'longest-palindromic-substring')
LIMIT 2;

SELECT COUNT(*) as daily_recommendations_added FROM daily_recommendations
WHERE user_id = '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15' AND date = CURRENT_DATE;
