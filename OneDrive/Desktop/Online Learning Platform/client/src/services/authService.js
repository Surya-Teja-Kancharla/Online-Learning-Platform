/**
 * AuthService - Frontend Authentication Service
 * Handles all authentication-related API calls and token management
 */

import api from './api';

class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} User and token
   */
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setAuthData(user, token);
        return response.data;
      }
      
      throw new Error('Signup failed');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User and token
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        this.setAuthData(user, token);
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} User data
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        this.setUser(user);
        return user;
      }
      
      throw new Error('Failed to get profile');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify user role
   * @returns {Promise<object>} Role verification data
   */
  async verifyRole() {
    try {
      const response = await api.get('/auth/verify-role');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Response data
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<object>} Response data
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Response data
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh JWT token
   * @returns {Promise<string>} New token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      
      if (response.data.success) {
        const token = response.data.data.token;
        this.setToken(token);
        return token;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set authentication data in localStorage
   * @param {object} user - User object
   * @param {string} token - JWT token
   */
  setAuthData(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  /**
   * Set user data in localStorage
   * @param {object} user - User object
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Set token in localStorage
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Get current user from localStorage
   * @returns {object|null} User object or null
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get token from localStorage
   * @returns {string|null} Token or null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.hasRole('admin');
  }

  /**
   * Check if user is instructor
   * @returns {boolean}
   */
  isInstructor() {
    return this.hasRole('instructor');
  }

  /**
   * Check if user is student
   * @returns {boolean}
   */
  isStudent() {
    return this.hasRole('student');
  }

  /**
   * Get user's role
   * @returns {string|null} User role or null
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Get redirect path based on user role
   * @returns {string} Dashboard path
   */
  getRoleDashboard() {
    const role = this.getUserRole();
    
    switch (role) {
      case 'student':
        return '/dashboard/student';
      case 'instructor':
        return '/dashboard/instructor';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/login';
    }
  }
}

// Export singleton instance
export default new AuthService();