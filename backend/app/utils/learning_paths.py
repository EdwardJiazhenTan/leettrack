"""
Learning Paths Utility Functions
Handles creation and management of learning paths and their questions
"""

from app import db
from app.models.learning_path import LearningPath
from app.models.path_question import PathQuestion
from app.models.question import Question
from app.utils.leetcode_graphql import leetcode_client
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def create_learning_path(name, description, difficulty_level="Intermediate", 
                        estimated_hours=None, tags=None, source="System", 
                        creator_id=None, is_public=True):
    """Create a new learning path"""
    try:
        learning_path = LearningPath(
            name=name,
            description=description,
            source=source,
            creator_id=creator_id,
            is_public=is_public,
            difficulty_level=difficulty_level,
            estimated_hours=estimated_hours,
            tags=tags if isinstance(tags, str) else ','.join(tags) if tags else None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            is_active=True
        )
        
        db.session.add(learning_path)
        db.session.commit()
        
        logger.info(f"Created learning path: {name}")
        return learning_path
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating learning path {name}: {str(e)}")
        raise

def add_question_to_path(path_id, question_title_slug, sequence_number, 
                        notes=None, estimated_minutes=None, importance=3):
    """Add a question to a learning path by fetching it from LeetCode"""
    try:
        # First, try to find the question in our database
        question = Question.query.filter_by(title=question_title_slug.replace('-', ' ').title()).first()
        
        # If not found, fetch from LeetCode GraphQL API
        if not question:
            logger.info(f"Fetching question from LeetCode: {question_title_slug}")
            problem_data = leetcode_client.get_problem_by_slug(question_title_slug)
            
            if 'error' in problem_data:
                logger.error(f"Failed to fetch question {question_title_slug}: {problem_data['error']}")
                return None
            
            # Create new question in database
            question = Question(
                leetcode_id=problem_data.get('questionId'),
                title=problem_data.get('title'),
                url=f"https://leetcode.com/problems/{question_title_slug}/",
                difficulty=problem_data.get('difficulty'),
                description=problem_data.get('content'),
                tags=','.join(tag.get('name', '') for tag in problem_data.get('topicTags', [])),
                last_updated=datetime.utcnow()
            )
            db.session.add(question)
            db.session.flush()  # Get the question_id
        
        # Check if question is already in the path
        existing = PathQuestion.query.filter_by(
            path_id=path_id, 
            question_id=question.question_id
        ).first()
        
        if existing:
            logger.warning(f"Question {question.title} already exists in path {path_id}")
            return existing
        
        # Add question to path
        path_question = PathQuestion(
            path_id=path_id,
            question_id=question.question_id,
            sequence_number=sequence_number,
            notes=notes,
            estimated_minutes=estimated_minutes,
            importance=importance
        )
        
        db.session.add(path_question)
        db.session.commit()
        
        logger.info(f"Added question {question.title} to path {path_id}")
        return path_question
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding question {question_title_slug} to path {path_id}: {str(e)}")
        raise

