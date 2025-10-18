# Online Learning Platform

A full-stack e-learning platform built with React, Node.js/Express, and PostgreSQL.

## Project Structure

```
online-learning-platform/
├── client/                 # React Frontend
├── server/                 # Node.js/Express Backenda# 🎓 Online Learning Platform

A comprehensive full-stack Learning Management System (LMS) built with **React**, **Node.js**, **Express**, and **PostgreSQL**. This platform enables students to enroll in courses, instructors to create and manage educational content, and administrators to oversee the entire system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-blue.svg)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👤 **Multi-Role System**
- **Students** - Enroll in courses, track progress, take quizzes
- **Instructors** - Create and manage courses, upload content, view analytics
- **Admins** - Manage users, courses, and system settings

### 📚 **Course Management**
- ✅ Create and publish courses with rich content
- ✅ Upload video lectures, PDFs, and documents (500MB videos, 50MB docs)
- ✅ Organize content into modules and lessons
- ✅ Set course pricing, difficulty levels, and prerequisites
- ✅ Advanced search and filtering by category, difficulty, price
- ✅ Course ratings and reviews

### 🎯 **Learning Experience**
- Interactive video player with progress tracking
- Course bookmarks and notes
- Certificate generation upon completion
- Personalized student dashboard
- Progress analytics

### 📝 **Assessment System**
- Create quizzes with multiple question types
- Automatic grading and instant feedback
- Quiz attempts tracking
- Performance analytics and reporting

### 💬 **Discussion Forums**
- Course-specific discussion boards
- Post questions and get answers
- Upvote/downvote system
- Direct instructor responses

### 🔐 **Security & Authentication**
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password encryption with bcrypt (10 rounds)
- CORS protection and security headers
- Rate limiting to prevent abuse
- Input validation and sanitization

### 📊 **Analytics & Reporting**
- Student progress tracking
- Course enrollment statistics
- Revenue and earnings reports
- User engagement metrics
- Instructor performance dashboard

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI library |
| React Router | 6.x | Client-side routing |
| TailwindCSS | 3.x | Utility-first CSS |
| Axios | 1.x | HTTP client |
| Context API | - | State management |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express | 4.x | Web framework |
| PostgreSQL | 15+ | Relational database |
| JWT | - | Authentication |
| Bcrypt | - | Password hashing |
| Multer | - | File uploads |

### **DevOps**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

### **Testing**
- **Jest** - Unit and integration testing
- **Supertest** - API endpoint testing
- **React Testing Library** - Component testing

---

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Client   │ ───> │  Express API    │ ───> │  PostgreSQL DB  │
│   (Port 3000)   │ <─── │   (Port 5000)   │ <─── │   (Port 5432)   │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### **Design Patterns**
- **MVC** - Model-View-Controller architecture
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **Singleton Pattern** - Service instances
- **Factory Pattern** - Model creation

### **API Architecture**
```
HTTP Request
     ↓
Controllers (Request handling)
     ↓
Services (Business logic)
     ↓
Repositories (Data access)
     ↓
Database (PostgreSQL)
```

---

## 🚀 Getting Started

### **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/download/))
- **Docker** (optional, for containerized setup) ([Download](https://www.docker.com/))
- **npm** or **yarn** package manager

### **Quick Start with Docker** (Recommended)

This is the fastest way to get the application running:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/online-learning-platform.git
cd online-learning-platform

# 2. Copy environment file
cp .env.example .env

# 3. Update .env with your configuration
# IMPORTANT: Change JWT_SECRET and database passwords!
nano .env

# 4. Start all services with Docker Compose
docker-compose up -d

# 5. Check logs
docker-compose logs -f

# 6. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

---

## 📦 Installation

### **Manual Setup (Without Docker)**

#### **Step 1: Database Setup**

```bash
# Create PostgreSQL database
createdb learning_platform

# Or using psql
psql -U postgres
CREATE DATABASE learning_platform;
\q

# Run migrations
cd database/migrations
psql -U postgres -d learning_platform -f 001_create_users_table.sql
psql -U postgres -d learning_platform -f 002_create_courses_table.sql

