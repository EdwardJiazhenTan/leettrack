#!/bin/bash

# LeetTrack Complete Database Setup Script
# Sets up PostgreSQL database with all 150 LeetCode questions and learning paths

set -e

# Default database configuration
DB_NAME=${DB_NAME:-"leettrack"}
DB_USER=${DB_USER:-"leettrack_user"}
DB_PASSWORD=${DB_PASSWORD:-"leettrack_password"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo "🚀 Setting up LeetTrack PostgreSQL database with 150 LeetCode questions..."

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on $DB_HOST:$DB_PORT"
    echo "Please start PostgreSQL first:"
    echo "  macOS (Homebrew): brew services start postgresql"
    echo "  Ubuntu: sudo service postgresql start"
    echo "  Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database and user (as current superuser)
SUPER_USER=${DB_SUPER_USER:-$(whoami)}
echo "📝 Creating database and user..."
psql -h $DB_HOST -p $DB_PORT -U $SUPER_USER -d postgres << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
EOF

echo "✅ Database '$DB_NAME' and user '$DB_USER' created"

# Run schema setup
echo "📋 Setting up database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/../schema/complete-schema.sql"

echo "✅ Database schema created"

# Load all 150 questions
echo "📚 Loading all 150 LeetCode questions..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/../seed/insert-all-150-questions.sql"

echo "✅ All 150 questions loaded"

# Create learning paths
echo "🛤️  Creating learning paths..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/../seed/create-top-interview-150-path.sql"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/../seed/create-graph-theory-path.sql"

echo "✅ Learning paths created"

# Display statistics
echo "📊 Database statistics:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT
    (SELECT COUNT(*) FROM questions) as total_questions,
    (SELECT COUNT(*) FROM questions WHERE difficulty = 'Easy') as easy_questions,
    (SELECT COUNT(*) FROM questions WHERE difficulty = 'Medium') as medium_questions,
    (SELECT COUNT(*) FROM questions WHERE difficulty = 'Hard') as hard_questions,
    (SELECT COUNT(*) FROM paths) as total_paths,
    (SELECT COUNT(DISTINCT tag) FROM question_tags) as unique_tags;
"

echo ""
echo "🎉 LeetTrack database setup complete!"
echo ""
echo "📋 What's included:"
echo "  • 150 LeetCode questions across all major categories"
echo "  • 22+ structured learning paths"
echo "  • Proper tags and difficulty classification"
echo "  • Progress tracking system"
echo ""
echo "Connection details:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo ""
echo "Connection URL for your .env.local:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\""
echo ""
echo "To connect manually:"
echo "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""
echo "🔥 Ready to start coding! Visit /questions to see all problems."
