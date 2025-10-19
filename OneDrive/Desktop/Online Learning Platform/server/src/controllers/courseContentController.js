/**
 * Course Content Controller
 * Handles course lessons and materials
 */

const db = require('../config/database');

class CourseContentController {
  /**
   * Get all content for a course
   * GET /api/course-content/course/:courseId
   */
  async getCourseContent(req, res) {
    try {
      const { courseId } = req.params;

      const query = `
        SELECT *
        FROM course_content
        WHERE course_id = $1
        ORDER BY order_index ASC
      `;

      const result = await db.query(query, [courseId]);

      res.status(200).json({
        success: true,
        data: {
          content: result.rows,
        },
      });
    } catch (error) {
      console.error('Get course content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch course content',
        error: error.message,
      });
    }
  }

  /**
   * Get single content item
   * GET /api/course-content/:id
   */
  async getContentById(req, res) {
    try {
      const { id } = req.params;

      const query = 'SELECT * FROM course_content WHERE id = $1';
      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Get content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch content',
        error: error.message,
      });
    }
  }

  /**
   * Create course content (Instructor only)
   * POST /api/course-content
   */
  async createContent(req, res) {
    try {
      const { course_id, type, title, url, content, duration, order_index, is_free } = req.body;

      const query = `
        INSERT INTO course_content (course_id, type, title, url, content, duration, order_index, is_free)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [course_id, type, title, url, content, duration, order_index, is_free || false];
      const result = await db.query(query, values);

      res.status(201).json({
        success: true,
        message: 'Content created successfully',
        data: {
          content: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Create content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create content',
        error: error.message,
      });
    }
  }

  /**
   * Update course content
   * PUT /api/course-content/:id
   */
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const { type, title, url, content, duration, order_index, is_free } = req.body;

      const query = `
        UPDATE course_content
        SET type = COALESCE($1, type),
            title = COALESCE($2, title),
            url = COALESCE($3, url),
            content = COALESCE($4, content),
            duration = COALESCE($5, duration),
            order_index = COALESCE($6, order_index),
            is_free = COALESCE($7, is_free)
        WHERE id = $8
        RETURNING *
      `;

      const values = [type, title, url, content, duration, order_index, is_free, id];
      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        data: {
          content: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update content',
        error: error.message,
      });
    }
  }

  /**
   * Delete course content
   * DELETE /api/course-content/:id
   */
  async deleteContent(req, res) {
    try {
      const { id } = req.params;

      const query = 'DELETE FROM course_content WHERE id = $1 RETURNING *';
      const result = await db.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully',
      });
    } catch (error) {
      console.error('Delete content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete content',
        error: error.message,
      });
    }
  }
}

module.exports = new CourseContentController();