/**
 * Forum Controller
 * Handles HTTP requests for forum posts and comments
 */

const ForumService = require('../services/ForumService');

class ForumController {
  // ==================== POSTS ====================

  /**
   * Create a new post
   * POST /api/forum/posts
   */
  async createPost(req, res, next) {
    try {
      const userId = req.user.id;
      const { course_id, title, content } = req.body;

      if (!course_id || !title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Course ID, title, and content are required',
        });
      }

      const post = await ForumService.createPost(userId, {
        course_id,
        title,
        content,
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all posts for a course
   * GET /api/forum/posts/course/:courseId
   */
  async getPostsByCourse(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const { page = 1, limit = 20, sort = 'recent' } = req.query;

      const offset = (page - 1) * limit;

      const posts = await ForumService.getPostsByCourse(
        courseId,
        userId,
        { limit: parseInt(limit), offset, sort }
      );

      res.status(200).json({
        success: true,
        data: {
          posts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: posts.length === parseInt(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single post with comments
   * GET /api/forum/posts/:postId
   */
  async getPostById(req, res, next) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const post = await ForumService.getPostById(postId, userId);

      res.status(200).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a post
   * PUT /api/forum/posts/:postId
   */
  async updatePost(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { postId } = req.params;
      const { title, content } = req.body;

      const post = await ForumService.updatePost(
        postId,
        userId,
        userRole,
        { title, content }
      );

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a post
   * DELETE /api/forum/posts/:postId
   */
  async deletePost(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { postId } = req.params;

      await ForumService.deletePost(postId, userId, userRole);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upvote a post
   * POST /api/forum/posts/:postId/upvote
   */
  async upvotePost(req, res, next) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const result = await ForumService.upvotePost(postId, userId);

      res.status(200).json({
        success: true,
        message: result.action === 'added' ? 'Post upvoted' : 'Vote removed',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Pin a post (Instructor/Admin only)
   * PATCH /api/forum/posts/:postId/pin
   */
  async pinPost(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { postId } = req.params;
      const { isPinned } = req.body;

      const post = await ForumService.togglePin(postId, userId, userRole, isPinned);

      res.status(200).json({
        success: true,
        message: isPinned ? 'Post pinned' : 'Post unpinned',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lock a post (Instructor/Admin only)
   * PATCH /api/forum/posts/:postId/lock
   */
  async lockPost(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { postId } = req.params;
      const { isLocked } = req.body;

      const post = await ForumService.toggleLock(postId, userId, userRole, isLocked);

      res.status(200).json({
        success: true,
        message: isLocked ? 'Post locked' : 'Post unlocked',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== COMMENTS ====================

  /**
   * Create a comment
   * POST /api/forum/comments
   */
  async createComment(req, res, next) {
    try {
      const userId = req.user.id;
      const { post_id, content } = req.body;

      if (!post_id || !content) {
        return res.status(400).json({
          success: false,
          message: 'Post ID and content are required',
        });
      }

      const comment = await ForumService.createComment(userId, {
        post_id,
        content,
      });

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a comment
   * PUT /api/forum/comments/:commentId
   */
  async updateComment(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { commentId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Content is required',
        });
      }

      const comment = await ForumService.updateComment(
        commentId,
        userId,
        userRole,
        content
      );

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment
   * DELETE /api/forum/comments/:commentId
   */
  async deleteComment(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { commentId } = req.params;

      await ForumService.deleteComment(commentId, userId, userRole);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upvote a comment
   * POST /api/forum/comments/:commentId/upvote
   */
  async upvoteComment(req, res, next) {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await ForumService.upvoteComment(commentId, userId);

      res.status(200).json({
        success: true,
        message: result.action === 'added' ? 'Comment upvoted' : 'Vote removed',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ForumController();