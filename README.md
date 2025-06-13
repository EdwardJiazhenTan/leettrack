# LeetTrack

A comprehensive LeetCode progress tracking and learning path management system with curated company-specific, topic-specific, and pattern-based learning paths.

## 🚀 Features

### Core Features

- **User Management**: Secure registration, login, and profile management
- **LeetCode Integration**: Sync and track your LeetCode progress automatically
- **Progress Analytics**: Detailed statistics and progress visualization
- **Learning Path System**: Curated learning paths for systematic preparation

### Enhanced Learning Paths (NEW)

- **Company-Specific Paths**: Amazon, Meta, Uber interview preparation tracks
- **Topic-Specific Paths**: Binary Search, Dynamic Programming, Graph Algorithms
- **Pattern-Based Paths**: LeetCode 101 guide and Grokking the Coding Interview patterns
- **Admin Management**: Full CRUD operations with drag-and-drop question reordering
- **Scalable Architecture**: Template-based path creation system

## 📸 Screenshots

### Homepage - Welcome Interface

![Homepage Screenshot](screenshots/screenshots1.png)
_Clean, terminal-inspired homepage with cyberpunk aesthetics and intuitive navigation_

### Learning Paths - Structured Learning

![Learning Paths Screenshot](screenshots/screenshot2.png)
_Comprehensive learning paths with company-specific, topic-based, and pattern-focused tracks_

### Profile Dashboard - Progress Tracking

![Profile Dashboard Screenshot](screenshots/screenshot3.png)
_Detailed progress analytics with beautiful visualizations and performance metrics_

## 🎯 Learning Path Categories

### 🏢 Company Interview Preparation

- **Amazon Interview Prep - 30 Days**: Leadership principles, system design thinking, practical problem-solving (15 questions)
- **Meta Interview Prep - 30 Days**: Social graph algorithms, optimization, scalable design patterns (15 questions)
- **Uber Interview Prep - 30 Days**: Geolocation algorithms, real-time data processing, optimization (15 questions)

### 📖 Topic Mastery

- **Binary Search Mastery**: From basic implementation to advanced applications (10 questions)
- **Dynamic Programming Deep Dive**: All major DP patterns and optimization techniques (15 questions)
- **Graph Algorithms Complete Guide**: DFS, BFS, shortest paths, advanced graph theory (15 questions)

### 🎯 Pattern Recognition

- **LeetCode 101 - Algorithm Patterns**: Systematic coverage of fundamental patterns (24 questions)
- **Grokking the Coding Interview Patterns**: 14 most important coding patterns (21 questions)

## 🛠️ Tech Stack

### Backend

- **Flask**: Python web framework
- **PostgreSQL**: Primary database
- **SQLAlchemy**: ORM and database management
- **Flask-JWT-Extended**: Authentication and authorization
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Migrate**: Database migrations

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Catppuccin Theme**: Beautiful, consistent color scheme

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+

### Backend Setup

1. **Clone and navigate**

```bash
git clone https://github.com/your-repo/leettrack.git
cd leettrack/backend
```

2. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Setup database**

```bash
# Create PostgreSQL database
createdb leettrack

# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost/leettrack"
export JWT_SECRET_KEY="your-secret-key"
export FLASK_ENV="development"

# Run migrations
flask db upgrade
```

5. **Populate learning paths**

```bash
python scripts/populate_comprehensive_paths.py
```

6. **Start backend server**

```bash
python run.py
```

### Frontend Setup

1. **Navigate to frontend**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

## 🔧 Administration

### Admin Dashboard Features

- **Path Management**: Create, edit, delete, and toggle learning paths
- **Bulk Creation**: One-click creation of company, topic, or pattern paths
- **Question Management**: Add, remove, and reorder questions with drag-and-drop
- **Real-time Updates**: Live statistics and progress tracking
- **User-Friendly Interface**: Terminal-inspired design with Catppuccin colors

### Admin Access

1. Log in with admin credentials (created during population script)
2. Visit `/admin` for the main dashboard
3. Use `/admin/paths/{id}` for detailed path editing

### API Endpoints

#### Public Endpoints

```http
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
GET  /api/v1/learning-paths    # List public learning paths
```

