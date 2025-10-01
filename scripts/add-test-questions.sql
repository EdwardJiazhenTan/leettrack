INSERT INTO questions (title, slug, difficulty, url, leetcode_id) VALUES
  ('Two Sum', 'two-sum', 'Easy', 'https://leetcode.com/problems/two-sum/', '1'),
  ('Add Two Numbers', 'add-two-numbers', 'Medium', 'https://leetcode.com/problems/add-two-numbers/', '2'),
  ('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', '3'),
  ('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', '4'),
  ('Longest Palindromic Substring', 'longest-palindromic-substring', 'Medium', 'https://leetcode.com/problems/longest-palindromic-substring/', '5');

SELECT COUNT(*) FROM questions;