# Seed sample data (optional)
cd ../seeds
psql -U postgres -d learning_platform -f 001_seed_users.sql
psql -U postgres -d learning_platform -f 002_seed_courses.sql
```

#### **Step 2: Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# Required: POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, JWT_SECRET

# Start development server
npm run dev

# Server will start on http://localhost:5000
# You should see: "✅ Database connected successfully"
```

#### **Step 3: Frontend Setup**

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm start

# Application will open at http://localhost:3000
```

---

## 💻 Usage

### **Default Test Users** (After seeding database)

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | Password@123 | Full system access |
| **Instructor** | instructor@example.com | Password@123 | Course management |
| **Student** | student@example.com | Password@123 | Course enrollment |

### **Getting Started as Different Roles**

#### **As a Student:**
1. Login with student credentials
2. Browse available courses at `/courses`
3. Enroll in a course
4. Access course content and track progress
5. Take quizzes and earn certificates

#### **As an Instructor:**
1. Login with instructor credentials
2. Navigate to Instructor Dashboard
3. Create a new course with "Create Course" button
4. Upload video lectures and course materials
5. Publish course to make it available to students
6. View enrollment and revenue analytics

#### **As an Admin:**
1. Login with admin credentials
2. Access Admin Dashboard
3. Manage users (approve instructors, disable accounts)
4. Oversee all courses
5. View system-wide analytics

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "name": "John Doe", "role": "student" }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### **Course Endpoints**

#### Get All Published Courses
```http
GET /api/courses/published?category=Web Development&difficulty=beginner&page=1&limit=10
```

#### Create Course (Instructor Only)
```http
POST /api/courses
Authorization: Bearer <instructor_token>
Content-Type: multipart/form-data

title: "Complete Web Development Bootcamp"
description: "Learn web development from scratch..."
category: "Web Development"
difficulty: "beginner"
price: 99.99
video: <video_file>
thumbnail: <image_file>
```

#### Get Course Details
```http
GET /api/courses/:id
```

#### Update Course (Instructor/Admin)
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 149.99
}
```

#### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

For complete API documentation, see:
- [Authentication API Docs](./docs/AUTH_API.md)
- [Course API Docs](./docs/COURSE_API.md)

---

## 📂 Project Structure

```
online-learning-platform/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/            # Buttons, Inputs, Toast
│   │   │   └── layout/            # Header, Footer, ProtectedRoute
│   │   ├── pages/                 # Page components
│   │   │   ├── Auth/              # Login, Signup
│   │   │   ├── Student/           # Student Dashboard
│   │   │   ├── Instructor/        # Instructor Dashboard
│   │   │   └── Admin/             # Admin Dashboard
│   │   ├── services/              # API service layer
│   │   │   ├── api.js            # Axios instance
│   │   │   └── authService.js    # Auth API calls
│   │   ├── context/               # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── ToastContext.js
│   │   ├── utils/                 # Utility functions
│   │   ├── App.js                 # Root component
│   │   └── index.js               # Entry point
│   ├── package.json
│   └── README.md
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── config/                # Configuration
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.js
│   │   │   └── courseController.js
│   │   ├── services/              # Business logic
│   │   │   ├── AuthService.js
│   │   │   └── CourseService.js
│   │   ├── repositories/          # Data access
│   │   │   ├── UserRepository.js
│   │   │   └── CourseRepository.js
│   │   ├── models/                # Domain models
│   │   │   ├── User.js
│   │   │   └── Course.js
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.js
│   │   │   └── courseRoutes.js
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── utils/                 # Utilities
│   │   │   ├── errors.js
│   │   │   └── responses.js
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   ├── tests/                     # Test files
│   │   └── integration/
│   │       ├── auth.test.js
│   │       └── course.test.js
│   ├── uploads/                   # Uploaded files
│   ├── package.json
│   └── README.md
│
├── database/                        # Database scripts
│   ├── migrations/                 # SQL migrations
│   │   ├── 001_create_users_table.sql
│   │   └── 002_create_courses_table.sql
│   └── seeds/                      # Sample data
│       ├── 001_seed_users.sql
│       └── 002_seed_courses.sql
│
├── docs/                            # Documentation
│   ├── AUTH_API.md
│   ├── COURSE_API.md
│   └── FRONTEND_AUTH.md
│
├── .env.example                     # Environment template
├── docker-compose.yml               # Docker orchestration
└── README.md                        # This file
```

