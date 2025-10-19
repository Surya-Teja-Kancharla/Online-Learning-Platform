/**
 * Forum Repository
 * Handles all database operations for forum posts and comments
 */

const db = require('../config/database');

class ForumRepository {
  // ==================== POSTS ====================

  /**
   * Create a new forum post
   */
  async createPost(postData) {
    const { course_id, user_id, title, content } = postData;
    
    const query = `
      INSERT INTO forum_posts (course_id, user_id, title, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [course_id, user_id, title, content]);
    return result.rows[0];
  }

  /**
   * Get all posts for a course
   */
  async getPostsByCourse(courseId, options = {}) {
    const { limit = 20, offset = 0, sort = 'recent' } = options;
    
    let orderBy = 'fp.created_at DESC';
    if (sort === 'popular') {
      orderBy = 'fp.upvotes DESC, fp.created_at DESC';
    } else if (sort === 'views') {
      orderBy = 'fp.views DESC';
    }

    const query = `
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        COUNT(DISTINCT fc.id) as comment_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN forum_comments fc ON fp.id = fc.post_id
      WHERE fp.course_id = $1
      GROUP BY fp.id, u.id, u.name, u.avatar_url, u.role
      ORDER BY fp.is_pinned DESC, ${orderBy}
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [courseId, limit, offset]);
    return result.rows;
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId) {
    const query = `
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        COUNT(DISTINCT fc.id) as comment_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN forum_comments fc ON fp.id = fc.post_id
      WHERE fp.id = $1
      GROUP BY fp.id, u.id, u.name, u.avatar_url, u.role
    `;
    
    const result = await db.query(query, [postId]);
    return result.rows[0];
  }

  /**
   * Update a post
   */
  async updatePost(postId, updateData) {
    const { title, content } = updateData;
    
    const query = `
      UPDATE forum_posts
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [title, content, postId]);
    return result.rows[0];
  }

  /**
   * Delete a post
   */
  async deletePost(postId) {
    const query = 'DELETE FROM forum_posts WHERE id = $1 RETURNING *';
    const result = await db.query(query, [postId]);
    return result.rows[0];
  }

  /**
   * Increment post views
   */
  async incrementViews(postId) {
    const query = `
      UPDATE forum_posts
      SET views = views + 1
      WHERE id = $1
      RETURNING views
    `;
    
    const result = await db.query(query, [postId]);
    return result.rows[0]?.views;
  }

  /**
   * Pin/Unpin a post
   */
  async togglePin(postId, isPinned) {
    const query = `
      UPDATE forum_posts
      SET is_pinned = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [isPinned, postId]);
    return result.rows[0];
  }

  /**
   * Lock/Unlock a post
   */
  async toggleLock(postId, isLocked) {
    const query = `
      UPDATE forum_posts
      SET is_locked = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [isLocked, postId]);
    return result.rows[0];
  }

  // ==================== COMMENTS ====================

  /**
   * Create a new comment
   */
  async createComment(commentData) {
    const { post_id, user_id, content } = commentData;
    
    const query = `
      INSERT INTO forum_comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await db.query(query, [post_id, user_id, content]);
    return result.rows[0];
  }

  /**
   * Get all comments for a post
   */
  async getCommentsByPost(postId) {
    const query = `
      SELECT 
        fc.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role
      FROM forum_comments fc
      JOIN users u ON fc.user_id = u.id
      WHERE fc.post_id = $1
      ORDER BY fc.created_at ASC
    `;
    
    const result = await db.query(query, [postId]);
    return result.rows;
  }

  /**
   * Update a comment
   */
  async updateComment(commentId, content) {
    const query = `
      UPDATE forum_comments
      SET content = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [content, commentId]);
    return result.rows[0];
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId) {
    const query = 'DELETE FROM forum_comments WHERE id = $1 RETURNING *';
    const result = await db.query(query, [commentId]);
    return result.rows[0];
  }

  // ==================== VOTES ====================

  /**
   * Upvote a post
   */
  async upvotePost(postId, userId) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if already voted
      const checkQuery = 'SELECT * FROM post_votes WHERE post_id = $1 AND user_id = $2';
      const existing = await client.query(checkQuery, [postId, userId]);
      
      if (existing.rows.length > 0) {
        // Remove vote
        await client.query('DELETE FROM post_votes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
        await client.query('UPDATE forum_posts SET upvotes = upvotes - 1 WHERE id = $1', [postId]);
        await client.query('COMMIT');
        return { action: 'removed', upvoted: false };
      } else {
        // Add vote
        await client.query('INSERT INTO post_votes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
        await client.query('UPDATE forum_posts SET upvotes = upvotes + 1 WHERE id = $1', [postId]);
        await client.query('COMMIT');
        return { action: 'added', upvoted: true };
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Upvote a comment
   */
  async upvoteComment(commentId, userId) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if already voted
      const checkQuery = 'SELECT * FROM comment_votes WHERE comment_id = $1 AND user_id = $2';
      const existing = await client.query(checkQuery, [commentId, userId]);
      
      if (existing.rows.length > 0) {
        // Remove vote
        await client.query('DELETE FROM comment_votes WHERE comment_id = $1 AND user_id = $2', [commentId, userId]);
        await client.query('UPDATE forum_comments SET upvotes = upvotes - 1 WHERE id = $1', [commentId]);
        await client.query('COMMIT');
        return { action: 'removed', upvoted: false };
      } else {
        // Add vote
        await client.query('INSERT INTO comment_votes (comment_id, user_id) VALUES ($1, $2)', [commentId, userId]);
        await client.query('UPDATE forum_comments SET upvotes = upvotes + 1 WHERE id = $1', [commentId]);
        await client.query('COMMIT');
        return { action: 'added', upvoted: true };
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if user has voted on post
   */
  async hasUserVotedPost(postId, userId) {
    const query = 'SELECT * FROM post_votes WHERE post_id = $1 AND user_id = $2';
    const result = await db.query(query, [postId, userId]);
    return result.rows.length > 0;
  }

  /**
   * Check if user has voted on comment
   */
  async hasUserVotedComment(commentId, userId) {
    const query = 'SELECT * FROM comment_votes WHERE comment_id = $1 AND user_id = $2';
    const result = await db.query(query, [commentId, userId]);
    return result.rows.length > 0;
  }

  /**
   * Get user's voted posts
   */
  async getUserVotedPosts(userId, courseId) {
    const query = `
      SELECT pv.post_id
      FROM post_votes pv
      JOIN forum_posts fp ON pv.post_id = fp.id
      WHERE pv.user_id = $1 AND fp.course_id = $2
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return result.rows.map(row => row.post_id);
  }
}

module.exports = new ForumRepository();