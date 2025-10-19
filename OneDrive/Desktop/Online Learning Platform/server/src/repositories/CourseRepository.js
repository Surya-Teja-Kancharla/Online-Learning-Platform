/**
 * CourseRepository - Data Access Layer
 * Handles all database operations for courses
 * Implements Repository Pattern
 */

const db = require('../config/database');

class CourseRepository {
  /**
   * Create a new course
   */
  async create(courseData) {
    const query = `
      INSERT INTO courses (
        title, description, instructor_id, category, 
        difficulty_level, price, thumbnail_url, 
        video_url, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      courseData.title,
      courseData.description,
      courseData.instructor_id,
      courseData.category,
      courseData.difficulty_level || 'beginner',
      courseData.price || 0,
      courseData.thumbnail_url || null,
      courseData.video_url || null,
      courseData.is_published || false,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find course by ID
   */
  async findById(courseId) {
    const query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        COUNT(DISTINCT e.id) as enrollment_count,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as rating_count
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.id = $1
      GROUP BY c.id, u.name, u.email
    `;

    const result = await db.query(query, [courseId]);
    return result.rows[0];
  }

  /**
   * Find all courses with filters
   */
  async findAll(filters = {}) {
    let query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        COUNT(DISTINCT e.id) as enrollment_count,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as rating_count
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    // Apply filters
    if (filters.is_published !== undefined) {
      query += ` AND c.is_published = $${paramIndex}`;
      values.push(filters.is_published);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND c.category = $${paramIndex}`;
      values.push(filters.category);
      paramIndex++;
    }

    if (filters.difficulty_level) {
      query += ` AND c.difficulty_level = $${paramIndex}`;
      values.push(filters.difficulty_level);
      paramIndex++;
    }

    if (filters.instructor_id) {
      query += ` AND c.instructor_id = $${paramIndex}`;
      values.push(filters.instructor_id);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.min_price !== undefined) {
      query += ` AND c.price >= $${paramIndex}`;
      values.push(filters.min_price);
      paramIndex++;
    }

    if (filters.max_price !== undefined) {
      query += ` AND c.price <= $${paramIndex}`;
      values.push(filters.max_price);
      paramIndex++;
    }

    query += ` GROUP BY c.id, u.name`;

    // Sorting
    if (filters.sort_by === 'popularity') {
      query += ` ORDER BY enrollment_count DESC`;
    } else if (filters.sort_by === 'rating') {
      query += ` ORDER BY average_rating DESC NULLS LAST`;
    } else if (filters.sort_by === 'price_low') {
      query += ` ORDER BY c.price ASC`;
    } else if (filters.sort_by === 'price_high') {
      query += ` ORDER BY c.price DESC`;
    } else {
      query += ` ORDER BY c.created_at DESC`;
    }

    // Pagination
    const limit = filters.limit || 12;
    const page = filters.page || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await db.query(query, values);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM courses c
      WHERE 1=1
    `;
    
    const countValues = [];
    let countIndex = 1;
    
    if (filters.is_published !== undefined) {
      countQuery += ` AND c.is_published = $${countIndex}`;
      countValues.push(filters.is_published);
      countIndex++;
    }
    
    if (filters.category) {
      countQuery += ` AND c.category = $${countIndex}`;
      countValues.push(filters.category);
      countIndex++;
    }
    
    if (filters.difficulty_level) {
      countQuery += ` AND c.difficulty_level = $${countIndex}`;
      countValues.push(filters.difficulty_level);
      countIndex++;
    }
    
    if (filters.instructor_id) {
      countQuery += ` AND c.instructor_id = $${countIndex}`;
      countValues.push(filters.instructor_id);
      countIndex++;
    }
    
    if (filters.search) {
      countQuery += ` AND (c.title ILIKE $${countIndex} OR c.description ILIKE $${countIndex})`;
      countValues.push(`%${filters.search}%`);
      countIndex++;
    }

    const countResult = await db.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);

    return {
      courses: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Update course
   */
  async update(courseId, courseData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic UPDATE query
    Object.keys(courseData).forEach((key) => {
      if (courseData[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(courseData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE courses
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(courseId);

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete course
   */
  async delete(courseId) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const result = await db.query(query, [courseId]);
    return result.rows[0];
  }

  /**
   * Find courses by instructor
   */
  async findByInstructor(instructorId, filters = {}) {
    return this.findAll({ ...filters, instructor_id: instructorId });
  }

  /**
   * Check if course exists
   */
  async exists(courseId) {
    const query = 'SELECT EXISTS(SELECT 1 FROM courses WHERE id = $1)';
    const result = await db.query(query, [courseId]);
    return result.rows[0].exists;
  }

  /**
   * Get course stats
   */
  async getStats(courseId) {
    const query = `
      SELECT 
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) as completed_enrollments,
        AVG(e.progress) as average_progress,
        COUNT(DISTINCT r.id) as total_reviews,
        AVG(r.rating) as average_rating
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.id = $1
      GROUP BY c.id
    `;

    const result = await db.query(query, [courseId]);
    return result.rows[0];
  }

  /**
   * Get popular courses
   */
  async getPopular(limit = 10) {
    const query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        COUNT(DISTINCT e.id) as enrollment_count,
        AVG(r.rating) as average_rating
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.is_published = true
      GROUP BY c.id, u.name
      ORDER BY enrollment_count DESC, average_rating DESC NULLS LAST
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);
    return result.rows;
  }

  /**
   * Search courses
   */
  async search(searchTerm, filters = {}) {
    return this.findAll({ ...filters, search: searchTerm });
  }
}

module.exports = new CourseRepository();