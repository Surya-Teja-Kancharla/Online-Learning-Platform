# Client (Frontend)

React-based frontend for the Online Learning Platform.

## Folder Structure

```
client/
├── public/                      # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/             # Shared components (Button, Input, Modal, etc.)
│   │   ├── layout/             # Layout components (Header, Footer, Sidebar)
│   │   ├── auth/               # Authentication components
│   │   ├── course/             # Course-related components
│   │   ├── quiz/               # Quiz components
│   │   └── forum/              # Forum components
│   ├── pages/                   # Page-level components (Route components)
│   │   ├── Auth/               # Login, Signup, ForgotPassword
│   │   ├── Student/            # Student dashboard, courses, profile
│   │   ├── Instructor/         # Instructor dashboard, course management
│   │   ├── Admin/              # Admin dashboard, user management
│   │   ├── Course/             # Course details, player, enrollment
│   │   └── Common/             # Home, About, Contact, NotFound
│   ├── services/                # API service layer
│   │   ├── api.js              # Axios instance configuration
│   │   ├── authService.js      # Authentication APIs
│   │   ├── courseService.js    # Course APIs
│   │   ├── quizService.js      # Quiz APIs
│   │   ├── forumService.js     # Forum APIs
│   │   └── userService.js      # User APIs
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useCourse.js        # Course data hook
│   │   ├── useDebounce.js      # Debounce hook
│   │   └── useLocalStorage.js  # LocalStorage hook
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.js      # Authentication context
│   │   ├── ThemeContext.js     # Theme (dark/light mode)
│   │   └── NotificationContext.js # Notification system
│   ├── utils/                   # Utility functions
│   │   ├── validation.js       # Form validation helpers
│   │   ├── formatters.js       # Date, currency formatters
│   │   ├── constants.js        # App constants
│   │   └── helpers.js          # General helper functions
│   ├── assets/                  # Images, fonts, styles
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/
│   ├── App.js                   # Root component
│   ├── index.js                 # Entry point
│   └── routes.js               # Route configuration
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md
```

## Component Organization

### Component Categories

1. **Common Components** (`components/common/`)

   - Button, Input, Card, Modal, Dropdown
   - Alert, Badge, Spinner, Tooltip
   - Form components with validation

2. **Layout Components** (`components/layout/`)

   - Header (with navigation)
   - Footer
   - Sidebar (for dashboards)
   - ProtectedRoute (for role-based access)

3. **Feature Components** (`components/{feature}/`)
   - Organized by feature domain
   - Self-contained with related logic

### Service Layer Pattern

All API calls go through service files:

```javascript
// Example: services/courseService.js
import api from "./api";

export const courseService = {
  getAllCourses: () => api.get("/courses"),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  // ...
};
```

### Custom Hooks Pattern

Encapsulate reusable logic:

```javascript
// Example: hooks/useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Authentication logic
  return { user, loading, login, logout };
};
```

## Setup Instructions

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Run Development Server

```bash
npm start
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Styling

- **TailwindCSS** for utility-first styling
- **CSS Modules** for component-specific styles
- Dark/Light theme support via Context API

## State Management

- **Zustand** for global state management
- **React Query** for server state caching
- **Context API** for theme and authentication

## Best Practices

1. **Component Design**

   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper prop validation

2. **Performance**

   - Lazy load routes and heavy components
   - Memoize expensive computations
   - Optimize re-renders with React.memo

3. **Code Quality**

   - Follow ESLint rules
   - Use Prettier for formatting
   - Write tests for critical components

4. **Accessibility**
   - Use semantic HTML
   - Implement keyboard navigation
   - Add ARIA labels where needed
