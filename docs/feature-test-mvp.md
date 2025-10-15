# Topic-Based Testing Feature - MVP

## Overview
This document describes the initial implementation of a topic-based testing feature that allows users to take timed tests on specific topics.

## Feature Requirements
- Users select a topic (e.g., Binary Search, Dynamic Programming)
- System presents 5 questions in order: Easy, Easy, Medium, Medium, Hard
- Each question has a 25-minute time limit
- Scoring: 1 point per question completed within time limit
- Scores stored as user attributes (e.g., `binary_search_score`, `dp_score`)
- MVP: No database persistence, testing API integration first

## Phase 1: Backend API Testing ✅

### Implemented
Created a backend route to test fetching random questions by topic and difficulty from LeetCode API.

**Endpoint:** `GET /api/test/random-question`

**Query Parameters:**
- `topic`: string (e.g., "binary-search", "dynamic-programming", "graph")
- `difficulty`: "Easy" | "Medium" | "Hard"

**Features:**
- Fetches up to 100 questions from LeetCode GraphQL API
- Filters out paid-only questions
- Randomly selects one question from available pool
- Returns question details and metadata

**Response Example:**
```json
{
  "success": true,
  "question": {
    "id": "322",
    "title": "Coin Change",
    "titleSlug": "coin-change",
    "difficulty": "Medium",
    "url": "https://leetcode.com/problems/coin-change/",
    "acRate": 47.32,
    "topicTags": [
      {"name": "Array", "slug": "array"},
      {"name": "Dynamic Programming", "slug": "dynamic-programming"},
      {"name": "Breadth-First Search", "slug": "breadth-first-search"}
    ],
    "hasSolution": true,
    "hasVideoSolution": true
  },
  "metadata": {
    "topic": "dynamic-programming",
    "difficulty": "Medium",
    "totalAvailable": 88,
    "totalWithPaid": 306
  }
}
```

### Test Results

| Topic | Difficulty | Free Questions Available |
|-------|-----------|-------------------------|
| Binary Search | Easy | 27 |
| Dynamic Programming | Medium | 88 |
| Graph | Hard | 73 |

**Findings:**
- ✅ LeetCode API successfully returns questions by topic and difficulty
- ✅ Good variety of free questions available across topics
- ✅ Random selection works correctly
- ✅ API response includes all necessary metadata
- ⚠️ Invalid topics return all questions (no error) - may need client-side validation

## Next Steps (Phase 2)

### 1. Test Session State Management
- Create in-memory session tracking
- Track current question number (1-5)
- Track start time for each question
- Track score

### 2. Timer Implementation
- Frontend: 25-minute countdown timer
- Backend: Verify submission is within time limit
- Auto-advance to next question or end test when time expires

### 3. Test Flow API
Create endpoints:
- `POST /api/test/start` - Initialize test session
- `GET /api/test/current` - Get current question
- `POST /api/test/submit` - Submit answer and move to next question
- `GET /api/test/results` - Get final score

### 4. Frontend UI
- Topic selection page
- Test interface with:
  - Question display
  - Timer countdown
  - Submit button
  - Progress indicator (Question 1 of 5)
- Results page showing score

### 5. Database Schema (Future)
```sql
CREATE TABLE user_test_scores (
  user_id UUID,
  topic VARCHAR(50),
  score INTEGER,
  max_score INTEGER DEFAULT 5,
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, topic, completed_at)
);
```

## Common LeetCode Topics

Valid topic slugs for the API:
- `binary-search`
- `dynamic-programming`
- `graph`
- `array`
- `hash-table`
- `tree`
- `linked-list`
- `backtracking`
- `greedy`
- `depth-first-search`
- `breadth-first-search`
- `sorting`
- `sliding-window`
- `two-pointers`

## Technical Notes

### LeetCode API Integration
Using existing `getQuestionsByTag()` function from `lib/leetcode-client.ts`:
- Supports filtering by tags (topics) and difficulty
- Returns up to 100 questions per request
- Includes question metadata (tags, AC rate, solutions availability)

### Limitations
- LeetCode API rate limiting (unknown limits)
- Some topics have limited free questions
- Cannot verify actual LeetCode submissions programmatically
- Timer/scoring must be managed on our end

## Git Branch
Working on: `feature-test`