#### Protected Endpoints

```http
GET    /api/v1/learning-paths/{id}           # Get path details
POST   /api/v1/learning-paths/{id}/enroll    # Enroll in path
GET    /api/v1/profile                       # User profile
```

#### Admin Endpoints

```http
GET    /api/v1/admin/learning-paths                    # List all paths
POST   /api/v1/admin/learning-paths                    # Create path
PUT    /api/v1/admin/learning-paths/{id}               # Update path
DELETE /api/v1/admin/learning-paths/{id}               # Delete path
POST   /api/v1/admin/learning-paths/bulk-create        # Bulk create paths
POST   /api/v1/admin/learning-paths/{id}/questions     # Add question
PUT    /api/v1/admin/learning-paths/{id}/questions/reorder  # Reorder questions
```

## 📊 Learning Path Data Sources

Our curated paths are based on:

- **Company Analysis**: Real interview questions from Amazon, Meta, Uber hiring processes
- **LeetCode 101 Guide**: Comprehensive algorithm pattern guide at https://noworneverev.github.io/leetcode_101/
- **Grokking Patterns**: 14 essential coding interview patterns
- **Community Input**: Crowdsourced difficulty ratings and time estimations

## 🎨 Design Philosophy

### Terminal-Inspired Interface

- **Monospace Fonts**: Consistent, readable typography
- **Catppuccin Colors**: Beautiful, eye-friendly color scheme
- **Bracket Notation**: [COMMANDS] and terminal-style interactions
- **Retro Aesthetics**: Nostalgic computing experience

### User Experience

- **Progressive Disclosure**: Information revealed when needed
- **Drag-and-Drop**: Intuitive question reordering
- **Real-time Feedback**: Immediate response to user actions
- **Responsive Design**: Works on all device sizes

## 🔄 Development Workflow

### Adding New Learning Paths

1. **Define Path Structure**

```python
# In backend/app/utils/learning_paths.py
def create_custom_paths(creator_id):
    path = create_learning_path(
        name="Custom Path Name",
        description="Detailed description",
        difficulty_level="Intermediate",
        estimated_hours=30,
        tags="Custom,Tags,Here",
        source="System",
        creator_id=creator_id,
        is_public=True
    )

    questions = [
        ("question-slug", 1, "Learning notes", 30, 4),
        # (slug, sequence, notes, minutes, importance)
    ]

    for slug, seq, notes, minutes, importance in questions:
        add_question_to_path(path.path_id, slug, seq, notes, minutes, importance)
```

2. **Update Bulk Creation**

```python
# Add to routes/learning_paths_routes.py
elif path_type == 'custom':
    created_paths = create_custom_paths(current_user_id)
```

3. **Test and Deploy**

```bash
python scripts/populate_comprehensive_paths.py
```

## 🚀 Deployment

### Environment Variables

```bash
# Production settings
export FLASK_ENV="production"
export DATABASE_URL="postgresql://user:pass@prod-db:5432/leettrack"
export JWT_SECRET_KEY="secure-random-key"
export CORS_ORIGINS="https://your-domain.com"
```

### Docker Deployment

```dockerfile
# Dockerfile provided for containerized deployment
docker build -t leettrack .
docker run -p 5000:5000 leettrack
```

## 📈 Analytics and Metrics

### Progress Tracking

- **Question Completion**: Track solved questions across paths
- **Time Management**: Estimated vs actual time spent
- **Difficulty Progression**: Skill development over time
- **Pattern Recognition**: Strength analysis by algorithm pattern

### Admin Insights

- **Path Popularity**: Most enrolled learning paths
- **Completion Rates**: Success metrics by path and difficulty
- **User Engagement**: Activity patterns and retention

## 🤝 Contributing

### Code Style

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Strict mode, consistent naming
- **Database**: Follow migration patterns, maintain referential integrity

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LeetCode**: For providing the problem platform and API
- **LeetCode 101 Guide**: For comprehensive algorithm patterns
- **Grokking the Coding Interview**: For systematic pattern approach
- **Catppuccin**: For the beautiful color scheme
- **Community**: For feedback and contributions

## 📞 Support

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Email**: support@leettrack.com for direct contact

---

**Happy Coding! 🎯**
