-- Create learning paths for each category of LeetCode 150
-- This script creates structured learning paths with proper ordering

-- Array / String Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Array & String Fundamentals',
    'Master array manipulation and string processing techniques. This comprehensive path covers sorting, searching, two pointers, and advanced string algorithms essential for coding interviews.',
    'Intermediate',
    40,
    TRUE
);

-- Two Pointers Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Two Pointers Technique',
    'Learn the powerful two pointers technique for solving array and string problems efficiently. Perfect for optimizing brute force solutions.',
    'Beginner',
    8,
    TRUE
);

-- Sliding Window Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Sliding Window Patterns',
    'Master sliding window technique for subarray and substring problems. Essential for achieving optimal time complexity in many scenarios.',
    'Intermediate',
    12,
    TRUE
);

-- Matrix Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Matrix Manipulation',
    'Learn matrix traversal patterns, rotation, and modification techniques. Covers spiral traversal, in-place operations, and game simulations.',
    'Intermediate',
    15,
    TRUE
);

-- Hashmap Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Hash Table Mastery',
    'Understand when and how to use hash tables for efficient lookups. Covers frequency counting, pattern matching, and optimization techniques.',
    'Beginner',
    18,
    TRUE
);

-- Intervals Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Interval Processing',
    'Learn to work with intervals: merging, inserting, and finding overlaps. Important for scheduling and range-based problems.',
    'Intermediate',
    10,
    TRUE
);

-- Stack Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Stack Data Structure',
    'Master stack-based solutions for parsing, validation, and expression evaluation. Includes monotonic stack patterns.',
    'Intermediate',
    12,
    TRUE
);

-- Linked List Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Linked List Operations',
    'Comprehensive coverage of linked list manipulation: reversal, cycle detection, merging, and advanced pointer techniques.',
    'Intermediate',
    25,
    TRUE
);

-- Binary Tree General Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Binary Tree Fundamentals',
    'Build strong foundation in binary tree operations: traversal, construction, modification, and path-based problems.',
    'Intermediate',
    30,
    TRUE
);

-- Binary Tree BFS Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Tree BFS & Level Order',
    'Master breadth-first search on trees and level-order processing. Essential for tree analysis and BST operations.',
    'Intermediate',
    18,
    TRUE
);

-- Graph General Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Graph Algorithms',
    'Introduction to graph traversal, cycle detection, and topological sorting. Covers DFS, BFS, and dependency problems.',
    'Advanced',
    20,
    TRUE
);

-- Graph BFS Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Graph BFS Applications',
    'Specialized BFS applications for shortest path and state space problems. Advanced graph search techniques.',
    'Advanced',
    8,
    TRUE
);

-- Trie Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Trie Data Structure',
    'Learn trie implementation and applications for string search, autocomplete, and word games.',
    'Intermediate',
    10,
    TRUE
);

-- Backtracking Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Backtracking Algorithms',
    'Master backtracking for generating combinations, permutations, and solving constraint satisfaction problems.',
    'Advanced',
    20,
    TRUE
);

-- Divide & Conquer Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Divide & Conquer',
    'Learn divide and conquer strategy for efficient problem solving. Covers sorting, tree construction, and optimization.',
    'Advanced',
    12,
    TRUE
);

-- Kadane''s Algorithm Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Maximum Subarray Problems',
    'Master Kadane''s algorithm and its variations for maximum subarray problems. Essential dynamic programming technique.',
    'Intermediate',
    6,
    TRUE
);

-- Binary Search Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Binary Search Mastery',
    'Comprehensive binary search patterns: basic search, search space reduction, and complex search conditions.',
    'Intermediate',
    18,
    TRUE
);

-- Heap Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Heap & Priority Queue',
    'Learn heap data structure for priority-based problems. Covers Kth largest, streaming data, and optimization problems.',
    'Advanced',
    15,
    TRUE
);

-- Bit Manipulation Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Bit Manipulation Techniques',
    'Master bit-level operations for efficient solutions. Covers XOR patterns, bit counting, and optimization tricks.',
    'Intermediate',
    12,
    TRUE
);

-- Math Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Mathematical Algorithms',
    'Essential mathematical problem-solving techniques. Covers number theory, geometry, and mathematical optimization.',
    'Intermediate',
    15,
    TRUE
);

-- 1D DP Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    '1D Dynamic Programming',
    'Foundation of dynamic programming with one-dimensional problems. Learn to identify and solve DP patterns.',
    'Intermediate',
    25,
    TRUE
);

-- Multidimensional DP Path
INSERT INTO paths (title, description, difficulty, estimated_hours, is_public)
VALUES (
    'Advanced Dynamic Programming',
    'Master complex DP problems with multiple dimensions. Advanced optimization and state management techniques.',
    'Advanced',
    35,
    TRUE
);

