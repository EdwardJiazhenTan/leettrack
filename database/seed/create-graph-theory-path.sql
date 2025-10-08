-- Insert Graph Theory questions
INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Flood Fill', 'flood-fill', 'Easy', 'https://leetcode.com/problems/flood-fill/', '733', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of Islands', 'number-of-islands', 'Medium', 'https://leetcode.com/problems/number-of-islands/', '200', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Max Area of Island', 'max-area-of-island', 'Medium', 'https://leetcode.com/problems/max-area-of-island/', '695', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of Closed Islands', 'number-of-closed-islands', 'Medium', 'https://leetcode.com/problems/number-of-closed-islands/', '1254', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of Enclaves', 'number-of-enclaves', 'Medium', 'https://leetcode.com/problems/number-of-enclaves/', '1020', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Count Sub Islands', 'count-sub-islands', 'Medium', 'https://leetcode.com/problems/count-sub-islands/', '1905', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('As Far from Land as Possible', 'as-far-from-land-as-possible', 'Medium', 'https://leetcode.com/problems/as-far-from-land-as-possible/', '1162', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'Medium', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', '417', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Shortest Path in Binary Matrix', 'shortest-path-in-binary-matrix', 'Medium', 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', '1091', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('01 Matrix', '01-matrix', 'Medium', 'https://leetcode.com/problems/01-matrix/', '542', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Shortest Bridge', 'shortest-bridge', 'Medium', 'https://leetcode.com/problems/shortest-bridge/', '934', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Nearest Exit from Entrance in Maze', 'nearest-exit-from-entrance-in-maze', 'Medium', 'https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/', '1926', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('All Paths From Source to Target', 'all-paths-from-source-to-target', 'Medium', 'https://leetcode.com/problems/all-paths-from-source-to-target/', '797', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Keys and Rooms', 'keys-and-rooms', 'Medium', 'https://leetcode.com/problems/keys-and-rooms/', '841', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of Provinces', 'number-of-provinces', 'Medium', 'https://leetcode.com/problems/number-of-provinces/', '547', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of Operations to Make Network Connected', 'number-of-operations-to-make-network-connected', 'Medium', 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/', '1319', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Time Needed to Inform All Employees', 'time-needed-to-inform-all-employees', 'Medium', 'https://leetcode.com/problems/time-needed-to-inform-all-employees/', '1376', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find Eventual Safe States', 'find-eventual-safe-states', 'Medium', 'https://leetcode.com/problems/find-eventual-safe-states/', '802', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Shortest Path with Alternating Colors', 'shortest-path-with-alternating-colors', 'Medium', 'https://leetcode.com/problems/shortest-path-with-alternating-colors/', '1129', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Reorder Routes to Make All Paths Lead to the City Zero', 'reorder-routes-to-make-all-paths-lead-to-the-city-zero', 'Medium', 'https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/', '1466', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Shortest Path Visiting All Nodes', 'shortest-path-visiting-all-nodes', 'Hard', 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/', '847', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Jump Game III', 'jump-game-iii', 'Medium', 'https://leetcode.com/problems/jump-game-iii/', '1306', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Jumps to Reach Home', 'minimum-jumps-to-reach-home', 'Medium', 'https://leetcode.com/problems/minimum-jumps-to-reach-home/', '1654', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Water and Jug Problem', 'water-and-jug-problem', 'Medium', 'https://leetcode.com/problems/water-and-jug-problem/', '365', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Genetic Mutation', 'minimum-genetic-mutation', 'Medium', 'https://leetcode.com/problems/minimum-genetic-mutation/', '433', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Open the Lock', 'open-the-lock', 'Medium', 'https://leetcode.com/problems/open-the-lock/', '752', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Word Ladder', 'word-ladder', 'Hard', 'https://leetcode.com/problems/word-ladder/', '127', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find the Town Judge', 'find-the-town-judge', 'Easy', 'https://leetcode.com/problems/find-the-town-judge/', '997', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Number of Vertices to Reach All Nodes', 'minimum-number-of-vertices-to-reach-all-nodes', 'Medium', 'https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/', '1557', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Maximal Network Rank', 'maximal-network-rank', 'Medium', 'https://leetcode.com/problems/maximal-network-rank/', '1615', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Possible Bipartition', 'possible-bipartition', 'Medium', 'https://leetcode.com/problems/possible-bipartition/', '886', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Is Graph Bipartite?', 'is-graph-bipartite', 'Medium', 'https://leetcode.com/problems/is-graph-bipartite/', '785', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Redundant Connection', 'redundant-connection', 'Medium', 'https://leetcode.com/problems/redundant-connection/', '684', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Redundant Connection II', 'redundant-connection-ii', 'Hard', 'https://leetcode.com/problems/redundant-connection-ii/', '685', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Clone Graph', 'clone-graph', 'Medium', 'https://leetcode.com/problems/clone-graph/', '133', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Course Schedule', 'course-schedule', 'Medium', 'https://leetcode.com/problems/course-schedule/', '207', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Course Schedule II', 'course-schedule-ii', 'Medium', 'https://leetcode.com/problems/course-schedule-ii/', '210', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

-- Create the Graph Theory learning path
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
  'Graph Theory',
  'Master essential graph algorithms including DFS, BFS, topological sort, shortest paths, and Union-Find. Perfect for building strong graph problem-solving skills.',
  'Intermediate',
  40,
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
  SELECT id INTO v_path_id FROM learning_paths WHERE title = 'Graph Theory';

  SELECT id INTO v_question_id FROM questions WHERE slug = 'flood-fill';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 0)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-islands';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 1)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'max-area-of-island';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 2)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-closed-islands';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 3)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-enclaves';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 4)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'count-sub-islands';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 5)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'as-far-from-land-as-possible';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 6)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'pacific-atlantic-water-flow';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 7)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'shortest-path-in-binary-matrix';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 8)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = '01-matrix';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 9)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'shortest-bridge';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 10)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'nearest-exit-from-entrance-in-maze';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 11)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'all-paths-from-source-to-target';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 12)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'keys-and-rooms';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 13)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-provinces';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 14)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-operations-to-make-network-connected';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 15)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'time-needed-to-inform-all-employees';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 16)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-eventual-safe-states';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 17)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'shortest-path-with-alternating-colors';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 18)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'reorder-routes-to-make-all-paths-lead-to-the-city-zero';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 19)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'shortest-path-visiting-all-nodes';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 20)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'jump-game-iii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 21)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-jumps-to-reach-home';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 22)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'water-and-jug-problem';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 23)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-genetic-mutation';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 24)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'open-the-lock';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 25)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-ladder';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 26)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-the-town-judge';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 27)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-number-of-vertices-to-reach-all-nodes';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 28)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'maximal-network-rank';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 29)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'possible-bipartition';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 30)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'is-graph-bipartite';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 31)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'redundant-connection';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 32)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'redundant-connection-ii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 33)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'clone-graph';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 34)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'course-schedule';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 35)
  ON CONFLICT (path_id, order_index) DO NOTHING;

  SELECT id INTO v_question_id FROM questions WHERE slug = 'course-schedule-ii';
  INSERT INTO path_questions (path_id, question_id, order_index)
  VALUES (v_path_id, v_question_id, 36)
  ON CONFLICT (path_id, order_index) DO NOTHING;

END $$;

-- Verify the path was created
SELECT
  lp.title,
  lp.difficulty,
  COUNT(pq.id) as total_questions
FROM learning_paths lp
LEFT JOIN path_questions pq ON pq.path_id = lp.id
WHERE lp.title = 'Graph Theory'
GROUP BY lp.id, lp.title, lp.difficulty;
