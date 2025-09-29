#!/usr/bin/env python3
"""
Generate SQL script for all 150 LeetCode questions
"""

questions_data = {
    "Array / String": [
        (88, "Merge Sorted Array", "Easy", "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively."),
        (27, "Remove Element", "Easy", "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place."),
        (26, "Remove Duplicates from Sorted Array", "Easy", "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once."),
        (80, "Remove Duplicates from Sorted Array II", "Medium", "Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice."),
        (169, "Majority Element", "Easy", "Given an array nums of size n, return the majority element."),
        (189, "Rotate Array", "Medium", "Given an array, rotate the array to the right by k steps, where k is non-negative."),
        (121, "Best Time to Buy and Sell Stock", "Easy", "You are given an array prices where prices[i] is the price of a given stock on the ith day."),
        (122, "Best Time to Buy and Sell Stock II", "Medium", "You are given an integer array prices where prices[i] is the price of a given stock on the ith day."),
        (55, "Jump Game", "Medium", "You are given an integer array nums. You are initially positioned at the array's first index."),
        (45, "Jump Game II", "Medium", "Given an array of non-negative integers nums, you are initially positioned at the first index of the array."),
        (274, "H-Index", "Medium", "Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper."),
        (380, "Insert Delete GetRandom O(1)", "Medium", "Implement the RandomizedSet class with insert, remove, and getRandom operations in average O(1) time."),
        (238, "Product of Array Except Self", "Medium", "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]."),
        (134, "Gas Station", "Medium", "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]."),
        (135, "Candy", "Hard", "There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings."),
        (42, "Trapping Rain Water", "Hard", "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining."),
        (13, "Roman to Integer", "Easy", "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M."),
        (12, "Integer to Roman", "Medium", "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M."),
        (58, "Length of Last Word", "Easy", "Given a string s consisting of words and spaces, return the length of the last word in the string."),
        (14, "Longest Common Prefix", "Easy", "Write a function to find the longest common prefix string amongst an array of strings."),
        (151, "Reverse Words in a String", "Medium", "Given an input string s, reverse the order of the words."),
        (6, "Zigzag Conversion", "Medium", "The string \"PAYPALISHIRING\" is written in a zigzag pattern on a given number of rows."),
        (28, "Find the Index of the First Occurrence in a String", "Medium", "Given two strings needle and haystack, return the index of the first occurrence of needle in haystack."),
        (68, "Text Justification", "Hard", "Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters.")
    ],

    "Two Pointers": [
        (125, "Valid Palindrome", "Easy", "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward."),
        (392, "Is Subsequence", "Easy", "Given two strings s and t, return true if s is a subsequence of t, or false otherwise."),
        (167, "Two Sum II - Input Array Is Sorted", "Medium", "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number."),
        (11, "Container With Most Water", "Medium", "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i])."),
        (15, "3Sum", "Medium", "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.")
    ],

    "Sliding Window": [
        (209, "Minimum Size Subarray Sum", "Medium", "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray."),
        (3, "Longest Substring Without Repeating Characters", "Medium", "Given a string s, find the length of the longest substring without repeating characters."),
        (30, "Substring with Concatenation of All Words", "Hard", "You are given a string s and an array of strings words of the same length."),
        (76, "Minimum Window Substring", "Hard", "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s.")
    ],

    "Matrix": [
        (36, "Valid Sudoku", "Medium", "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated."),
        (54, "Spiral Matrix", "Medium", "Given an m x n matrix, return all elements of the matrix in spiral order."),
        (48, "Rotate Image", "Medium", "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise)."),
        (73, "Set Matrix Zeroes", "Medium", "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s."),
        (289, "Game of Life", "Medium", "According to Wikipedia's article: \"The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.\"")
    ],

    "Hashmap": [
        (383, "Ransom Note", "Easy", "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine."),
        (205, "Isomorphic Strings", "Easy", "Given two strings s and t, determine if they are isomorphic."),
        (290, "Word Pattern", "Easy", "Given a pattern and a string s, find if s follows the same pattern."),
        (242, "Valid Anagram", "Easy", "Given two strings s and t, return true if t is an anagram of s, and false otherwise."),
        (49, "Group Anagrams", "Medium", "Given an array of strings strs, group the anagrams together."),
        (1, "Two Sum", "Easy", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."),
        (202, "Happy Number", "Easy", "Write an algorithm to determine if a number n is happy."),
        (219, "Contains Duplicate II", "Easy", "Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k."),
        (128, "Longest Consecutive Sequence", "Hard", "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.")
    ],

    "Intervals": [
        (228, "Summary Ranges", "Easy", "You are given a sorted unique integer array nums."),
        (56, "Merge Intervals", "Medium", "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals."),
        (57, "Insert Interval", "Medium", "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi]."),
        (452, "Minimum Number of Arrows to Burst Balloons", "Medium", "There are some spherical balloons taped onto a flat wall that represents the XY-plane.")
    ],

    "Stack": [
        (20, "Valid Parentheses", "Easy", "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."),
        (71, "Simplify Path", "Medium", "Given a string path, which is an absolute path (starting with a slash '/') to a file or directory in a Unix-style file system."),
        (155, "Min Stack", "Medium", "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time."),
        (150, "Evaluate Reverse Polish Notation", "Medium", "Evaluate the value of an arithmetic expression in Reverse Polish Notation."),
        (224, "Basic Calculator", "Hard", "Given a string s representing a valid expression, implement a basic calculator to evaluate it.")
    ],

    "Linked List": [
        (141, "Linked List Cycle", "Easy", "Given head, the head of a linked list, determine if the linked list has a cycle in it."),
        (2, "Add Two Numbers", "Medium", "You are given two non-empty linked lists representing two non-negative integers."),
        (21, "Merge Two Sorted Lists", "Easy", "You are given the heads of two sorted linked lists list1 and list2."),
        (138, "Copy List with Random Pointer", "Medium", "A linked list of length n is given such that each node contains an additional random pointer."),
        (92, "Reverse Linked List II", "Medium", "Given the head of a singly linked list and two integers left and right where left <= right."),
        (25, "Reverse Nodes in k-Group", "Hard", "Given the head of a linked list, reverse the nodes of the list k at a time."),
        (19, "Remove Nth Node From End of List", "Medium", "Given the head of a linked list, remove the nth node from the end of the list."),
        (82, "Remove Duplicates from Sorted List II", "Medium", "Given the head of a sorted linked list, delete all nodes that have duplicate numbers."),
        (61, "Rotate List", "Medium", "Given the head of a linked list, rotate the list to the right by k places."),
        (86, "Partition List", "Medium", "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x."),
        (146, "LRU Cache", "Medium", "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.")
    ],

    "Binary Tree General": [
        (104, "Maximum Depth of Binary Tree", "Easy", "Given the root of a binary tree, return its maximum depth."),
        (100, "Same Tree", "Easy", "Given the roots of two binary trees p and q, write a function to check if they are the same or not."),
        (226, "Invert Binary Tree", "Easy", "Given the root of a binary tree, invert the tree, and return its root."),
        (101, "Symmetric Tree", "Easy", "Given the root of a binary tree, check whether it is a mirror of itself."),
        (105, "Construct Binary Tree from Preorder and Inorder Traversal", "Medium", "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree."),
        (106, "Construct Binary Tree from Inorder and Postorder Traversal", "Medium", "Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree."),
        (117, "Populating Next Right Pointers in Each Node II", "Medium", "Given a binary tree, populate each next pointer to point to its next right node."),
        (114, "Flatten Binary Tree to Linked List", "Medium", "Given the root of a binary tree, flatten the tree into a \"linked list\"."),
        (112, "Path Sum", "Easy", "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum."),
        (129, "Sum Root to Leaf Numbers", "Medium", "You are given the root of a binary tree containing digits from 0 to 9 only."),
        (124, "Binary Tree Maximum Path Sum", "Hard", "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them."),
        (173, "Binary Search Tree Iterator", "Medium", "Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST)."),
        (222, "Count Complete Tree Nodes", "Medium", "Given the root of a complete binary tree, return the number of the nodes in the tree."),
        (236, "Lowest Common Ancestor of a Binary Tree", "Medium", "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.")
    ],

    "Binary Tree BFS": [
        (199, "Binary Tree Right Side View", "Medium", "Given the root of a binary tree, imagine yourself standing on the right side of it."),
        (637, "Average of Levels in Binary Tree", "Easy", "Given the root of a binary tree, return the average value of the nodes on each level in the form of an array."),
        (102, "Binary Tree Level Order Traversal", "Medium", "Given the root of a binary tree, return the level order traversal of its nodes' values."),
        (103, "Binary Tree Zigzag Level Order Traversal", "Medium", "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values."),
        (530, "Minimum Absolute Difference in BST", "Easy", "Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree."),
        (230, "Kth Smallest Element in a BST", "Medium", "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree."),
        (98, "Validate Binary Search Tree", "Medium", "Given the root of a binary tree, determine if it is a valid binary search tree (BST).")
    ],

    "Graph General": [
        (200, "Number of Islands", "Medium", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands."),
        (130, "Surrounded Regions", "Medium", "Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'."),
        (133, "Clone Graph", "Medium", "Given a reference of a node in a connected undirected graph."),
        (399, "Evaluate Division", "Medium", "You are given an array of variable pairs equations and an array of real numbers values."),
        (207, "Course Schedule", "Medium", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1."),
        (210, "Course Schedule II", "Medium", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.")
    ],

    "Graph BFS": [
        (909, "Snakes and Ladders", "Medium", "You are given an n x n integer matrix board where the cells are labeled from 1 to n2 in a Boustrophedon style."),
        (433, "Minimum Genetic Mutation", "Medium", "A gene string can be represented by an 8-character long string, with choices from 'A', 'C', 'G', and 'T'.")
    ],

    "Trie": [
        (208, "Implement Trie (Prefix Tree)", "Medium", "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings."),
        (211, "Design Add and Search Words Data Structure", "Medium", "Design a data structure that supports adding new words and finding if a string matches any previously added string."),
        (212, "Word Search II", "Hard", "Given an m x n board of characters and a list of strings words, return all words on the board.")
    ],

    "Backtracking": [
        (17, "Letter Combinations of a Phone Number", "Medium", "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent."),
        (77, "Combinations", "Medium", "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]."),
        (46, "Permutations", "Medium", "Given an array nums of distinct integers, return all the possible permutations."),
        (39, "Combination Sum", "Medium", "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target."),
        (52, "N-Queens II", "Hard", "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other."),
        (22, "Generate Parentheses", "Medium", "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses."),
        (79, "Word Search", "Medium", "Given an m x n grid of characters board and a string word, return true if word exists in the grid.")
    ],

    "Divide & Conquer": [
        (108, "Convert Sorted Array to Binary Search Tree", "Easy", "Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree."),
        (148, "Sort List", "Medium", "Given the head of a linked list, return the list after sorting it in ascending order."),
        (427, "Construct Quad Tree", "Medium", "Given a n * n matrix grid of 0's and 1's only, we want to represent the grid with a Quad Tree."),
        (23, "Merge k Sorted Lists", "Hard", "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.")
    ],

    "Kadane's Algorithm": [
        (53, "Maximum Subarray", "Medium", "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum."),
        (918, "Maximum Sum Circular Subarray", "Medium", "Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums.")
    ],

    "Binary Search": [
        (35, "Search Insert Position", "Easy", "Given a sorted array of distinct integers and a target value, return the index if the target is found."),
        (74, "Search a 2D Matrix", "Medium", "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix."),
        (162, "Find Peak Element", "Medium", "A peak element is an element that is strictly greater than its neighbors."),
        (33, "Search in Rotated Sorted Array", "Medium", "There is an integer array nums sorted in ascending order (with distinct values)."),
        (34, "Find First and Last Position of Element in Sorted Array", "Medium", "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value."),
        (153, "Find Minimum in Rotated Sorted Array", "Medium", "Suppose an array of length n sorted in ascending order is rotated between 1 and n times."),
        (4, "Median of Two Sorted Arrays", "Hard", "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.")
    ],

    "Heap": [
        (215, "Kth Largest Element in an Array", "Medium", "Given an integer array nums and an integer k, return the kth largest element in the array."),
        (502, "IPO", "Hard", "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO."),
        (373, "Find K Pairs with Smallest Sums", "Medium", "You are given two integer arrays nums1 and nums2 sorted in ascending order and an integer k."),
        (295, "Find Median from Data Stream", "Hard", "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.")
    ],

    "Bit Manipulation": [
        (67, "Add Binary", "Easy", "Given two binary strings a and b, return their sum as a binary string."),
        (190, "Reverse Bits", "Easy", "Reverse bits of a given 32 bits unsigned integer."),
        (191, "Number of 1 Bits", "Easy", "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight)."),
        (136, "Single Number", "Easy", "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one."),
        (137, "Single Number II", "Medium", "Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it."),
        (201, "Bitwise AND of Numbers Range", "Medium", "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.")
    ],

    "Math": [
        (9, "Palindrome Number", "Easy", "Given an integer x, return true if x is palindrome integer."),
        (66, "Plus One", "Easy", "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer."),
        (172, "Factorial Trailing Zeroes", "Medium", "Given an integer n, return the number of trailing zeroes in n!."),
        (69, "Sqrt(x)", "Easy", "Given a non-negative integer x, compute and return the square root of x."),
        (50, "Pow(x, n)", "Medium", "Implement pow(x, n), which calculates x raised to the power n (i.e., xn)."),
        (149, "Max Points on a Line", "Hard", "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.")
    ],

    "1D Dynamic Programming": [
        (70, "Climbing Stairs", "Easy", "You are climbing a staircase. It takes n steps to reach the top."),
        (198, "House Robber", "Medium", "You are a professional robber planning to rob houses along a street."),
        (139, "Word Break", "Medium", "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words."),
        (322, "Coin Change", "Medium", "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money."),
        (300, "Longest Increasing Subsequence", "Medium", "Given an integer array nums, return the length of the longest strictly increasing subsequence.")
    ],

    "Multidimensional DP": [
        (120, "Triangle", "Medium", "Given a triangle array, return the minimum path sum from top to bottom."),
        (64, "Minimum Path Sum", "Medium", "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path."),
        (63, "Unique Paths II", "Medium", "You are given an m x n integer array grid. There is a robot initially located at the top-left corner (i.e., grid[0][0])."),
        (5, "Longest Palindromic Substring", "Medium", "Given a string s, return the longest palindromic substring in s."),
        (97, "Interleaving String", "Medium", "Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2."),
        (72, "Edit Distance", "Hard", "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2."),
        (123, "Best Time to Buy and Sell Stock III", "Hard", "You are given an array prices where prices[i] is the price of a given stock on the ith day."),
        (188, "Best Time to Buy and Sell Stock IV", "Hard", "You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k."),
        (221, "Maximal Square", "Medium", "Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area."),
        (115, "Distinct Subsequences", "Hard", "Given two strings s and t, return the number of distinct subsequences of s which equals t.")
    ]
}

def create_slug(title):
    """Convert title to URL slug"""
    return title.lower().replace(" ", "-").replace("(", "").replace(")", "").replace(",", "").replace("'", "").replace(".", "").replace("/", "-")

def escape_sql_string(s):
    """Escape single quotes in SQL strings"""
    return s.replace("'", "''")

def generate_sql():
    """Generate complete SQL script"""

    sql_content = """-- LeetCode 150 Questions - Complete Dataset
-- Generated script with all questions organized by category

-- Clear existing data
DELETE FROM question_tags;
DELETE FROM questions;

"""

    # Generate questions
    for category, questions in questions_data.items():
        sql_content += f"-- {category} ({len(questions)} questions)\n"

        for leetcode_id, title, difficulty, description in questions:
            slug = create_slug(title)
            url = f"https://leetcode.com/problems/{slug}/"

            sql_content += f"""INSERT INTO questions (leetcode_id, title, slug, difficulty, description, url, is_custom) VALUES
('{leetcode_id}', '{escape_sql_string(title)}', '{slug}', '{difficulty}', '{escape_sql_string(description)}', '{url}', FALSE);
"""

        sql_content += "\n"

    # Generate tags
    sql_content += "-- Insert tags for questions\n"

    category_tags_map = {
        "Array / String": ["Array", "String"],
        "Two Pointers": ["Two Pointers"],
        "Sliding Window": ["Sliding Window"],
        "Matrix": ["Matrix"],
        "Hashmap": ["Hash Table"],
        "Intervals": ["Intervals"],
        "Stack": ["Stack"],
        "Linked List": ["Linked List"],
        "Binary Tree General": ["Tree", "Binary Tree"],
        "Binary Tree BFS": ["Tree", "Binary Tree", "BFS"],
        "Graph General": ["Graph"],
        "Graph BFS": ["Graph", "BFS"],
        "Trie": ["Trie"],
        "Backtracking": ["Backtracking"],
        "Divide & Conquer": ["Divide and Conquer"],
        "Kadane's Algorithm": ["Dynamic Programming", "Array"],
        "Binary Search": ["Binary Search"],
        "Heap": ["Heap"],
        "Bit Manipulation": ["Bit Manipulation"],
        "Math": ["Math"],
        "1D Dynamic Programming": ["Dynamic Programming"],
        "Multidimensional DP": ["Dynamic Programming"]
    }

    for category, questions in questions_data.items():
        tags = category_tags_map.get(category, [category])

        for leetcode_id, title, difficulty, description in questions:
            slug = create_slug(title)

            for tag in tags:
                sql_content += f"""INSERT INTO question_tags (question_id, tag)
SELECT q.id, '{tag}' FROM questions q WHERE q.slug = '{slug}';
"""

        sql_content += "\n"

    return sql_content

if __name__ == "__main__":
    sql_script = generate_sql()

    with open("leetcode_150_complete.sql", "w", encoding="utf-8") as f:
        f.write(sql_script)

    print(f"Generated SQL script with {sum(len(questions) for questions in questions_data.values())} questions")
    print("Saved to: leetcode_150_complete.sql")
