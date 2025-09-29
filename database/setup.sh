#!/bin/bash

# LeetTrack Database Setup Script
# This script sets up a PostgreSQL database for LeetTrack

set -e

# Default database configuration
DB_NAME=${DB_NAME:-"leettrack"}
DB_USER=${DB_USER:-"leettrack_user"}
DB_PASSWORD=${DB_PASSWORD:-"leettrack_password"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo "🚀 Setting up LeetTrack PostgreSQL database..."

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

# Create database and user (as postgres superuser)
echo "📝 Creating database and user..."
psql -h $DB_HOST -p $DB_PORT -U postgres << EOF
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
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/schema.sql"

echo "✅ Database schema created"

# Ask if user wants to load sample data
read -p "📦 Load sample questions data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Loading sample data..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/sample_data.sql"
    echo "✅ Sample data loaded"
fi

echo ""
echo "🎉 LeetTrack database setup complete!"
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
