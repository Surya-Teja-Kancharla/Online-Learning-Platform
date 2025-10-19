/**
 * Course Content Routes
 * API endpoints for course lessons and materials
 */

const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContentController');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');

/**
 * Public/Student Routes
 */

// Get all content for a course
router.get('/course/:courseId', authenticate, courseContentController.getCourseContent);

// Get single content item
router.get('/:id', authenticate, courseContentController.getContentById);

/**
 * Instructor/Admin Routes
 */

// Create course content
router.post(
  '/',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  courseContentController.createContent
);

// Update course content
router.put(
  '/:id',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  courseContentController.updateContent
);

// Delete course content
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  courseContentController.deleteContent
);

module.exports = router;