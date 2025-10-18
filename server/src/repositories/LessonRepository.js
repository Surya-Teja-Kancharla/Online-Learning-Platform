/**
 * Lesson Repository
 * Handles database operations for lessons
 */

const pool = require('../config/database');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');

class LessonRepository {
  /**
   * Create a new lesson
   */
  async create(lessonData) {
    const query = `
      INSERT INTO lessons (
        course_id, title, description, content_type, content_url,
        video_provider, duration, order_index, is_free_preview
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      lessonData.course_id,
      lessonData.title,
      lessonData.description,
      lessonData.content_type,
      lessonData.content_url,
      lessonData.video_provider,
      lessonData.duration,
      lessonData.order_index || 0,
      lessonData.is_free_preview || false,
    ];

    const result = await pool.query(query, values);
    return Lesson.fromDatabase(result.rows[0]);
  }

  /**
   * Find lesson by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM lessons WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return Lesson.fromDatabase(result.rows[0]);
  }

  /**
   * Find all lessons for a course
   */
  async findByCourse(courseId) {
    const query = `
      SELECT * FROM lessons 
      WHERE course_id = $1 
      ORDER BY order_index ASC
    `;
    
    const result = await pool.query(query, [courseId]);
    return result.rows.map(row => Lesson.fromDatabase(row));
  }

  /**
   * Update lesson
   */
  async update(id, lessonData) {
    const query = `
      UPDATE lessons 
      SET title = $1, description = $2, content_type = $3, 
          content_url = $4, video_provider = $5, duration = $6, 
          order_index = $7, is_free_preview = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      lessonData.title,
      lessonData.description,
      lessonData.content_type,
      lessonData.content_url,
      lessonData.video_provider,
      lessonData.duration,
      lessonData.order_index,
      lessonData.is_free_preview,
      id,
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return Lesson.fromDatabase(result.rows[0]);
  }

  /**
   * Delete lesson
   */
  async delete(id) {
    const query = 'DELETE FROM lessons WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get or create lesson progress
   */
  async getOrCreateProgress(userId, lessonId, courseId) {
    // Try to find existing progress
    let query = `
      SELECT * FROM lesson_progress 
      WHERE user_id = $1 AND lesson_id = $2
    `;
    
    let result = await pool.query(query, [userId, lessonId]);
    
    if (result.rows.length > 0) {
      return LessonProgress.fromDatabase(result.rows[0]);
    }

    // Create new progress record
    query = `
      INSERT INTO lesson_progress (user_id, lesson_id, course_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    result = await pool.query(query, [userId, lessonId, courseId]);
    return LessonProgress.fromDatabase(result.rows[0]);
  }

  /**
   * Update lesson progress
   */
  async updateProgress(userId, lessonId, progressData) {
    const query = `
      UPDATE lesson_progress 
      SET completed = $1, progress_percentage = $2, time_spent = $3, 
          last_position = $4, completed_at = $5, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6 AND lesson_id = $7
      RETURNING *
    `;
    
    const values = [
      progressData.completed,
      progressData.progress_percentage,
      progressData.time_spent,
      progressData.last_position,
      progressData.completed ? new Date() : null,
      userId,
      lessonId,
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return LessonProgress.fromDatabase(result.rows[0]);
  }

  /**
   * Get user's progress for all lessons in a course
   */
  async getCourseProgress(userId, courseId) {
    const query = `
      SELECT lp.*, l.title as lesson_title 
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      WHERE lp.user_id = $1 AND lp.course_id = $2
      ORDER BY l.order_index ASC
    `;
    
    const result = await pool.query(query, [userId, courseId]);
    return result.rows.map(row => LessonProgress.fromDatabase(row));
  }

  /**
   * Mark lesson as complete
   */
  async markComplete(userId, lessonId) {
    const query = `
      UPDATE lesson_progress 
      SET completed = true, progress_percentage = 100, 
          completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND lesson_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, lessonId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return LessonProgress.fromDatabase(result.rows[0]);
  }

  /**
   * Get completion stats for a course
   */
  async getCompletionStats(userId, courseId) {
    const query = `
      SELECT 
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN lp.completed = true THEN 1 END) as completed_lessons,
        AVG(lp.progress_percentage) as average_progress
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
      WHERE l.course_id = $2
    `;
    
    const result = await pool.query(query, [userId, courseId]);
    return result.rows[0];
  }
}

module.exports = new LessonRepository();