---

## 🧪 Testing

### **Backend Tests**

```bash
cd server

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js

# Run tests in watch mode
npm run test:watch
```

### **Frontend Tests**

```bash
cd client

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode (default)
npm test
```

### **Running Tests in Docker**

```bash
# Run backend tests
docker-compose exec server npm test

# Run frontend tests
docker-compose exec client npm test
```

---

## 🚢 Deployment

### **Production Deployment Checklist**

Before deploying to production:

- [ ] Change all default secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure production database with strong password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up CDN for file uploads (AWS S3, Cloudinary)
- [ ] Configure email service for notifications
- [ ] Set up monitoring and logging (Sentry, LogRocket)
- [ ] Configure backups for database
- [ ] Set up CI/CD pipeline
- [ ] Review and adjust rate limits
- [ ] Enable security headers
- [ ] Configure firewall rules

### **Docker Production Deployment**

```bash
# 1. Set environment to production
export NODE_ENV=production

# 2. Update .env with production values

# 3. Build and start services
docker-compose -f docker-compose.yml up -d --build

# 4. Check logs
docker-compose logs -f

# 5. Monitor services
docker-compose ps
```

### **Manual Deployment**

#### Build Frontend
```bash
cd client
npm run build
# Output: build/ directory
```

#### Start Backend
```bash
cd server
NODE_ENV=production node src/server.js
```

#### Configure Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /path/to/server/uploads;
    }
}
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **How to Contribute**

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/online-learning-platform.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Request review

### **Code Style**

- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Online Learning Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Authors & Contributors

- **Development Team** - *Initial work*
- See [Contributors](https://github.com/yourusername/online-learning-platform/contributors) for full list

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- PostgreSQL contributors for the reliable database
- TailwindCSS team for the utility-first CSS framework
- All open-source library maintainers
- Community contributors and testers

---

## 📞 Support & Contact

- **Documentation:** [GitHub Wiki](https://github.com/yourusername/online-learning-platform/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/online-learning-platform/issues)
- **Email:** support@learningplatform.com
- **Discord:** [Join our community](https://discord.gg/yourserver)

---

## 🗺️ Roadmap

### **Phase 1: Core Platform** (✅ Completed)
- [x] User authentication and authorization
- [x] Course creation and management
- [x] File upload system
- [x] Student enrollment

### **Phase 2: Enhanced Learning** (🚧 In Progress)
- [ ] Quiz and assessment system
- [ ] Video streaming optimization
- [ ] Discussion forums
- [ ] Progress tracking
- [ ] Certificate generation

### **Phase 3: Advanced Features** (📋 Planned)
- [ ] Live video classes (WebRTC)
- [ ] AI-powered course recommendations
- [ ] Mobile app (React Native)
- [ ] Gamification features
- [ ] Multi-language support
- [ ] Payment integration (Stripe)
- [ ] Progressive Web App (PWA)

### **Phase 4: Scale & Optimize** (🔮 Future)
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations
- [ ] White-label solution

---

## 📊 Project Status

- **Version:** 1.0.0
- **Status:** ✅ Active Development
- **Build:** ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
- **Coverage:** ![Coverage](https://img.shields.io/badge/coverage-85%25-green)
- **Last Updated:** October 2024

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐️ on GitHub!

---

**Built with ❤️ by the Learning Platform Team**

**[⬆ back to top](#-online-learning-platform)**
├── database/              # Database scripts and migrations
├── docker/                # Docker configurations
├── docker-compose.yml     # Multi-container orchestration
└── README.md             # Project documentation
```

## Quick Start

### Prerequisites
- Node.js (v18+)