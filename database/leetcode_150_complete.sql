-- LeetCode 150 Questions - Complete Dataset
-- Generated script with all questions organized by category

-- Clear existing data
DELETE FROM question_tags;
DELETE FROM questions;

-- Array / String (24 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('88', 'Merge Sorted Array', 'merge-sorted-array', 'Easy', 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.', 'https://leetcode.com/problems/merge-sorted-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('27', 'Remove Element', 'remove-element', 'Easy', 'Given an integer array nums and an integer val, remove all occurrences of val in nums in-place.', 'https://leetcode.com/problems/remove-element/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('26', 'Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Easy', 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('80', 'Remove Duplicates from Sorted Array II', 'remove-duplicates-from-sorted-array-ii', 'Medium', 'Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('169', 'Majority Element', 'majority-element', 'Easy', 'Given an array nums of size n, return the majority element.', 'https://leetcode.com/problems/majority-element/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('189', 'Rotate Array', 'rotate-array', 'Medium', 'Given an array, rotate the array to the right by k steps, where k is non-negative.', 'https://leetcode.com/problems/rotate-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('121', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', 'You are given an array prices where prices[i] is the price of a given stock on the ith day.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('122', 'Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii', 'Medium', 'You are given an integer array prices where prices[i] is the price of a given stock on the ith day.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('55', 'Jump Game', 'jump-game', 'Medium', 'You are given an integer array nums. You are initially positioned at the array''s first index.', 'https://leetcode.com/problems/jump-game/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('45', 'Jump Game II', 'jump-game-ii', 'Medium', 'Given an array of non-negative integers nums, you are initially positioned at the first index of the array.', 'https://leetcode.com/problems/jump-game-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('274', 'H-Index', 'h-index', 'Medium', 'Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper.', 'https://leetcode.com/problems/h-index/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('380', 'Insert Delete GetRandom O(1)', 'insert-delete-getrandom-o1', 'Medium', 'Implement the RandomizedSet class with insert, remove, and getRandom operations in average O(1) time.', 'https://leetcode.com/problems/insert-delete-getrandom-o1/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('238', 'Product of Array Except Self', 'product-of-array-except-self', 'Medium', 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', 'https://leetcode.com/problems/product-of-array-except-self/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('134', 'Gas Station', 'gas-station', 'Medium', 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].', 'https://leetcode.com/problems/gas-station/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('135', 'Candy', 'candy', 'Hard', 'There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.', 'https://leetcode.com/problems/candy/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('42', 'Trapping Rain Water', 'trapping-rain-water', 'Hard', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'https://leetcode.com/problems/trapping-rain-water/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('13', 'Roman to Integer', 'roman-to-integer', 'Easy', 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.', 'https://leetcode.com/problems/roman-to-integer/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('12', 'Integer to Roman', 'integer-to-roman', 'Medium', 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.', 'https://leetcode.com/problems/integer-to-roman/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('58', 'Length of Last Word', 'length-of-last-word', 'Easy', 'Given a string s consisting of words and spaces, return the length of the last word in the string.', 'https://leetcode.com/problems/length-of-last-word/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('14', 'Longest Common Prefix', 'longest-common-prefix', 'Easy', 'Write a function to find the longest common prefix string amongst an array of strings.', 'https://leetcode.com/problems/longest-common-prefix/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('151', 'Reverse Words in a String', 'reverse-words-in-a-string', 'Medium', 'Given an input string s, reverse the order of the words.', 'https://leetcode.com/problems/reverse-words-in-a-string/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('6', 'Zigzag Conversion', 'zigzag-conversion', 'Medium', 'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows.', 'https://leetcode.com/problems/zigzag-conversion/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('28', 'Find the Index of the First Occurrence in a String', 'find-the-index-of-the-first-occurrence-in-a-string', 'Medium', 'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack.', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('68', 'Text Justification', 'text-justification', 'Hard', 'Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters.', 'https://leetcode.com/problems/text-justification/', FALSE);

-- Two Pointers (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('125', 'Valid Palindrome', 'valid-palindrome', 'Easy', 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.', 'https://leetcode.com/problems/valid-palindrome/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('392', 'Is Subsequence', 'is-subsequence', 'Easy', 'Given two strings s and t, return true if s is a subsequence of t, or false otherwise.', 'https://leetcode.com/problems/is-subsequence/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('167', 'Two Sum II - Input Array Is Sorted', 'two-sum-ii---input-array-is-sorted', 'Medium', 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.', 'https://leetcode.com/problems/two-sum-ii---input-array-is-sorted/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('11', 'Container With Most Water', 'container-with-most-water', 'Medium', 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).', 'https://leetcode.com/problems/container-with-most-water/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('15', '3Sum', '3sum', 'Medium', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', 'https://leetcode.com/problems/3sum/', FALSE);

-- Sliding Window (4 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('209', 'Minimum Size Subarray Sum', 'minimum-size-subarray-sum', 'Medium', 'Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray.', 'https://leetcode.com/problems/minimum-size-subarray-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('3', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'Given a string s, find the length of the longest substring without repeating characters.', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('30', 'Substring with Concatenation of All Words', 'substring-with-concatenation-of-all-words', 'Hard', 'You are given a string s and an array of strings words of the same length.', 'https://leetcode.com/problems/substring-with-concatenation-of-all-words/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('76', 'Minimum Window Substring', 'minimum-window-substring', 'Hard', 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s.', 'https://leetcode.com/problems/minimum-window-substring/', FALSE);

-- Matrix (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('36', 'Valid Sudoku', 'valid-sudoku', 'Medium', 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated.', 'https://leetcode.com/problems/valid-sudoku/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('54', 'Spiral Matrix', 'spiral-matrix', 'Medium', 'Given an m x n matrix, return all elements of the matrix in spiral order.', 'https://leetcode.com/problems/spiral-matrix/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('48', 'Rotate Image', 'rotate-image', 'Medium', 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).', 'https://leetcode.com/problems/rotate-image/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('73', 'Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium', 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s.', 'https://leetcode.com/problems/set-matrix-zeroes/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('289', 'Game of Life', 'game-of-life', 'Medium', 'According to Wikipedia''s article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."', 'https://leetcode.com/problems/game-of-life/', FALSE);

-- Hashmap (9 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('383', 'Ransom Note', 'ransom-note', 'Easy', 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine.', 'https://leetcode.com/problems/ransom-note/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('205', 'Isomorphic Strings', 'isomorphic-strings', 'Easy', 'Given two strings s and t, determine if they are isomorphic.', 'https://leetcode.com/problems/isomorphic-strings/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('290', 'Word Pattern', 'word-pattern', 'Easy', 'Given a pattern and a string s, find if s follows the same pattern.', 'https://leetcode.com/problems/word-pattern/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('242', 'Valid Anagram', 'valid-anagram', 'Easy', 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', 'https://leetcode.com/problems/valid-anagram/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('49', 'Group Anagrams', 'group-anagrams', 'Medium', 'Given an array of strings strs, group the anagrams together.', 'https://leetcode.com/problems/group-anagrams/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('1', 'Two Sum', 'two-sum', 'Easy', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'https://leetcode.com/problems/two-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('202', 'Happy Number', 'happy-number', 'Easy', 'Write an algorithm to determine if a number n is happy.', 'https://leetcode.com/problems/happy-number/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('219', 'Contains Duplicate II', 'contains-duplicate-ii', 'Easy', 'Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.', 'https://leetcode.com/problems/contains-duplicate-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('128', 'Longest Consecutive Sequence', 'longest-consecutive-sequence', 'Hard', 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.', 'https://leetcode.com/problems/longest-consecutive-sequence/', FALSE);

-- Intervals (4 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('228', 'Summary Ranges', 'summary-ranges', 'Easy', 'You are given a sorted unique integer array nums.', 'https://leetcode.com/problems/summary-ranges/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('56', 'Merge Intervals', 'merge-intervals', 'Medium', 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.', 'https://leetcode.com/problems/merge-intervals/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('57', 'Insert Interval', 'insert-interval', 'Medium', 'You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi].', 'https://leetcode.com/problems/insert-interval/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('452', 'Minimum Number of Arrows to Burst Balloons', 'minimum-number-of-arrows-to-burst-balloons', 'Medium', 'There are some spherical balloons taped onto a flat wall that represents the XY-plane.', 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', FALSE);

-- Stack (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('20', 'Valid Parentheses', 'valid-parentheses', 'Easy', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.', 'https://leetcode.com/problems/valid-parentheses/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('71', 'Simplify Path', 'simplify-path', 'Medium', 'Given a string path, which is an absolute path (starting with a slash ''/'') to a file or directory in a Unix-style file system.', 'https://leetcode.com/problems/simplify-path/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('155', 'Min Stack', 'min-stack', 'Medium', 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', 'https://leetcode.com/problems/min-stack/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('150', 'Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'Medium', 'Evaluate the value of an arithmetic expression in Reverse Polish Notation.', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('224', 'Basic Calculator', 'basic-calculator', 'Hard', 'Given a string s representing a valid expression, implement a basic calculator to evaluate it.', 'https://leetcode.com/problems/basic-calculator/', FALSE);

-- Linked List (11 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('141', 'Linked List Cycle', 'linked-list-cycle', 'Easy', 'Given head, the head of a linked list, determine if the linked list has a cycle in it.', 'https://leetcode.com/problems/linked-list-cycle/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('2', 'Add Two Numbers', 'add-two-numbers', 'Medium', 'You are given two non-empty linked lists representing two non-negative integers.', 'https://leetcode.com/problems/add-two-numbers/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('21', 'Merge Two Sorted Lists', 'merge-two-sorted-lists', 'Easy', 'You are given the heads of two sorted linked lists list1 and list2.', 'https://leetcode.com/problems/merge-two-sorted-lists/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('138', 'Copy List with Random Pointer', 'copy-list-with-random-pointer', 'Medium', 'A linked list of length n is given such that each node contains an additional random pointer.', 'https://leetcode.com/problems/copy-list-with-random-pointer/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('92', 'Reverse Linked List II', 'reverse-linked-list-ii', 'Medium', 'Given the head of a singly linked list and two integers left and right where left <= right.', 'https://leetcode.com/problems/reverse-linked-list-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('25', 'Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'Hard', 'Given the head of a linked list, reverse the nodes of the list k at a time.', 'https://leetcode.com/problems/reverse-nodes-in-k-group/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('19', 'Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'Medium', 'Given the head of a linked list, remove the nth node from the end of the list.', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('82', 'Remove Duplicates from Sorted List II', 'remove-duplicates-from-sorted-list-ii', 'Medium', 'Given the head of a sorted linked list, delete all nodes that have duplicate numbers.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('61', 'Rotate List', 'rotate-list', 'Medium', 'Given the head of a linked list, rotate the list to the right by k places.', 'https://leetcode.com/problems/rotate-list/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('86', 'Partition List', 'partition-list', 'Medium', 'Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.', 'https://leetcode.com/problems/partition-list/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('146', 'LRU Cache', 'lru-cache', 'Medium', 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.', 'https://leetcode.com/problems/lru-cache/', FALSE);

-- Binary Tree General (14 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('104', 'Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'Easy', 'Given the root of a binary tree, return its maximum depth.', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('100', 'Same Tree', 'same-tree', 'Easy', 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.', 'https://leetcode.com/problems/same-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('226', 'Invert Binary Tree', 'invert-binary-tree', 'Easy', 'Given the root of a binary tree, invert the tree, and return its root.', 'https://leetcode.com/problems/invert-binary-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('101', 'Symmetric Tree', 'symmetric-tree', 'Easy', 'Given the root of a binary tree, check whether it is a mirror of itself.', 'https://leetcode.com/problems/symmetric-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('105', 'Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Medium', 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree.', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('106', 'Construct Binary Tree from Inorder and Postorder Traversal', 'construct-binary-tree-from-inorder-and-postorder-traversal', 'Medium', 'Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree.', 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('117', 'Populating Next Right Pointers in Each Node II', 'populating-next-right-pointers-in-each-node-ii', 'Medium', 'Given a binary tree, populate each next pointer to point to its next right node.', 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('114', 'Flatten Binary Tree to Linked List', 'flatten-binary-tree-to-linked-list', 'Medium', 'Given the root of a binary tree, flatten the tree into a "linked list".', 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('112', 'Path Sum', 'path-sum', 'Easy', 'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.', 'https://leetcode.com/problems/path-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('129', 'Sum Root to Leaf Numbers', 'sum-root-to-leaf-numbers', 'Medium', 'You are given the root of a binary tree containing digits from 0 to 9 only.', 'https://leetcode.com/problems/sum-root-to-leaf-numbers/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('124', 'Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Hard', 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('173', 'Binary Search Tree Iterator', 'binary-search-tree-iterator', 'Medium', 'Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST).', 'https://leetcode.com/problems/binary-search-tree-iterator/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('222', 'Count Complete Tree Nodes', 'count-complete-tree-nodes', 'Medium', 'Given the root of a complete binary tree, return the number of the nodes in the tree.', 'https://leetcode.com/problems/count-complete-tree-nodes/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('236', 'Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium', 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', FALSE);

-- Binary Tree BFS (7 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('199', 'Binary Tree Right Side View', 'binary-tree-right-side-view', 'Medium', 'Given the root of a binary tree, imagine yourself standing on the right side of it.', 'https://leetcode.com/problems/binary-tree-right-side-view/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('637', 'Average of Levels in Binary Tree', 'average-of-levels-in-binary-tree', 'Easy', 'Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.', 'https://leetcode.com/problems/average-of-levels-in-binary-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('102', 'Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Medium', 'Given the root of a binary tree, return the level order traversal of its nodes'' values.', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('103', 'Binary Tree Zigzag Level Order Traversal', 'binary-tree-zigzag-level-order-traversal', 'Medium', 'Given the root of a binary tree, return the zigzag level order traversal of its nodes'' values.', 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('530', 'Minimum Absolute Difference in BST', 'minimum-absolute-difference-in-bst', 'Easy', 'Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.', 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('230', 'Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'Medium', 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('98', 'Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium', 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).', 'https://leetcode.com/problems/validate-binary-search-tree/', FALSE);

-- Graph General (6 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('200', 'Number of Islands', 'number-of-islands', 'Medium', 'Given an m x n 2D binary grid grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.', 'https://leetcode.com/problems/number-of-islands/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('130', 'Surrounded Regions', 'surrounded-regions', 'Medium', 'Given an m x n matrix board containing ''X'' and ''O'', capture all regions that are 4-directionally surrounded by ''X''.', 'https://leetcode.com/problems/surrounded-regions/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('133', 'Clone Graph', 'clone-graph', 'Medium', 'Given a reference of a node in a connected undirected graph.', 'https://leetcode.com/problems/clone-graph/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('399', 'Evaluate Division', 'evaluate-division', 'Medium', 'You are given an array of variable pairs equations and an array of real numbers values.', 'https://leetcode.com/problems/evaluate-division/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('207', 'Course Schedule', 'course-schedule', 'Medium', 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.', 'https://leetcode.com/problems/course-schedule/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('210', 'Course Schedule II', 'course-schedule-ii', 'Medium', 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.', 'https://leetcode.com/problems/course-schedule-ii/', FALSE);

-- Graph BFS (2 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('909', 'Snakes and Ladders', 'snakes-and-ladders', 'Medium', 'You are given an n x n integer matrix board where the cells are labeled from 1 to n2 in a Boustrophedon style.', 'https://leetcode.com/problems/snakes-and-ladders/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('433', 'Minimum Genetic Mutation', 'minimum-genetic-mutation', 'Medium', 'A gene string can be represented by an 8-character long string, with choices from ''A'', ''C'', ''G'', and ''T''.', 'https://leetcode.com/problems/minimum-genetic-mutation/', FALSE);

-- Trie (3 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('208', 'Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree', 'Medium', 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.', 'https://leetcode.com/problems/implement-trie-prefix-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('211', 'Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'Medium', 'Design a data structure that supports adding new words and finding if a string matches any previously added string.', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('212', 'Word Search II', 'word-search-ii', 'Hard', 'Given an m x n board of characters and a list of strings words, return all words on the board.', 'https://leetcode.com/problems/word-search-ii/', FALSE);

-- Backtracking (7 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('17', 'Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'Medium', 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('77', 'Combinations', 'combinations', 'Medium', 'Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].', 'https://leetcode.com/problems/combinations/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('46', 'Permutations', 'permutations', 'Medium', 'Given an array nums of distinct integers, return all the possible permutations.', 'https://leetcode.com/problems/permutations/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('39', 'Combination Sum', 'combination-sum', 'Medium', 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.', 'https://leetcode.com/problems/combination-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('52', 'N-Queens II', 'n-queens-ii', 'Hard', 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.', 'https://leetcode.com/problems/n-queens-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('22', 'Generate Parentheses', 'generate-parentheses', 'Medium', 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.', 'https://leetcode.com/problems/generate-parentheses/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('79', 'Word Search', 'word-search', 'Medium', 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.', 'https://leetcode.com/problems/word-search/', FALSE);

-- Divide & Conquer (4 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('108', 'Convert Sorted Array to Binary Search Tree', 'convert-sorted-array-to-binary-search-tree', 'Easy', 'Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.', 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('148', 'Sort List', 'sort-list', 'Medium', 'Given the head of a linked list, return the list after sorting it in ascending order.', 'https://leetcode.com/problems/sort-list/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('427', 'Construct Quad Tree', 'construct-quad-tree', 'Medium', 'Given a n * n matrix grid of 0''s and 1''s only, we want to represent the grid with a Quad Tree.', 'https://leetcode.com/problems/construct-quad-tree/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('23', 'Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard', 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', 'https://leetcode.com/problems/merge-k-sorted-lists/', FALSE);

-- Kadane's Algorithm (2 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('53', 'Maximum Subarray', 'maximum-subarray', 'Medium', 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.', 'https://leetcode.com/problems/maximum-subarray/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('918', 'Maximum Sum Circular Subarray', 'maximum-sum-circular-subarray', 'Medium', 'Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums.', 'https://leetcode.com/problems/maximum-sum-circular-subarray/', FALSE);

-- Binary Search (7 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('35', 'Search Insert Position', 'search-insert-position', 'Easy', 'Given a sorted array of distinct integers and a target value, return the index if the target is found.', 'https://leetcode.com/problems/search-insert-position/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('74', 'Search a 2D Matrix', 'search-a-2d-matrix', 'Medium', 'Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix.', 'https://leetcode.com/problems/search-a-2d-matrix/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('162', 'Find Peak Element', 'find-peak-element', 'Medium', 'A peak element is an element that is strictly greater than its neighbors.', 'https://leetcode.com/problems/find-peak-element/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('33', 'Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium', 'There is an integer array nums sorted in ascending order (with distinct values).', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('34', 'Find First and Last Position of Element in Sorted Array', 'find-first-and-last-position-of-element-in-sorted-array', 'Medium', 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.', 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('153', 'Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'Medium', 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times.', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('4', 'Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', FALSE);

-- Heap (4 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('215', 'Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium', 'Given an integer array nums and an integer k, return the kth largest element in the array.', 'https://leetcode.com/problems/kth-largest-element-in-an-array/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('502', 'IPO', 'ipo', 'Hard', 'Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO.', 'https://leetcode.com/problems/ipo/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('373', 'Find K Pairs with Smallest Sums', 'find-k-pairs-with-smallest-sums', 'Medium', 'You are given two integer arrays nums1 and nums2 sorted in ascending order and an integer k.', 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('295', 'Find Median from Data Stream', 'find-median-from-data-stream', 'Hard', 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.', 'https://leetcode.com/problems/find-median-from-data-stream/', FALSE);

-- Bit Manipulation (6 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('67', 'Add Binary', 'add-binary', 'Easy', 'Given two binary strings a and b, return their sum as a binary string.', 'https://leetcode.com/problems/add-binary/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('190', 'Reverse Bits', 'reverse-bits', 'Easy', 'Reverse bits of a given 32 bits unsigned integer.', 'https://leetcode.com/problems/reverse-bits/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('191', 'Number of 1 Bits', 'number-of-1-bits', 'Easy', 'Write a function that takes an unsigned integer and returns the number of ''1'' bits it has (also known as the Hamming weight).', 'https://leetcode.com/problems/number-of-1-bits/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('136', 'Single Number', 'single-number', 'Easy', 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.', 'https://leetcode.com/problems/single-number/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('137', 'Single Number II', 'single-number-ii', 'Medium', 'Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it.', 'https://leetcode.com/problems/single-number-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('201', 'Bitwise AND of Numbers Range', 'bitwise-and-of-numbers-range', 'Medium', 'Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.', 'https://leetcode.com/problems/bitwise-and-of-numbers-range/', FALSE);

-- Math (6 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('9', 'Palindrome Number', 'palindrome-number', 'Easy', 'Given an integer x, return true if x is palindrome integer.', 'https://leetcode.com/problems/palindrome-number/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('66', 'Plus One', 'plus-one', 'Easy', 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer.', 'https://leetcode.com/problems/plus-one/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('172', 'Factorial Trailing Zeroes', 'factorial-trailing-zeroes', 'Medium', 'Given an integer n, return the number of trailing zeroes in n!.', 'https://leetcode.com/problems/factorial-trailing-zeroes/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('69', 'Sqrt(x)', 'sqrtx', 'Easy', 'Given a non-negative integer x, compute and return the square root of x.', 'https://leetcode.com/problems/sqrtx/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('50', 'Pow(x, n)', 'powx-n', 'Medium', 'Implement pow(x, n), which calculates x raised to the power n (i.e., xn).', 'https://leetcode.com/problems/powx-n/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('149', 'Max Points on a Line', 'max-points-on-a-line', 'Hard', 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.', 'https://leetcode.com/problems/max-points-on-a-line/', FALSE);

-- 1D Dynamic Programming (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('70', 'Climbing Stairs', 'climbing-stairs', 'Easy', 'You are climbing a staircase. It takes n steps to reach the top.', 'https://leetcode.com/problems/climbing-stairs/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('198', 'House Robber', 'house-robber', 'Medium', 'You are a professional robber planning to rob houses along a street.', 'https://leetcode.com/problems/house-robber/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('139', 'Word Break', 'word-break', 'Medium', 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.', 'https://leetcode.com/problems/word-break/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('322', 'Coin Change', 'coin-change', 'Medium', 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.', 'https://leetcode.com/problems/coin-change/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('300', 'Longest Increasing Subsequence', 'longest-increasing-subsequence', 'Medium', 'Given an integer array nums, return the length of the longest strictly increasing subsequence.', 'https://leetcode.com/problems/longest-increasing-subsequence/', FALSE);

-- Multidimensional DP (10 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('120', 'Triangle', 'triangle', 'Medium', 'Given a triangle array, return the minimum path sum from top to bottom.', 'https://leetcode.com/problems/triangle/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('64', 'Minimum Path Sum', 'minimum-path-sum', 'Medium', 'Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.', 'https://leetcode.com/problems/minimum-path-sum/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('63', 'Unique Paths II', 'unique-paths-ii', 'Medium', 'You are given an m x n integer array grid. There is a robot initially located at the top-left corner (i.e., grid[0][0]).', 'https://leetcode.com/problems/unique-paths-ii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('5', 'Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium', 'Given a string s, return the longest palindromic substring in s.', 'https://leetcode.com/problems/longest-palindromic-substring/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('97', 'Interleaving String', 'interleaving-string', 'Medium', 'Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.', 'https://leetcode.com/problems/interleaving-string/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('72', 'Edit Distance', 'edit-distance', 'Hard', 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', 'https://leetcode.com/problems/edit-distance/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('123', 'Best Time to Buy and Sell Stock III', 'best-time-to-buy-and-sell-stock-iii', 'Hard', 'You are given an array prices where prices[i] is the price of a given stock on the ith day.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('188', 'Best Time to Buy and Sell Stock IV', 'best-time-to-buy-and-sell-stock-iv', 'Hard', 'You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('221', 'Maximal Square', 'maximal-square', 'Medium', 'Given an m x n binary matrix filled with 0''s and 1''s, find the largest square containing only 1''s and return its area.', 'https://leetcode.com/problems/maximal-square/', FALSE);
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('115', 'Distinct Subsequences', 'distinct-subsequences', 'Hard', 'Given two strings s and t, return the number of distinct subsequences of s which equals t.', 'https://leetcode.com/problems/distinct-subsequences/', FALSE);

-- Insert tags for questions
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'merge-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'merge-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'remove-element';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'remove-element';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'remove-duplicates-from-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'remove-duplicates-from-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'remove-duplicates-from-sorted-array-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'remove-duplicates-from-sorted-array-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'majority-element';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'majority-element';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'rotate-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'rotate-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'jump-game';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'jump-game';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'jump-game-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'jump-game-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'h-index';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'h-index';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'insert-delete-getrandom-o1';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'insert-delete-getrandom-o1';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'product-of-array-except-self';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'product-of-array-except-self';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'gas-station';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'gas-station';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'candy';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'candy';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'trapping-rain-water';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'trapping-rain-water';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'roman-to-integer';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'roman-to-integer';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'integer-to-roman';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'integer-to-roman';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'length-of-last-word';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'length-of-last-word';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'longest-common-prefix';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'longest-common-prefix';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'reverse-words-in-a-string';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'reverse-words-in-a-string';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'zigzag-conversion';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'zigzag-conversion';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'find-the-index-of-the-first-occurrence-in-a-string';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'find-the-index-of-the-first-occurrence-in-a-string';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'text-justification';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'String' FROM questions q WHERE q.slug = 'text-justification';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Two Pointers' FROM questions q WHERE q.slug = 'valid-palindrome';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Two Pointers' FROM questions q WHERE q.slug = 'is-subsequence';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Two Pointers' FROM questions q WHERE q.slug = 'two-sum-ii---input-array-is-sorted';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Two Pointers' FROM questions q WHERE q.slug = 'container-with-most-water';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Two Pointers' FROM questions q WHERE q.slug = '3sum';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Sliding Window' FROM questions q WHERE q.slug = 'minimum-size-subarray-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Sliding Window' FROM questions q WHERE q.slug = 'longest-substring-without-repeating-characters';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Sliding Window' FROM questions q WHERE q.slug = 'substring-with-concatenation-of-all-words';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Sliding Window' FROM questions q WHERE q.slug = 'minimum-window-substring';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Matrix' FROM questions q WHERE q.slug = 'valid-sudoku';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Matrix' FROM questions q WHERE q.slug = 'spiral-matrix';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Matrix' FROM questions q WHERE q.slug = 'rotate-image';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Matrix' FROM questions q WHERE q.slug = 'set-matrix-zeroes';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Matrix' FROM questions q WHERE q.slug = 'game-of-life';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'ransom-note';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'isomorphic-strings';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'word-pattern';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'valid-anagram';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'group-anagrams';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'two-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'happy-number';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'contains-duplicate-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Hash Table' FROM questions q WHERE q.slug = 'longest-consecutive-sequence';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Intervals' FROM questions q WHERE q.slug = 'summary-ranges';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Intervals' FROM questions q WHERE q.slug = 'merge-intervals';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Intervals' FROM questions q WHERE q.slug = 'insert-interval';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Intervals' FROM questions q WHERE q.slug = 'minimum-number-of-arrows-to-burst-balloons';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'valid-parentheses';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'simplify-path';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'min-stack';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'evaluate-reverse-polish-notation';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Stack' FROM questions q WHERE q.slug = 'basic-calculator';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'linked-list-cycle';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'add-two-numbers';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'merge-two-sorted-lists';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'copy-list-with-random-pointer';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'reverse-linked-list-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'reverse-nodes-in-k-group';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'remove-nth-node-from-end-of-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'remove-duplicates-from-sorted-list-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'rotate-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'partition-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Linked List' FROM questions q WHERE q.slug = 'lru-cache';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'maximum-depth-of-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'maximum-depth-of-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'same-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'same-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'invert-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'invert-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'symmetric-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'symmetric-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'construct-binary-tree-from-preorder-and-inorder-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'construct-binary-tree-from-preorder-and-inorder-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'construct-binary-tree-from-inorder-and-postorder-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'construct-binary-tree-from-inorder-and-postorder-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'populating-next-right-pointers-in-each-node-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'populating-next-right-pointers-in-each-node-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'flatten-binary-tree-to-linked-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'flatten-binary-tree-to-linked-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'path-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'path-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'sum-root-to-leaf-numbers';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'sum-root-to-leaf-numbers';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'binary-tree-maximum-path-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'binary-tree-maximum-path-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'binary-search-tree-iterator';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'binary-search-tree-iterator';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'count-complete-tree-nodes';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'count-complete-tree-nodes';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'lowest-common-ancestor-of-a-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'lowest-common-ancestor-of-a-binary-tree';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'binary-tree-right-side-view';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'binary-tree-right-side-view';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'binary-tree-right-side-view';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'average-of-levels-in-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'average-of-levels-in-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'average-of-levels-in-binary-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'binary-tree-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'binary-tree-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'binary-tree-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'binary-tree-zigzag-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'binary-tree-zigzag-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'binary-tree-zigzag-level-order-traversal';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'minimum-absolute-difference-in-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'minimum-absolute-difference-in-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'minimum-absolute-difference-in-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'kth-smallest-element-in-a-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'kth-smallest-element-in-a-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'kth-smallest-element-in-a-bst';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Tree' FROM questions q WHERE q.slug = 'validate-binary-search-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Tree' FROM questions q WHERE q.slug = 'validate-binary-search-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'validate-binary-search-tree';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'number-of-islands';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'surrounded-regions';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'clone-graph';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'evaluate-division';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'course-schedule';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'course-schedule-ii';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'snakes-and-ladders';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'snakes-and-ladders';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Graph' FROM questions q WHERE q.slug = 'minimum-genetic-mutation';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'BFS' FROM questions q WHERE q.slug = 'minimum-genetic-mutation';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Trie' FROM questions q WHERE q.slug = 'implement-trie-prefix-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Trie' FROM questions q WHERE q.slug = 'design-add-and-search-words-data-structure';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Trie' FROM questions q WHERE q.slug = 'word-search-ii';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'letter-combinations-of-a-phone-number';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'combinations';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'permutations';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'combination-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'n-queens-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'generate-parentheses';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Backtracking' FROM questions q WHERE q.slug = 'word-search';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Divide and Conquer' FROM questions q WHERE q.slug = 'convert-sorted-array-to-binary-search-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Divide and Conquer' FROM questions q WHERE q.slug = 'sort-list';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Divide and Conquer' FROM questions q WHERE q.slug = 'construct-quad-tree';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Divide and Conquer' FROM questions q WHERE q.slug = 'merge-k-sorted-lists';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'maximum-subarray';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'maximum-subarray';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'maximum-sum-circular-subarray';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Array' FROM questions q WHERE q.slug = 'maximum-sum-circular-subarray';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'search-insert-position';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'search-a-2d-matrix';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'find-peak-element';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'search-in-rotated-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'find-first-and-last-position-of-element-in-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'find-minimum-in-rotated-sorted-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Binary Search' FROM questions q WHERE q.slug = 'median-of-two-sorted-arrays';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Heap' FROM questions q WHERE q.slug = 'kth-largest-element-in-an-array';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Heap' FROM questions q WHERE q.slug = 'ipo';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Heap' FROM questions q WHERE q.slug = 'find-k-pairs-with-smallest-sums';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Heap' FROM questions q WHERE q.slug = 'find-median-from-data-stream';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'add-binary';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'reverse-bits';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'number-of-1-bits';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'single-number';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'single-number-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Bit Manipulation' FROM questions q WHERE q.slug = 'bitwise-and-of-numbers-range';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'palindrome-number';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'plus-one';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'factorial-trailing-zeroes';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'sqrtx';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'powx-n';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Math' FROM questions q WHERE q.slug = 'max-points-on-a-line';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'climbing-stairs';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'house-robber';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'word-break';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'coin-change';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'longest-increasing-subsequence';

INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'triangle';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'minimum-path-sum';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'unique-paths-ii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'longest-palindromic-substring';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'interleaving-string';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'edit-distance';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock-iii';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'best-time-to-buy-and-sell-stock-iv';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'maximal-square';
INSERT INTO question_tags (question_id, tag)
SELECT q.id, 'Dynamic Programming' FROM questions q WHERE q.slug = 'distinct-subsequences';

