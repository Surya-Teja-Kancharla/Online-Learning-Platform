/**
 * Course API Integration Tests
 * Tests for course CRUD operations and permissions
 */

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const path = require('path');

describe('Course API', () => {
  let instructorToken;
  let studentToken;
  let adminToken;
  let courseId;

  // Setup - Login users
  beforeAll(async () => {
    // Login as instructor
    const instructorRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'instructor@example.com',
        password: 'Password@123'
      });
    instructorToken = instructorRes.body.data.token;

    // Login as student
    const studentRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@example.com',
        password: 'Password@123'
      });
    studentToken = studentRes.body.data.token;

    // Login as admin (if exists)
    try {
      const adminRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Password@123'
        });
      adminToken = adminRes.body.data.token;
    } catch (error) {
      console.log('Admin user not found, skipping admin tests');
    }
  });

  afterAll(async () => {
    await db.closePool();
  });

  describe('POST /api/courses', () => {
    it('should create a course as instructor', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Test Course',
          description: 'This is a test course description with enough characters',
          category: 'Web Development',
          difficulty: 'beginner',
          price: 49.99,
          duration: 1200,
          language: 'English'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course).toHaveProperty('id');
      expect(response.body.data.course.title).toBe('Test Course');
      
      courseId = response.body.data.course.id;
    });

    it('should reject course creation by student', async () => {
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Test Course',
          description: 'This is a test course description',
          category: 'Web Development',
          difficulty: 'beginner'
        })
        .expect(403);
    });

    it('should reject course with short title', async () => {
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Test',
          description: 'This is a test course description',
          category: 'Web Development',
          difficulty: 'beginner'
        })
        .expect(400);
    });

    it('should reject course with invalid difficulty', async () => {
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Valid Test Course Title',
          description: 'This is a test course description',
          category: 'Web Development',
          difficulty: 'expert'
        })
        .expect(400);
    });
  });

  describe('GET /api/courses/published', () => {
    it('should get published courses', async () => {
      const response = await request(app)
        .get('/api/courses/published')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter courses by category', async () => {
      const response = await request(app)
        .get('/api/courses/published?category=Web Development')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(course => {
        expect(course.category).toBe('Web Development');
      });
    });

    it('should filter courses by difficulty', async () => {
      const response = await request(app)
        .get('/api/courses/published?difficulty=beginner')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(course => {
        expect(course.difficulty).toBe('beginner');
      });
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should get course by ID', async () => {
      const response = await request(app)
        .get(`/api/courses/${courseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course).toHaveProperty('id');
      expect(response.body.data.course.id).toBe(courseId);
    });

    it('should return 404 for non-existent course', async () => {
      await request(app)
        .get('/api/courses/99999')
        .expect(404);
    });
  });

  describe('GET /api/courses/instructor/me', () => {
    it('should get instructor\'s own courses', async () => {
      const response = await request(app)
        .get('/api/courses/instructor/me')
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.courses)).toBe(true);
    });

    it('should reject access by student', async () => {
      await request(app)
        .get('/api/courses/instructor/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update own course as instructor', async () => {
      const response = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Updated Test Course',
          price: 59.99
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course.title).toBe('Updated Test Course');
      expect(parseFloat(response.body.data.course.price)).toBe(59.99);
    });

    it('should reject update by non-owner', async () => {
      await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Hacked Course'
        })
        .expect(403);
    });
  });

  describe('POST /api/courses/:id/publish', () => {
    it('should publish course', async () => {
      const response = await request(app)
        .post(`/api/courses/${courseId}/publish`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course.is_published).toBe(true);
    });
  });

  describe('POST /api/courses/:id/unpublish', () => {
    it('should unpublish course', async () => {
      const response = await request(app)
        .post(`/api/courses/${courseId}/unpublish`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course.is_published).toBe(false);
    });
  });

  describe('GET /api/courses/search', () => {
    it('should search courses', async () => {
      const response = await request(app)
        .get('/api/courses/search?q=web')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/courses/popular', () => {
    it('should get popular courses', async () => {
      const response = await request(app)
        .get('/api/courses/popular?limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.courses)).toBe(true);
    });
  });

  describe('GET /api/courses/categories', () => {
    it('should get available categories', async () => {
      const response = await request(app)
        .get('/api/courses/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.categories)).toBe(true);
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete own course as instructor', async () => {
      const response = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for deleted course', async () => {
      await request(app)
        .get(`/api/courses/${courseId}`)
        .expect(404);
    });
  });

  describe('Admin permissions', () => {
    if (adminToken) {
      it('should allow admin to delete any course', async () => {
        // Create a course as instructor
        const createRes = await request(app)
          .post('/api/courses')
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            title: 'Course to be deleted by admin',
            description: 'This course will be deleted by admin',
            category: 'Test',
            difficulty: 'beginner'
          });

        const newCourseId = createRes.body.data.course.id;

        // Delete as admin
        const deleteRes = await request(app)
          .delete(`/api/courses/${newCourseId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(deleteRes.body.success).toBe(true);
      });
    }
  });
});