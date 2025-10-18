/**
 * Quiz Routes
 * API endpoints for quizzes
 */

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth.middleware');
const { instructorOnly, studentOnly } = require('../middleware/rbac.middleware');

// Create quiz (instructor only)
router.post('/', authenticate, instructorOnly, quizController.create);

// Get quiz by ID (authenticated users)
router.get('/:id', authenticate, quizController.getById);

// Update quiz (instructor only)
router.put('/:id', authenticate, instructorOnly, quizController.update);

// Delete quiz (instructor only)
router.delete('/:id', authenticate, instructorOnly, quizController.delete);

// Add question to quiz (instructor only)
router.post('/:id/questions', authenticate, instructorOnly, quizController.addQuestion);

// Submit quiz (student only)
router.post('/:id/submit', authenticate, studentOnly, quizController.submit);

// Get quiz history (authenticated users)
router.get('/:id/history', authenticate, quizController.getHistory);

module.exports = router;