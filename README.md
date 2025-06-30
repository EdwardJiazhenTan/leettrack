# [🌐 LeetTrack.app](https://leettrack.app)

A comprehensive LeetCode progress tracking and learning path management system with curated company-specific, topic-specific, and pattern-based learning paths.

## 🚀 How to Run

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup database
export DATABASE_URL="postgresql://username:password@localhost/leettrack"
export JWT_SECRET_KEY="your-secret-key"
export FLASK_ENV="development"
flask db upgrade

# Populate learning paths
python scripts/populate_comprehensive_paths.py

# Start server
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

### Quick Start (Both servers)
```bash
./run_dev.sh
```

## 🚀 How to Deploy

### Production Environment Variables
```bash
# Backend
export FLASK_ENV="production"
export DATABASE_URL="postgresql://user:pass@prod-db:5432/leettrack"
export JWT_SECRET_KEY="secure-random-key"
export CORS_ORIGINS="https://your-domain.com"

# Frontend
export NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

### Backend Deployment (EC2)
```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

### Frontend Deployment (Vercel)
- Push to main branch (GitHub Actions will auto-deploy)
- Or manually: `npx vercel --prod`

## 📸 Screenshots & Examples

### Homepage - Terminal-Inspired Interface
![Homepage Screenshot](screenshots/screenshots1.png)

### Learning Paths - Structured Learning
![Learning Paths Screenshot](screenshots/screenshot2.png)

### Profile Dashboard - Progress Analytics
![Profile Dashboard Screenshot](screenshots/screenshot3.png)

## 🎯 Learning Path Examples

### Company Interview Preparation
- **Amazon Interview Prep**: Leadership principles, system design (15 questions)
- **Meta Interview Prep**: Social graph algorithms, optimization (15 questions)
- **Uber Interview Prep**: Geolocation algorithms, real-time processing (15 questions)

### Topic Mastery
- **Binary Search Mastery**: Basic to advanced applications (10 questions)
- **Dynamic Programming**: All major DP patterns (15 questions)
- **Graph Algorithms**: DFS, BFS, shortest paths (15 questions)

### Pattern Recognition
- **LeetCode 101 Patterns**: Fundamental algorithm patterns (24 questions)
- **Grokking Interview Patterns**: 14 essential coding patterns (21 questions)