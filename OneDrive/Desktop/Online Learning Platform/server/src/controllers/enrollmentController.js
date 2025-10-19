/**
 * EnrollmentController - Handles enrollment-related operations
 */

const db = require('../config/database');

class EnrollmentController {
  /**
   * Get all enrollments for authenticated user
   */
  async getMyEnrollments(req, res) {
    try {
      const userId = req.user.id; // FIXED: Changed from req.user.userId

      const query = `
        SELECT 
          e.*,
          c.id as course_id,
          c.title as course_title,
          c.description as course_description,
          c.thumbnail_url,
          c.difficulty_level,
          u.name as instructor_name
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN users u ON c.instructor_id = u.id
        WHERE e.user_id = $1
        ORDER BY e.enrolled_at DESC
      `;

      const result = await db.query(query, [userId]);

      res.status(200).json({
        success: true,
        data: {
          enrollments: result.rows
        }
      });
    } catch (error) {
      console.error('Get my enrollments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch enrollments',
        error: error.message
      });
    }
  }

  /**
   * Enroll in a course
   */
  async enrollInCourse(req, res) {
    try {
      const userId = req.user.id; // FIXED: Changed from req.user.userId
      const { course_id } = req.body;

      console.log('Enrollment - userId:', userId, 'course_id:', course_id); // Debug

      if (!course_id) {
        return res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
      }

      // Check if already enrolled
      const checkQuery = 'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2';
      const existing = await db.query(checkQuery, [userId, course_id]);

      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Already enrolled in this course'
        });
      }

      // Create enrollment
      const insertQuery = `
        INSERT INTO enrollments (user_id, course_id, progress, enrolled_at, last_accessed_at)
        VALUES ($1, $2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const result = await db.query(insertQuery, [userId, course_id]);

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course',
        data: {
          enrollment: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Enroll in course error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to enroll in course',
        error: error.message
      });
    }
  }

  /**
   * Get enrollment by course ID
   */
  async getEnrollmentByCourse(req, res) {
    try {
      const userId = req.user.id; // FIXED
      const { courseId } = req.params;

      const query = `
        SELECT e.*, c.title as course_title
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = $1 AND e.course_id = $2
      `;

      const result = await db.query(query, [userId, courseId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          enrollment: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Get enrollment by course error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch enrollment',
        error: error.message
      });
    }
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(req, res) {
    try {
      const userId = req.user.id; // FIXED
      const { enrollmentId } = req.params;
      const { progress } = req.body;

      if (progress < 0 || progress > 100) {
        return res.status(400).json({
          success: false,
          message: 'Progress must be between 0 and 100'
        });
      }

      const query = `
        UPDATE enrollments
        SET progress = $1, last_accessed_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND user_id = $3
        RETURNING *
      `;

      const result = await db.query(query, [progress, enrollmentId, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        data: {
          enrollment: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Update progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update progress',
        error: error.message
      });
    }
  }

  /**
   * Mark enrollment as completed
   */
  async completeEnrollment(req, res) {
    try {
      const userId = req.user.id; // FIXED
      const { enrollmentId } = req.params;

      const query = `
        UPDATE enrollments
        SET progress = 100, completed_at = CURRENT_TIMESTAMP, last_accessed_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;

      const result = await db.query(query, [enrollmentId, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Course completed successfully',
        data: {
          enrollment: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Complete enrollment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete enrollment',
        error: error.message
      });
    }
  }

  /**
   * Get student statistics
   */
  async getStudentStats(req, res) {
    try {
      const userId = req.user.id; // FIXED

      const statsQuery = `
        SELECT 
          COUNT(*) as total_enrollments,
          COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_courses,
          COALESCE(AVG(progress), 0) as average_progress,
          COUNT(CASE WHEN progress > 0 AND completed_at IS NULL THEN 1 END) as in_progress
        FROM enrollments
        WHERE user_id = $1
      `;

      const result = await db.query(statsQuery, [userId]);

      res.status(200).json({
        success: true,
        data: {
          stats: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Get student stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student statistics',
        error: error.message
      });
    }
  }

  /**
   * Unenroll from a course
   */
  async unenroll(req, res) {
    try {
      const userId = req.user.id; // FIXED
      const { enrollmentId } = req.params;

      const query = 'DELETE FROM enrollments WHERE id = $1 AND user_id = $2 RETURNING *';
      const result = await db.query(query, [enrollmentId, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Successfully unenrolled from course'
      });
    } catch (error) {
      console.error('Unenroll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unenroll from course',
        error: error.message
      });
    }
  }

  /**
   * Get course progress details
   */
  async getCourseProgress(req, res) {
    try {
      const userId = req.user.id; // FIXED
      const { courseId } = req.params;

      const query = `
        SELECT 
          e.progress,
          e.enrolled_at,
          e.last_accessed_at,
          e.completed_at,
          COUNT(cc.id) as total_lessons,
          c.title as course_title
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN course_content cc ON c.id = cc.course_id
        WHERE e.user_id = $1 AND e.course_id = $2
        GROUP BY e.id, e.progress, e.enrolled_at, e.last_accessed_at, e.completed_at, c.title
      `;

      const result = await db.query(query, [userId, courseId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          progress: result.rows[0]
        }
      });
    } catch (error) {
      console.error('Get course progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch course progress',
        error: error.message
      });
    }
  }
}

module.exports = new EnrollmentController();