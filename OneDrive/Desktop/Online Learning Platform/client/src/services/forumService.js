/**
 * Forum Service (Frontend)
 * API calls for discussion forum
 */

import api from './api';

const forumService = {
  // ==================== POSTS ====================

  /**
   * Get all posts for a course
   */
  async getCoursePosts(courseId, params = {}) {
    const { page = 1, limit = 20, sort = 'recent' } = params;
    const response = await api.get(`/forum/posts/course/${courseId}`, {
      params: { page, limit, sort },
    });
    return response.data.data;
  },

  /**
   * Get a single post with comments
   */
  async getPostById(postId) {
    const response = await api.get(`/forum/posts/${postId}`);
    return response.data.data;
  },

  /**
   * Create a new post
   */
  async createPost(postData) {
    const response = await api.post('/forum/posts', postData);
    return response.data.data;
  },

  /**
   * Update a post
   */
  async updatePost(postId, updateData) {
    const response = await api.put(`/forum/posts/${postId}`, updateData);
    return response.data.data;
  },

  /**
   * Delete a post
   */
  async deletePost(postId) {
    const response = await api.delete(`/forum/posts/${postId}`);
    return response.data;
  },

  /**
   * Upvote a post
   */
  async upvotePost(postId) {
    const response = await api.post(`/forum/posts/${postId}/upvote`);
    return response.data.data;
  },

  /**
   * Pin a post (Instructor/Admin only)
   */
  async pinPost(postId, isPinned) {
    const response = await api.patch(`/forum/posts/${postId}/pin`, { isPinned });
    return response.data.data;
  },

  /**
   * Lock a post (Instructor/Admin only)
   */
  async lockPost(postId, isLocked) {
    const response = await api.patch(`/forum/posts/${postId}/lock`, { isLocked });
    return response.data.data;
  },

  // ==================== COMMENTS ====================

  /**
   * Create a comment
   */
  async createComment(commentData) {
    const response = await api.post('/forum/comments', commentData);
    return response.data.data;
  },

  /**
   * Update a comment
   */
  async updateComment(commentId, content) {
    const response = await api.put(`/forum/comments/${commentId}`, { content });
    return response.data.data;
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId) {
    const response = await api.delete(`/forum/comments/${commentId}`);
    return response.data;
  },

  /**
   * Upvote a comment
   */
  async upvoteComment(commentId) {
    const response = await api.post(`/forum/comments/${commentId}/upvote`);
    return response.data.data;
  },
};

export default forumService;