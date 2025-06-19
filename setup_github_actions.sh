#!/bin/bash
# GitHub Actions Secrets Setup Script for LeetTrack

set -e

echo "🚀 Setting up GitHub Actions secrets for LeetTrack automated deployment..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   On Ubuntu/Debian: sudo apt install gh"
    echo "   On macOS: brew install gh"
    echo "   Or download from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "🔐 Please login to GitHub CLI first:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is available and authenticated"

# Vercel secrets (from your provided information and project config)
echo "📝 Setting Vercel deployment secrets..."
gh secret set VERCEL_TOKEN --body "gD1acrXA1kAjMryGx4xCZeLE"
gh secret set VERCEL_ORG_ID --body "team_robFgEY1EZIKjKG97oUgq3LI"
gh secret set VERCEL_PROJECT_ID --body "prj_6Nva1IwlZQDyESovoxUZ9eYpGbPY"

# API Configuration secrets
echo "🔗 Setting API configuration secrets..."
gh secret set API_BASE_URL --body "https://api.leettrack.app/api/v1"
gh secret set NEXT_PUBLIC_API_URL --body "https://api.leettrack.app/api/v1"

# EC2 deployment secrets (from your provided SSH details)
echo "🖥️ Setting EC2 deployment secrets..."
gh secret set EC2_HOST --body "ec2-44-205-249-75.compute-1.amazonaws.com"
gh secret set EC2_USER --body "ubuntu"

# For the SSH key, we need to read your PEM file
if [ -f "/home/ed/Documents/keys/LeetTrack.pem" ]; then
    echo "🔑 Setting SSH key from your PEM file..."
    cat "/home/ed/Documents/keys/LeetTrack.pem" | gh secret set EC2_SSH_KEY
    echo "✅ SSH key added successfully"
else
    echo "⚠️ SSH key file not found at /home/ed/Documents/keys/LeetTrack.pem"
    echo "Please set this secret manually:"
    echo "   cat path/to/your/LeetTrack.pem | gh secret set EC2_SSH_KEY"
fi

echo ""
echo "🎉 GitHub Actions secrets setup complete!"
echo ""
echo "📋 Secrets configured:"
echo "  ✅ VERCEL_TOKEN"
echo "  ✅ VERCEL_ORG_ID"
echo "  ✅ VERCEL_PROJECT_ID"
echo "  ✅ API_BASE_URL"
echo "  ✅ NEXT_PUBLIC_API_URL"
echo "  ✅ EC2_HOST"
echo "  ✅ EC2_USER"
if [ -f "/home/ed/Documents/keys/LeetTrack.pem" ]; then
    echo "  ✅ EC2_SSH_KEY"
else
    echo "  ⚠️ EC2_SSH_KEY (needs manual setup)"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Verify secrets in GitHub: Repository → Settings → Secrets and variables → Actions"
echo "2. Test the pipeline: git push origin main"
echo "3. Monitor deployment: GitHub → Actions tab"
echo ""
echo "🔧 Your workflow will now:"
echo "  • Run tests on every push/PR"
echo "  • Deploy frontend to Vercel on main branch"
echo "  • Deploy backend to EC2 on main branch"
echo "  • Update CORS automatically"
echo "  • Send deployment notifications" 