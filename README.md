# LeetTrack

A full-stack application for tracking LeetCode progress with spaced repetition learning and curated learning paths.

## 🚀 Features

### ✅ Implemented

- **Authentication System**: JWT-based user registration and login
- **Daily LeetCode Problems**: Fetches and displays daily coding challenges
- **Direct LeetCode Integration**: GraphQL-based API integration (no external dependencies)
- **Learning Paths**: Pre-built NeetCode 75 path with 148 problems across 18 categories
- **Database Integration**: AWS RDS PostgreSQL with comprehensive data models
- **Modern UI**: Terminal-themed interface with Catppuccin color scheme
- **Caching System**: In-memory caching for optimal performance
- **CORS Configuration**: Proper cross-origin resource sharing setup

### 🎯 Core Architecture

- **Backend**: Flask with SQLAlchemy, JWT authentication, GraphQL integration
- **Frontend**: Next.js 15 with TypeScript, modern React patterns
- **Database**: PostgreSQL on AWS RDS with migration support
- **API Integration**: Direct LeetCode GraphQL queries (self-hosted solution)

## 🛠️ Tech Stack

### Backend

- **Framework**: Flask 2.3.3
- **Database**: PostgreSQL (AWS RDS)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Authentication**: Flask-JWT-Extended
- **Migrations**: Flask-Migrate (Alembic)
- **API Integration**: Custom GraphQL client for LeetCode
- **CORS**: Flask-CORS

### Frontend

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom terminal theme
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API

### Database Schema

- **Users**: Authentication and profile management
- **Questions**: LeetCode problem metadata
- **Learning Paths**: Curated problem collections
- **User Progress**: Tracking and spaced repetition
- **Review System**: Scheduled review functionality

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL database (AWS RDS configured)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd LeetTrack
```

2. **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
flask db upgrade
```

3. **Frontend Setup**

```bash
cd frontend
npm install
```

4. **Start Development Servers**

```bash
# From project root
chmod +x run_dev.sh
./run_dev.sh
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Current Status

### Database

- ✅ AWS RDS PostgreSQL configured and connected
- ✅ Complete schema with 9+ tables
- ✅ Migration system in place
- ✅ NeetCode 75 learning path populated (148 problems)

### API Endpoints

- ✅ Authentication: `/api/v1/auth/*`
- ✅ LeetCode Integration: `/api/v1/leetcode/*`
- ✅ Learning Paths: `/api/v1/learning-paths/*`
- ✅ User Progress: `/api/v1/user/*`

### Frontend Pages

- ✅ Home dashboard with daily problems and learning paths
- ✅ Authentication (login/register) with terminal UI
- ✅ Responsive design with modern styling

## 📋 Todo List (Priority Order)

### 🔴 High Priority

1. **Admin/Manager Dashboard**

   - Special login for administrators
   - Path management interface (create, edit, delete learning paths)
   - User monitoring and analytics dashboard
   - System health and usage statistics

2. **Social Authentication**

   - Google OAuth integration
   - GitHub OAuth integration
   - Account linking functionality

3. **Reusable Question Components**
   - Standardized question display component
   - Code editor integration
   - Solution submission interface
   - Progress tracking widgets

### 🟡 Medium Priority

4. **User Profile & Settings**

   - Personal profile page with statistics
   - Account settings and preferences
   - LeetCode profile synchronization
   - Progress visualization charts

5. **Review System Enhancement**

   - Question review scheduling page
   - Spaced repetition algorithm implementation
   - Review queue management
   - Performance analytics

6. **Review Widget**
   - Embeddable review widget for websites
   - Customizable appearance and behavior
   - API for external integrations
   - Widget configuration dashboard

### 🟢 Low Priority

7. **AI Integration**

   - AI-powered hint system
   - Solution explanation generation
   - Personalized learning recommendations
   - Code review and optimization suggestions

8. **UI/UX Improvements**

   - Smooth animations and transitions
   - Advanced CSS styling
   - Theme customization (dark/light modes)
   - Mobile responsiveness enhancements
   - Accessibility improvements

9. **Deployment & Hosting**

   - AWS EC2 backend deployment
   - Vercel frontend deployment
   - CI/CD pipeline setup
   - Production environment configuration
   - SSL certificate and domain setup

10. **Documentation & Community**
    - Comprehensive API documentation
    - User guide and tutorials
    - Contributing guidelines
    - Community features (forums, discussions)
    - Integration examples and SDKs

## 🏗️ Architecture Decisions

### LeetCode API Integration

- **Decision**: Direct GraphQL integration instead of external API
- **Rationale**: Eliminates rate limiting (60 req/hour), reduces dependencies
- **Implementation**: Custom GraphQL client with caching

### Authentication

- **Decision**: JWT-based authentication with refresh tokens
- **Rationale**: Stateless, scalable, secure
- **Implementation**: Flask-JWT-Extended with 1-hour access tokens

### Database Design

- **Decision**: Normalized relational schema
- **Rationale**: Data integrity, complex queries, relationship management
- **Implementation**: SQLAlchemy ORM with migration support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NeetCode](https://neetcode.io/) for the curated problem sets
- [LeetCode](https://leetcode.com/) for the problem platform
- [Catppuccin](https://catppuccin.com/) for the beautiful color scheme
- Open source community for the amazing tools and libraries
