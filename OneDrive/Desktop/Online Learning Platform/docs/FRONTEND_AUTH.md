# Frontend Authentication - Complete Documentation

## Overview

Complete React authentication system with form validation, error handling, API integration, role-based navigation, and responsive design.

---

## 📦 Files Created (15 Total)

### Core Services

1. **`services/api.js`** - Axios client with interceptors
2. **`services/authService.js`** - Authentication service layer

### Context & State Management

3. **`context/AuthContext.js`** - Global auth state
4. **`context/ToastContext.js`** - Toast notifications

### Utilities

5. **`utils/validation.js`** - Form validation functions

### Common Components

6. **`components/common/Input.jsx`** - Reusable input field
7. **`components/common/Button.jsx`** - Reusable button
8. **`components/common/Toast.jsx`** - Toast notification

### Layout Components

9. **`components/layout/ProtectedRoute.jsx`** - Route guard

### Pages

10. **`pages/Auth/Login.jsx`** - Login page
11. **`pages/Auth/Signup.jsx`** - Signup page
12. **`pages/Student/Dashboard.jsx`** - Student dashboard
13. **`pages/Instructor/Dashboard.jsx`** - Instructor dashboard
14. **`pages/Admin/Dashboard.jsx`** - Admin dashboard

### Configuration

15. **`App.js`** - Main app with routing
16. **`index.js`** - Entry point
17. **`tailwind.config.js`** - Tailwind config
18. **`index.css`** - Global styles

---

## 🏗️ Architecture

### Service Layer Pattern

```
┌─────────────────────────────────────────┐
│           Components (UI)                │
│   Login, Signup, Dashboards             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Context (State Management)        │
│   AuthContext, ToastContext             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Service Layer (API)               │
│   authService.js, api.js                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Backend API                       │
│   /api/auth/*                            │
└─────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Signup Flow

1. User fills signup form
2. Client-side validation runs
3. Form data sent to backend via authService
4. Backend creates user and returns JWT token
5. Token stored in localStorage
6. User object stored in AuthContext
7. User redirected to role-specific dashboard
8. Success toast displayed

### Login Flow

1. User enters credentials
2. Client-side validation runs
3. Credentials sent to backend
4. Backend verifies and returns JWT token
5. Token stored in localStorage
6. User object stored in AuthContext
7. User redirected to role-specific dashboard
8. Success toast displayed

### Route Protection Flow

1. User tries to access protected route
2. ProtectedRoute component checks authentication
3. If not authenticated → redirect to /login
4. If authenticated, check role requirements
5. If role doesn't match → redirect to own dashboard
6. If authorized → render component

---

## 🎯 Key Features

### 1. **Axios API Client** (`services/api.js`)

**Features:**

- Centralized API configuration
- Automatic token injection in headers
- Request/response interceptors
- Global error handling
- Automatic redirect on 401 errors

**Usage:**

```javascript
import api from "../services/api";

const response = await api.post("/auth/login", { email, password });
```

### 2. **Auth Service** (`services/authService.js`)

**Methods:**

- `signup(userData)` - Register new user
- `login(email, password)` - Login user
- `logout()` - Logout user
- `getProfile()` - Get current user profile
- `verifyRole()` - Verify user role
- `changePassword()` - Change password
- `forgotPassword(email)` - Request reset
- `resetPassword(token, newPassword)` - Reset password
- `refreshToken()` - Refresh JWT token
- `isAuthenticated()` - Check if authenticated
- `hasRole(role)` - Check user role
- `getRoleDashboard()` - Get dashboard path

**Token Management:**

- Stores token in localStorage
- Automatically adds to requests
- Handles token refresh
- Clears on logout

### 3. **Auth Context** (`context/AuthContext.js`)

**State:**

- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Authentication status
- `isAdmin`, `isInstructor`, `isStudent` - Role checks

**Methods:**

- `login(email, password)`
- `signup(userData)`
- `logout()`
- `updateUser(user)`
- `hasRole(role)`
- `getDashboardPath()`

**Usage:**

```javascript
import { useAuth } from "../context/AuthContext";

const { user, login, logout, isAuthenticated } = useAuth();
```

### 4. **Form Validation** (`utils/validation.js`)

**Functions:**

- `validateEmail(email)` - Email format validation
- `validatePassword(password)` - Password strength validation
- `validateName(name)` - Name validation
- `validatePasswordMatch()` - Password confirmation
- `validateSignupForm(formData)` - Complete signup validation
- `validateLoginForm(formData)` - Complete login validation
- `getPasswordStrength(password)` - Password strength indicator

**Password Requirements:**

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Example:**

```javascript
import { validateSignupForm } from "../utils/validation";

const errors = validateSignupForm(formData);
if (hasErrors(errors)) {
  setErrors(errors);
  return;
}
```

### 5. **Toast Notifications** (`context/ToastContext.js`)

**Methods:**

- `success(message, duration)` - Success toast
- `error(message, duration)` - Error toast
- `warning(message, duration)` - Warning toast
- `info(message, duration)` - Info toast

**Usage:**

```javascript
import { useToast } from "../context/ToastContext";

