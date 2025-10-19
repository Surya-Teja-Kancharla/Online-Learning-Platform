/**
 * AuthService - Business Logic Layer
 * Handles authentication logic, token generation, and user validation
 * Implements Single Responsibility Principle
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { 
  ValidationError, 
  UnauthorizedError, 
  ConflictError 
} = require('../utils/errors');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - User and token
   */
  async signup(userData) {
    this.validateSignupData(userData);

    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const password_hash = await this.hashPassword(userData.password);

    const user = await UserRepository.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password_hash,
      role: userData.role || 'student',
      avatar_url: userData.avatar_url,
      bio: userData.bio
    });

    const token = this.generateToken(user);

    return {
      user: user.toSafeObject(),
      token
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - { user, token }
   */
  async login(email, password) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // **FIX AREA START**
    // This logic correctly handles both plain text and hashed passwords.
    const passwordHash = user.password_hash; 
    let isPasswordValid = false;
    
    if (passwordHash && (passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$'))) {
      isPasswordValid = await bcrypt.compare(password, passwordHash);
    } else {
      console.warn(`[AUTH] Plain text password detected for user: ${email}. Auto-hashing...`);
      isPasswordValid = (password === passwordHash);
      
      if (isPasswordValid) {
        try {
          const newHashedPassword = await this.hashPassword(password);
          await UserRepository.updatePassword(user.id, newHashedPassword);
          console.log(`[AUTH] Password for ${email} has been securely hashed.`);
        } catch (hashError) {
          console.error("Failed to auto-hash password:", hashError);
        }
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    // **FIX AREA END**

    const token = this.generateToken(user);

    // This ensures we always return the object the controller and frontend expect.
    return {
      user: user.toSafeObject(),
      token: token
    };
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<object>} - Decoded token payload
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  }

  /**
   * Get user by token
   * @param {string} token - JWT token
   * @returns {Promise<User>}
   */
  async getUserByToken(token) {
    const decoded = await this.verifyToken(token);
    const user = await UserRepository.findById(decoded.userId);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  /**
   * Verify user role
   * @param {number} userId - User ID
   * @param {string|string[]} allowedRoles - Allowed role(s)
   * @returns {Promise<boolean>}
   */
  async verifyRole(userId, allowedRoles) {
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, oldPassword, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const passwordHash = user.password_hash;
    let isPasswordValid = false;
    if (passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$')) {
      isPasswordValid = await this.verifyPassword(oldPassword, passwordHash);
    } else {
      isPasswordValid = oldPassword === passwordHash;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const new_password_hash = await this.hashPassword(newPassword);
    return await UserRepository.updatePassword(userId, new_password_hash);
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.bcryptRounds);
  }

  /**
   * Verify password against hash
   * @param {string} password - Plain text password
   * @param {string} hash - Password hash
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   * @param {User} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });
  }

  /**
   * Validate signup data
   * @param {object} userData - User data to validate
   * @throws {ValidationError}
   */
  validateSignupData(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (userData.role && !['student', 'instructor', 'admin'].includes(userData.role)) {
      errors.push('Invalid role');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email || '');
  }

  /**
   * Generate password reset token
   * @param {string} email - User email
   * @returns {Promise<string|null>} - Reset token
   */
  async generatePasswordResetToken(email) {
    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    return resetToken;
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>}
   */
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedError('Invalid reset token');
      }

      if (!newPassword || newPassword.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      const password_hash = await this.hashPassword(newPassword);
      return await UserRepository.updatePassword(decoded.userId, password_hash);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Reset token has expired');
      }
      throw error;
    }
  }
}

module.exports = new AuthService();

