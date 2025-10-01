INSERT INTO daily_recommendations (user_id, question_id, date, recommendation_type, priority_score)
SELECT
  '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15',
  id,
  CURRENT_DATE,
  (CASE
    WHEN ROW_NUMBER() OVER (ORDER BY id) % 2 = 0 THEN 'review'
    ELSE 'new'
  END)::recommendation_type,
  ((ROW_NUMBER() OVER (ORDER BY id)) * 0.15)::DECIMAL(3,2)
FROM questions
LIMIT 5;

SELECT COUNT(*) as recommendations_added FROM daily_recommendations
WHERE user_id = '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15' AND date = CURRENT_DATE;
