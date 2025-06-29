# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeetTrack is a comprehensive LeetCode progress tracking and learning path management system with curated company-specific, topic-specific, and pattern-based learning paths. It consists of a Flask backend with PostgreSQL database and a Next.js 15 frontend with terminal-themed UI.

## Development Commands

### Backend (Flask)
```bash
cd backend
source venv/bin/activate           # Activate virtual environment
pip install -r requirements.txt    # Install dependencies
flask db upgrade                   # Run database migrations
python scripts/populate_comprehensive_paths.py  # Populate learning paths
python app.py                      # Run development server (port 5000)
flask run                          # Alternative server command

# Database operations
flask db migrate -m "Description"  # Create new migration
flask db upgrade                   # Apply migrations
flask db downgrade                 # Rollback migrations

# Testing
pytest                             # Run all tests
pytest tests/test_api_endpoints.py # Run specific test file
pytest --cov=app                   # Run tests with coverage
```

### Frontend (Next.js)
```bash
cd frontend
npm install                        # Install dependencies
npm run dev                        # Run development server (port 3000)
npm run build                      # Build for production
npm run start                      # Run production server
npm run lint                       # Run ESLint
npx tsc --noEmit                   # Type check without building
```

### Full Development Environment
```bash
./run_dev.sh                       # Start both backend and frontend servers
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Press Ctrl+C to stop all servers
```

## Architecture Overview

### Backend Structure
- **Flask Application Factory Pattern**: App creation in `app/__init__.py`
- **SQLAlchemy ORM**: Database models in `app/models/`
- **JWT Authentication**: Token-based auth with Flask-JWT-Extended
- **Direct LeetCode GraphQL Integration**: Custom client in `app/utils/leetcode_graphql.py`
- **Comprehensive Learning Paths**: Company, topic, and pattern-based paths
- **Spaced Repetition System**: Review scheduling with confidence tracking

### Frontend Structure
- **Next.js 15 App Router**: File-based routing in `app/` directory
- **TypeScript**: Full type safety throughout
- **React Context**: Authentication state management in `app/context/AuthContext.tsx`
- **Terminal Theme**: Catppuccin color scheme with monospace fonts
- **API Integration**: Service layer in `app/services/api.ts`

### Key Models and Relationships
```
User -> UserQuestion (progress tracking)
User -> UserLearningPath (path enrollment)
User -> ReviewSchedule (spaced repetition)
LearningPath -> PathQuestion -> Question (path structure)
User -> UserPathQuestion (path-specific progress)
```

### API Endpoints Structure
- `/api/v1/auth/*` - Authentication (login, register, refresh)
- `/api/v1/leetcode/*` - LeetCode integration (daily question, user stats)
- `/api/v1/learning-paths/*` - Learning path management
- `/api/v1/admin/*` - Admin operations (path CRUD, bulk creation)
- `/api/v1/auth/user/*` - User profile and progress endpoints

## Development Guidelines

### Environment Setup
- Backend requires PostgreSQL database (AWS RDS in production)
- Environment variables managed via `.env` files (excluded from git)
- GitHub secrets used for production deployments:
  - `NEXT_PUBLIC_API_URL` should be `https://api.leettrack.app` (without `/api/v1`)
  - Backend CORS configured via `CORS_ORIGINS` environment variable

### Database Operations
- Always create migrations for schema changes: `flask db migrate -m "Description"`
- Use the population script for initial data: `python scripts/populate_comprehensive_paths.py`
- Admin user created automatically: `admin@leettrack.com` / `LeetTrack2024!`

### API Integration Patterns
- Frontend uses `buildApiUrl()` function from `app/config/api.ts`
- All API endpoints defined in `API_ENDPOINTS` constant
- Authentication via JWT tokens stored in localStorage and AuthContext
- Error handling with consistent response patterns

### Learning Path System
- **Company Paths**: Amazon, Meta, Uber interview preparation (15 questions each)
- **Topic Paths**: Binary Search, DP, Graphs (10-15 questions each)
- **Pattern Paths**: LeetCode 101 guide, Grokking patterns (20+ questions each)
- Admin can create, edit, delete paths via `/admin` dashboard
- Bulk creation endpoints for systematic path generation

### Testing Strategy
- Backend: pytest with coverage reporting
- Frontend: Type checking with TypeScript, linting with ESLint
- Live API testing script: `backend/test_api_live.py`
- Manual testing checklist in frontend README

### Common Issues and Solutions
- **CORS Errors**: Check `CORS_ORIGINS` in backend environment
- **Duplicate API Paths**: Ensure `NEXT_PUBLIC_API_URL` doesn't include `/api/v1`
- **Database Connection**: Verify PostgreSQL connection and migrations
- **Authentication**: Check JWT token handling in AuthContext

### Production Deployment
- Frontend: Vercel with GitHub Actions (`.github/workflows/frontend-deploy.yml`)
- Backend: EC2 with deployment script (`backend/deploy.sh`)
- CORS script for Vercel URLs: `backend/update_cors_for_vercel.sh`
- Environment-specific configurations in `app/config/config.py`

### Code Style and Patterns
- Backend: PEP 8, type hints, SQLAlchemy patterns
- Frontend: TypeScript strict mode, React functional components with hooks
- Consistent error handling and logging throughout
- Terminal-themed UI with Catppuccin colors and monospace fonts