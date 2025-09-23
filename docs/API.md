# LeetTrack API Documentation

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained through the login endpoint and should be included in all authenticated requests.

---

## Authentication & User Management

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "password123",
  "leetcode_username": "john_leetcode" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "user_id": "user_12345",
    "email": "user@example.com",
    "username": "john_doe",
    "leetcode_username": "john_leetcode",
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-15T10:00:00.000Z"
  },
  "token": "jwt_token_here",
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400`: Invalid input (missing fields, invalid email, weak password)
- `409`: Email or username already exists

---

### POST /api/auth/login
Authenticate user and obtain access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "user_id": "user_12345",
    "email": "user@example.com",
    "username": "john_doe",
    "leetcode_username": "john_leetcode",
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-15T10:00:00.000Z"
  },
  "token": "jwt_token_here",
  "message": "Login successful"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials

---

### POST /api/auth/logout
**Auth Required:** Yes

Invalidate the current session token.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### GET /api/auth/profile
**Auth Required:** Yes

Get current user's profile and statistics.

**Response (200):**
```json
{
  "user": {
    "user_id": "user_12345",
    "email": "user@example.com",
    "username": "john_doe",
    "leetcode_username": "john_leetcode",
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-15T10:00:00.000Z"
  },
  "stats": {
    "total_questions_attempted": 45,
    "total_questions_solved": 32,
    "easy_solved": 15,
    "medium_solved": 12,
    "hard_solved": 5,
    "current_streak": 7,
    "longest_streak": 14,
    "enrolled_paths": 3,
    "completed_paths": 1
  }
}
```

---

### PUT /api/auth/profile
**Auth Required:** Yes

Update user profile information.

**Request Body:**
```json
{
  "username": "new_username", // optional
  "email": "new@example.com", // optional
  "leetcode_username": "new_leetcode_user" // optional
}
```

**Response (200):**
```json
{
  "user_id": "user_12345",
  "email": "new@example.com",
  "username": "new_username",
  "leetcode_username": "new_leetcode_user",
  "created_at": "2025-01-15T10:00:00.000Z",
  "updated_at": "2025-01-15T11:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid email format
- `409`: Email or username already taken

---

## Question Management

### GET /api/questions
Search and filter questions with pagination.

**Query Parameters:**
- `query` (string): Search in title, description, tags
- `difficulty` (string): "Easy", "Medium", or "Hard"
- `tags` (string): Comma-separated tags
- `is_custom` (boolean): Filter custom vs LeetCode questions
- `created_by` (string): Filter by creator user ID
- `limit` (number): Results per page (max 100, default 20)
- `offset` (number): Pagination offset (default 0)
- `sort_by` (string): "title", "difficulty", "created_at", "updated_at"
- `sort_order` (string): "asc" or "desc"

**Example Request:**
```
GET /api/questions?difficulty=Easy&tags=Array,Hash Table&limit=10&sort_by=title&sort_order=asc
```

**Response (200):**
```json
{
  "questions": [
    {
      "id": "question_123",
      "leetcode_id": "1",
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "Easy",
      "description": "Given an array of integers...",
      "tags": ["Array", "Hash Table"],
      "url": "https://leetcode.com/problems/two-sum/",
      "is_custom": false,
      "created_by": "admin_user",
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0,
  "has_more": true
}
```

---

### POST /api/questions
**Auth Required:** Yes

Create a new custom question.

**Request Body:**
```json
{
  "title": "Custom Array Problem",
  "slug": "custom-array-problem",
  "difficulty": "Medium",
  "description": "Solve this custom array manipulation problem...",
  "tags": ["Array", "Two Pointers"],
  "url": "https://example.com/problem", // optional
  "leetcode_id": "123" // optional
}
```

**Response (201):**
```json
{
  "id": "question_456",
  "title": "Custom Array Problem",
  "slug": "custom-array-problem",
  "difficulty": "Medium",
  "description": "Solve this custom array manipulation problem...",
  "tags": ["Array", "Two Pointers"],
  "url": "https://example.com/problem",
  "is_custom": true,
  "created_by": "user_12345",
  "created_at": "2025-01-15T10:00:00.000Z",
  "updated_at": "2025-01-15T10:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid input (missing required fields, invalid slug format)
- `409`: Slug already exists

---

### GET /api/questions/[id]
Get a specific question by ID.

**Response (200):**
```json
{
  "id": "question_123",
  "leetcode_id": "1",
  "title": "Two Sum",
  "slug": "two-sum",
  "difficulty": "Easy",
  "description": "Given an array of integers...",
  "tags": ["Array", "Hash Table"],
  "url": "https://leetcode.com/problems/two-sum/",
  "is_custom": false,
  "created_by": "admin_user",
  "created_at": "2025-01-15T10:00:00.000Z",
  "updated_at": "2025-01-15T10:00:00.000Z"
}
```

**Error Responses:**
- `404`: Question not found

---

### PUT /api/questions/[id]
**Auth Required:** Yes

Update a question. Users can only update custom questions they created.

**Request Body:**
```json
{
  "title": "Updated Title", // optional
  "description": "Updated description", // optional
  "tags": ["Updated", "Tags"], // optional
  "difficulty": "Hard" // optional
}
```

**Response (200):**
```json
{
  "id": "question_456",
  "title": "Updated Title",
  "slug": "custom-array-problem",
  "difficulty": "Hard",
  "description": "Updated description",
  "tags": ["Updated", "Tags"],
  "is_custom": true,
  "created_by": "user_12345",
  "created_at": "2025-01-15T10:00:00.000Z",
  "updated_at": "2025-01-15T11:00:00.000Z"
}
```

**Error Responses:**
- `403`: Cannot edit questions you didn't create
- `404`: Question not found
- `409`: Slug already exists

---

### DELETE /api/questions/[id]
**Auth Required:** Yes

Delete a custom question. Users can only delete questions they created.

**Response (200):**
```json
{
  "message": "Question deleted successfully"
}
```

**Error Responses:**
- `403`: Cannot delete questions you didn't create
- `404`: Question not found

---

### GET /api/questions/stats
Get overall question statistics.

**Response (200):**
```json
{
  "total_questions": 2500,
  "easy_count": 850,
  "medium_count": 1200,
  "hard_count": 450,
  "custom_questions": 150,
  "leetcode_questions": 2350,
  "popular_tags": [
    { "tag": "Array", "count": 400 },
    { "tag": "Hash Table", "count": 250 },
    { "tag": "Dynamic Programming", "count": 200 }
  ]
}
```

---

## LeetCode Integration

### GET /api/leetcode/daily
Get today's LeetCode daily challenge.

**Response (200):**
```json
{
  "data": {
    "activeDailyCodingChallengeQuestion": {
      "date": "2025-01-15",
      "userStatus": "NotStarted",
      "link": "https://leetcode.com/problems/two-sum/",
      "question": {
        "acRate": 49.3,
        "difficulty": "Easy",
        "frontendQuestionId": "1",
        "title": "Two Sum",
        "titleSlug": "two-sum",
        "topicTags": [
          { "name": "Array", "id": "1", "slug": "array" }
        ]
      }
    }
  }
}
```

---

### GET /api/leetcode/question/[slug]
Get detailed question information from LeetCode.

**Response (200):**
```json
{
  "questionId": "1",
  "questionFrontendId": "1",
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "content": "<p>Given an array of integers...</p>",
  "difficulty": "Easy",
  "topicTags": [
    { "name": "Array", "slug": "array" }
  ],
  "codeSnippets": [
    {
      "lang": "JavaScript",
      "langSlug": "javascript",
      "code": "var twoSum = function(nums, target) {\n    \n};"
    }
  ]
}
```

---

### GET /api/leetcode/questions
Search LeetCode questions by tags and filters.

**Query Parameters:**
- `tags` (string): Comma-separated tags
- `difficulty` (string): "Easy", "Medium", "Hard"
- `limit` (number): Results limit (default 20, max 100)
- `skip` (number): Pagination offset

**Response (200):**
```json
{
  "total": 1500,
  "questions": [
    {
      "acRate": 49.3,
      "difficulty": "Easy",
      "frontendQuestionId": "1",
      "title": "Two Sum",
      "titleSlug": "two-sum",
      "topicTags": [
        { "name": "Array", "id": "1", "slug": "array" }
      ]
    }
  ]
}
```

---

### GET /api/leetcode/user/[username]
Get LeetCode user profile and statistics.

**Response (200):**
```json
{
  "user": {
    "username": "john_leetcode",
    "profile": {
      "realName": "John Doe",
      "ranking": 150000
    },
    "submitStats": {
      "acSubmissionNum": [
        { "difficulty": "All", "count": 85, "submissions": 150 }
      ]
    }
  },
  "allQuestionsCount": [
    { "difficulty": "Easy", "count": 850 }
  ]
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## Rate Limiting

API endpoints are subject to rate limiting:
- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **LeetCode Integration**: 50 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641981600
```