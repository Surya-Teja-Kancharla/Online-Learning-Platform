/**
 * Course Service
 * Handles all course-related API calls
 */

import api from './api';

class CourseService {
  /**
   * Get all published courses with filters
   */
  async getPublishedCourses(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/courses/published?${params.toString()}`);
      
      console.log('Published courses response:', response.data);
      
      // Backend returns: { success: true, data: [courses], pagination: {...} }
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Fallback for other formats
      return response.data.courses || response.data.data?.courses || response.data || [];
    } catch (error) {
      console.error('Get published courses error:', error);
      throw error;
    }
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data.data.course || response.data.course || response.data;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  /**
   * Search courses
   */
  async searchCourses(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/courses/search?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data.courses || [];
      }
      
      return response.data.courses || response.data || [];
    } catch (error) {
      console.error('Search courses error:', error);
      throw error;
    }
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(limit = 10) {
    try {
      const response = await api.get(`/courses/popular?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data.courses || [];
      }
      
      return response.data.courses || response.data || [];
    } catch (error) {
      console.error('Get popular courses error:', error);
      throw error;
    }
  }

  /**
   * Get course content
   */
  async getCourseContent(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/content`);
      
      if (response.data.success) {
        return response.data.data.content || [];
      }
      
      return response.data.content || response.data || [];
    } catch (error) {
      console.error('Get course content error:', error);
      throw error;
    }
  }

  /**
   * Get course by ID with full details (content, instructor, etc.)
   */
  async getCourseDetails(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/details`);
      
      if (response.data.success) {
        return response.data.data || response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Get course details error:', error);
      throw error;
    }
  }

  /**
   * Get courses by category
   */
  async getCoursesByCategory(category) {
    try {
      const response = await api.get(`/courses/category/${category}`);
      
      if (response.data.success) {
        return response.data.data.courses || [];
      }
      
      return response.data.courses || response.data || [];
    } catch (error) {
      console.error('Get courses by category error:', error);
      throw error;
    }
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses() {
    try {
      const response = await api.get('/courses/featured');
      
      if (response.data.success) {
        return response.data.data.courses || [];
      }
      
      return response.data.courses || response.data || [];
    } catch (error) {
      console.error('Get featured courses error:', error);
      throw error;
    }
  }
}

const courseService = new CourseService();
export default courseService;