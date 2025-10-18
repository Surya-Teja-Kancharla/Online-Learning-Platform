/**
 * User Domain Model
 * Represents a user entity in the system
 * Roles: student, instructor, admin
 */

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role;
    this.avatar_url = data.avatar_url || null;
    this.bio = data.bio || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    return this.role === role;
  }

  /**
   * Check if user is an admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Check if user is an instructor
   * @returns {boolean}
   */
  isInstructor() {
    return this.role === 'instructor';
  }

  /**
   * Check if user is a student
   * @returns {boolean}
   */
  isStudent() {
    return this.role === 'student';
  }

  /**
   * Get safe user object (without password)
   * @returns {object}
   */
  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      avatar_url: this.avatar_url,
      bio: this.bio,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Validate user data
   * @returns {boolean}
   */
  isValid() {
    return (
      this.name &&
      this.email &&
      this.role &&
      ['student', 'instructor', 'admin'].includes(this.role)
    );
  }
}

module.exports = User;