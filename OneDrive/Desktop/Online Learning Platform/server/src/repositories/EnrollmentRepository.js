/**
 * Enrollment Repository
 * Database queries for enrollment operations
 */

const db = require('../config/database');

class EnrollmentRepository {
  /**
   * Create a new enrollment
   */
  async create(enrollmentData) {
    const { student_id, course_id } = enrollmentData;
    
    const query = `
      INSERT INTO enrollments (student_id, course_id, enrolled_at, progress)
      VALUES ($1, $2, NOW(), 0)
      RETURNING *
    `;
    
    const result = await db.query(query, [student_id, course_id]);
    return result.rows[0];
  }

  /**
   * Get enrollment by ID
   */
  async findById(id) {
    const query = `
      SELECT e.*, 
             c.title as course_title,
             c.thumbnail_url,
             u.username as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all enrollments for a student
   */
  async findByStudentId(studentId) {
    const query = `
      SELECT e.*, 
             c.title as course_title,
             c.description,
             c.thumbnail_url,
             c.difficulty_level,
             u.username as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.student_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  /**
   * Get enrollment by student and course
   */
  async findByStudentAndCourse(studentId, courseId) {
    const query = `
      SELECT * FROM enrollments
      WHERE student_id = $1 AND course_id = $2
    `;
    
    const result = await db.query(query, [studentId, courseId]);
    return result.rows[0];
  }

  /**
   * Get all enrollments for a course
   */
  async findByCourseId(courseId) {
    const query = `
      SELECT e.*, 
             u.username as student_name,
             u.email as student_email
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      WHERE e.course_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    
    const result = await db.query(query, [courseId]);
    return result.rows;
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(id, progress) {
    const query = `
      UPDATE enrollments
      SET progress = $1, last_accessed_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [progress, id]);
    return result.rows[0];
  }

  /**
   * Update last accessed time
   */
  async updateLastAccessed(id) {
    const query = `
      UPDATE enrollments
      SET last_accessed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Mark enrollment as completed
   */
  async markCompleted(id) {
    const query = `
      UPDATE enrollments
      SET completed_at = NOW(), progress = 100
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Delete enrollment
   */
  async delete(id) {
    const query = `DELETE FROM enrollments WHERE id = $1`;
    await db.query(query, [id]);
  }

  /**
   * Check if student is enrolled in course
   */
  async isEnrolled(studentId, courseId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM enrollments
        WHERE student_id = $1 AND course_id = $2
      ) as is_enrolled
    `;
    
    const result = await db.query(query, [studentId, courseId]);
    return result.rows[0].is_enrolled;
  }

  /**
   * Get enrollment count for a course
   */
  async getEnrollmentCount(courseId) {
    const query = `
      SELECT COUNT(*) as count
      FROM enrollments
      WHERE course_id = $1
    `;
    
    const result = await db.query(query, [courseId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get recent enrollments
   */
  async getRecentEnrollments(limit = 10) {
    const query = `
      SELECT e.*, 
             c.title as course_title,
             u.username as student_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.student_id = u.id
      ORDER BY e.enrolled_at DESC
      LIMIT $1
    `;
    
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  /**
   * Get enrollment statistics for instructor
   */
  async getInstructorEnrollmentStats(instructorId) {
    const query = `
      SELECT 
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT e.student_id) as unique_students,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_enrollments,
        AVG(e.progress) as average_progress
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = $1
    `;
    
    const result = await db.query(query, [instructorId]);
    return result.rows[0];
  }
}

module.exports = EnrollmentRepository;