# LeetTrack - Structured LeetCode Learning Platform

## Overview

A learning management system for developers to master coding interviews through structured, admin-curated learning paths and personalized daily study plans.

### Key Features
- Admin-curated learning paths with quality-controlled curriculum
- Multi-path enrollment for simultaneous learning tracks
- Personalized daily planning with custom quotas for new problems and reviews
- Smart recommendation engine for daily study sessions
- Spaced repetition system for optimized review scheduling
- Comprehensive progress analytics across all enrolled paths
- Seamless LeetCode integration with official data sync

## Architecture

### Technology Stack
- Backend: Next.js API Routes with TypeScript
- Database: PostgreSQL (planned) / Mock Storage (current)
- External API: LeetCode GraphQL
- Frontend: Next.js React (planned)
- Testing: Jest with comprehensive test coverage

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LeetCode      │    │   LeetTrack      │    │   Admin         │
│   GraphQL API   │◄──►│   Backend        │◄──►│   Dashboard     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   User           │
                       │   Dashboard      │
                       └──────────────────┘
```

## Database Schema

### Core Entities

#### Users
```sql
users (
  user_id: UUID PRIMARY KEY,
  email: VARCHAR UNIQUE,
  username: VARCHAR UNIQUE,
  leetcode_username: VARCHAR,
  password_hash: VARCHAR,
  is_admin: BOOLEAN DEFAULT FALSE,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### Learning Paths (Admin-Created)
```sql
learning_paths (
  path_id: UUID PRIMARY KEY,
  title: VARCHAR,
  description: TEXT,
  difficulty_level: ENUM('Beginner', 'Intermediate', 'Advanced'),
  estimated_duration_days: INTEGER,
  is_active: BOOLEAN DEFAULT TRUE,
  created_by: UUID REFERENCES users(user_id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### Questions
```sql
questions (
  question_id: UUID PRIMARY KEY,
  leetcode_id: VARCHAR UNIQUE,
  title: VARCHAR,
  slug: VARCHAR UNIQUE,
  difficulty: ENUM('Easy', 'Medium', 'Hard'),
  description: TEXT,
  tags: TEXT[], -- Array of topic tags
  url: VARCHAR,
  is_custom: BOOLEAN DEFAULT FALSE,
  created_by: UUID REFERENCES users(user_id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### Path Questions (Ordered Curriculum)
```sql
path_questions (
  path_question_id: UUID PRIMARY KEY,
  path_id: UUID REFERENCES learning_paths(path_id),
  question_id: UUID REFERENCES questions(question_id),
  order_index: INTEGER, -- Sequence within path
  is_required: BOOLEAN DEFAULT TRUE,
  created_at: TIMESTAMP
)
```

#### User Path Enrollments
```sql
user_path_enrollments (
  enrollment_id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(user_id),
  path_id: UUID REFERENCES learning_paths(path_id),
  enrolled_at: TIMESTAMP,
  is_active: BOOLEAN DEFAULT TRUE,
  completion_percentage: DECIMAL(5,2) DEFAULT 0.00,
  estimated_completion_date: DATE
)
```

#### User Question Progress
```sql
user_question_progress (
  progress_id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(user_id),
  question_id: UUID REFERENCES questions(question_id),
  path_id: UUID REFERENCES learning_paths(path_id), -- Which path context
  status: ENUM('not_started', 'in_progress', 'completed', 'needs_review'),
  first_attempted_at: TIMESTAMP,
  last_attempted_at: TIMESTAMP,
  completed_at: TIMESTAMP,
  next_review_date: DATE,
  review_count: INTEGER DEFAULT 0,
  difficulty_rating: INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  notes: TEXT,
  wants_review: BOOLEAN DEFAULT FALSE -- User preference
)
```

#### Daily Study Plans
```sql
daily_study_plans (
  plan_id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(user_id),
  date: DATE,
  target_new_questions: INTEGER DEFAULT 0,
  target_review_questions: INTEGER DEFAULT 0,
  actual_new_completed: INTEGER DEFAULT 0,
  actual_review_completed: INTEGER DEFAULT 0,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

#### Daily Recommendations
```sql
daily_recommendations (
  recommendation_id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(user_id),
  date: DATE,
  question_id: UUID REFERENCES questions(question_id),
  path_id: UUID REFERENCES learning_paths(path_id),
  recommendation_type: ENUM('new', 'review'),
  priority_score: DECIMAL(3,2), -- Algorithm-generated priority
  is_completed: BOOLEAN DEFAULT FALSE,
  created_at: TIMESTAMP
)
```

## Current API Endpoints

### Authentication & User Management
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User authentication
POST   /api/auth/logout            # User logout
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update user profile
```

### Question Management
```
GET    /api/questions              # Search/filter questions
POST   /api/questions              # Create custom question
GET    /api/questions/[id]         # Get specific question
PUT    /api/questions/[id]         # Update question
DELETE /api/questions/[id]         # Delete question
GET    /api/questions/stats        # Question statistics
```

### LeetCode Integration
```
GET    /api/leetcode/daily         # Get daily LeetCode challenge
GET    /api/leetcode/question/[slug] # Get question by slug
GET    /api/leetcode/questions     # Search questions by tags
GET    /api/leetcode/user/[username] # Get user LeetCode profile
```

## Development Status

### Completed Features
- User authentication and management system
- Question CRUD operations with search and filtering
- LeetCode GraphQL integration (daily challenges, question search, user profiles)
- Comprehensive test suite (101 tests across 12 suites)
- Mock data layer for rapid development

### Next Phase: Learning Path System
- Database migration from mock storage to PostgreSQL
- Admin learning path creation and management
- User path enrollment and progress tracking
- Daily planning and recommendation system

## Project Structure

```
/app/api/          # Next.js API routes
/lib/              # Shared utilities and services
/types/            # TypeScript type definitions
/docs/             # Project documentation
/__tests__/        # Test suites
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd leettrack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npm test
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/leettrack
NEXTAUTH_SECRET=your-secret-key
LEETCODE_API_KEY=optional-api-key
```

**LeetTrack** - Structured learning for coding interview success