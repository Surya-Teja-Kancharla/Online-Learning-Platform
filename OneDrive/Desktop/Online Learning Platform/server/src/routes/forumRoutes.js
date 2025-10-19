/**
 * Forum Routes
 * API endpoints for discussion forum with RBAC
 */

const express = require('express');
const router = express.Router();
const ForumController = require('../controllers/forumController');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/rbac.middleware');

// All forum routes require authentication
router.use(authenticate);

// ==================== POST ROUTES ====================

/**
 * @route   POST /api/forum/posts
 * @desc    Create a new forum post
 * @access  Private (Student, Instructor, Admin)
 */
router.post(
  '/posts',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.createPost
);

/**
 * @route   GET /api/forum/posts/course/:courseId
 * @desc    Get all posts for a course
 * @access  Private (Student, Instructor, Admin)
 */
router.get(
  '/posts/course/:courseId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.getPostsByCourse
);

/**
 * @route   GET /api/forum/posts/:postId
 * @desc    Get a single post with comments
 * @access  Private (Student, Instructor, Admin)
 */
router.get(
  '/posts/:postId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.getPostById
);

/**
 * @route   PUT /api/forum/posts/:postId
 * @desc    Update a post
 * @access  Private (Author, Instructor, Admin)
 */
router.put(
  '/posts/:postId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.updatePost
);

/**
 * @route   DELETE /api/forum/posts/:postId
 * @desc    Delete a post
 * @access  Private (Author, Instructor, Admin)
 */
router.delete(
  '/posts/:postId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.deletePost
);

/**
 * @route   POST /api/forum/posts/:postId/upvote
 * @desc    Upvote a post (toggle)
 * @access  Private (Student, Instructor, Admin)
 */
router.post(
  '/posts/:postId/upvote',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.upvotePost
);

/**
 * @route   PATCH /api/forum/posts/:postId/pin
 * @desc    Pin/Unpin a post
 * @access  Private (Instructor, Admin only)
 */
router.patch(
  '/posts/:postId/pin',
  authorizeRoles(['instructor', 'admin']),
  ForumController.pinPost
);

/**
 * @route   PATCH /api/forum/posts/:postId/lock
 * @desc    Lock/Unlock a post
 * @access  Private (Instructor, Admin only)
 */
router.patch(
  '/posts/:postId/lock',
  authorizeRoles(['instructor', 'admin']),
  ForumController.lockPost
);

// ==================== COMMENT ROUTES ====================

/**
 * @route   POST /api/forum/comments
 * @desc    Create a comment
 * @access  Private (Student, Instructor, Admin)
 */
router.post(
  '/comments',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.createComment
);

/**
 * @route   PUT /api/forum/comments/:commentId
 * @desc    Update a comment
 * @access  Private (Author, Instructor, Admin)
 */
router.put(
  '/comments/:commentId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.updateComment
);

/**
 * @route   DELETE /api/forum/comments/:commentId
 * @desc    Delete a comment
 * @access  Private (Author, Instructor, Admin)
 */
router.delete(
  '/comments/:commentId',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.deleteComment
);

/**
 * @route   POST /api/forum/comments/:commentId/upvote
 * @desc    Upvote a comment (toggle)
 * @access  Private (Student, Instructor, Admin)
 */
router.post(
  '/comments/:commentId/upvote',
  authorizeRoles(['student', 'instructor', 'admin']),
  ForumController.upvoteComment
);

module.exports = router;