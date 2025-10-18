/**
 * Course Service
 * Handles all course-related API calls
 */

import api from './api';

class CourseService {
  /**
   * Get all courses for authenticated instructor
   * @returns {Promise<Array>} - Instructor's courses
   */
  async getInstructorCourses(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.is_published !== undefined) {
        params.append('is_published', filters.is_published);
      }
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/courses/instructor/me?${params}`);
      return response.data.data.courses;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get instructor statistics
   * @returns {Promise<Object>} - Statistics
   */
  async getInstructorStats() {
    try {
      const response = await api.get('/courses/instructor/stats');
      return response.data.data.stats;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get all published courses
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} - Courses with pagination
   */
  async getPublishedCourses(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/courses/published?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Object>} - Course details
   */
  async getCourseById(id) {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data.data.course;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Create new course
   * @param {FormData} formData - Course data with files
   * @param {Function} onProgress - Upload progress callback
   * @returns {Promise<Object>} - Created course
   */
  async createCourse(formData, onProgress) {
    try {
      const response = await api.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data.data.course;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {FormData} formData - Updated course data
   * @param {Function} onProgress - Upload progress callback
   * @returns {Promise<Object>} - Updated course
   */
  async updateCourse(id, formData, onProgress) {
    try {
      const response = await api.put(`/courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data.data.course;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise<void>}
   */
  async deleteCourse(id) {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Publish course
   * @param {number} id - Course ID
   * @returns {Promise<Object>} - Updated course
   */
  async publishCourse(id) {
    try {
      const response = await api.post(`/courses/${id}/publish`);
      return response.data.data.course;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Unpublish course
   * @param {number} id - Course ID
   * @returns {Promise<Object>} - Updated course
   */
  async unpublishCourse(id) {
    try {
      const response = await api.post(`/courses/${id}/unpublish`);
      return response.data.data.course;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Search courses
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} - Search results
   */
  async searchCourses(query, filters = {}) {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/courses/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get popular courses
   * @param {number} limit - Number of courses
   * @returns {Promise<Array>} - Popular courses
   */
  async getPopularCourses(limit = 10) {
    try {
      const response = await api.get(`/courses/popular?limit=${limit}`);
      return response.data.data.courses;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get top rated courses
   * @param {number} limit - Number of courses
   * @returns {Promise<Array>} - Top rated courses
   */
  async getTopRatedCourses(limit = 10) {
    try {
      const response = await api.get(`/courses/top-rated?limit=${limit}`);
      return response.data.data.courses;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get courses by category
   * @param {string} category - Category name
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} - Courses in category
   */
  async getCoursesByCategory(category, filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/courses/category/${category}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get available categories
   * @returns {Promise<Array>} - Category list
   */
  async getCategories() {
    try {
      const response = await api.get('/courses/categories');
      return response.data.data.categories;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new CourseService();