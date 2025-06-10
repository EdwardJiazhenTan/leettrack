# LeetTrack Frontend

Next.js 15 frontend application with TypeScript, terminal-themed UI, and modern React patterns for the LeetTrack platform.

## 🏗️ Architecture Overview

```
frontend/
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── postcss.config.mjs    # PostCSS configuration
├── public/              # Static assets
└── app/                 # Next.js App Router structure
    ├── layout.tsx       # Root layout component
    ├── page.tsx         # Home page
    ├── globals.css      # Global styles
    ├── components/      # Reusable UI components
    ├── context/         # React Context providers
    ├── services/        # API service layer
    ├── login/          # Login page route
    └── register/       # Register page route
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS with custom terminal theme
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API
- **UI Theme**: Catppuccin color scheme with terminal aesthetics
- **Authentication**: JWT token-based with context management

## 📁 Directory Structure

### `/app/` (App Router)

Next.js 15 App Router structure with file-based routing.

```typescript
app/
├── layout.tsx           # Root layout with providers
├── page.tsx            # Home dashboard page
├── globals.css         # Global styles and Tailwind imports
├── favicon.ico         # Application favicon
├── login/
│   └── page.tsx        # Login page
├── register/
│   └── page.tsx        # Registration page
├── components/         # Reusable UI components
├── context/           # React Context providers
└── services/          # API service layer
```

### `/app/components/`

Reusable UI components with consistent terminal theming.

```typescript
components/
├── DailyQuestion.tsx    # Daily LeetCode challenge display
├── LearningPathsList.tsx # Learning paths overview
└── Navbar.tsx          # Navigation component
```

**Component Features:**

- **Terminal Aesthetics**: Consistent Catppuccin color scheme
- **TypeScript**: Full type safety with interfaces
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loading and error handling
- **Accessibility**: ARIA labels and keyboard navigation

#### `DailyQuestion.tsx`

- Fetches and displays daily LeetCode challenge
- Shows problem difficulty, likes, and description
- Handles loading and error states
- Links to LeetCode problem page

#### `LearningPathsList.tsx`

- Displays available learning paths
- Shows path metadata (difficulty, question count, tags)
- Responsive grid layout
- Progress indicators

#### `Navbar.tsx`

- Authentication-aware navigation
- User profile display when logged in
- Responsive mobile menu
- Terminal-themed styling

### `/app/context/`

React Context providers for global state management.

```typescript
context/
└── AuthContext.tsx     # Authentication state management
```

**AuthContext Features:**

- JWT token management
- User authentication state
- Login/logout functionality
- Protected route handling
- Automatic token refresh
- Local storage persistence

### `/app/services/`

API service layer for backend communication.

```typescript
services/
└── api.ts             # API client and service functions
```

**API Services:**

- **Authentication**: Login, register, token refresh
- **LeetCode Integration**: Daily questions, user profiles
- **Learning Paths**: Path listing, enrollment, progress
- **Error Handling**: Consistent error response handling
- **Type Safety**: Full TypeScript interfaces

### Route Pages

#### `/app/page.tsx` (Home Dashboard)

- Daily question display
- Learning paths overview
- User progress summary
- Authentication-aware content

#### `/app/login/page.tsx`

- User authentication form
- JWT token handling
- Error state management
- Redirect after successful login

#### `/app/register/page.tsx`

- User registration form
- Form validation
- Account creation flow
- Automatic login after registration

## 🎨 Design System

### Terminal Theme

Inspired by terminal interfaces with modern UX principles:

```css
/* Catppuccin Color Palette */
--background: #1e1e2e; /* Base background */
--surface: #313244; /* Card backgrounds */
--border: #45475a; /* Borders and dividers */
--text: #cdd6f4; /* Primary text */
--text-muted: #a6adc8; /* Secondary text */
--accent: #89b4fa; /* Links and highlights */
--success: #a6e3a1; /* Success states */
--warning: #f9e2af; /* Warning states */
--error: #f38ba8; /* Error states */
```

### Component Styling Patterns

- **Borders**: 2-4px solid borders with shadow effects
- **Typography**: Monospace fonts for terminal feel
- **Spacing**: Consistent padding and margin scale
- **Hover States**: Subtle color transitions
- **Focus States**: Accessible keyboard navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

2. **Environment setup** (if needed)

```bash
# Create .env.local for environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

3. **Run development server**

```bash
npm run dev
# or
yarn dev
```

Application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig = {
  // API proxy configuration
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};
```

### Tailwind Configuration

Custom terminal theme with Catppuccin colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
};
```

## 🧪 Development

### Component Development

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### API Integration Testing

```typescript
// Example API call
const response = await fetch("/api/v1/leetcode/daily-question");
const data = await response.json();
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach

- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly interactive elements
- Optimized loading for mobile networks

## 🔐 Authentication Flow

### Login Process

1. User submits credentials
2. Frontend sends request to `/api/v1/auth/login`
3. Backend validates and returns JWT token
4. Token stored in AuthContext and localStorage
5. User redirected to dashboard

### Protected Routes

```typescript
// Example protected component
const ProtectedComponent = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;

  return <DashboardContent />;
};
```

## 🎯 State Management

### AuthContext Pattern

```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

### Local State Management

- Component-level state with `useState`
- Form state management
- Loading and error states
- UI interaction state

## 🚀 Performance Optimization

### Next.js Features

- **Automatic Code Splitting**: Route-based splitting
- **Image Optimization**: Next.js Image component
- **Static Generation**: Pre-rendered pages where possible
- **API Routes**: Server-side API handling

### Loading Strategies

- Skeleton loading components
- Progressive data loading
- Error boundaries for graceful failures
- Optimistic UI updates

## 🧪 Testing Strategy

### Component Testing

```bash
# Run tests (when implemented)
npm run test

# Test coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Authentication flow (login/register/logout)
- [ ] Daily question loading and display
- [ ] Learning paths listing and interaction
- [ ] Responsive design across devices
- [ ] Error handling and edge cases

## 🔍 Debugging

### Development Tools

- React Developer Tools
- Next.js built-in debugging
- Browser DevTools for network inspection
- TypeScript compiler for type checking

### Common Issues

- **CORS Errors**: Check backend CORS configuration
- **Authentication**: Verify JWT token handling
- **API Calls**: Check network tab for request/response
- **Styling**: Verify Tailwind classes and custom CSS

## 📊 Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze
```

### Optimization Targets

- Keep bundle size under 1MB
- Minimize third-party dependencies
- Use dynamic imports for large components
- Optimize images and assets

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

### Build Optimization

- Static asset optimization
- Image compression
- CSS purging with Tailwind
- JavaScript minification