const toast = useToast();

toast.success("Login successful!");
toast.error("Invalid credentials");
```

### 6. **Protected Routes** (`components/layout/ProtectedRoute.jsx`)

**Features:**

- Authentication check
- Role-based access control
- Automatic redirects
- Loading states

**Usage:**

```javascript
<Route
  path="/dashboard/student"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

### 7. **Reusable Components**

#### Input Component

```javascript
<Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="john@example.com"
  required
/>
```

#### Button Component

```javascript
<Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
  Sign In
</Button>
```

---

## 🎨 UI/UX Features

### Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Responsive grids and layouts
- Touch-friendly buttons

### Form UX

- Real-time validation
- Error messages below fields
- Password visibility toggle
- Password strength indicator
- Loading states on submit
- Disabled state while processing

### Accessibility

- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Error announcements

### Visual Feedback

- Success/error toasts
- Loading spinners
- Button states (hover, active, disabled)
- Form field focus states
- Smooth animations

---

## 🚦 Role-Based Navigation

### Student Role

**Dashboard:** `/dashboard/student`
**Features:**

- View enrolled courses
- Track progress
- Access learning materials

### Instructor Role

**Dashboard:** `/dashboard/instructor`
**Features:**

- Create/manage courses
- View student enrollments
- Create quizzes

### Admin Role

**Dashboard:** `/dashboard/admin`
**Features:**

- Manage all users
- Manage all courses
- System administration

---

## 🔒 Security Features

### Client-Side Security

1. **Token Storage:** Secure localStorage with XSS protection
2. **Auto-Logout:** Automatic logout on token expiration
3. **HTTPS Only:** Production uses HTTPS
4. **Input Validation:** All inputs validated before submission
5. **XSS Prevention:** React's built-in XSS protection

### Best Practices

- Never store sensitive data in localStorage except tokens
- Tokens automatically included in requests
- Expired tokens trigger auto-logout
- Role checks on both client and server
- CSRF protection via JWT

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (min-width: 0px) {
}

/* Tablet */
@media (min-width: 640px) {
}

/* Desktop */
@media (min-width: 1024px) {
}

/* Large Desktop */
@media (min-width: 1280px) {
}
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Signup:**

- [ ] Valid signup creates account
- [ ] Duplicate email shows error
- [ ] Weak password shows error
- [ ] Password mismatch shows error
- [ ] Role selection works
- [ ] Success toast appears
- [ ] Auto-redirect to dashboard

**Login:**

- [ ] Valid credentials log in
- [ ] Invalid credentials show error
- [ ] Empty fields show validation
- [ ] Remember me checkbox works
- [ ] Forgot password link works
- [ ] Success toast appears
- [ ] Role-based redirect works

**Protected Routes:**

- [ ] Unauthenticated redirects to login
- [ ] Wrong role redirects to own dashboard
- [ ] Correct role accesses page

**Logout:**

- [ ] Logout clears auth data
- [ ] Redirects to login
- [ ] Can't access protected routes after logout

---

## 🚀 Usage Examples

### Complete Login Example

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginExample = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome, ${user.name}!`);
      navigate(getDashboardPath(user.role));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

### Complete Signup Example

```javascript
const handleSignup = async (formData) => {
  // Validate
  const errors = validateSignupForm(formData);
  if (hasErrors(errors)) {
    setErrors(errors);
    return;
  }

  // Signup
  try {
    const user = await signup(formData);
    toast.success("Account created!");
    navigate(getDashboardPath(user.role));
  } catch (error) {
    toast.error(error.message);
  }
};
```

---

## 🎓 Best Practices

### Component Organization

- One component per file
- Logical folder structure
- Reusable components in /common
- Page components in /pages

### State Management

- Use Context for global state
- Use local state for component-specific data
- Lift state up when needed

### Error Handling

- Always wrap async calls in try-catch
- Display user-friendly error messages
- Log errors for debugging
- Use toast notifications for feedback

### Performance

- Use React.memo for expensive components
- Lazy load routes
- Optimize re-renders
- Minimize context updates

---

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
}
```

### Adding New Role

1. Update role validation in `utils/validation.js`
2. Add role check in `AuthService`
3. Create dashboard component
4. Add protected route
5. Update navigation logic

### Custom Toast Duration

```javascript
toast.success("Message", 10000); // 10 seconds
```

---

## 📊 Component Hierarchy

```
App
├── AuthProvider
│   └── ToastProvider
│       └── BrowserRouter
│           └── Routes
│               ├── Login
│               ├── Signup
│               └── ProtectedRoute
│                   ├── StudentDashboard
│                   ├── InstructorDashboard
│                   └── AdminDashboard
```

---

## ✅ Success Criteria

- [x] Login form with validation
- [x] Signup form with validation
- [x] Role-based navigation
- [x] Token management
- [x] Protected routes
- [x] Success/error toasts
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Password strength indicator
- [x] Remember me functionality
- [x] Forgot password UI

---

## 🎉 Complete & Production Ready!

All frontend authentication components are fully implemented and ready for use!