def get_learning_path_with_questions(path_id):
    """Get a learning path with all its questions"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return None
        
        # Get questions ordered by sequence
        path_questions = db.session.query(PathQuestion, Question).join(
            Question, PathQuestion.question_id == Question.question_id
        ).filter(PathQuestion.path_id == path_id).order_by(
            PathQuestion.sequence_number
        ).all()
        
        return {
            'path': path,
            'questions': [
                {
                    'sequence_number': pq.sequence_number,
                    'question': q,
                    'notes': pq.notes,
                    'estimated_minutes': pq.estimated_minutes,
                    'importance': pq.importance
                }
                for pq, q in path_questions
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting learning path {path_id}: {str(e)}")
        raise

def create_neetcode_75_path():
    """Create the NeetCode 75 learning path with all problems"""
    
    # NeetCode 75 problems organized by category
    neetcode_75_problems = [
        # Array & Hashing
        ("two-sum", 1, "Array & Hashing", 15, 5),
        ("contains-duplicate", 2, "Array & Hashing", 10, 4),
        ("valid-anagram", 3, "Array & Hashing", 15, 4),
        ("group-anagrams", 4, "Array & Hashing", 25, 4),
        ("top-k-frequent-elements", 5, "Array & Hashing", 30, 5),
        ("product-of-array-except-self", 6, "Array & Hashing", 25, 5),
        ("valid-sudoku", 7, "Array & Hashing", 30, 3),
        ("encode-and-decode-strings", 8, "Array & Hashing", 20, 4),
        ("longest-consecutive-sequence", 9, "Array & Hashing", 35, 4),
        
        # Two Pointers
        ("valid-palindrome", 10, "Two Pointers", 15, 4),
        ("two-sum-ii-input-array-is-sorted", 11, "Two Pointers", 20, 4),
        ("3sum", 12, "Two Pointers", 35, 5),
        ("container-with-most-water", 13, "Two Pointers", 25, 4),
        ("trapping-rain-water", 14, "Two Pointers", 45, 5),
        
        # Sliding Window
        ("best-time-to-buy-and-sell-stock", 15, "Sliding Window", 20, 5),
        ("longest-substring-without-repeating-characters", 16, "Sliding Window", 30, 5),
        ("longest-repeating-character-replacement", 17, "Sliding Window", 35, 4),
        ("permutation-in-string", 18, "Sliding Window", 30, 4),
        ("minimum-window-substring", 19, "Sliding Window", 45, 5),
        ("sliding-window-maximum", 20, "Sliding Window", 40, 4),
        
        # Stack
        ("valid-parentheses", 21, "Stack", 15, 5),
        ("min-stack", 22, "Stack", 25, 4),
        ("evaluate-reverse-polish-notation", 23, "Stack", 20, 3),
        ("generate-parentheses", 24, "Stack", 30, 4),
        ("daily-temperatures", 25, "Stack", 25, 4),
        ("car-fleet", 26, "Stack", 35, 3),
        ("largest-rectangle-in-histogram", 27, "Stack", 45, 4),
        
        # Binary Search
        ("binary-search", 28, "Binary Search", 15, 5),
        ("search-a-2d-matrix", 29, "Binary Search", 20, 4),
        ("koko-eating-bananas", 30, "Binary Search", 30, 4),
        ("find-minimum-in-rotated-sorted-array", 31, "Binary Search", 25, 4),
        ("search-in-rotated-sorted-array", 32, "Binary Search", 30, 5),
        ("time-based-key-value-store", 33, "Binary Search", 35, 3),
        ("median-of-two-sorted-arrays", 34, "Binary Search", 45, 5),
        
        # Linked List
        ("reverse-linked-list", 35, "Linked List", 15, 5),
        ("merge-two-sorted-lists", 36, "Linked List", 20, 5),
        ("reorder-list", 37, "Linked List", 30, 4),
        ("remove-nth-node-from-end-of-list", 38, "Linked List", 25, 4),
        ("copy-list-with-random-pointer", 39, "Linked List", 35, 4),
        ("add-two-numbers", 40, "Linked List", 25, 4),
        ("linked-list-cycle", 41, "Linked List", 20, 5),
        ("find-the-duplicate-number", 42, "Linked List", 30, 4),
        ("lru-cache", 43, "Linked List", 40, 5),
        ("merge-k-sorted-lists", 44, "Linked List", 45, 5),
        ("reverse-nodes-in-k-group", 45, "Linked List", 45, 4),
        
        # Trees
        ("invert-binary-tree", 46, "Trees", 15, 5),
        ("maximum-depth-of-binary-tree", 47, "Trees", 15, 4),
        ("diameter-of-binary-tree", 48, "Trees", 20, 4),
        ("balanced-binary-tree", 49, "Trees", 20, 3),
        ("same-tree", 50, "Trees", 15, 3),
        ("subtree-of-another-tree", 51, "Trees", 25, 4),
        ("lowest-common-ancestor-of-a-binary-search-tree", 52, "Trees", 25, 4),
        ("binary-tree-level-order-traversal", 53, "Trees", 25, 4),
        ("binary-tree-right-side-view", 54, "Trees", 25, 4),
        ("count-good-nodes-in-binary-tree", 55, "Trees", 25, 3),
        ("validate-binary-search-tree", 56, "Trees", 30, 5),
        ("kth-smallest-element-in-a-bst", 57, "Trees", 25, 4),
        ("construct-binary-tree-from-preorder-and-inorder-traversal", 58, "Trees", 35, 4),
        ("binary-tree-maximum-path-sum", 59, "Trees", 40, 5),
        ("serialize-and-deserialize-binary-tree", 60, "Trees", 45, 5),
        
        # Tries
        ("implement-trie-prefix-tree", 61, "Tries", 30, 4),
        ("design-add-and-search-words-data-structure", 62, "Tries", 35, 4),
        ("word-search-ii", 63, "Tries", 45, 5),
        
        # Heap / Priority Queue
        ("kth-largest-element-in-a-stream", 64, "Heap", 25, 3),
        ("last-stone-weight", 65, "Heap", 20, 3),
        ("k-closest-points-to-origin", 66, "Heap", 25, 4),
        ("task-scheduler", 67, "Heap", 35, 4),
        ("design-twitter", 68, "Heap", 40, 3),
        ("find-median-from-data-stream", 69, "Heap", 40, 5),
        
        # Backtracking
        ("subsets", 70, "Backtracking", 25, 5),
        ("combination-sum", 71, "Backtracking", 30, 4),
        ("permutations", 72, "Backtracking", 25, 4),
        ("subsets-ii", 73, "Backtracking", 30, 4),
        ("combination-sum-ii", 74, "Backtracking", 35, 4),
        ("word-search", 75, "Backtracking", 35, 4),
        ("palindrome-partitioning", 76, "Backtracking", 35, 4),
        ("letter-combinations-of-a-phone-number", 77, "Backtracking", 25, 4),
        ("n-queens", 78, "Backtracking", 45, 4),
        
        # Graphs
        ("number-of-islands", 79, "Graphs", 25, 5),
        ("clone-graph", 80, "Graphs", 30, 4),
        ("max-area-of-island", 81, "Graphs", 25, 4),
        ("pacific-atlantic-water-flow", 82, "Graphs", 35, 4),
        ("surrounded-regions", 83, "Graphs", 30, 4),
        ("rotting-oranges", 84, "Graphs", 25, 4),
        ("walls-and-gates", 85, "Graphs", 30, 3),
        ("course-schedule", 86, "Graphs", 30, 5),
        ("course-schedule-ii", 87, "Graphs", 35, 4),
        ("redundant-connection", 88, "Graphs", 30, 3),
        ("number-of-connected-components-in-an-undirected-graph", 89, "Graphs", 25, 3),
        ("graph-valid-tree", 90, "Graphs", 30, 4),
        ("word-ladder", 91, "Graphs", 40, 4),
        
        # Advanced Graphs
        ("reconstruct-itinerary", 92, "Advanced Graphs", 40, 3),
        ("min-cost-to-connect-all-points", 93, "Advanced Graphs", 35, 4),
        ("network-delay-time", 94, "Advanced Graphs", 35, 4),
        ("swim-in-rising-water", 95, "Advanced Graphs", 40, 4),
        ("alien-dictionary", 96, "Advanced Graphs", 45, 5),
        ("cheapest-flights-within-k-stops", 97, "Advanced Graphs", 40, 4),
        
        # 1-D Dynamic Programming
        ("climbing-stairs", 98, "1-D DP", 15, 5),
        ("min-cost-climbing-stairs", 99, "1-D DP", 20, 4),
        ("house-robber", 100, "1-D DP", 20, 5),
        ("house-robber-ii", 101, "1-D DP", 25, 4),
        ("longest-palindromic-substring", 102, "1-D DP", 30, 5),
        ("palindromic-substrings", 103, "1-D DP", 25, 4),
        ("decode-ways", 104, "1-D DP", 35, 4),
        ("coin-change", 105, "1-D DP", 30, 5),
        ("maximum-product-subarray", 106, "1-D DP", 30, 4),
        ("word-break", 107, "1-D DP", 35, 4),
        ("longest-increasing-subsequence", 108, "1-D DP", 35, 5),
        ("partition-equal-subset-sum", 109, "1-D DP", 35, 4),
        
        # 2-D Dynamic Programming
        ("unique-paths", 110, "2-D DP", 20, 4),
        ("longest-common-subsequence", 111, "2-D DP", 30, 5),
        ("best-time-to-buy-and-sell-stock-with-cooldown", 112, "2-D DP", 35, 4),
        ("coin-change-2", 113, "2-D DP", 30, 4),
        ("target-sum", 114, "2-D DP", 30, 4),
        ("interleaving-string", 115, "2-D DP", 40, 4),
        ("longest-increasing-path-in-a-matrix", 116, "2-D DP", 40, 4),
        ("distinct-subsequences", 117, "2-D DP", 40, 4),
        ("edit-distance", 118, "2-D DP", 35, 5),
        ("burst-balloons", 119, "2-D DP", 45, 4),
        ("regular-expression-matching", 120, "2-D DP", 45, 5),
        
        # Greedy
        ("maximum-subarray", 121, "Greedy", 20, 5),
        ("jump-game", 122, "Greedy", 25, 4),
        ("jump-game-ii", 123, "Greedy", 30, 4),
        ("gas-station", 124, "Greedy", 30, 4),
        ("hand-of-straights", 125, "Greedy", 30, 3),
        ("merge-triplets-to-form-target-triplet", 126, "Greedy", 35, 3),
        ("partition-labels", 127, "Greedy", 25, 4),
        ("valid-parenthesis-string", 128, "Greedy", 30, 4),
        
        # Intervals
        ("insert-interval", 129, "Intervals", 25, 4),
        ("merge-intervals", 130, "Intervals", 25, 5),
        ("non-overlapping-intervals", 131, "Intervals", 30, 4),
        ("meeting-rooms", 132, "Intervals", 15, 3),
        ("meeting-rooms-ii", 133, "Intervals", 30, 5),
        
        # Math & Geometry
        ("rotate-image", 134, "Math & Geometry", 25, 4),
        ("spiral-matrix", 135, "Math & Geometry", 25, 4),
        ("set-matrix-zeroes", 136, "Math & Geometry", 25, 4),
        ("happy-number", 137, "Math & Geometry", 20, 3),
        ("plus-one", 138, "Math & Geometry", 15, 3),
        ("pow-x-n", 139, "Math & Geometry", 25, 4),
        ("multiply-strings", 140, "Math & Geometry", 35, 3),
        ("detect-squares", 141, "Math & Geometry", 35, 3),
        
        # Bit Manipulation
        ("single-number", 142, "Bit Manipulation", 15, 4),
        ("number-of-1-bits", 143, "Bit Manipulation", 15, 3),
        ("counting-bits", 144, "Bit Manipulation", 20, 4),
        ("reverse-bits", 145, "Bit Manipulation", 20, 3),
        ("missing-number", 146, "Bit Manipulation", 15, 4),
        ("sum-of-two-integers", 147, "Bit Manipulation", 25, 4),
        ("reverse-integer", 148, "Bit Manipulation", 20, 3)
    ]
    
    try:
        # Create the learning path
        path = create_learning_path(
            name="NeetCode 75",
            description="A curated list of 75 LeetCode problems that cover all the important patterns and concepts needed for coding interviews. This path is designed to build a strong foundation in data structures and algorithms.",
            difficulty_level="Intermediate",
            estimated_hours=150,
            tags=["Interview Prep", "Data Structures", "Algorithms", "NeetCode", "Coding Interview"],
            source="System",
            is_public=True
        )
        
        logger.info(f"Created NeetCode 75 path with ID: {path.path_id}")
        
        # Add all problems to the path
        success_count = 0
        for problem_slug, sequence, category, minutes, importance in neetcode_75_problems:
            try:
                result = add_question_to_path(
                    path_id=path.path_id,
                    question_title_slug=problem_slug,
                    sequence_number=sequence,
                    notes=f"Category: {category}",
                    estimated_minutes=minutes,
                    importance=importance
                )
                if result:
                    success_count += 1
                    logger.info(f"Added {problem_slug} ({success_count}/{len(neetcode_75_problems)})")
            except Exception as e:
                logger.error(f"Failed to add {problem_slug}: {str(e)}")
                continue
        
        logger.info(f"Successfully added {success_count}/{len(neetcode_75_problems)} problems to NeetCode 75 path")
        return path
        
    except Exception as e:
        logger.error(f"Error creating NeetCode 75 path: {str(e)}")
        raise 