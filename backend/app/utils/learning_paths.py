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


def create_learning_path(
    name,
    description,
    difficulty_level="Intermediate",
    estimated_hours=None,
    tags=None,
    source="System",
    creator_id=None,
    is_public=True,
):
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
            tags=tags if isinstance(tags, str) else ",".join(tags) if tags else None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            is_active=True,
        )

        db.session.add(learning_path)
        db.session.commit()

        logger.info(f"Created learning path: {name}")
        return learning_path

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating learning path {name}: {str(e)}")
        raise


def add_question_to_path(
    path_id,
    question_title_slug,
    sequence_number,
    notes=None,
    estimated_minutes=None,
    importance=3,
):
    """Add a question to a learning path by fetching it from LeetCode"""
    try:
        # First, try to find the question in our database
        question = Question.query.filter_by(
            title=question_title_slug.replace("-", " ").title()
        ).first()

        # If not found, fetch from LeetCode GraphQL API
        if not question:
            logger.info(f"Fetching question from LeetCode: {question_title_slug}")
            problem_data = leetcode_client.get_problem_by_slug(question_title_slug)

            if "error" in problem_data:
                logger.error(
                    f"Failed to fetch question {question_title_slug}: {problem_data['error']}"
                )
                return None

            # Create new question in database
            question = Question(
                leetcode_id=problem_data.get("questionId"),
                title=problem_data.get("title"),
                url=f"https://leetcode.com/problems/{question_title_slug}/",
                difficulty=problem_data.get("difficulty"),
                description=problem_data.get("content"),
                tags=",".join(
                    tag.get("name", "") for tag in problem_data.get("topicTags", [])
                ),
                last_updated=datetime.utcnow(),
            )
            db.session.add(question)
            db.session.flush()  # Get the question_id

        # Check if question is already in the path
        existing = PathQuestion.query.filter_by(
            path_id=path_id, question_id=question.question_id
        ).first()

        if existing:
            logger.warning(
                f"Question {question.title} already exists in path {path_id}"
            )
            return existing

        # Add question to path
        path_question = PathQuestion(
            path_id=path_id,
            question_id=question.question_id,
            sequence_number=sequence_number,
            notes=notes,
            estimated_minutes=estimated_minutes,
            importance=importance,
        )

        db.session.add(path_question)
        db.session.commit()

        logger.info(f"Added question {question.title} to path {path_id}")
        return path_question

    except Exception as e:
        db.session.rollback()
        logger.error(
            f"Error adding question {question_title_slug} to path {path_id}: {str(e)}"
        )
        raise


def get_learning_path_with_questions(path_id):
    """Get a learning path with all its questions"""
    try:
        path = LearningPath.query.get(path_id)
        if not path:
            return None

        # Get questions ordered by sequence
        path_questions = (
            db.session.query(PathQuestion, Question)
            .join(Question, PathQuestion.question_id == Question.question_id)
            .filter(PathQuestion.path_id == path_id)
            .order_by(PathQuestion.sequence_number)
            .all()
        )

        return {
            "path": path,
            "questions": [
                {
                    "sequence_number": pq.sequence_number,
                    "question": q,
                    "notes": pq.notes,
                    "estimated_minutes": pq.estimated_minutes,
                    "importance": pq.importance,
                }
                for pq, q in path_questions
            ],
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
        (
            "construct-binary-tree-from-preorder-and-inorder-traversal",
            58,
            "Trees",
            35,
            4,
        ),
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
        ("reverse-integer", 148, "Bit Manipulation", 20, 3),
    ]

    try:
        # Create the learning path
        path = create_learning_path(
            name="NeetCode 75",
            description="A curated list of 75 LeetCode problems that cover all the important patterns and concepts needed for coding interviews. This path is designed to build a strong foundation in data structures and algorithms.",
            difficulty_level="Intermediate",
            estimated_hours=150,
            tags=[
                "Interview Prep",
                "Data Structures",
                "Algorithms",
                "NeetCode",
                "Coding Interview",
            ],
            source="System",
            is_public=True,
        )

        logger.info(f"Created NeetCode 75 path with ID: {path.path_id}")

        # Add all problems to the path
        success_count = 0
        for (
            problem_slug,
            sequence,
            category,
            minutes,
            importance,
        ) in neetcode_75_problems:
            try:
                result = add_question_to_path(
                    path_id=path.path_id,
                    question_title_slug=problem_slug,
                    sequence_number=sequence,
                    notes=f"Category: {category}",
                    estimated_minutes=minutes,
                    importance=importance,
                )
                if result:
                    success_count += 1
                    logger.info(
                        f"Added {problem_slug} ({success_count}/{len(neetcode_75_problems)})"
                    )
            except Exception as e:
                logger.error(f"Failed to add {problem_slug}: {str(e)}")
                continue

        logger.info(
            f"Successfully added {success_count}/{len(neetcode_75_problems)} problems to NeetCode 75 path"
        )
        return path

    except Exception as e:
        logger.error(f"Error creating NeetCode 75 path: {str(e)}")
        raise


