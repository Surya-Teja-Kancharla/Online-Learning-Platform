# Authentication API Documentation

Complete documentation for all authentication-related endpoints.

## Base URL

```
http://localhost:5000/api/auth
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. User Signup

Register a new user account.

**Endpoint:** `POST /api/auth/signup`

**Access:** Public

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "student",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Aspiring developer"
}
```

**Field Requirements:**

- `name` (required): 2-100 characters
- `email` (required): Valid email format
- `password` (required): Min 6 characters, must contain uppercase, lowercase, and number
- `role` (optional): `student`, `instructor`, or `admin` (default: `student`)
- `avatar_url` (optional): Valid URL
- `bio` (optional): Max 500 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Aspiring developer",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Validation error
- `409` - Email already registered

---

### 2. User Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Aspiring developer",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Invalid credentials

---

### 3. Get Current User Profile

Get authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Aspiring developer",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

- `401` - Unauthorized (no token or invalid token)

---

### 4. Verify User Role

Check user's role and permissions.

**Endpoint:** `GET /api/auth/verify-role`

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Role verified",
  "data": {
    "role": "student",
    "isAdmin": false,
    "isInstructor": false,
    "isStudent": true
  }
}
```

**Error Responses:**

- `401` - Unauthorized

---

### 5. Change Password

Change authenticated user's password.

**Endpoint:** `POST /api/auth/change-password`

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@456"
}
```

**Field Requirements:**

- `oldPassword` (required): Current password
- `newPassword` (required): Min 6 characters, must contain uppercase, lowercase, and number
- New password must be different from old password

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized or incorrect old password

---

### 6. Forgot Password

Request password reset token.

**Endpoint:** `POST /api/auth/forgot-password`

**Access:** Public

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset link sent to email",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** In production, the token should be sent via email, not returned in response.

**Error Responses:**

- `400` - Validation error

---

### 7. Reset Password

Reset password using reset token.

**Endpoint:** `POST /api/auth/reset-password`

**Access:** Public

**Request Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewPassword@123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Invalid or expired token

---

### 8. Logout

Logout user (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note:** With JWT, logout is primarily handled client-side by removing the token. Server can implement token blacklisting if needed.

---

### 9. Refresh Token

Get a new JWT token.

**Endpoint:** `POST /api/auth/refresh-token`

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `401` - Unauthorized

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required or failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

---

## JWT Token Structure

The JWT token contains:

```json
{
  "userId": 1,
  "email": "john@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Expiration:** 7 days (configurable)

---

## Password Requirements

- Minimum 6 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Example valid password: `Password@123`

---

## User Roles

### Student

- Default role
- Can enroll in courses
- Can view own progress
- Can participate in forums

### Instructor

- Can create and manage courses
- Can create quizzes
- Can view student enrollments
- Full access to own courses

### Admin

- Full system access
- Can manage all users
- Can manage all courses
- Can delete any resource

---

## Rate Limiting

Authentication endpoints are rate-limited:

- **Signup/Login:** 5 requests per 15 minutes per IP
- **Other endpoints:** 100 requests per 15 minutes per user

---

## Testing with cURL

### Signup Example

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password@123",
    "role": "student"
  }'
```

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password@123"
  }'
```

### Get Profile Example

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import the authentication endpoints
2. Create an environment variable for `baseUrl` and `token`
3. Set up pre-request scripts to automatically set the token after login
4. Use the token in subsequent requests

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Never log or expose tokens**
3. **Implement rate limiting**
4. **Use strong JWT secrets**
5. **Implement token refresh mechanism**
6. **Consider token blacklisting for logout**
7. **Validate all inputs**
8. **Use bcrypt for password hashing**
9. **Implement account lockout after failed attempts**
10. **Use secure password reset flows**
