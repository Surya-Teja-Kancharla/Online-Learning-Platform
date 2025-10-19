/**
 * UserRepository - Data Access Layer
 * Handles all database operations for users
 * Implements Repository pattern for separation of concerns
 */

const db = require('../config/database');
const User = require('../models/User');

class UserRepository {
  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<User>}
   */
  async create(userData) {
    const query = `
      INSERT INTO users (name, email, password_hash, role, avatar_url, bio)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      userData.name,
      userData.email,
      userData.password_hash,
      userData.role || 'student',
      userData.avatar_url || null,
      userData.bio || null
    ];

    try {
      const result = await db.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Find all users with optional role filter
   * @param {object} filters - Filter options
   * @returns {Promise<User[]>}
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

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
    return result.rows.map(row => new User(row));
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @returns {Promise<User[]>}
   */
  async findByRole(role) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE role = $1';
    const result = await db.query(query, [role]);
    return result.rows.map(row => new User(row));
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<User>}
   */
  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build update query
    const allowedFields = ['name', 'email', 'avatar_url', 'bio', 'role'];
    
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
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return new User(result.rows[0]);
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} hashedPassword - New password hash
   * @returns {Promise<User>}
   */
  async updatePassword(userId, hashedPassword) {
    const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [hashedPassword, userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>}
   */
  async emailExists(email) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await db.query(query, [email.toLowerCase()]);
    return result.rows[0].exists;
  }

  /**
   * Get user count by role
   * @param {string} role - Role to count
   * @returns {Promise<number>}
   */
  async countByRole(role) {
    const query = 'SELECT COUNT(*) FROM users WHERE role = $1';
    const result = await db.query(query, [role]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get total user count
   * @returns {Promise<number>}
   */
  async count() {
    const query = 'SELECT COUNT(*) FROM users';
    const result = await db.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = new UserRepository();