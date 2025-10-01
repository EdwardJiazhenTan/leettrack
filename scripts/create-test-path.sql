-- Create a test learning path
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, is_public, created_by)
VALUES (
  'Array Fundamentals',
  'Master the basics of array manipulation and common patterns',
  'Beginner',
  10,
  true,
  '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15'
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Add questions to the path
DO $$
DECLARE
  path_id UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
  q5_id UUID;
BEGIN
  -- Get the path ID
  SELECT id INTO path_id FROM learning_paths WHERE title = 'Array Fundamentals';

  -- Get question IDs
  SELECT id INTO q1_id FROM questions WHERE slug = 'two-sum';
  SELECT id INTO q2_id FROM questions WHERE slug = 'add-two-numbers';
  SELECT id INTO q3_id FROM questions WHERE slug = 'longest-substring-without-repeating-characters';
  SELECT id INTO q4_id FROM questions WHERE slug = 'median-of-two-sorted-arrays';
  SELECT id INTO q5_id FROM questions WHERE slug = 'longest-palindromic-substring';

  -- Add questions to the path in sequence (using order_index)
  INSERT INTO path_questions (path_id, question_id, order_index) VALUES
    (path_id, q1_id, 0),
    (path_id, q2_id, 1),
    (path_id, q3_id, 2),
    (path_id, q4_id, 3),
    (path_id, q5_id, 4)
  ON CONFLICT DO NOTHING;

  -- Enroll the test user in this path
  INSERT INTO user_path_enrollments (user_id, path_id)
  VALUES ('35f8ad5d-e7e2-444b-b380-b59ca7d5ea15', path_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Created path % and enrolled user', path_id;
END $$;

-- Verify the setup
SELECT
  lp.title,
  lp.difficulty,
  COUNT(pq.id) as total_questions
FROM learning_paths lp
LEFT JOIN path_questions pq ON pq.path_id = lp.id
WHERE lp.title = 'Array Fundamentals'
GROUP BY lp.id, lp.title, lp.difficulty;

-- Show enrolled paths for user
SELECT
  lp.title,
  upe.enrolled_at,
  upe.is_active
FROM user_path_enrollments upe
JOIN learning_paths lp ON upe.path_id = lp.id
WHERE upe.user_id = '35f8ad5d-e7e2-444b-b380-b59ca7d5ea15';
