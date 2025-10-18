# Server (Backend API)

Node.js/Express backend following clean architecture and SOLID principles.

## Folder Structure

```
server/
├── src/
│   ├── controllers/             # Request handlers (Presentation Layer)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── quizController.js
│   │   └── forumController.js
│   ├── services/                # Business logic layer
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── CourseService.js
│   │   ├── EnrollmentService.js
│   │   ├── QuizService.js
│   │   └── ForumService.js
│   ├── repositories/            # Data access layer (Database queries)
│   │   ├── UserRepository.js
│   │   ├── CourseRepository.js
│   │   ├── EnrollmentRepository.js
│   │   ├── QuizRepository.js
│   │   └── ForumRepository.js
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── rbac.middleware.js         # Role-based access control
│   │   ├── validation.middleware.js   # Request validation
│   │   ├── errorHandler.middleware.js # Global error handler
│   │   ├── upload.middleware.js       # File upload (Multer)
│   │   └── rateLimit.middleware.js    # Rate limiting
│   ├── models/                  # Database models (Domain entities)
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── CourseContent.js
│   │   ├── Quiz.js
│   │   ├── QuizSubmission.js
│   │   └── ForumPost.js
│   ├── routes/                  # API route definitions
│   │   ├── index.js            # Main router
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── quizRoutes.js
│   │   └── forumRoutes.js
│   ├── config/                  # Configuration files
│   │   ├── database.js         # Database connection
│   │   ├── jwt.js              # JWT configuration
│   │   ├── multer.js           # File upload configuration
│   │   └── logger.js           # Winston logger setup
│   ├── utils/                   # Utility functions
│   │   ├── validators.js       # Custom validators
│   │   ├── responses.js        # Standard response formats
│   │   ├── errors.js           # Custom error classes
│   │   ├── sanitizer.js        # Input sanitization
│   │   └── helpers.js          # General helpers
│   ├── app.js                   # Express app configuration
│   └── server.js               # Server entry point
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── helpers/
├── uploads/                     # Uploaded files (gitignored)
├── logs/                        # Application logs (gitignored)
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

## Architecture Layers

### 1. **Presentation Layer (Controllers)**

- Handle HTTP requests and responses
- Input validation
- Call appropriate services
- Return formatted responses

```javascript
// Example: controllers/courseController.js
class CourseController {
  async createCourse(req, res, next) {
    const courseData = req.body;
    const course = await courseService.createCourse(courseData, req.user);
    return res.status(201).json({ success: true, data: course });
  }
}
```

### 2. **Business Logic Layer (Services)**

- Contain core business logic
- Orchestrate operations
- Validate business rules
- Independent of HTTP layer

```javascript
// Example: services/CourseService.js
class CourseService {
  constructor(courseRepository, userRepository) {
    this.courseRepository = courseRepository;
    this.userRepository = userRepository;
  }

  async createCourse(courseData, instructor) {
    // Business validation
    if (instructor.role !== "instructor") {
      throw new ForbiddenError("Only instructors can create courses");
    }
    // Create course
    return await this.courseRepository.create(courseData);
  }
}
```

### 3. **Data Access Layer (Repositories)**

- Handle all database operations
- Abstract database logic
- Return domain models

```javascript
// Example: repositories/CourseRepository.js
class CourseRepository {
  async create(courseData) {
    const query = `
      INSERT INTO courses (title, description, instructor_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [courseData.title, ...]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
```

## Middleware Stack

1. **Global Middleware** (app.js)

   - helmet (security headers)
   - cors
   - compression
   - morgan (logging)
   - express.json()

2. **Route-Specific Middleware**

   - Authentication (JWT verification)
   - Authorization (RBAC)
   - Validation (express-validator)
   - Rate limiting

3. **Error Handling**
   - Global error handler
   - Async error wrapper

## API Route Structure

```
/api
├── /auth
│   ├── POST /signup
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh-token
│   └── GET /verify-role
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   └── DELETE /:id (admin only)
├── /courses
│   ├── GET /
│   ├── GET /:id
│   ├── POST / (instructor only)
│   ├── PUT /:id (instructor/admin)
│   ├── DELETE /:id (instructor/admin)
│   └── POST /:id/content (upload)
├── /enrollments
│   ├── POST / (enroll in course)
│   ├── GET /my-courses
│   └── PUT /:id/progress
├── /quizzes
│   ├── GET /course/:courseId
│   ├── POST / (instructor only)
│   ├── POST /submit
│   └── GET /submissions/:userId
└── /forum
    ├── GET /course/:courseId/posts
    ├── POST /posts
    ├── POST /posts/:id/comments
    └── PUT /posts/:id/upvote
```

## Security Features

1. **Authentication**

   - JWT-based authentication
   - Secure password hashing (bcrypt)
   - Token refresh mechanism

2. **Authorization**

   - Role-Based Access Control (RBAC)
   - Resource ownership validation
   - Permission middleware

3. **Input Validation**

   - express-validator for request validation
   - Joi schemas for complex validation
   - XSS protection via sanitization

4. **Security Headers**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting

## Error Handling

### Custom Error Classes

```javascript
// utils/errors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
```

### Global Error Handler

```javascript
// middleware/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

## Database Connection

Using `pg` (node-postgres) for PostgreSQL:

```javascript
// config/database.js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = { query: (text, params) => pool.query(text, params) };
```

## Logging

Winston for structured logging:

```javascript
// config/logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
```

## Setup Instructions

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure database and JWT settings.

### Database Setup

```bash
npm run db:migrate
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Run in Production

```bash
npm start
```

## Testing Strategy

1. **Unit Tests**

   - Test services in isolation
   - Mock repositories
   - Test business logic

2. **Integration Tests**

   - Test API endpoints
   - Use test database
   - Validate request/response

3. **Test Coverage**
   - Aim for >80% coverage
   - Focus on critical paths

## Best Practices

1. **Dependency Injection**

   - Services receive dependencies via constructor
   - Easier testing and maintenance

2. **Single Responsibility**

   - Each class has one responsibility
   - Controllers → HTTP handling
   - Services → Business logic
   - Repositories → Data access

3. **Error Handling**

   - Use custom error classes
   - Async error handling with express-async-errors
   - Meaningful error messages

4. **Validation**

   - Validate at controller level
   - Business rule validation in services
   - Use schemas for consistency

5. **Security**
   - Never trust client input
   - Sanitize all inputs
   - Use parameterized queries (prevent SQL injection)
   - Implement rate limiting
