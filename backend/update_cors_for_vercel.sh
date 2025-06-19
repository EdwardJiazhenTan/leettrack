#!/bin/bash
# Update CORS configuration for Vercel deployment
# Usage: ./update_cors_for_vercel.sh "https://your-vercel-url.app"

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <vercel-url>"
    echo "Example: $0 https://leettrack-abc123.vercel.app"
    exit 1
fi

VERCEL_URL="$1"
ENV_FILE="/home/ubuntu/LeetTrack/backend/.env"

echo "🔄 Updating CORS configuration for Vercel URL: $VERCEL_URL"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env file not found at $ENV_FILE"
    exit 1
fi

# Remove any existing CORS_ORIGINS line
sed -i '/^CORS_ORIGINS=/d' "$ENV_FILE"

# Add the new CORS configuration with all necessary origins
echo "CORS_ORIGINS=https://leettrack-ruby.vercel.app,https://api.leettrack.app,$VERCEL_URL" >> "$ENV_FILE"

echo "✅ CORS configuration updated in $ENV_FILE"
echo "📝 Current CORS origins: https://leettrack-ruby.vercel.app,https://api.leettrack.app,$VERCEL_URL"

# Reload environment variables for current session
export CORS_ORIGINS="https://leettrack-ruby.vercel.app,https://api.leettrack.app,$VERCEL_URL"

echo "🔄 CORS configuration updated successfully!"
echo "Note: Backend service restart required to apply changes." 