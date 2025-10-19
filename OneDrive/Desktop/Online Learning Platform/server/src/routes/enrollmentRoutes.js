/**
 * Enrollment Routes
 * Defines all enrollment-related API endpoints
 */

const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth.middleware');

// Apply authentication middleware to all enrollment routes
router.use(authenticate);

/**
 * @route   GET /api/enrollments/my-enrollments
 * @desc    Get all enrollments for authenticated user
 * @access  Private (Student)
 */
router.get('/my-enrollments', EnrollmentController.getMyEnrollments);

/**
 * @route   POST /api/enrollments/enroll
 * @desc    Enroll in a course
 * @access  Private (Student)
 */
router.post('/enroll', EnrollmentController.enrollInCourse);

/**
 * @route   GET /api/enrollments/course/:courseId
 * @desc    Get enrollment by course ID
 * @access  Private (Student)
 */
router.get('/course/:courseId', EnrollmentController.getEnrollmentByCourse);

/**
 * @route   PUT /api/enrollments/:enrollmentId/progress
 * @desc    Update enrollment progress
 * @access  Private (Student)
 */
router.put('/:enrollmentId/progress', EnrollmentController.updateProgress);

/**
 * @route   POST /api/enrollments/:enrollmentId/complete
 * @desc    Mark enrollment as completed
 * @access  Private (Student)
 */
router.post('/:enrollmentId/complete', EnrollmentController.completeEnrollment);

/**
 * @route   GET /api/enrollments/stats
 * @desc    Get student statistics
 * @access  Private (Student)
 */
router.get('/stats', EnrollmentController.getStudentStats);

/**
 * @route   DELETE /api/enrollments/:enrollmentId
 * @desc    Unenroll from a course
 * @access  Private (Student)
 */
router.delete('/:enrollmentId', EnrollmentController.unenroll);

/**
 * @route   GET /api/enrollments/course/:courseId/progress
 * @desc    Get course progress details
 * @access  Private (Student)
 */
router.get('/course/:courseId/progress', EnrollmentController.getCourseProgress);

module.exports = router;