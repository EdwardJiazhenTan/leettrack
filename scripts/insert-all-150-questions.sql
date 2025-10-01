-- Top Interview 150 - All Questions
-- First, delete the existing path to recreate it fresh
DELETE FROM path_questions WHERE path_id IN (SELECT id FROM learning_paths WHERE title = 'Top Interview 150');
DELETE FROM learning_paths WHERE title = 'Top Interview 150';

-- Insert all questions
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
VALUES ('Candy', 'candy', 'Hard', 'https://leetcode.com/problems/candy/', '135', false)
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

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Reverse Words in a String', 'reverse-words-in-a-string', 'Medium', 'https://leetcode.com/problems/reverse-words-in-a-string/', '151', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Zigzag Conversion', 'zigzag-conversion', 'Medium', 'https://leetcode.com/problems/zigzag-conversion/', '6', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find the Index of the First Occurrence in a String', 'find-the-index-of-the-first-occurrence-in-a-string', 'Easy', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', '28', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Text Justification', 'text-justification', 'Hard', 'https://leetcode.com/problems/text-justification/', '68', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Valid Palindrome', 'valid-palindrome', 'Easy', 'https://leetcode.com/problems/valid-palindrome/', '125', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Is Subsequence', 'is-subsequence', 'Easy', 'https://leetcode.com/problems/is-subsequence/', '392', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Two Sum II - Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted', 'Medium', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', '167', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Container With Most Water', 'container-with-most-water', 'Medium', 'https://leetcode.com/problems/container-with-most-water/', '11', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('3Sum', '3sum', 'Medium', 'https://leetcode.com/problems/3sum/', '15', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Size Subarray Sum', 'minimum-size-subarray-sum', 'Medium', 'https://leetcode.com/problems/minimum-size-subarray-sum/', '209', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '3', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Substring with Concatenation of All Words', 'substring-with-concatenation-of-all-words', 'Hard', 'https://leetcode.com/problems/substring-with-concatenation-of-all-words/', '30', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Window Substring', 'minimum-window-substring', 'Hard', 'https://leetcode.com/problems/minimum-window-substring/', '76', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Valid Sudoku', 'valid-sudoku', 'Medium', 'https://leetcode.com/problems/valid-sudoku/', '36', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Spiral Matrix', 'spiral-matrix', 'Medium', 'https://leetcode.com/problems/spiral-matrix/', '54', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Rotate Image', 'rotate-image', 'Medium', 'https://leetcode.com/problems/rotate-image/', '48', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium', 'https://leetcode.com/problems/set-matrix-zeroes/', '73', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Game of Life', 'game-of-life', 'Medium', 'https://leetcode.com/problems/game-of-life/', '289', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Ransom Note', 'ransom-note', 'Easy', 'https://leetcode.com/problems/ransom-note/', '383', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Isomorphic Strings', 'isomorphic-strings', 'Easy', 'https://leetcode.com/problems/isomorphic-strings/', '205', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Word Pattern', 'word-pattern', 'Easy', 'https://leetcode.com/problems/word-pattern/', '290', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Valid Anagram', 'valid-anagram', 'Easy', 'https://leetcode.com/problems/valid-anagram/', '242', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Group Anagrams', 'group-anagrams', 'Medium', 'https://leetcode.com/problems/group-anagrams/', '49', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Two Sum', 'two-sum', 'Easy', 'https://leetcode.com/problems/two-sum/', '1', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Happy Number', 'happy-number', 'Easy', 'https://leetcode.com/problems/happy-number/', '202', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Contains Duplicate II', 'contains-duplicate-ii', 'Easy', 'https://leetcode.com/problems/contains-duplicate-ii/', '219', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Longest Consecutive Sequence', 'longest-consecutive-sequence', 'Medium', 'https://leetcode.com/problems/longest-consecutive-sequence/', '128', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Summary Ranges', 'summary-ranges', 'Easy', 'https://leetcode.com/problems/summary-ranges/', '228', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Merge Intervals', 'merge-intervals', 'Medium', 'https://leetcode.com/problems/merge-intervals/', '56', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Insert Interval', 'insert-interval', 'Medium', 'https://leetcode.com/problems/insert-interval/', '57', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Number of Arrows to Burst Balloons', 'minimum-number-of-arrows-to-burst-balloons', 'Medium', 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', '452', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Valid Parentheses', 'valid-parentheses', 'Easy', 'https://leetcode.com/problems/valid-parentheses/', '20', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Simplify Path', 'simplify-path', 'Medium', 'https://leetcode.com/problems/simplify-path/', '71', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Min Stack', 'min-stack', 'Medium', 'https://leetcode.com/problems/min-stack/', '155', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'Medium', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', '150', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Basic Calculator', 'basic-calculator', 'Hard', 'https://leetcode.com/problems/basic-calculator/', '224', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Linked List Cycle', 'linked-list-cycle', 'Easy', 'https://leetcode.com/problems/linked-list-cycle/', '141', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Add Two Numbers', 'add-two-numbers', 'Medium', 'https://leetcode.com/problems/add-two-numbers/', '2', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'Easy', 'https://leetcode.com/problems/merge-two-sorted-lists/', '21', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Copy List with Random Pointer', 'copy-list-with-random-pointer', 'Medium', 'https://leetcode.com/problems/copy-list-with-random-pointer/', '138', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Reverse Linked List II', 'reverse-linked-list-ii', 'Medium', 'https://leetcode.com/problems/reverse-linked-list-ii/', '92', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'Hard', 'https://leetcode.com/problems/reverse-nodes-in-k-group/', '25', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'Medium', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', '19', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Remove Duplicates from Sorted List II', 'remove-duplicates-from-sorted-list-ii', 'Medium', 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/', '82', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Rotate List', 'rotate-list', 'Medium', 'https://leetcode.com/problems/rotate-list/', '61', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Partition List', 'partition-list', 'Medium', 'https://leetcode.com/problems/partition-list/', '86', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('LRU Cache', 'lru-cache', 'Medium', 'https://leetcode.com/problems/lru-cache/', '146', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'Easy', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', '104', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Same Tree', 'same-tree', 'Easy', 'https://leetcode.com/problems/same-tree/', '100', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Invert Binary Tree', 'invert-binary-tree', 'Easy', 'https://leetcode.com/problems/invert-binary-tree/', '226', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Symmetric Tree', 'symmetric-tree', 'Easy', 'https://leetcode.com/problems/symmetric-tree/', '101', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Medium', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', '105', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Construct Binary Tree from Inorder and Postorder Traversal', 'construct-binary-tree-from-inorder-and-postorder-traversal', 'Medium', 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', '106', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Populating Next Right Pointers in Each Node II', 'populating-next-right-pointers-in-each-node-ii', 'Medium', 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/', '117', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Flatten Binary Tree to Linked List', 'flatten-binary-tree-to-linked-list', 'Medium', 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', '114', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Path Sum', 'path-sum', 'Easy', 'https://leetcode.com/problems/path-sum/', '112', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Sum Root to Leaf Numbers', 'sum-root-to-leaf-numbers', 'Medium', 'https://leetcode.com/problems/sum-root-to-leaf-numbers/', '129', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Hard', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', '124', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Binary Search Tree Iterator', 'binary-search-tree-iterator', 'Medium', 'https://leetcode.com/problems/binary-search-tree-iterator/', '173', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Count Complete Tree Nodes', 'count-complete-tree-nodes', 'Easy', 'https://leetcode.com/problems/count-complete-tree-nodes/', '222', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', '236', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Binary Tree Right Side View', 'binary-tree-right-side-view', 'Medium', 'https://leetcode.com/problems/binary-tree-right-side-view/', '199', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Average of Levels in Binary Tree', 'average-of-levels-in-binary-tree', 'Easy', 'https://leetcode.com/problems/average-of-levels-in-binary-tree/', '637', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Medium', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', '102', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Binary Tree Zigzag Level Order Traversal', 'binary-tree-zigzag-level-order-traversal', 'Medium', 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', '103', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Absolute Difference in BST', 'minimum-absolute-difference-in-bst', 'Easy', 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/', '530', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'Medium', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', '230', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium', 'https://leetcode.com/problems/validate-binary-search-tree/', '98', false)
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
VALUES ('Surrounded Regions', 'surrounded-regions', 'Medium', 'https://leetcode.com/problems/surrounded-regions/', '130', false)
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
VALUES ('Evaluate Division', 'evaluate-division', 'Medium', 'https://leetcode.com/problems/evaluate-division/', '399', false)
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

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Snakes and Ladders', 'snakes-and-ladders', 'Medium', 'https://leetcode.com/problems/snakes-and-ladders/', '945', false)
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
VALUES ('Word Ladder', 'word-ladder', 'Hard', 'https://leetcode.com/problems/word-ladder/', '127', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree', 'Medium', 'https://leetcode.com/problems/implement-trie-prefix-tree/', '208', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'Medium', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', '211', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Word Search II', 'word-search-ii', 'Hard', 'https://leetcode.com/problems/word-search-ii/', '212', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'Medium', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', '17', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Combinations', 'combinations', 'Medium', 'https://leetcode.com/problems/combinations/', '77', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Permutations', 'permutations', 'Medium', 'https://leetcode.com/problems/permutations/', '46', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Combination Sum', 'combination-sum', 'Medium', 'https://leetcode.com/problems/combination-sum/', '39', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('N-Queens II', 'n-queens-ii', 'Hard', 'https://leetcode.com/problems/n-queens-ii/', '52', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Generate Parentheses', 'generate-parentheses', 'Medium', 'https://leetcode.com/problems/generate-parentheses/', '22', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Word Search', 'word-search', 'Medium', 'https://leetcode.com/problems/word-search/', '79', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Convert Sorted Array to Binary Search Tree', 'convert-sorted-array-to-binary-search-tree', 'Easy', 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', '108', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Sort List', 'sort-list', 'Medium', 'https://leetcode.com/problems/sort-list/', '148', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Construct Quad Tree', 'construct-quad-tree', 'Medium', 'https://leetcode.com/problems/construct-quad-tree/', '772', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard', 'https://leetcode.com/problems/merge-k-sorted-lists/', '23', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Maximum Subarray', 'maximum-subarray', 'Medium', 'https://leetcode.com/problems/maximum-subarray/', '53', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Maximum Sum Circular Subarray', 'maximum-sum-circular-subarray', 'Medium', 'https://leetcode.com/problems/maximum-sum-circular-subarray/', '954', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Search Insert Position', 'search-insert-position', 'Easy', 'https://leetcode.com/problems/search-insert-position/', '35', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Search a 2D Matrix', 'search-a-2d-matrix', 'Medium', 'https://leetcode.com/problems/search-a-2d-matrix/', '74', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find Peak Element', 'find-peak-element', 'Medium', 'https://leetcode.com/problems/find-peak-element/', '162', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', '33', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find First and Last Position of Element in Sorted Array', 'find-first-and-last-position-of-element-in-sorted-array', 'Medium', 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', '34', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'Medium', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', '153', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '4', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium', 'https://leetcode.com/problems/kth-largest-element-in-an-array/', '215', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('IPO', 'ipo', 'Hard', 'https://leetcode.com/problems/ipo/', '502', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find K Pairs with Smallest Sums', 'find-k-pairs-with-smallest-sums', 'Medium', 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/', '373', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Find Median from Data Stream', 'find-median-from-data-stream', 'Hard', 'https://leetcode.com/problems/find-median-from-data-stream/', '295', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Add Binary', 'add-binary', 'Easy', 'https://leetcode.com/problems/add-binary/', '67', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Reverse Bits', 'reverse-bits', 'Easy', 'https://leetcode.com/problems/reverse-bits/', '190', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Number of 1 Bits', 'number-of-1-bits', 'Easy', 'https://leetcode.com/problems/number-of-1-bits/', '191', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Single Number', 'single-number', 'Easy', 'https://leetcode.com/problems/single-number/', '136', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Single Number II', 'single-number-ii', 'Medium', 'https://leetcode.com/problems/single-number-ii/', '137', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Bitwise AND of Numbers Range', 'bitwise-and-of-numbers-range', 'Medium', 'https://leetcode.com/problems/bitwise-and-of-numbers-range/', '201', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Palindrome Number', 'palindrome-number', 'Easy', 'https://leetcode.com/problems/palindrome-number/', '9', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Plus One', 'plus-one', 'Easy', 'https://leetcode.com/problems/plus-one/', '66', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Factorial Trailing Zeroes', 'factorial-trailing-zeroes', 'Medium', 'https://leetcode.com/problems/factorial-trailing-zeroes/', '172', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Sqrt(x)', 'sqrtx', 'Easy', 'https://leetcode.com/problems/sqrtx/', '69', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Pow(x, n)', 'powx-n', 'Medium', 'https://leetcode.com/problems/powx-n/', '50', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Max Points on a Line', 'max-points-on-a-line', 'Hard', 'https://leetcode.com/problems/max-points-on-a-line/', '149', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Climbing Stairs', 'climbing-stairs', 'Easy', 'https://leetcode.com/problems/climbing-stairs/', '70', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('House Robber', 'house-robber', 'Medium', 'https://leetcode.com/problems/house-robber/', '198', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Word Break', 'word-break', 'Medium', 'https://leetcode.com/problems/word-break/', '139', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Coin Change', 'coin-change', 'Medium', 'https://leetcode.com/problems/coin-change/', '322', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Longest Increasing Subsequence', 'longest-increasing-subsequence', 'Medium', 'https://leetcode.com/problems/longest-increasing-subsequence/', '300', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Triangle', 'triangle', 'Medium', 'https://leetcode.com/problems/triangle/', '120', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Minimum Path Sum', 'minimum-path-sum', 'Medium', 'https://leetcode.com/problems/minimum-path-sum/', '64', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Unique Paths II', 'unique-paths-ii', 'Medium', 'https://leetcode.com/problems/unique-paths-ii/', '63', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium', 'https://leetcode.com/problems/longest-palindromic-substring/', '5', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Interleaving String', 'interleaving-string', 'Medium', 'https://leetcode.com/problems/interleaving-string/', '97', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Edit Distance', 'edit-distance', 'Medium', 'https://leetcode.com/problems/edit-distance/', '72', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Best Time to Buy and Sell Stock III', 'best-time-to-buy-and-sell-stock-iii', 'Hard', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/', '123', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Best Time to Buy and Sell Stock IV', 'best-time-to-buy-and-sell-stock-iv', 'Hard', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/', '188', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;

INSERT INTO questions (title, slug, difficulty, url, leetcode_id, is_custom)
VALUES ('Maximal Square', 'maximal-square', 'Medium', 'https://leetcode.com/problems/maximal-square/', '221', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  leetcode_id = EXCLUDED.leetcode_id;


-- Create the Top Interview 150 learning path
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
  'Top Interview 150',
  'LeetCode''s curated list of 150 most common interview questions. Covers comprehensive interview topics including arrays, strings, linked lists, trees, graphs, dynamic programming, and more. Best for 3+ months of preparation time.',
  'Intermediate',
  120,
  true
)
RETURNING id;

-- Add all questions to the path in order
DO $$
DECLARE
  v_path_id UUID;
  v_question_id UUID;
BEGIN
  SELECT id INTO v_path_id FROM learning_paths WHERE title = 'Top Interview 150';
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'merge-sorted-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 0)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-element';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 1)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-duplicates-from-sorted-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 2)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-duplicates-from-sorted-array-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 3)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'majority-element';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 4)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'rotate-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 5)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 6)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 7)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'jump-game';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 8)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'jump-game-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 9)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'h-index';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 10)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'insert-delete-getrandom-o1';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 11)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'product-of-array-except-self';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 12)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'gas-station';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 13)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'candy';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 14)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'trapping-rain-water';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 15)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'roman-to-integer';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 16)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'integer-to-roman';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 17)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'length-of-last-word';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 18)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-common-prefix';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 19)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'reverse-words-in-a-string';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 20)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'zigzag-conversion';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 21)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-the-index-of-the-first-occurrence-in-a-string';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 22)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'text-justification';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 23)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'valid-palindrome';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 24)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'is-subsequence';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 25)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'two-sum-ii-input-array-is-sorted';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 26)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'container-with-most-water';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 27)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = '3sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 28)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-size-subarray-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 29)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-substring-without-repeating-characters';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 30)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'substring-with-concatenation-of-all-words';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 31)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-window-substring';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 32)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'valid-sudoku';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 33)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'spiral-matrix';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 34)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'rotate-image';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 35)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'set-matrix-zeroes';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 36)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'game-of-life';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 37)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'ransom-note';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 38)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'isomorphic-strings';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 39)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-pattern';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 40)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'valid-anagram';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 41)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'group-anagrams';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 42)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'two-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 43)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'happy-number';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 44)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'contains-duplicate-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 45)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-consecutive-sequence';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 46)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'summary-ranges';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 47)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'merge-intervals';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 48)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'insert-interval';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 49)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-number-of-arrows-to-burst-balloons';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 50)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'valid-parentheses';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 51)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'simplify-path';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 52)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'min-stack';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 53)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'evaluate-reverse-polish-notation';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 54)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'basic-calculator';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 55)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'linked-list-cycle';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 56)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'add-two-numbers';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 57)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'merge-two-sorted-lists';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 58)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'copy-list-with-random-pointer';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 59)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'reverse-linked-list-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 60)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'reverse-nodes-in-k-group';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 61)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-nth-node-from-end-of-list';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 62)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'remove-duplicates-from-sorted-list-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 63)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'rotate-list';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 64)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'partition-list';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 65)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'lru-cache';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 66)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'maximum-depth-of-binary-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 67)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'same-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 68)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'invert-binary-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 69)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'symmetric-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 70)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'construct-binary-tree-from-preorder-and-inorder-traversal';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 71)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'construct-binary-tree-from-inorder-and-postorder-traversal';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 72)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'populating-next-right-pointers-in-each-node-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 73)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'flatten-binary-tree-to-linked-list';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 74)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'path-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 75)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'sum-root-to-leaf-numbers';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 76)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'binary-tree-maximum-path-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 77)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'binary-search-tree-iterator';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 78)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'count-complete-tree-nodes';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 79)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'lowest-common-ancestor-of-a-binary-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 80)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'binary-tree-right-side-view';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 81)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'average-of-levels-in-binary-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 82)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'binary-tree-level-order-traversal';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 83)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'binary-tree-zigzag-level-order-traversal';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 84)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-absolute-difference-in-bst';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 85)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'kth-smallest-element-in-a-bst';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 86)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'validate-binary-search-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 87)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-islands';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 88)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'surrounded-regions';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 89)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'clone-graph';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 90)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'evaluate-division';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 91)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'course-schedule';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 92)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'course-schedule-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 93)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'snakes-and-ladders';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 94)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-genetic-mutation';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 95)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-ladder';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 96)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'implement-trie-prefix-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 97)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'design-add-and-search-words-data-structure';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 98)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-search-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 99)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'letter-combinations-of-a-phone-number';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 100)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'combinations';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 101)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'permutations';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 102)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'combination-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 103)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'n-queens-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 104)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'generate-parentheses';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 105)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-search';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 106)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'convert-sorted-array-to-binary-search-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 107)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'sort-list';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 108)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'construct-quad-tree';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 109)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'merge-k-sorted-lists';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 110)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'maximum-subarray';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 111)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'maximum-sum-circular-subarray';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 112)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'search-insert-position';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 113)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'search-a-2d-matrix';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 114)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-peak-element';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 115)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'search-in-rotated-sorted-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 116)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-first-and-last-position-of-element-in-sorted-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 117)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-minimum-in-rotated-sorted-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 118)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'median-of-two-sorted-arrays';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 119)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'kth-largest-element-in-an-array';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 120)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'ipo';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 121)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-k-pairs-with-smallest-sums';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 122)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'find-median-from-data-stream';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 123)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'add-binary';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 124)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'reverse-bits';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 125)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'number-of-1-bits';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 126)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'single-number';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 127)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'single-number-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 128)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'bitwise-and-of-numbers-range';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 129)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'palindrome-number';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 130)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'plus-one';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 131)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'factorial-trailing-zeroes';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 132)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'sqrtx';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 133)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'powx-n';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 134)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'max-points-on-a-line';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 135)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'climbing-stairs';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 136)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'house-robber';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 137)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'word-break';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 138)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'coin-change';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 139)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-increasing-subsequence';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 140)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'triangle';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 141)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'minimum-path-sum';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 142)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'unique-paths-ii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 143)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'longest-palindromic-substring';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 144)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'interleaving-string';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 145)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'edit-distance';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 146)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock-iii';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 147)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'best-time-to-buy-and-sell-stock-iv';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 148)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
  SELECT id INTO v_question_id FROM questions WHERE slug = 'maximal-square';
  IF v_question_id IS NOT NULL THEN
    INSERT INTO path_questions (path_id, question_id, order_index)
    VALUES (v_path_id, v_question_id, 149)
    ON CONFLICT (path_id, order_index) DO NOTHING;
  END IF;
  
END $$;

-- Verify
SELECT 
  lp.title,
  lp.difficulty,
  lp.estimated_hours,
  COUNT(pq.id) as total_questions
FROM learning_paths lp
LEFT JOIN path_questions pq ON pq.path_id = lp.id
WHERE lp.title = 'Top Interview 150'
GROUP BY lp.id, lp.title, lp.difficulty, lp.estimated_hours;
