#!/bin/bash
# LeetTrack Backend Deployment Script for EC2

set -e  # Exit on any error

echo "🚀 Starting LeetTrack Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    echo -e "${RED}❌ This script should be run as ubuntu user${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found! Please create it first.${NC}"
    echo "Example .env file:"
    echo "FLASK_ENV=production"
    echo "DATABASE_URL=postgresql://username:password@host:port/database"
    echo "SECRET_KEY=your-secret-key"
    echo "JWT_SECRET_KEY=your-jwt-secret-key"
    echo "CORS_ORIGINS=https://your-frontend-domain.com"
    exit 1
fi

echo -e "${GREEN}✅ Found .env file${NC}"

# Load environment variables
export $(cat .env | xargs)

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Run database migrations
echo -e "${YELLOW}🗄️ Running database migrations...${NC}"
flask db upgrade

# Test the application
echo -e "${YELLOW}🧪 Testing application...${NC}"
python -c "from wsgi import app; print('✅ Application imports successfully')"

echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test with: gunicorn --config gunicorn_simple.conf.py wsgi:app"
echo "2. Set up systemd service for production"
echo "3. Configure Nginx reverse proxy (optional)"

echo -e "${GREEN}🚀 Ready for production!${NC}" 