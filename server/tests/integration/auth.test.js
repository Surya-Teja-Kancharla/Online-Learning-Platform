/**
 * Authentication API Integration Tests
 * Tests for signup, login, and role verification
 */

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('Authentication API', () => {
  // Clean up database before tests
  beforeAll(async () => {
    // Create test database tables if needed
    // In production, use a separate test database
  });

  // Clean up after all tests
  afterAll(async () => {
    await db.closePool();
  });

  describe('POST /api/auth/signup', () => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password@123',
      role: 'student'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should reject signup with duplicate email', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(409);
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject signup with short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'another@example.com',
          password: '12345'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'weak@example.com',
          password: 'weakpassword'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject signup with invalid role', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'invalid@example.com',
          role: 'superuser'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'Password@123'
    };

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginCredentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginCredentials.email);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginCredentials.email,
          password: 'WrongPassword@123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password@123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject login without email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password@123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject login without password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginCredentials.email
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password@123'
        });
      
      authToken = response.body.data.token;
    });

    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/verify-role', () => {
    let studentToken;
    let instructorToken;
    let adminToken;

    beforeAll(async () => {
      // Create and login users with different roles
      // Student
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Student Test',
          email: 'student.test@example.com',
          password: 'Password@123',
          role: 'student'
        });
      
      const studentResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student.test@example.com',
          password: 'Password@123'
        });
      studentToken = studentResponse.body.data.token;

      // Instructor
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Instructor Test',
          email: 'instructor.test@example.com',
          password: 'Password@123',
          role: 'instructor'
        });
      
      const instructorResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'instructor.test@example.com',
          password: 'Password@123'
        });
      instructorToken = instructorResponse.body.data.token;
    });

    it('should verify student role', async () => {
      const response = await request(app)
        .get('/api/auth/verify-role')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.data.role).toBe('student');
      expect(response.body.data.isStudent).toBe(true);
      expect(response.body.data.isInstructor).toBe(false);
      expect(response.body.data.isAdmin).toBe(false);
    });

    it('should verify instructor role', async () => {
      const response = await request(app)
        .get('/api/auth/verify-role')
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      expect(response.body.data.role).toBe('instructor');
      expect(response.body.data.isStudent).toBe(false);
      expect(response.body.data.isInstructor).toBe(true);
      expect(response.body.data.isAdmin).toBe(false);
    });
  });

  describe('POST /api/auth/change-password', () => {
    let authToken;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password@123'
        });
      
      authToken = response.body.data.token;
    });

    it('should change password with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'Password@123',
          newPassword: 'NewPassword@123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject change with wrong old password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'WrongPassword@123',
          newPassword: 'NewPassword@123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});