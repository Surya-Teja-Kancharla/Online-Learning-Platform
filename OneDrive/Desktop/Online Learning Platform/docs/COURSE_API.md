# Course Management API Documentation

Complete documentation for all course-related endpoints with file upload support.

## Base URL

```
http://localhost:5000/api/courses
```

## Authentication

Most endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Create Course

Create a new course (Instructors only).

**Endpoint:** `POST /api/courses`

**Access:** Private (Instructor only)

**Content-Type:** `multipart/form-data` (for file uploads)

**Request Body:**

```
title: "Complete Web Development Bootcamp" (required, 5-255 chars)
description: "Learn web development..." (required, min 20 chars)
category: "Web Development" (required)
difficulty: "beginner|intermediate|advanced" (required)
price: 99.99 (optional, default: 0)
duration: 4800 (optional, in minutes)
language: "English" (optional, default: English)
syllabus: "Module 1:..." (optional)
requirements: "Basic computer skills" (optional)
learning_outcomes: "Build websites..." (optional)
video: [file] (optional, max 500MB)
thumbnail: [file] (optional, max 5MB)
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": 1,
      "title": "Complete Web Development Bootcamp",
      "description": "Learn web development...",
      "instructor_id": 2,
      "category": "Web Development",
      "difficulty": "beginner",
      "price": 99.99,
      "duration": 4800,
      "thumbnail_url": "http://localhost:5000/uploads/courses/thumbnails/...",
      "video_url": "http://localhost:5000/uploads/courses/videos/...",
      "is_published": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 2. Get All Published Courses

Get all published courses with optional filters.

**Endpoint:** `GET /api/courses/published`

**Access:** Public

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty
- `search` (string): Search in title/description
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): created_at, title, price, rating, enrollment_count
- `sortOrder` (string): ASC or DESC

**Example:** `GET /api/courses/published?category=Web Development&difficulty=beginner&page=1&limit=10`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Complete Web Development Bootcamp",
      "description": "Learn web development...",
      "instructor": {
        "id": 2,
        "name": "John Smith",
        "email": "instructor@example.com"
      },
      "category": "Web Development",
      "difficulty": "beginner",
      "price": 99.99,
      "rating": 4.5,
      "enrollment_count": 500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 3. Get Course by ID

Get detailed course information.

**Endpoint:** `GET /api/courses/:id`

**Access:** Public

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "course": {
      "id": 1,
      "title": "Complete Web Development Bootcamp",
      "description": "Learn web development...",
      "instructor": {
        "id": 2,
        "name": "John Smith",
        "email": "instructor@example.com",
        "avatar_url": "..."
      },
      "category": "Web Development",
      "difficulty": "beginner",
      "price": 99.99,
      "duration": 4800,
      "thumbnail_url": "...",
      "video_url": "...",
      "syllabus": "Module 1:...",
      "requirements": "Basic computer skills",
      "learning_outcomes": "Build websites...",
      "language": "English",
      "is_published": true,
      "enrollment_count": 500,
      "rating": 4.5,
      "rating_count": 120,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 4. Get Instructor's Courses

Get courses created by the authenticated instructor.

**Endpoint:** `GET /api/courses/instructor/me`

**Access:** Private (Instructor only)

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `is_published` (boolean): Filter by published status

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [...]
  }
}
```

---

### 5. Get Instructor Statistics

Get statistics for the authenticated instructor.

**Endpoint:** `GET /api/courses/instructor/stats`

**Access:** Private (Instructor only)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalCourses": 10,
      "publishedCourses": 7,
      "draftCourses": 3,
      "totalEnrollments": 2500,
      "averageRating": "4.35",
      "totalRevenue": "15000.00"
    }
  }
}
```

---

### 6. Update Course

Update course details (Instructor - own courses, Admin - all courses).

**Endpoint:** `PUT /api/courses/:id`

**Access:** Private (Instructor/Admin)

**Content-Type:** `multipart/form-data`

**Request Body:** (all fields optional)

```
title: "Updated Title"
description: "Updated description"
category: "New Category"
difficulty: "intermediate"
price: 149.99
duration: 3600
language: "Spanish"
syllabus: "Updated syllabus"
requirements: "Updated requirements"
learning_outcomes: "Updated outcomes"
is_published: true
video: [file]
thumbnail: [file]
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "course": {...}
  }
}
```

---

### 7. Delete Course

Delete a course (Instructor - own courses, Admin - all courses).

**Endpoint:** `DELETE /api/courses/:id`

**Access:** Private (Instructor/Admin)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### 8. Publish Course

Publish a course to make it visible to students.

**Endpoint:** `POST /api/courses/:id/publish`

**Access:** Private (Instructor/Admin)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Course published successfully",
  "data": {
    "course": {
      "is_published": true,
      ...
    }
  }
}
```

---

### 9. Unpublish Course

Unpublish a course (hide from students).

