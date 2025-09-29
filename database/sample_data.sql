-- Sample data for LeetTrack questions
-- Run this after schema.sql to populate initial questions

-- Insert the 5 sample questions
INSERT INTO questions (id, leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
(
    uuid_generate_v4(),
    '1',
    'Two Sum',
    'two-sum',
    'Easy',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    'https://leetcode.com/problems/two-sum/',
    FALSE
),
(
    uuid_generate_v4(),
    '2',
    'Add Two Numbers',
    'add-two-numbers',
    'Medium',
    'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    'https://leetcode.com/problems/add-two-numbers/',
    FALSE
),
(
    uuid_generate_v4(),
    '3',
    'Longest Substring Without Repeating Characters',
    'longest-substring-without-repeating-characters',
    'Medium',
    'Given a string s, find the length of the longest substring without repeating characters.',
    'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    FALSE
),
(
    uuid_generate_v4(),
    '4',
    'Median of Two Sorted Arrays',
    'median-of-two-sorted-arrays',
    'Hard',
    'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    FALSE
),
(
    uuid_generate_v4(),
    '20',
    'Valid Parentheses',
    'valid-parentheses',
    'Easy',
    'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    'https://leetcode.com/problems/valid-parentheses/',
    FALSE
);

-- Insert tags for the questions
-- Two Sum tags
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'two-sum'
UNION ALL
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'two-sum';

-- Add Two Numbers tags
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'add-two-numbers'
UNION ALL
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'add-two-numbers'
UNION ALL
SELECT q.id, 'Recursion' FROM questions q WHERE q.slug = 'add-two-numbers';

-- Longest Substring tags
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'longest-substring-without-repeating-characters'
UNION ALL
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'longest-substring-without-repeating-characters'
UNION ALL
SELECT q.id, 'Sliding Window' FROM questions q WHERE q.slug = 'longest-substring-without-repeating-characters';

-- Median of Two Sorted Arrays tags
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'median-of-two-sorted-arrays'
UNION ALL
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'median-of-two-sorted-arrays'
UNION ALL
SELECT q.id, 'Divide and Conquer' FROM questions q WHERE q.slug = 'median-of-two-sorted-arrays';

-- Valid Parentheses tags
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'valid-parentheses'
UNION ALL
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'valid-parentheses';
