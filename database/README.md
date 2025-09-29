# LeetTrack Database Setup

This directory contains the PostgreSQL database schema and setup scripts for LeetTrack.

## Prerequisites

- PostgreSQL 12+ installed locally
- Node.js and npm (for running the application)

## Quick Setup

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
   cd database
   ./setup_complete.sh
   ```
   
   This will:
   - Create the database and user
   - Set up all tables and relationships
   - Load all 150 LeetCode questions
   - Create 22+ structured learning paths
   - Set up proper tags and categories

3. **Configure environment variables**:
   ```bash
   cd ..  # Back to project root
   cp .env.example .env.local
   ```
   
   The setup script will output the connection URL to add to your `.env.local`.

4. **Install dependencies** (if not done already):
   ```bash
   npm install
   ```

## Manual Setup

If you prefer to set up manually:

1. **Create database and user**:
   ```sql
   -- Connect as postgres superuser
   psql -U postgres
   
   -- Create user and database
   CREATE USER leettrack_user WITH PASSWORD 'leettrack_password';
   CREATE DATABASE leettrack OWNER leettrack_user;
   GRANT ALL PRIVILEGES ON DATABASE leettrack TO leettrack_user;
   ALTER USER leettrack_user CREATEDB;
   ```

2. **Run schema**:
   ```bash
   psql -U leettrack_user -d leettrack -f schema.sql
   ```

3. **Load sample data** (optional):
   ```bash
   psql -U leettrack_user -d leettrack -f sample_data.sql
   ```

## Database Schema

### Core Tables

- **`users`** - User accounts and authentication
- **`questions`** - LeetCode problems and custom questions
- **`question_tags`** - Tags for questions (many-to-many)
- **`paths`** - Learning paths created by users
- **`path_tags`** - Tags for paths (many-to-many)
- **`path_questions`** - Questions in paths with ordering

### Progress Tracking

- **`user_path_progress`** - User enrollment and completion of paths
- **`user_question_progress`** - Individual question progress within paths
- **`user_stats`** - Aggregated statistics for performance

### Key Features

- **UUID primary keys** for all tables
- **Automatic timestamps** with triggers
- **Foreign key constraints** for data integrity
- **Indexes** for query performance
- **Triggers** for automatic statistics updates
- **Check constraints** for data validation

## Complete Question Dataset

The database includes:

### 📚 **150 LeetCode Questions** organized in 22 categories:
- **Array / String** (24 questions) - Fundamental array and string operations
- **Two Pointers** (5 questions) - Efficient two-pointer technique
- **Sliding Window** (4 questions) - Window-based substring/subarray problems
- **Matrix** (5 questions) - 2D array manipulation and traversal
- **Hashmap** (9 questions) - Hash table applications and patterns
- **Intervals** (4 questions) - Interval merging and processing
- **Stack** (5 questions) - Stack-based parsing and validation
- **Linked List** (11 questions) - Comprehensive linked list operations
- **Binary Tree General** (14 questions) - Tree construction and traversal
- **Binary Tree BFS** (7 questions) - Level-order and BFS algorithms
- **Graph General** (6 questions) - Graph traversal and cycle detection
- **Graph BFS** (2 questions) - BFS applications in graphs
- **Trie** (3 questions) - Prefix tree implementation and usage
- **Backtracking** (7 questions) - Recursive exploration algorithms
- **Divide & Conquer** (4 questions) - Divide and conquer strategies
- **Kadane's Algorithm** (2 questions) - Maximum subarray problems
- **Binary Search** (7 questions) - Search and optimization techniques
- **Heap** (4 questions) - Priority queue applications
- **Bit Manipulation** (6 questions) - Bitwise operations and tricks
- **Math** (6 questions) - Mathematical problem solving
- **1D Dynamic Programming** (5 questions) - Foundation DP patterns
- **Multidimensional DP** (10 questions) - Advanced DP techniques

### 🛤️ **22+ Learning Paths** with:
- Structured progression from beginner to advanced
- Estimated completion times
- Proper difficulty classification
- Category-specific tags and organization

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

1. Create new migration files: `001_initial.sql`, `002_add_feature.sql`, etc.
2. Always include rollback scripts
3. Test migrations on a copy of production data
4. Document breaking changes

## Production Deployment

For cloud deployment (AWS RDS, Google Cloud SQL, etc.):

1. Use the schema.sql to set up production database
2. Update DATABASE_URL in production environment
3. Consider connection pooling for high traffic
4. Set up database backups
5. Monitor query performance with indexes

## Troubleshooting

**Connection issues:**
- Check PostgreSQL is running: `pg_isready`
- Verify port 5432 is open
- Check username/password in .env.local

**Permission errors:**
- Ensure leettrack_user has proper privileges
- Check database ownership

**Performance issues:**
- Monitor slow queries with `pg_stat_statements`
- Check if indexes are being used with `EXPLAIN`