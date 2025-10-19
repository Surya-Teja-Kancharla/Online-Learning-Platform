/**
 * Forum Service
 * Business logic for forum operations with validation and sanitization
 */

const ForumRepository = require('../repositories/ForumRepository');
const SanitizationService = require('../utils/sanitizationService');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');

class ForumService {
  // ==================== POSTS ====================

  /**
   * Create a new forum post
   */
  async createPost(userId, postData) {
    // Validate input lengths
    if (!SanitizationService.validateLength(postData.title, 3, 255)) {
      throw new ValidationError('Title must be between 3 and 255 characters');
    }

    if (!SanitizationService.validateLength(postData.content, 10, 10000)) {
      throw new ValidationError('Content must be between 10 and 10,000 characters');
    }

    // Sanitize input to prevent XSS
    const sanitized = SanitizationService.sanitizePostData(postData);

    // Check for spam
    if (SanitizationService.isSpam(sanitized.content)) {
      throw new ValidationError('Post contains spam content');
    }

    // Create post
    const post = await ForumRepository.createPost({
      course_id: postData.course_id,
      user_id: userId,
      title: sanitized.title,
      content: sanitized.content,
    });

    return post;
  }

  /**
   * Get all posts for a course
   */
  async getPostsByCourse(courseId, userId, options = {}) {
    const posts = await ForumRepository.getPostsByCourse(courseId, options);
    
    // Get user's voted posts
    const votedPosts = await ForumRepository.getUserVotedPosts(userId, courseId);
    
    // Add hasVoted flag to each post
    return posts.map(post => ({
      ...post,
      hasVoted: votedPosts.includes(post.id),
    }));
  }

  /**
   * Get a single post with comments
   */
  async getPostById(postId, userId) {
    const post = await ForumRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Increment view count
    await ForumRepository.incrementViews(postId);

    // Get comments
    const comments = await ForumRepository.getCommentsByPost(postId);

    // Check if user has voted
    const hasVoted = await ForumRepository.hasUserVotedPost(postId, userId);

    // Check which comments user has voted on
    const commentsWithVotes = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        hasVoted: await ForumRepository.hasUserVotedComment(comment.id, userId),
      }))
    );

    return {
      ...post,
      hasVoted,
      comments: commentsWithVotes,
    };
  }

  /**
   * Update a post
   */
  async updatePost(postId, userId, userRole, updateData) {
    const post = await ForumRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Only author or instructor/admin can update
    if (post.user_id !== userId && !['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('You do not have permission to update this post');
    }

    // Check if post is locked
    if (post.is_locked && post.user_id !== userId) {
      throw new ForbiddenError('This post is locked and cannot be edited');
    }

    // Sanitize input
    const sanitized = {};
    if (updateData.title) {
      if (!SanitizationService.validateLength(updateData.title, 3, 255)) {
        throw new ValidationError('Title must be between 3 and 255 characters');
      }
      sanitized.title = SanitizationService.sanitizeText(updateData.title);
    }

    if (updateData.content) {
      if (!SanitizationService.validateLength(updateData.content, 10, 10000)) {
        throw new ValidationError('Content must be between 10 and 10,000 characters');
      }
      sanitized.content = SanitizationService.sanitizeHTML(updateData.content);
    }

    const updatedPost = await ForumRepository.updatePost(postId, sanitized);
    return updatedPost;
  }

  /**
   * Delete a post
   */
  async deletePost(postId, userId, userRole) {
    const post = await ForumRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Only author or instructor/admin can delete
    if (post.user_id !== userId && !['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('You do not have permission to delete this post');
    }

    await ForumRepository.deletePost(postId);
  }

  /**
   * Upvote a post
   */
  async upvotePost(postId, userId) {
    const post = await ForumRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Cannot vote on own post
    if (post.user_id === userId) {
      throw new ValidationError('You cannot vote on your own post');
    }

    const result = await ForumRepository.upvotePost(postId, userId);
    
    // Get updated post
    const updatedPost = await ForumRepository.getPostById(postId);
    
    return {
      ...result,
      upvotes: updatedPost.upvotes,
    };
  }

  /**
   * Pin/Unpin a post (Instructor/Admin only)
   */
  async togglePin(postId, userId, userRole, isPinned) {
    if (!['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('Only instructors and admins can pin posts');
    }

    const post = await ForumRepository.togglePin(postId, isPinned);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  /**
   * Lock/Unlock a post (Instructor/Admin only)
   */
  async toggleLock(postId, userId, userRole, isLocked) {
    if (!['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('Only instructors and admins can lock posts');
    }

    const post = await ForumRepository.toggleLock(postId, isLocked);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  // ==================== COMMENTS ====================

  /**
   * Create a comment
   */
  async createComment(userId, commentData) {
    // Check if post exists and is not locked
    const post = await ForumRepository.getPostById(commentData.post_id);
    
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.is_locked) {
      throw new ForbiddenError('This post is locked and cannot accept new comments');
    }

    // Validate content length
    if (!SanitizationService.validateLength(commentData.content, 1, 5000)) {
      throw new ValidationError('Comment must be between 1 and 5,000 characters');
    }

    // Sanitize input
    const sanitized = SanitizationService.sanitizeCommentData(commentData);

    // Check for spam
    if (SanitizationService.isSpam(sanitized.content)) {
      throw new ValidationError('Comment contains spam content');
    }

    // Create comment
    const comment = await ForumRepository.createComment({
      post_id: commentData.post_id,
      user_id: userId,
      content: sanitized.content,
    });

    return comment;
  }

  /**
   * Update a comment
   */
  async updateComment(commentId, userId, userRole, content) {
    // Get comment with author info
    const comments = await ForumRepository.getCommentsByPost(0);
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    // Only author or instructor/admin can update
    if (comment.user_id !== userId && !['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('You do not have permission to update this comment');
    }

    // Validate and sanitize
    if (!SanitizationService.validateLength(content, 1, 5000)) {
      throw new ValidationError('Comment must be between 1 and 5,000 characters');
    }

    const sanitized = SanitizationService.sanitizeHTML(content);

    const updatedComment = await ForumRepository.updateComment(commentId, sanitized);
    return updatedComment;
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId, userId, userRole) {
    const comments = await ForumRepository.getCommentsByPost(0);
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    // Only author or instructor/admin can delete
    if (comment.user_id !== userId && !['instructor', 'admin'].includes(userRole)) {
      throw new ForbiddenError('You do not have permission to delete this comment');
    }

    await ForumRepository.deleteComment(commentId);
  }

  /**
   * Upvote a comment
   */
  async upvoteComment(commentId, userId) {
    const result = await ForumRepository.upvoteComment(commentId, userId);
    return result;
  }
}

module.exports = new ForumService();