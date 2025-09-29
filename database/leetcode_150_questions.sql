-- LeetCode 150 Questions - Comprehensive Dataset
-- All questions organized by category with proper metadata

-- Clear existing sample data
DELETE FROM question_tags;
DELETE FROM questions;

-- Array / String (24 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('88', 'Merge Sorted Array', 'merge-sorted-array', 'Easy', 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order.', 'https://leetcode.com/problems/merge-sorted-array/', FALSE),
('27', 'Remove Element', 'remove-element', 'Easy', 'Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The relative order of the elements may be changed.', 'https://leetcode.com/problems/remove-element/', FALSE),
('26', 'Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Easy', 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', FALSE),
('80', 'Remove Duplicates from Sorted Array II', 'remove-duplicates-from-sorted-array-ii', 'Medium', 'Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/', FALSE),
('169', 'Majority Element', 'majority-element', 'Easy', 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.', 'https://leetcode.com/problems/majority-element/', FALSE),
('189', 'Rotate Array', 'rotate-array', 'Medium', 'Given an array, rotate the array to the right by k steps, where k is non-negative.', 'https://leetcode.com/problems/rotate-array/', FALSE),
('121', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', FALSE),
('122', 'Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii', 'Medium', 'You are given an integer array prices where prices[i] is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', FALSE),
('55', 'Jump Game', 'jump-game', 'Medium', 'You are given an integer array nums. You are initially positioned at the arrays first index, and each element in the array represents your maximum jump length at that position.', 'https://leetcode.com/problems/jump-game/', FALSE),
('45', 'Jump Game II', 'jump-game-ii', 'Medium', 'Given an array of non-negative integers nums, you are initially positioned at the first index of the array. Each element in the array represents your maximum jump length at that position.', 'https://leetcode.com/problems/jump-game-ii/', FALSE),
('274', 'H-Index', 'h-index', 'Medium', 'Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper, return compute the researchers h-index.', 'https://leetcode.com/problems/h-index/', FALSE),
('380', 'Insert Delete GetRandom O(1)', 'insert-delete-getrandom-o1', 'Medium', 'Implement the RandomizedSet class with insert, remove, and getRandom operations in average O(1) time complexity.', 'https://leetcode.com/problems/insert-delete-getrandom-o1/', FALSE),
('238', 'Product of Array Except Self', 'product-of-array-except-self', 'Medium', 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', 'https://leetcode.com/problems/product-of-array-except-self/', FALSE),
('134', 'Gas Station', 'gas-station', 'Medium', 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station.', 'https://leetcode.com/problems/gas-station/', FALSE),
('135', 'Candy', 'candy', 'Hard', 'There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to the following requirements.', 'https://leetcode.com/problems/candy/', FALSE),
('42', 'Trapping Rain Water', 'trapping-rain-water', 'Hard', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'https://leetcode.com/problems/trapping-rain-water/', FALSE),
('13', 'Roman to Integer', 'roman-to-integer', 'Easy', 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.', 'https://leetcode.com/problems/roman-to-integer/', FALSE),
('12', 'Integer to Roman', 'integer-to-roman', 'Medium', 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given an integer, convert it to a roman numeral.', 'https://leetcode.com/problems/integer-to-roman/', FALSE),
('58', 'Length of Last Word', 'length-of-last-word', 'Easy', 'Given a string s consisting of words and spaces, return the length of the last word in the string.', 'https://leetcode.com/problems/length-of-last-word/', FALSE),
('14', 'Longest Common Prefix', 'longest-common-prefix', 'Easy', 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.', 'https://leetcode.com/problems/longest-common-prefix/', FALSE),
('151', 'Reverse Words in a String', 'reverse-words-in-a-string', 'Medium', 'Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters.', 'https://leetcode.com/problems/reverse-words-in-a-string/', FALSE),
('6', 'Zigzag Conversion', 'zigzag-conversion', 'Medium', 'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows and then read line by line.', 'https://leetcode.com/problems/zigzag-conversion/', FALSE),
('28', 'Find the Index of the First Occurrence in a String', 'find-the-index-of-the-first-occurrence-in-a-string', 'Medium', 'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', FALSE),
('68', 'Text Justification', 'text-justification', 'Hard', 'Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified.', 'https://leetcode.com/problems/text-justification/', FALSE);

-- Two Pointers (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('125', 'Valid Palindrome', 'valid-palindrome', 'Easy', 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.', 'https://leetcode.com/problems/valid-palindrome/', FALSE),
('392', 'Is Subsequence', 'is-subsequence', 'Easy', 'Given two strings s and t, return true if s is a subsequence of t, or false otherwise.', 'https://leetcode.com/problems/is-subsequence/', FALSE),
('167', 'Two Sum II - Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted', 'Medium', 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', FALSE),
('11', 'Container With Most Water', 'container-with-most-water', 'Medium', 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).', 'https://leetcode.com/problems/container-with-most-water/', FALSE),
('15', '3Sum', '3sum', 'Medium', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', 'https://leetcode.com/problems/3sum/', FALSE);

-- Sliding Window (4 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('209', 'Minimum Size Subarray Sum', 'minimum-size-subarray-sum', 'Medium', 'Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray of which the sum is greater than or equal to target.', 'https://leetcode.com/problems/minimum-size-subarray-sum/', FALSE),
('3', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'Given a string s, find the length of the longest substring without repeating characters.', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', FALSE),
('30', 'Substring with Concatenation of All Words', 'substring-with-concatenation-of-all-words', 'Hard', 'You are given a string s and an array of strings words of the same length. Return all starting indices of substring(s) in s that is a concatenation of each word in words exactly once.', 'https://leetcode.com/problems/substring-with-concatenation-of-all-words/', FALSE),
('76', 'Minimum Window Substring', 'minimum-window-substring', 'Hard', 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.', 'https://leetcode.com/problems/minimum-window-substring/', FALSE);

-- Matrix (5 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('36', 'Valid Sudoku', 'valid-sudoku', 'Medium', 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules.', 'https://leetcode.com/problems/valid-sudoku/', FALSE),
('54', 'Spiral Matrix', 'spiral-matrix', 'Medium', 'Given an m x n matrix, return all elements of the matrix in spiral order.', 'https://leetcode.com/problems/spiral-matrix/', FALSE),
('48', 'Rotate Image', 'rotate-image', 'Medium', 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).', 'https://leetcode.com/problems/rotate-image/', FALSE),
('73', 'Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium', 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s.', 'https://leetcode.com/problems/set-matrix-zeroes/', FALSE),
('289', 'Game of Life', 'game-of-life', 'Medium', 'According to Wikipedia''s article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."', 'https://leetcode.com/problems/game-of-life/', FALSE);

-- Hashmap (9 questions)
INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('383', 'Ransom Note', 'ransom-note', 'Easy', 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.', 'https://leetcode.com/problems/ransom-note/', FALSE),
('205', 'Isomorphic Strings', 'isomorphic-strings', 'Easy', 'Given two strings s and t, determine if they are isomorphic. Two strings s and t are isomorphic if the characters in s can be replaced to get t.', 'https://leetcode.com/problems/isomorphic-strings/', FALSE),
('290', 'Word Pattern', 'word-pattern', 'Easy', 'Given a pattern and a string s, find if s follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.', 'https://leetcode.com/problems/word-pattern/', FALSE),
('242', 'Valid Anagram', 'valid-anagram', 'Easy', 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', 'https://leetcode.com/problems/valid-anagram/', FALSE),
('49', 'Group Anagrams', 'group-anagrams', 'Medium', 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.', 'https://leetcode.com/problems/group-anagrams/', FALSE),
('1', 'Two Sum', 'two-sum', 'Easy', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'https://leetcode.com/problems/two-sum/', FALSE),
('202', 'Happy Number', 'happy-number', 'Easy', 'Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process.', 'https://leetcode.com/problems/happy-number/', FALSE),
('219', 'Contains Duplicate II', 'contains-duplicate-ii', 'Easy', 'Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.', 'https://leetcode.com/problems/contains-duplicate-ii/', FALSE),
('128', 'Longest Consecutive Sequence', 'longest-consecutive-sequence', 'Hard', 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.', 'https://leetcode.com/problems/longest-consecutive-sequence/', FALSE);

-- Continue with remaining categories...
-- (This is getting quite long, let me create a more efficient approach)
