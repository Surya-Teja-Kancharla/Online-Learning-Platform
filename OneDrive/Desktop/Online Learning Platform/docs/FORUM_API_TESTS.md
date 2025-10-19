# Forum API Test Collection

# Use with Postman, Thunder Client, or curl

## Environment Variables

```
BASE_URL=http://localhost:5000
TOKEN=your_jwt_token_here
```

---

## 1. CREATE POST

**POST** `{{BASE_URL}}/api/forum/posts`

Headers:

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "course_id": 1,
  "title": "How to implement Redux in React?",
  "content": "I'm building a medium-sized app and wondering if I should use Redux or Context API. What are your recommendations?"
}
```

Expected: 201 Created

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": 4,
      "course_id": 1,
      "user_id": 5,
      "title": "How to implement Redux in React?",
      "content": "...",
      "upvotes": 0,
      "views": 0,
      "created_at": "..."
    }
  }
}
```

---

## 2. GET COURSE POSTS

**GET** `{{BASE_URL}}/api/forum/posts/course/1?page=1&limit=20&sort=recent`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Query Parameters:

- `page`: 1 (default: 1)
- `limit`: 20 (default: 20)
- `sort`: recent | popular | views (default: recent)

Expected: 200 OK

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "...",
        "content": "...",
        "author_name": "Sneha Gupta",
        "upvotes": 5,
        "comment_count": 3,
        "hasVoted": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasMore": false
    }
  }
}
```

---

## 3. GET SINGLE POST

**GET** `{{BASE_URL}}/api/forum/posts/1`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Expected: 200 OK

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "...",
      "content": "...",
      "author_name": "Sneha Gupta",
      "upvotes": 5,
      "views": 15,
      "hasVoted": false,
      "comments": [
        {
          "id": 1,
          "content": "...",
          "author_name": "Dr. Rajesh Kumar",
          "upvotes": 2,
          "hasVoted": false
        }
      ]
    }
  }
}
```

---

## 4. UPDATE POST

**PUT** `{{BASE_URL}}/api/forum/posts/1`

Headers:

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "title": "Updated: How to implement Redux?",
  "content": "Updated content here..."
}
```

Expected: 200 OK

---

## 5. DELETE POST

**DELETE** `{{BASE_URL}}/api/forum/posts/1`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Expected: 200 OK

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 6. UPVOTE POST

**POST** `{{BASE_URL}}/api/forum/posts/1/upvote`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Expected: 200 OK

```json
{
  "success": true,
  "message": "Post upvoted",
  "data": {
    "action": "added",
    "upvoted": true,
    "upvotes": 6
  }
}
```

Note: Calling again will remove the vote (toggle)

---

## 7. PIN POST (Instructor/Admin only)

**PATCH** `{{BASE_URL}}/api/forum/posts/1/pin`

Headers:

```
Authorization: Bearer {{INSTRUCTOR_TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "isPinned": true
}
```

Expected: 200 OK

---

## 8. LOCK POST (Instructor/Admin only)

**PATCH** `{{BASE_URL}}/api/forum/posts/1/lock`

Headers:

```
Authorization: Bearer {{INSTRUCTOR_TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "isLocked": true
}
```

Expected: 200 OK

---

## 9. CREATE COMMENT

**POST** `{{BASE_URL}}/api/forum/comments`

Headers:

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "post_id": 1,
  "content": "Great question! I recommend starting with Context API for medium apps."
}
```

Expected: 201 Created

---

## 10. UPDATE COMMENT

**PUT** `{{BASE_URL}}/api/forum/comments/1`

Headers:

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

Body:

```json
{
  "content": "Updated comment content..."
}
```

Expected: 200 OK

---

## 11. DELETE COMMENT

**DELETE** `{{BASE_URL}}/api/forum/comments/1`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Expected: 200 OK

---

## 12. UPVOTE COMMENT

**POST** `{{BASE_URL}}/api/forum/comments/1/upvote`

Headers:

```
Authorization: Bearer {{TOKEN}}
```

Expected: 200 OK

---

## Error Scenarios to Test

### 1. XSS Attack Prevention

**POST** `/api/forum/posts`

```json
{
  "course_id": 1,
  "title": "Normal Title",
  "content": "<script>alert('XSS')</script>Malicious content"
}
```

Expected: Script tags removed, safe content stored

### 2. Unauthorized Edit

**PUT** `/api/forum/posts/1` (as different user)
Expected: 403 Forbidden

### 3. Self-Vote

**POST** `/api/forum/posts/YOUR_OWN_POST_ID/upvote`
Expected: 400 Bad Request

### 4. Student Pinning Post

**PATCH** `/api/forum/posts/1/pin` (as student)
Expected: 403 Forbidden

### 5. Comment on Locked Post

First lock a post, then try to comment
Expected: 403 Forbidden

### 6. Invalid Input Length

**POST** `/api/forum/posts`

```json
{
  "course_id": 1,
  "title": "AB", // Too short
  "content": "Test"
}
```

Expected: 400 Bad Request

---

## Test Sequence

1. Create post as student ✅
2. Get all posts ✅
3. View single post (increments views) ✅
4. Create comment ✅
5. Upvote post ✅
6. Upvote comment ✅
7. Try to upvote own post ❌
8. Edit post (as owner) ✅
9. Try to edit post (as different user) ❌
10. Pin post as instructor ✅
11. Try to pin post as student ❌
12. Delete comment ✅
13. Delete post ✅

---

## Quick curl Examples

### Create Post

```bash
curl -X POST http://localhost:5000/api/forum/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id":1,"title":"Test Post","content":"This is a test post content"}'
```

### Get Posts

```bash
curl http://localhost:5000/api/forum/posts/course/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Upvote

```bash
curl -X POST http://localhost:5000/api/forum/posts/1/upvote \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Happy Testing! 🧪**
