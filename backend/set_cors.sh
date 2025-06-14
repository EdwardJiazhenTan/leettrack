#!/bin/bash

# Script to set CORS origins for LeetTrack backend
# Usage: ./set_cors.sh "https://your-frontend.vercel.app,https://your-frontend.netlify.app"

if [ -z "$1" ]; then
    echo "❌ Usage: $0 'https://your-frontend-domain.com,https://another-domain.com'"
    echo "Example: $0 'https://leettrack.vercel.app,https://www.leettrack.com'"
    exit 1
fi

CORS_ORIGINS="$1"

echo "🔧 Setting CORS origins to: $CORS_ORIGINS"

# Update .env file
if [ -f ".env" ]; then
    # Remove existing CORS_ORIGINS line
    sed -i '/^CORS_ORIGINS=/d' .env
    # Add new CORS_ORIGINS line
    echo "CORS_ORIGINS=$CORS_ORIGINS" >> .env
    echo "✅ Updated .env file"
else
    # Create .env file
    echo "CORS_ORIGINS=$CORS_ORIGINS" > .env
    echo "✅ Created .env file"
fi

# Export for current session
export CORS_ORIGINS="$CORS_ORIGINS"

echo "🚀 CORS origins set successfully!"
echo "📝 Don't forget to restart your backend service:"
echo "   sudo systemctl restart leettrack-backend"
echo "   OR"
echo "   pkill -f gunicorn && gunicorn --config gunicorn.conf.py wsgi:app" 