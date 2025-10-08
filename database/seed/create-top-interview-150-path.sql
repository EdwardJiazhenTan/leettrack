-- Insert questions from Top Interview 150

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Merge Sorted Array', 'merge-sorted-array', 'Easy', 'https://leetcode.com/problems/merge-sorted-array/', '88', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Remove Element', 'remove-element', 'Easy', 'https://leetcode.com/problems/remove-element/', '27', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Easy', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', '26', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Remove Duplicates from Sorted Array II', 'remove-duplicates-from-sorted-array-ii', 'Medium', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/', '80', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Majority Element', 'majority-element', 'Easy', 'https://leetcode.com/problems/majority-element/', '169', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Rotate Array', 'rotate-array', 'Medium', 'https://leetcode.com/problems/rotate-array/', '189', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', '121', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii', 'Medium', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', '122', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Jump Game', 'jump-game', 'Medium', 'https://leetcode.com/problems/jump-game/', '55', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Jump Game II', 'jump-game-ii', 'Medium', 'https://leetcode.com/problems/jump-game-ii/', '45', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('H-Index', 'h-index', 'Medium', 'https://leetcode.com/problems/h-index/', '274', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Insert Delete GetRandom O(1)', 'insert-delete-getrandom-o1', 'Medium', 'https://leetcode.com/problems/insert-delete-getrandom-o1/', '380', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Product of Array Except Self', 'product-of-array-except-self', 'Medium', 'https://leetcode.com/problems/product-of-array-except-self/', '238', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Gas Station', 'gas-station', 'Medium', 'https://leetcode.com/problems/gas-station/', '134', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Candy', 'candy', 'Medium', 'https://leetcode.com/problems/candy/', '135', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Trapping Rain Water', 'trapping-rain-water', 'Hard', 'https://leetcode.com/problems/trapping-rain-water/', '42', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Roman to Integer', 'roman-to-integer', 'Easy', 'https://leetcode.com/problems/roman-to-integer/', '13', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Integer to Roman', 'integer-to-roman', 'Medium', 'https://leetcode.com/problems/integer-to-roman/', '12', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Length of Last Word', 'length-of-last-word', 'Easy', 'https://leetcode.com/problems/length-of-last-word/', '58', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Longest Common Prefix', 'longest-common-prefix', 'Easy', 'https://leetcode.com/problems/longest-common-prefix/', '14', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;


-- Create the Top Interview 150 learning path
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
  'Top Interview 150',
  'LeetCode''s curated list of 150 most common interview questions. Covers comprehensive interview topics and is best for 3+ months of preparation time.',
  'Intermediate',
  100,
  true
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Add questions to the path
DO $$
DECLARE
  v_path_id UUID;
  v_question_id UUID;
BEGIN
  SELECT id INTO v_path_id FROM learning_paths WHERE title = 'Top Interview 150';
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'merge-sorted-array';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 0)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-element';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 1)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-duplicates-from-sorted-array';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 2)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-duplicates-from-sorted-array-ii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 3)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'majority-element';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 4)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'rotate-array';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 5)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 6)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock-ii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 7)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'jump-game';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 8)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'jump-game-ii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 9)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'h-index';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 10)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'insert-delete-getrandom-o1';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 11)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'product-of-array-except-self';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 12)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'gas-station';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 13)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'candy';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 14)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'trapping-rain-water';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 15)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'roman-to-integer';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 16)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'integer-to-roman';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 17)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'length-of-last-word';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 18)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-common-prefix';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 19)
  ON CONFLICT (path_id, order_index) DO NOTHING;
  
END $$;

-- Verify the path was created
SELECT 
  lp.title,
  lp.difficulty,
  COUNT(pq.id) as total_questions
FROM learning_paths lp
LEFT JOIN path_questions pq ON pq.path_id = lp.id
WHERE lp.title = 'Top Interview 150'
GROUP BY lp.id, lp.title, lp.difficulty;
