s/**
 * CourseRepository - Data Access Layer
 * Handles all database operations for courses
 * Implements Repository pattern for separation of concerns
 */

const db = require('../config/database');
const Course = require('../models/Course');

class CourseRepository {
  /**
   * Create a new course
   * @param {object} courseData - Course data
   * @returns {Promise<Course>}
   */
  async create(courseData) {
    const query = `
      INSERT INTO courses (
        title, description, instructor_id, category, difficulty,
        price, duration, thumbnail_url, video_url, syllabus,
        requirements, learning_outcomes, language, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const values = [
      courseData.title,
      courseData.description,
      courseData.instructor_id,
      courseData.category,
      courseData.difficulty,
      courseData.price || 0,
      courseData.duration || null,
      courseData.thumbnail_url || null,
      courseData.video_url || null,
      courseData.syllabus || null,
      courseData.requirements || null,
      courseData.learning_outcomes || null,
      courseData.language || 'English',
      courseData.is_published || false
    ];

    try {
      const result = await db.query(query, values);
      return new Course(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Course|null>}
   */
  async findById(id) {
    const query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.avatar_url as instructor_avatar_url
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Course(result.rows[0]);
  }

  /**
   * Find all courses with optional filters
   * @param {object} filters - Filter options
   * @returns {Promise<Course[]>}
   */
  async findAll(filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.avatar_url as instructor_avatar_url
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;

    // Filter by instructor
    if (filters.instructor_id) {
      query += ` AND c.instructor_id = $${paramCount}`;
      values.push(filters.instructor_id);
      paramCount++;
    }

    // Filter by category
    if (filters.category) {
      query += ` AND c.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    // Filter by difficulty
    if (filters.difficulty) {
      query += ` AND c.difficulty = $${paramCount}`;
      values.push(filters.difficulty);
      paramCount++;
    }

    // Filter by published status
    if (filters.is_published !== undefined) {
      query += ` AND c.is_published = $${paramCount}`;
      values.push(filters.is_published);
      paramCount++;
    }

    // Search by title or description
    if (filters.search) {
      query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      query += ` AND c.price >= $${paramCount}`;
      values.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice !== undefined) {
      query += ` AND c.price <= $${paramCount}`;
      values.push(filters.maxPrice);
      paramCount++;
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY c.${sortBy} ${sortOrder}`;

    // Pagination
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await db.query(query, values);
    return result.rows.map(row => new Course(row));
  }

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {object} updateData - Data to update
   * @returns {Promise<Course>}
   */
  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Allowed fields to update
    const allowedFields = [
      'title', 'description', 'category', 'difficulty', 'price',
      'duration', 'thumbnail_url', 'video_url', 'syllabus',
      'requirements', 'learning_outcomes', 'language', 'is_published'
    ];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id parameter
    values.push(id);

    const query = `
      UPDATE courses 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('Course not found');
    }

    return new Course(result.rows[0]);
  }

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Find courses by instructor
   * @param {number} instructorId - Instructor ID
   * @returns {Promise<Course[]>}
   */
  async findByInstructor(instructorId) {
    return this.findAll({ instructor_id: instructorId });
  }

  /**
   * Find published courses
   * @param {object} filters - Additional filters
   * @returns {Promise<Course[]>}
   */
  async findPublished(filters = {}) {
    return this.findAll({ ...filters, is_published: true });
  }

  /**
   * Get course count
   * @param {object} filters - Filter options
   * @returns {Promise<number>}
   */
  async count(filters = {}) {
    let query = 'SELECT COUNT(*) FROM courses WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.instructor_id) {
      query += ` AND instructor_id = $${paramCount}`;
      values.push(filters.instructor_id);
      paramCount++;
    }

    if (filters.is_published !== undefined) {
      query += ` AND is_published = $${paramCount}`;
      values.push(filters.is_published);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Update enrollment count
   * @param {number} id - Course ID
   * @param {number} increment - Amount to increment (can be negative)
   * @returns {Promise<boolean>}
   */
  async updateEnrollmentCount(id, increment = 1) {
    const query = `
      UPDATE courses 
      SET enrollment_count = enrollment_count + $1
      WHERE id = $2
    `;
    const result = await db.query(query, [increment, id]);
    return result.rowCount > 0;
  }

  /**
   * Update course rating
   * @param {number} id - Course ID
   * @param {number} newRating - New rating value
   * @returns {Promise<boolean>}
   */
  async updateRating(id, newRating) {
    const query = `
      UPDATE courses 
      SET 
        rating = (rating * rating_count + $1) / (rating_count + 1),
        rating_count = rating_count + 1
      WHERE id = $2
    `;
    const result = await db.query(query, [newRating, id]);
    return result.rowCount > 0;
  }

  /**
   * Get courses by category
   * @param {string} category - Category name
   * @param {object} filters - Additional filters
   * @returns {Promise<Course[]>}
   */
  async findByCategory(category, filters = {}) {
    return this.findAll({ ...filters, category });
  }

  /**
   * Get popular courses
   * @param {number} limit - Number of courses to return
   * @returns {Promise<Course[]>}
   */
  async findPopular(limit = 10) {
    return this.findAll({
      is_published: true,
      sortBy: 'enrollment_count',
      sortOrder: 'DESC',
      limit
    });
  }

  /**
   * Get top rated courses
   * @param {number} limit - Number of courses to return
   * @returns {Promise<Course[]>}
   */
  async findTopRated(limit = 10) {
    return this.findAll({
      is_published: true,
      sortBy: 'rating',
      sortOrder: 'DESC',
      limit
    });
  }

  /**
   * Get available categories
   * @returns {Promise<string[]>}
   */
  async getCategories() {
    const query = `
      SELECT DISTINCT category 
      FROM courses 
      WHERE is_published = true
      ORDER BY category
    `;
    const result = await db.query(query);
    return result.rows.map(row => row.category);
  }
}

module.exports = new CourseRepository();