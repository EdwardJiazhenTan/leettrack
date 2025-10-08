# LeetTrack Database

This directory contains the PostgreSQL database schema and setup scripts for LeetTrack.

## Directory Structure

```
database/
├── schema/              # Database schema definitions
│   └── complete-schema.sql
├── seed/                # Seed data for production
│   ├── insert-all-150-questions.sql
│   ├── create-top-interview-150-path.sql
│   └── create-graph-theory-path.sql
├── migrations/          # Database migrations
│   └── add_user_settings.sql
├── setup/               # Setup scripts
│   └── setup_complete.sh
└── utils/               # Utility scripts
    └── generate_questions.py
```

## Prerequisites

- PostgreSQL 12+ installed locally (or Neon/cloud PostgreSQL)
- Node.js and npm (for running the application)

## Quick Setup (Local Development)

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS (Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo service postgresql start
   
   # Docker (alternative)
   docker run --name leettrack-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

2. **Run the complete setup script**:
   ```bash
   cd database/setup
   ./setup_complete.sh
   ```
   
   This will:
   - Create the database and user
   - Set up all tables and relationships
   - Load seed data with questions and learning paths

3. **Configure environment variables**:
   ```bash
   cd ../..  # Back to project root
   cp .env.example .env.local
   ```
   
   The setup script will output the connection URL to add to your `.env.local`.

4. **Install dependencies** (if not done already):
   ```bash
   npm install
   ```

## Production Setup (Neon/Cloud PostgreSQL)

1. **Create database schema**:
   ```bash
   psql <your-neon-connection-string> -f database/schema/complete-schema.sql
   ```

2. **Load seed data** (optional but recommended):
   ```bash
   # Load all 150 LeetCode questions
   psql <your-neon-connection-string> -f database/seed/insert-all-150-questions.sql
   
   # Create learning paths
   psql <your-neon-connection-string> -f database/seed/create-top-interview-150-path.sql
   psql <your-neon-connection-string> -f database/seed/create-graph-theory-path.sql
   ```

3. **Update environment variables**:
   ```bash
   # Add to .env.local or production environment
   DATABASE_URL=<your-neon-connection-string>
   ```

## Database Schema

### Core Tables

- **`users`** - User accounts and authentication
- **`questions`** - LeetCode problems and custom questions
- **`question_tags`** - Tags for questions (many-to-many)
- **`learning_paths`** - Learning paths created by users
- **`path_tags`** - Tags for paths (many-to-many)
- **`path_questions`** - Questions in paths with ordering

### Progress Tracking

- **`user_path_enrollments`** - User enrollment and completion of paths
- **`user_question_progress`** - Individual question progress within paths
- **`daily_study_plans`** - Daily recommendations for users
- **`daily_recommendations`** - Question recommendations
- **`user_settings`** - User preferences

### Key Features

- **UUID primary keys** for all tables
- **Automatic timestamps** with triggers
- **Foreign key constraints** for data integrity
- **Indexes** for query performance
- **Check constraints** for data validation

## Seed Data

### Available Learning Paths

1. **Top Interview 150** (37 questions shown in script, complete version has 150)
   - Difficulty: Intermediate
   - Estimated: 100 hours
   - LeetCode's curated interview questions

2. **Graph Theory** (37 questions)
   - Difficulty: Intermediate
   - Estimated: 40 hours
   - DFS, BFS, topological sort, shortest paths, Union-Find

### Question Database

The seed data includes 150+ LeetCode questions organized by topics:
- Array/String, Two Pointers, Sliding Window
- Graph Theory, Trees, Linked Lists
- Dynamic Programming, Backtracking
- And more...

## Connection Testing

After setup, test your connection:

```bash
# Using psql
psql -U leettrack_user -d leettrack -c "SELECT COUNT(*) FROM questions;"

# Or using the application
npm run dev
# Check that questions load on /questions page
```

## Migration Strategy

For future schema changes:

1. Create new migration files in `migrations/` directory
2. Use descriptive names: `YYYY-MM-DD_feature_name.sql`
3. Always include rollback capability
4. Test migrations on a copy of production data
5. Document breaking changes

### Running Migrations

```bash
psql <connection-string> -f database/migrations/add_user_settings.sql
```

## Troubleshooting

**Connection issues:**
- Check PostgreSQL is running: `pg_isready`
- Verify port 5432 is open
- Check username/password in .env.local

**Permission errors:**
- Ensure database user has proper privileges
- Check database ownership

**Performance issues:**
- Monitor slow queries with `pg_stat_statements`
- Check if indexes are being used with `EXPLAIN`
- Review query plans for optimization

## Development Tools

### Generate Questions Script

Use `utils/generate_questions.py` to generate question seed data from LeetCode study plans:

```bash
cd database/utils
python generate_questions.py
```

## Version Control

All SQL files in this directory are safe to commit to version control as they contain:
- Schema definitions (public knowledge)
- LeetCode question metadata (public data)
- Learning path structures (application content)

**Do NOT commit:**
- Database dumps with user data
- Production connection strings with credentials
- `.env` files
