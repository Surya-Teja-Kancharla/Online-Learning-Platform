/**
 * Course Routes
 * Defines all course-related API endpoints with RBAC
 */

const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');
const {
  uploadThumbnail,
  uploadVideo,
  uploadDocument,
  handleMulterError,
} = require('../middleware/upload.middleware');

/**
 * Public Routes (No authentication required)
 */

/**
 * @route   GET /api/courses/published
 * @desc    Get all published courses with filters
 * @access  Public
 */
router.get('/published', CourseController.getPublishedCourses);

/**
 * @route   GET /api/courses/popular
 * @desc    Get popular courses
 * @access  Public
 */
router.get('/popular', CourseController.getPopularCourses);

/**
 * @route   GET /api/courses/search
 * @desc    Search courses
 * @access  Public
 */
router.get('/search', CourseController.searchCourses);

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID (published courses only for non-authenticated)
 * @access  Public
 */
router.get('/:id', CourseController.getCourseById);

/**
 * Protected Routes (Authentication required)
 */

/**
 * @route   GET /api/courses
 * @desc    Get all courses (instructors see their own, admin sees all)
 * @access  Private (Instructor, Admin)
 */
router.get(
  '/',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.getAllCourses
);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Instructor, Admin)
 */
router.post(
  '/',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.createCourse
);

/**
 * @route   GET /api/courses/instructor/my-courses
 * @desc    Get instructor's courses
 * @access  Private (Instructor)
 */
router.get(
  '/instructor/my-courses',
  authenticate,
  authorizeRoles(['instructor']),
  CourseController.getMyInstructorCourses
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course (owner instructor or admin)
 * @access  Private (Instructor-Owner, Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course (owner instructor or admin)
 * @access  Private (Instructor-Owner, Admin)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.deleteCourse
);

/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Toggle course publish status
 * @access  Private (Instructor-Owner, Admin)
 */
router.patch(
  '/:id/publish',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.togglePublishStatus
);

/**
 * @route   GET /api/courses/:id/stats
 * @desc    Get course statistics
 * @access  Private (Instructor-Owner, Admin)
 */
router.get(
  '/:id/stats',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  CourseController.getCourseStats
);

/**
 * File Upload Routes
 */

/**
 * @route   POST /api/courses/:id/thumbnail
 * @desc    Upload course thumbnail
 * @access  Private (Instructor-Owner, Admin)
 */
router.post(
  '/:id/thumbnail',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  uploadThumbnail,
  handleMulterError,
  CourseController.uploadThumbnail
);

/**
 * @route   POST /api/courses/:id/video
 * @desc    Upload course intro video
 * @access  Private (Instructor-Owner, Admin)
 */
router.post(
  '/:id/video',
  authenticate,
  authorizeRoles(['instructor', 'admin']),
  uploadVideo,
  handleMulterError,
  CourseController.uploadVideo
);

module.exports = router;