**Endpoint:** `POST /api/courses/:id/unpublish`

**Access:** Private (Instructor/Admin)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Course unpublished successfully",
  "data": {
    "course": {
      "is_published": false,
      ...
    }
  }
}
```

---

### 10. Search Courses

Search for published courses.

**Endpoint:** `GET /api/courses/search`

**Access:** Public

**Query Parameters:**

- `q` (string): Search query (required)
- `page`, `limit`, `category`, `difficulty`, `minPrice`, `maxPrice`

**Example:** `GET /api/courses/search?q=javascript&category=Web Development`

**Success Response (200):**

```json
{
  "success": true,
  "data": [...courses...],
  "pagination": {...}
}
```

---

### 11. Get Popular Courses

Get most enrolled courses.

**Endpoint:** `GET /api/courses/popular`

**Access:** Public

**Query Parameters:**

- `limit` (number): Number of courses (default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [...]
  }
}
```

---

### 12. Get Top Rated Courses

Get highest rated courses.

**Endpoint:** `GET /api/courses/top-rated`

**Access:** Public

**Query Parameters:**

- `limit` (number): Number of courses (default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [...]
  }
}
```

---

### 13. Get Courses by Category

Get all courses in a specific category.

**Endpoint:** `GET /api/courses/category/:category`

**Access:** Public

**Query Parameters:**

- `page`, `limit`, `difficulty`, `sortBy`, `sortOrder`

**Example:** `GET /api/courses/category/Web Development?difficulty=beginner`

**Success Response (200):**

```json
{
  "success": true,
  "data": [...courses...],
  "pagination": {...}
}
```

---

### 14. Get Available Categories

Get list of all course categories.

**Endpoint:** `GET /api/courses/categories`

**Access:** Public

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "categories": [
      "Web Development",
      "Data Science",
      "Mobile Development",
      "Design"
    ]
  }
}
```

---

## File Upload Requirements

### Video Files

- **Allowed formats:** mp4, avi, mov, wmv, flv, mkv, webm
- **Max size:** 500MB
- **Field name:** `video`

### Thumbnail Images

- **Allowed formats:** jpeg, jpg, png, gif, webp
- **Max size:** 5MB
- **Field name:** `thumbnail`

### Document Files

- **Allowed formats:** pdf, doc, docx, txt, ppt, pptx
- **Max size:** 50MB per document
- **Field name:** `documents` (array, max 5 files)

---

## Error Responses

### 400 - Bad Request (Validation Error)

```json
{
  "success": false,
  "message": "Title must be at least 5 characters"
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to access this course"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Course not found"
}
```

---

## Permission Matrix

| Endpoint          | Student | Instructor | Admin    |
| ----------------- | ------- | ---------- | -------- |
| Create Course     | ❌      | ✅         | ❌       |
| Get Published     | ✅      | ✅         | ✅       |
| Get by ID         | ✅      | ✅         | ✅       |
| Get Own Courses   | ❌      | ✅ (own)   | ✅ (all) |
| Update Course     | ❌      | ✅ (own)   | ✅ (all) |
| Delete Course     | ❌      | ✅ (own)   | ✅ (all) |
| Publish/Unpublish | ❌      | ✅ (own)   | ✅ (all) |

---

## Testing with cURL

### Create Course

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Course" \
  -F "description=This is a test course with enough description" \
  -F "category=Web Development" \
  -F "difficulty=beginner" \
  -F "price=49.99" \
  -F "thumbnail=@/path/to/image.jpg" \
  -F "video=@/path/to/video.mp4"
```

### Get Published Courses

```bash
curl http://localhost:5000/api/courses/published?category=Web%20Development&page=1&limit=10
```

### Update Course

```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "price=59.99"
```

---

## Best Practices

1. **Always validate input** on both client and server
2. **Use appropriate file sizes** to optimize performance
3. **Implement pagination** for large datasets
4. **Cache frequently accessed data** (categories, popular courses)
5. **Compress files** before upload when possible
6. **Use CDN** for serving media files in production
7. **Implement rate limiting** to prevent abuse
8. **Validate file types** on both client and server
9. **Store files in cloud storage** (S3, GCS) in production
10. **Generate thumbnails** from videos automatically

---

## Rate Limiting

- **Create/Update/Delete:** 20 requests per hour per user
- **Get requests:** 100 requests per hour per IP
- **Search:** 50 requests per hour per IP

---

## Pagination

Default pagination settings:

- **Default page:** 1
- **Default limit:** 10
- **Max limit:** 100

---

## Security Considerations

1. Files are validated for type and size
2. Uploaded files are renamed to prevent conflicts
3. Instructors can only modify their own courses
4. Admins have full access to all courses
5. Students cannot create or modify courses
6. File paths are sanitized to prevent directory traversal
7. All uploads are scanned (implement in production)

---

This completes the Course Management API documentation!
