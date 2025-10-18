/**
 * Course Routes
 * Defines all course-related API endpoints
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth.middleware');
const {
  instructorOnly,
  instructorOrAdmin,
  adminOnly
} = require('../middleware/rbac.middleware');
const {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
  searchValidation,
  paginationValidation,
  categoryValidation,
  validateFileUploads
} = require('../middleware/courseValidation.middleware');
const { uploadConfig } = require('../middleware/upload.middleware');

/**
 * @route   GET /api/courses/published
 * @desc    Get all published courses (public)
 * @access  Public
 */
router.get(
  '/published',
  searchValidation,
  courseController.getPublishedCourses
);

/**
 * @route   GET /api/courses/popular
 * @desc    Get popular courses
 * @access  Public
 */
router.get('/popular', courseController.getPopularCourses);

/**
 * @route   GET /api/courses/top-rated
 * @desc    Get top rated courses
 * @access  Public
 */
router.get('/top-rated', courseController.getTopRatedCourses);

/**
 * @route   GET /api/courses/search
 * @desc    Search courses
 * @access  Public
 */
router.get('/search', searchValidation, courseController.searchCourses);

/**
 * @route   GET /api/courses/categories
 * @desc    Get available categories
 * @access  Public
 */
router.get('/categories', courseController.getCategories);

/**
 * @route   GET /api/courses/category/:category
 * @desc    Get courses by category
 * @access  Public
 */
router.get(
  '/category/:category',
  categoryValidation,
  paginationValidation,
  courseController.getCoursesByCategory
);

/**
 * @route   GET /api/courses/instructor/me
 * @desc    Get instructor's own courses
 * @access  Private (Instructor)
 */
router.get(
  '/instructor/me',
  authenticate,
  instructorOnly,
  paginationValidation,
  courseController.getInstructorCourses
);

/**
 * @route   GET /api/courses/instructor/stats
 * @desc    Get instructor statistics
 * @access  Private (Instructor)
 */
router.get(
  '/instructor/stats',
  authenticate,
  instructorOnly,
  courseController.getInstructorStats
);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Instructor)
 */
router.post(
  '/',
  authenticate,
  instructorOnly,
  uploadConfig.courseFiles,
  validateFileUploads,
  createCourseValidation,
  courseController.createCourse
);

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get(
  '/:id',
  courseIdValidation,
  courseController.getCourseById
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Instructor - own courses, Admin - all courses)
 */
router.put(
  '/:id',
  authenticate,
  instructorOrAdmin,
  courseIdValidation,
  uploadConfig.courseFiles,
  validateFileUploads,
  updateCourseValidation,
  courseController.updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Instructor - own courses, Admin - all courses)
 */
router.delete(
  '/:id',
  authenticate,
  instructorOrAdmin,
  courseIdValidation,
  courseController.deleteCourse
);

/**
 * @route   POST /api/courses/:id/publish
 * @desc    Publish course
 * @access  Private (Instructor - own courses, Admin - all courses)
 */
router.post(
  '/:id/publish',
  authenticate,
  instructorOrAdmin,
  courseIdValidation,
  courseController.publishCourse
);

/**
 * @route   POST /api/courses/:id/unpublish
 * @desc    Unpublish course
 * @access  Private (Instructor - own courses, Admin - all courses)
 */
router.post(
  '/:id/unpublish',
  authenticate,
  instructorOrAdmin,
  courseIdValidation,
  courseController.unpublishCourse
);

/**
 * @route   GET /api/courses
 * @desc    Get all courses (with filters)
 * @access  Private (Admin only)
 */
router.get(
  '/',
  authenticate,
  adminOnly,
  paginationValidation,
  courseController.getAllCourses
);

module.exports = router;