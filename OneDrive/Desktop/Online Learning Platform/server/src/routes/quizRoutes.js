/**
 * Quiz Routes
 * API endpoints for quizzes
 */

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');

// Create quiz (instructor only)
router.post('/', authenticate, authorizeRoles(['instructor', 'admin']), quizController.create);

// Get quiz by ID (authenticated users)
router.get('/:id', authenticate, quizController.getById);

// Update quiz (instructor only)
router.put('/:id', authenticate, authorizeRoles(['instructor', 'admin']), quizController.update);

// Delete quiz (instructor only)
router.delete('/:id', authenticate, authorizeRoles(['instructor', 'admin']), quizController.delete);

// Add question to quiz (instructor only)
router.post('/:id/questions', authenticate, authorizeRoles(['instructor', 'admin']), quizController.addQuestion);

// Submit quiz (student only)
router.post('/:id/submit', authenticate, authorizeRoles(['student']), quizController.submit);

// Get quiz history (authenticated users)
router.get('/:id/history', authenticate, quizController.getHistory);

module.exports = router;