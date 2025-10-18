/**
 * Lesson Routes
 * API endpoints for lessons
 */

const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { instructorOnly } = require('../middleware/rbac.middleware');

// Create lesson (instructor only)
router.post('/', authenticate, instructorOnly, lessonController.create);

// Get lesson by ID (optional auth for free previews)
router.get('/:id', optionalAuthenticate, lessonController.getById);

// Get lessons by course (optional auth)
router.get('/course/:courseId', optionalAuthenticate, lessonController.getByCourse);

// Update lesson (instructor only)
router.put('/:id', authenticate, instructorOnly, lessonController.update);

// Delete lesson (instructor only)
router.delete('/:id', authenticate, instructorOnly, lessonController.delete);

// Update progress (authenticated students)
router.put('/:id/progress', authenticate, lessonController.updateProgress);

// Mark lesson as complete (authenticated students)
router.post('/:id/complete', authenticate, lessonController.markComplete);

// Get course progress (authenticated students)
router.get('/course/:courseId/progress', authenticate, lessonController.getCourseProgress);

// Get next lesson
router.get('/:id/next', authenticate, lessonController.getNext);

// Get previous lesson
router.get('/:id/previous', authenticate, lessonController.getPrevious);

module.exports = router;