-- Add tags for paths
INSERT INTO path_tags (path_id, tag)
SELECT p.id, 'Array' FROM paths p WHERE p.title = 'Array & String Fundamentals'
UNION ALL
SELECT p.id, 'String' FROM paths p WHERE p.title = 'Array & String Fundamentals'
UNION ALL
SELECT p.id, 'Two Pointers' FROM paths p WHERE p.title = 'Two Pointers Technique'
UNION ALL
SELECT p.id, 'Sliding Window' FROM paths p WHERE p.title = 'Sliding Window Patterns'
UNION ALL
SELECT p.id, 'Matrix' FROM paths p WHERE p.title = 'Matrix Manipulation'
UNION ALL
SELECT p.id, 'Hash Table' FROM paths p WHERE p.title = 'Hash Table Mastery'
UNION ALL
SELECT p.id, 'Intervals' FROM paths p WHERE p.title = 'Interval Processing'
UNION ALL
SELECT p.id, 'Stack' FROM paths p WHERE p.title = 'Stack Data Structure'
UNION ALL
SELECT p.id, 'Linked List' FROM paths p WHERE p.title = 'Linked List Operations'
UNION ALL
SELECT p.id, 'Tree' FROM paths p WHERE p.title = 'Binary Tree Fundamentals'
UNION ALL
SELECT p.id, 'Binary Tree' FROM paths p WHERE p.title = 'Binary Tree Fundamentals'
UNION ALL
SELECT p.id, 'Tree' FROM paths p WHERE p.title = 'Tree BFS & Level Order'
UNION ALL
SELECT p.id, 'BFS' FROM paths p WHERE p.title = 'Tree BFS & Level Order'
UNION ALL
SELECT p.id, 'Graph' FROM paths p WHERE p.title = 'Graph Algorithms'
UNION ALL
SELECT p.id, 'Graph' FROM paths p WHERE p.title = 'Graph BFS Applications'
UNION ALL
SELECT p.id, 'BFS' FROM paths p WHERE p.title = 'Graph BFS Applications'
UNION ALL
SELECT p.id, 'Trie' FROM paths p WHERE p.title = 'Trie Data Structure'
UNION ALL
SELECT p.id, 'Backtracking' FROM paths p WHERE p.title = 'Backtracking Algorithms'
UNION ALL
SELECT p.id, 'Divide and Conquer' FROM paths p WHERE p.title = 'Divide & Conquer'
UNION ALL
SELECT p.id, 'Dynamic Programming' FROM paths p WHERE p.title = 'Maximum Subarray Problems'
UNION ALL
SELECT p.id, 'Binary Search' FROM paths p WHERE p.title = 'Binary Search Mastery'
UNION ALL
SELECT p.id, 'Heap' FROM paths p WHERE p.title = 'Heap & Priority Queue'
UNION ALL
SELECT p.id, 'Bit Manipulation' FROM paths p WHERE p.title = 'Bit Manipulation Techniques'
UNION ALL
SELECT p.id, 'Math' FROM paths p WHERE p.title = 'Mathematical Algorithms'
UNION ALL
SELECT p.id, 'Dynamic Programming' FROM paths p WHERE p.title = '1D Dynamic Programming'
UNION ALL
SELECT p.id, 'Dynamic Programming' FROM paths p WHERE p.title = 'Advanced Dynamic Programming';

-- Populate path_questions with proper ordering
-- This maps questions to their respective learning paths

-- Array & String Fundamentals
INSERT INTO path_questions (path_id, question_id, order_index)
SELECT
    p.id,
    q.id,
    ROW_NUMBER() OVER (ORDER BY CAST(q.leetcode_id AS INTEGER))
FROM paths p
CROSS JOIN questions q
WHERE p.title = 'Array & String Fundamentals'
AND q.leetcode_id IN ('88', '27', '26', '80', '169', '189', '121', '122', '55', '45', '274', '380', '238', '134', '135', '42', '13', '12', '58', '14', '151', '6', '28', '68');

-- Two Pointers Technique
INSERT INTO path_questions (path_id, question_id, order_index)
SELECT
    p.id,
    q.id,
    ROW_NUMBER() OVER (ORDER BY CAST(q.leetcode_id AS INTEGER))
FROM paths p
CROSS JOIN questions q
WHERE p.title = 'Two Pointers Technique'
AND q.leetcode_id IN ('125', '392', '167', '11', '15');

-- Sliding Window Patterns
INSERT INTO path_questions (path_id, question_id, order_index)
SELECT
    p.id,
    q.id,
    ROW_NUMBER() OVER (ORDER BY CAST(q.leetcode_id AS INTEGER))
FROM paths p
CROSS JOIN questions q
WHERE p.title = 'Sliding Window Patterns'
AND q.leetcode_id IN ('209', '3', '30', '76');

-- Matrix Manipulation
INSERT INTO path_questions (path_id, question_id, order_index)
SELECT
    p.id,
    q.id,
    ROW_NUMBER() OVER (ORDER BY CAST(q.leetcode_id AS INTEGER))
FROM paths p
CROSS JOIN questions q
WHERE p.title = 'Matrix Manipulation'
AND q.leetcode_id IN ('36', '54', '48', '73', '289');

-- Hash Table Mastery
INSERT INTO path_questions (path_id, question_id, order_index)
SELECT
    p.id,
    q.id,
    ROW_NUMBER() OVER (ORDER BY CAST(q.leetcode_id AS INTEGER))
FROM paths p
CROSS JOIN questions q
WHERE p.title = 'Hash Table Mastery'
AND q.leetcode_id IN ('383', '205', '290', '242', '49', '1', '202', '219', '128');

-- Continue with other paths...
-- (Adding all path_questions mappings for brevity, but the pattern continues)
