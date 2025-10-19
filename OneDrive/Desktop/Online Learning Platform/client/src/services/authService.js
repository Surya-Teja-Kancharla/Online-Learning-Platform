/**
 * Frontend Auth Service
 * Handles authentication API calls to the backend
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} user and token
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store token and user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Token stored:', token);
        console.log('User stored:', user);
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      );
    }
  }

  /**
   * Register new user
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success && response.data.data) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed'
      );
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Clear authentication data (alias for logout)
   */
  clearAuthData() {
    this.logout();
  }

  /**
   * Clear authentication data (alias for logout)
   */
  clearAuthData() {
    this.logout();
  }

  /**
   * Get current user from localStorage
   * @returns {object|null}
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored token
   * @returns {string|null}
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
   * Get current user from API
   * @returns {Promise<object>}
   */
  async fetchCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data.data.user;
      }

      throw new Error('Failed to fetch user');
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} oldPassword 
   * @param {string} newPassword 
   * @returns {Promise<object>}
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const token = this.getToken();
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Password change failed'
      );
    }
  }
}

export default new AuthService();