def create_company_paths(creator_id):
    """Create company-specific learning paths with their key interview questions"""
    created_paths = []

    # Amazon Path
    amazon_path = create_learning_path(
        name="Amazon Interview Prep - 30 Days",
        description="Amazon's most frequently asked coding interview questions focusing on leadership principles, system design thinking, and practical problem-solving skills.",
        difficulty_level="Intermediate",
        estimated_hours=45,
        tags="Amazon,Interview,System Design,Arrays,Trees,Graphs",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    amazon_questions = [
        (
            "two-sum",
            1,
            "Classic array problem, demonstrates understanding of hash maps",
            20,
            5,
        ),
        ("add-two-numbers", 2, "Linked list manipulation, edge case handling", 25, 4),
        (
            "longest-substring-without-repeating-characters",
            3,
            "Sliding window technique",
            30,
            5,
        ),
        ("median-of-two-sorted-arrays", 4, "Binary search on arrays", 45, 4),
        ("merge-k-sorted-lists", 5, "Heap/priority queue usage", 40, 5),
        ("trapping-rain-water", 6, "Two pointers, space optimization", 35, 4),
        ("search-in-rotated-sorted-array", 7, "Modified binary search", 25, 4),
        ("combination-sum", 8, "Backtracking fundamentals", 30, 4),
        ("word-ladder", 9, "BFS graph traversal", 35, 4),
        ("copy-list-with-random-pointer", 10, "Deep copy with complex pointers", 30, 4),
        ("word-break", 11, "Dynamic programming", 25, 4),
        ("lru-cache", 12, "Design pattern, hash map + doubly linked list", 40, 5),
        ("number-of-islands", 13, "DFS/BFS on 2D grid", 25, 5),
        ("meeting-rooms-ii", 14, "Interval scheduling, heap usage", 30, 5),
        (
            "design-add-and-search-words-data-structure",
            15,
            "Trie data structure",
            35,
            4,
        ),
    ]

    for slug, seq, notes, minutes, importance in amazon_questions:
        try:
            add_question_to_path(
                amazon_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Amazon path: {e}")

    created_paths.append(amazon_path)

    # Meta (Facebook) Path
    meta_path = create_learning_path(
        name="Meta Interview Prep - 30 Days",
        description="Meta's coding interview questions emphasizing social graph algorithms, optimization, and scalable system design patterns.",
        difficulty_level="Intermediate",
        estimated_hours=50,
        tags="Meta,Facebook,Interview,Graphs,DP,Trees,Optimization",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    meta_questions = [
        ("valid-parentheses", 1, "String processing fundamentals", 15, 5),
        ("merge-intervals", 2, "Interval processing, sorting", 25, 5),
        (
            "binary-tree-vertical-order-traversal",
            3,
            "Tree traversal with ordering",
            35,
            4,
        ),
        ("subarray-sum-equals-k", 4, "Prefix sum technique", 25, 4),
        ("valid-palindrome", 5, "Two pointers on strings", 15, 4),
        ("remove-invalid-parentheses", 6, "BFS for minimum changes", 40, 4),
        ("expression-add-operators", 7, "Backtracking with evaluation", 45, 3),
        ("sparse-matrix-multiplication", 8, "Matrix operations optimization", 30, 4),
        (
            "find-all-anagrams-in-a-string",
            9,
            "Sliding window with frequency count",
            25,
            4,
        ),
        ("random-pick-with-weight", 10, "Probability and binary search", 30, 4),
        (
            "minimum-remove-to-make-valid-parentheses",
            11,
            "Greedy string processing",
            20,
            4,
        ),
        ("accounts-merge", 12, "Union-Find for social connections", 35, 5),
        ("shortest-path-in-binary-matrix", 13, "BFS shortest path", 25, 4),
        ("design-hit-counter", 14, "Rate limiting design", 30, 5),
        (
            "product-of-array-except-self",
            15,
            "Array manipulation without division",
            20,
            5,
        ),
    ]

    for slug, seq, notes, minutes, importance in meta_questions:
        try:
            add_question_to_path(
                meta_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Meta path: {e}")

    created_paths.append(meta_path)

    # Uber Path
    uber_path = create_learning_path(
        name="Uber Interview Prep - 30 Days",
        description="Uber's coding interviews focusing on geolocation algorithms, real-time data processing, and ride-sharing optimization problems.",
        difficulty_level="Intermediate",
        estimated_hours=40,
        tags="Uber,Interview,Geolocation,Graphs,Real-time,Optimization",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    uber_questions = [
        ("palindromic-substrings", 1, "String DP fundamentals", 25, 4),
        ("word-pattern", 2, "Hash map pattern matching", 20, 4),
        ("group-anagrams", 3, "String categorization", 25, 4),
        ("serialize-and-deserialize-binary-tree", 4, "Tree serialization", 40, 5),
        ("evaluate-division", 5, "Graph traversal with weights", 35, 4),
        ("course-schedule-ii", 6, "Topological sorting", 30, 4),
        ("meeting-rooms", 7, "Interval overlap detection", 20, 5),
        ("decode-string", 8, "Stack-based string processing", 25, 4),
        ("shortest-distance-from-all-buildings", 9, "Multi-source BFS", 40, 4),
        ("alien-dictionary", 10, "Topological sort on custom order", 35, 4),
        ("design-phone-directory", 11, "Efficient number allocation", 25, 3),
        ("reconstruct-itinerary", 12, "Eulerian path in graphs", 35, 3),
        ("find-median-from-data-stream", 13, "Two heaps for dynamic median", 30, 5),
        ("k-closest-points-to-origin", 14, "Heap for geographic proximity", 25, 5),
        ("minimum-cost-to-hire-k-workers", 15, "Optimization with constraints", 40, 4),
    ]

    for slug, seq, notes, minutes, importance in uber_questions:
        try:
            add_question_to_path(
                uber_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Uber path: {e}")

    created_paths.append(uber_path)

    logger.info(f"Created {len(created_paths)} company learning paths")
    return created_paths


def create_topic_paths(creator_id):
    """Create topic-specific learning paths"""
    created_paths = []

    # Binary Search Path
    binary_search_path = create_learning_path(
        name="Binary Search Mastery",
        description="Comprehensive guide to binary search algorithms, from basic implementation to advanced applications in complex scenarios.",
        difficulty_level="Intermediate",
        estimated_hours=25,
        tags="Binary Search,Algorithms,Search,Optimization",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    binary_search_questions = [
        ("binary-search", 1, "Basic binary search implementation", 15, 5),
        ("search-insert-position", 2, "Binary search with insertion point", 15, 4),
        (
            "find-first-and-last-position-of-element-in-sorted-array",
            3,
            "Finding bounds with binary search",
            25,
            5,
        ),
        ("search-in-rotated-sorted-array", 4, "Modified binary search", 30, 5),
        (
            "find-minimum-in-rotated-sorted-array",
            5,
            "Finding pivot in rotated array",
            25,
            4,
        ),
        ("search-a-2d-matrix", 6, "2D binary search", 20, 4),
        ("koko-eating-bananas", 7, "Binary search on answer", 30, 4),
        (
            "capacity-to-ship-packages-within-d-days",
            8,
            "Optimization with binary search",
            35,
            4,
        ),
        ("median-of-two-sorted-arrays", 9, "Advanced binary search", 45, 5),
        ("find-k-closest-elements", 10, "Binary search with sliding window", 30, 4),
    ]

    for slug, seq, notes, minutes, importance in binary_search_questions:
        try:
            add_question_to_path(
                binary_search_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Binary Search path: {e}")

    created_paths.append(binary_search_path)

    # Dynamic Programming Path
    dp_path = create_learning_path(
        name="Dynamic Programming Deep Dive",
        description="Master dynamic programming from basic concepts to advanced optimization techniques, covering all major DP patterns.",
        difficulty_level="Advanced",
        estimated_hours=60,
        tags="Dynamic Programming,DP,Optimization,Algorithms",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    dp_questions = [
        ("climbing-stairs", 1, "Basic DP - Fibonacci pattern", 15, 5),
        ("house-robber", 2, "1D DP with constraints", 20, 5),
        ("coin-change", 3, "Unbounded knapsack DP", 25, 5),
        ("longest-increasing-subsequence", 4, "LIS pattern", 30, 4),
        ("unique-paths", 5, "2D grid DP", 20, 4),
        ("edit-distance", 6, "String DP", 35, 5),
        ("word-break", 7, "DP with string matching", 25, 4),
        ("palindromic-substrings", 8, "Substring DP", 25, 4),
        ("longest-palindromic-subsequence", 9, "Subsequence DP", 30, 4),
        ("maximum-subarray", 10, "Kadane's algorithm", 20, 5),
        ("best-time-to-buy-and-sell-stock", 11, "State machine DP", 20, 5),
        ("partition-equal-subset-sum", 12, "0/1 Knapsack", 30, 4),
        ("longest-common-subsequence", 13, "Classic 2D DP", 25, 5),
        ("regular-expression-matching", 14, "Advanced string DP", 45, 4),
        ("burst-balloons", 15, "Interval DP", 45, 3),
    ]

    for slug, seq, notes, minutes, importance in dp_questions:
        try:
            add_question_to_path(dp_path.path_id, slug, seq, notes, minutes, importance)
        except Exception as e:
            logger.error(f"Failed to add {slug} to DP path: {e}")

    created_paths.append(dp_path)

    # Graph Algorithms Path
    graph_path = create_learning_path(
        name="Graph Algorithms Complete Guide",
        description="Comprehensive coverage of graph algorithms including DFS, BFS, shortest paths, and advanced graph theory concepts.",
        difficulty_level="Advanced",
        estimated_hours=45,
        tags="Graphs,DFS,BFS,Shortest Path,Algorithms",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    graph_questions = [
        ("number-of-islands", 1, "Basic DFS on 2D grid", 25, 5),
        ("clone-graph", 2, "Graph cloning with DFS/BFS", 25, 4),
        ("course-schedule", 3, "Cycle detection with DFS", 30, 5),
        ("course-schedule-ii", 4, "Topological sorting", 30, 5),
        ("pacific-atlantic-water-flow", 5, "Multi-source DFS", 35, 4),
        ("word-ladder", 6, "BFS shortest path", 35, 4),
        ("network-delay-time", 7, "Dijkstra's algorithm", 35, 4),
        (
            "cheapest-flights-within-k-stops",
            8,
            "Modified Dijkstra with constraints",
            40,
            4,
        ),
        ("alien-dictionary", 9, "Topological sort with custom ordering", 35, 4),
        ("minimum-spanning-tree", 10, "MST algorithms", 40, 3),
        ("critical-connections-in-a-network", 11, "Tarjan's bridge-finding", 45, 3),
        ("accounts-merge", 12, "Union-Find for connected components", 35, 4),
        ("graph-valid-tree", 13, "Tree validation in graphs", 25, 4),
        ("shortest-path-in-binary-matrix", 14, "BFS with obstacles", 25, 4),
        ("reconstruct-itinerary", 15, "Eulerian path", 35, 3),
    ]

    for slug, seq, notes, minutes, importance in graph_questions:
        try:
            add_question_to_path(
                graph_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Graph path: {e}")

    created_paths.append(graph_path)

    logger.info(f"Created {len(created_paths)} topic learning paths")
    return created_paths


def create_pattern_paths(creator_id):
    """Create pattern-based learning paths"""
    created_paths = []

    # LeetCode 101 Path
    leetcode_101_path = create_learning_path(
        name="LeetCode 101 - Algorithm Patterns",
        description="Based on the comprehensive LeetCode 101 guide, covering fundamental algorithm patterns and problem-solving techniques systematically.",
        difficulty_level="Beginner",
        estimated_hours=80,
        tags="LeetCode 101,Patterns,Fundamentals,Comprehensive",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    leetcode_101_questions = [
        # Greedy Algorithm
        ("assign-cookies", 1, "Greedy - Basic assignment problem", 15, 4),
        ("non-overlapping-intervals", 2, "Greedy - Interval scheduling", 25, 4),
        (
            "minimum-number-of-arrows-to-burst-balloons",
            3,
            "Greedy - Interval merging",
            25,
            4,
        ),
        # Binary Search
        ("binary-search", 4, "Binary Search - Template implementation", 15, 5),
        (
            "find-first-and-last-position-of-element-in-sorted-array",
            5,
            "Binary Search - Finding bounds",
            25,
            4,
        ),
        ("search-in-rotated-sorted-array", 6, "Binary Search - Rotated array", 30, 4),
        # Sort
        ("merge-intervals", 7, "Sorting - Interval merging", 25, 4),
        ("largest-number", 8, "Sorting - Custom comparator", 30, 3),
        # Dynamic Programming
        ("climbing-stairs", 9, "DP - Basic recursion to DP", 15, 5),
        ("triangle", 10, "DP - Path sum optimization", 20, 4),
        ("maximum-subarray", 11, "DP - Kadane's algorithm", 20, 5),
        ("house-robber", 12, "DP - Linear DP with constraints", 20, 4),
        ("coin-change", 13, "DP - Unbounded knapsack", 25, 5),
        ("word-break", 14, "DP - String partitioning", 25, 4),
        ("combination-sum-iv", 15, "DP - Counting combinations", 25, 4),
        ("house-robber-ii", 16, "DP - Circular array", 25, 4),
        ("best-time-to-buy-and-sell-stock", 17, "DP - State machine", 20, 5),
        ("longest-increasing-subsequence", 18, "DP - LIS pattern", 30, 4),
        ("partition-equal-subset-sum", 19, "DP - 0/1 knapsack", 30, 4),
        # Divide and Conquer
        ("maximum-subarray", 20, "D&C - Alternative to DP approach", 25, 3),
        ("majority-element", 21, "D&C - Boyer-Moore algorithm", 20, 4),
        # Search (DFS/BFS)
        ("max-area-of-island", 22, "DFS - 2D grid traversal", 25, 4),
        (
            "find-all-anagrams-in-a-string",
            23,
            "Sliding window - Pattern matching",
            25,
            4,
        ),
        ("pacific-atlantic-water-flow", 24, "DFS - Multi-source exploration", 35, 4),
    ]

    for slug, seq, notes, minutes, importance in leetcode_101_questions:
        try:
            add_question_to_path(
                leetcode_101_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to LeetCode 101 path: {e}")

    created_paths.append(leetcode_101_path)

    # Grokking Coding Interview Path
    grokking_path = create_learning_path(
        name="Grokking the Coding Interview Patterns",
        description="Systematic approach to coding interviews using pattern recognition. Master the 14 most important coding patterns for technical interviews.",
        difficulty_level="Intermediate",
        estimated_hours=70,
        tags="Grokking,Patterns,Interview,Systematic",
        source="System",
        creator_id=creator_id,
        is_public=True,
    )

    grokking_questions = [
        # Pattern 1: Sliding Window
        ("maximum-sum-subarray-of-size-k", 1, "Sliding Window - Fixed size", 20, 4),
        (
            "smallest-subarray-with-given-sum",
            2,
            "Sliding Window - Variable size",
            25,
            4,
        ),
        (
            "longest-substring-with-k-distinct-characters",
            3,
            "Sliding Window - K distinct",
            30,
            4,
        ),
        ("fruits-into-baskets", 4, "Sliding Window - At most 2 types", 25, 4),
        (
            "longest-substring-without-repeating-characters",
            5,
            "Sliding Window - No repeats",
            25,
            5,
        ),
        # Pattern 2: Two Pointers
        ("pair-with-target-sum", 6, "Two Pointers - Target sum", 15, 5),
        ("remove-duplicates", 7, "Two Pointers - In-place removal", 15, 4),
        ("squaring-a-sorted-array", 8, "Two Pointers - Merge technique", 20, 4),
        ("triplet-sum-to-zero", 9, "Two Pointers - 3Sum", 30, 5),
        ("triplet-sum-close-to-target", 10, "Two Pointers - Closest sum", 25, 4),
        # Pattern 3: Fast & Slow Pointers
        ("linkedlist-cycle", 11, "Fast Slow - Cycle detection", 20, 5),
        ("start-of-linkedlist-cycle", 12, "Fast Slow - Cycle start", 25, 4),
        ("happy-number", 13, "Fast Slow - Number cycle", 20, 4),
        ("middle-of-the-linkedlist", 14, "Fast Slow - Middle finding", 15, 4),
        # Pattern 4: Merge Intervals
        ("merge-intervals", 15, "Merge Intervals - Basic merging", 25, 5),
        ("insert-interval", 16, "Merge Intervals - Insert and merge", 25, 4),
        ("intervals-intersection", 17, "Merge Intervals - Intersection", 25, 4),
        ("conflicting-appointments", 18, "Merge Intervals - Conflict detection", 20, 4),
        # Pattern 5: Cyclic Sort
        ("cyclic-sort", 19, "Cyclic Sort - Basic implementation", 20, 4),
        ("find-the-missing-number", 20, "Cyclic Sort - Missing number", 15, 4),
        ("find-all-missing-numbers", 21, "Cyclic Sort - All missing", 20, 4),
    ]

    for slug, seq, notes, minutes, importance in grokking_questions:
        try:
            add_question_to_path(
                grokking_path.path_id, slug, seq, notes, minutes, importance
            )
        except Exception as e:
            logger.error(f"Failed to add {slug} to Grokking path: {e}")

    created_paths.append(grokking_path)

    logger.info(f"Created {len(created_paths)} pattern learning paths")
    return created_paths
