#!/bin/bash
# Development setup script for LeetTrack backend
# This mirrors the CI/CD process for consistent local development

set -e

echo "🚀 Setting up LeetTrack Backend Development Environment..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📝 Please edit .env file with your configuration"
    else
        echo "❌ .env.example not found. Please create .env manually."
    fi
fi

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database configuration"
echo "2. Run database migrations: flask db upgrade"
echo "3. Start development server: python app.py"
echo "4. Or start with gunicorn: gunicorn --config gunicorn.conf.py wsgi:app" 