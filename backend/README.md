# LeetTrack Backend

Flask-based REST API backend for LeetTrack application with JWT authentication, PostgreSQL database, and direct LeetCode GraphQL integration.

## 🏗️ Architecture Overview

```
backend/
├── app.py                 # Flask application entry point
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── migrations/           # Database migration files (Alembic)
├── instance/            # Flask instance folder (ignored)
└── app/                 # Main application package
    ├── __init__.py      # Flask app factory and configuration
    ├── config/          # Configuration management
    ├── models/          # SQLAlchemy database models
    ├── routes/          # API route handlers
    └── utils/           # Utility functions and helpers
```

## 🛠️ Tech Stack

- **Framework**: Flask 2.3.3 with Flask-RESTful
- **Database**: PostgreSQL (AWS RDS) with SQLAlchemy ORM
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **Migrations**: Flask-Migrate (Alembic)
- **API Integration**: Custom GraphQL client for LeetCode
- **CORS**: Flask-CORS for cross-origin requests
- **Environment**: python-dotenv for configuration

## 📁 Directory Structure

### `/app/config/`

Configuration management and environment-specific settings.

```python
config/
└── config.py           # Environment configurations (Dev, Prod, Test)
```

**Key Features:**

- Environment-based configuration (development, production, testing)
- Database connection management
- JWT token configuration
- Spaced repetition algorithm settings

### `/app/models/`

SQLAlchemy database models representing the application's data structure.

```python
models/
├── __init__.py         # Model imports and database initialization
├── user.py            # User authentication and profile
├── question.py        # LeetCode problem metadata
├── learning_path.py   # Curated learning paths
├── path_question.py   # Questions within learning paths
├── user_learning_path.py    # User enrollment in paths
├── user_path_question.py    # User progress on path questions
├── user_question.py   # User progress on individual questions
├── review_schedule.py # Spaced repetition scheduling
└── scheduled_review.py # Individual review sessions
```

**Database Schema:**

- **Users**: Authentication, profiles, preferences
- **Questions**: LeetCode problems with metadata
- **Learning Paths**: Curated problem collections (e.g., NeetCode 75)
- **Progress Tracking**: User completion and performance data
- **Review System**: Spaced repetition scheduling

### `/app/routes/`

API endpoint handlers organized by functionality.

```python
routes/
├── index.py           # Health check and root endpoints
├── auth_routes.py     # User registration and authentication
├── leetcode_routes.py # LeetCode data integration
├── learning_paths_routes.py # Learning path management
└── debug_routes.py    # Development and debugging endpoints
```

**API Endpoints:**

#### Authentication (`/api/v1/auth/`)

- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /refresh` - JWT token refresh

#### LeetCode Integration (`/api/v1/leetcode/`)

- `GET /daily-question` - Daily coding challenge
- `GET /user/<username>` - User profile and statistics
- `GET /problem/<slug>` - Specific problem details
- `GET /problems` - Problem list with filters

#### Learning Paths (`/api/v1/learning-paths/`)

- `GET /` - List all public learning paths
- `GET /<id>` - Get specific path with questions
- `POST /` - Create new learning path (authenticated)
- `POST /<id>/questions` - Add question to path (authenticated)

#### User Progress (`/api/v1/user/`)

- `GET /learning-paths` - User's enrolled paths
- `POST /learning-paths/<id>/enroll` - Enroll in learning path
- `GET /progress` - User progress statistics

### `/app/utils/`

Utility functions and helper modules.

```python
utils/
├── auth.py            # Authentication helpers
├── leetcode_api.py    # Legacy external API client
├── leetcode_graphql.py # Direct GraphQL integration
└── learning_paths.py  # Learning path management utilities
```

**Key Utilities:**

#### `leetcode_graphql.py`

- **LeetCodeGraphQLClient**: Direct GraphQL integration with LeetCode
- **Caching System**: In-memory caching for optimal performance
- **Error Handling**: Comprehensive network and API error management
- **Rate Limiting**: Respectful request spacing

#### `learning_paths.py`

- **Path Creation**: Utilities for creating and managing learning paths
- **Question Integration**: Automatic question fetching and validation
- **NeetCode 75**: Pre-built path with 148 problems across 18 categories

#### `auth.py`

- **Password Hashing**: Secure password management with bcrypt
- **JWT Helpers**: Token generation and validation utilities

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL database (AWS RDS configured)
- Virtual environment (recommended)

### Installation

1. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Environment setup**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Database migration**

```bash
flask db upgrade
```

5. **Run development server**

```bash
python app.py
# or
flask run
```

Server will be available at `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- **Database**: PostgreSQL connection settings
- **JWT**: Secret keys and token expiration
- **Flask**: Debug mode and secret key
- **External APIs**: LeetCode integration settings

### Database Migrations

```bash
# Create new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Downgrade (if needed)
flask db downgrade
```

## 🧪 API Testing

### Health Check

```bash
curl http://localhost:5000/api/v1/ping
```

### Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

### LeetCode Data

```bash
# Daily question
curl http://localhost:5000/api/v1/leetcode/daily-question

# User profile
curl http://localhost:5000/api/v1/leetcode/user/uwi
```

## 🏛️ Architecture Decisions

### Direct GraphQL Integration

- **Why**: Eliminates external API rate limiting (60 req/hour)
- **How**: Custom GraphQL client with caching
- **Benefits**: Better performance, reliability, and control

### JWT Authentication

- **Stateless**: No server-side session storage
- **Scalable**: Easy horizontal scaling
- **Secure**: Industry-standard token-based auth

### PostgreSQL + SQLAlchemy

- **Relational**: Complex relationships between entities
- **ACID**: Data consistency and integrity
- **Migrations**: Version-controlled schema changes

## 🔍 Debugging

### Debug Routes (`/api/v1/debug/`)

Available in development mode:

- `GET /db-status` - Database connection status
- `GET /models` - Database model information
- `GET /cache-stats` - GraphQL client cache statistics

### Logging

- Flask development server provides detailed request logs
- Database queries logged in debug mode
- GraphQL requests and responses logged

## 📊 Performance

### Caching Strategy

- **Daily Questions**: 1 hour cache
- **User Profiles**: 15 minutes cache
- **Problem Lists**: 30 minutes cache
- **Individual Problems**: 1 hour cache

### Database Optimization

- Indexed foreign keys for fast joins
- Efficient query patterns in SQLAlchemy
- Connection pooling for concurrent requests

## 🔐 Security

### Authentication

- Password hashing with bcrypt
- JWT tokens with expiration
- Protected routes with decorators

### Database

- SQL injection prevention with SQLAlchemy ORM
- Environment-based configuration
- Secure connection to AWS RDS

### CORS

- Configured for frontend origin
- Credentials support for authenticated requests
