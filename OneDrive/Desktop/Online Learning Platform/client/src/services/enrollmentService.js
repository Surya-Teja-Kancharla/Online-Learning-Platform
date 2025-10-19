/**
 * Enrollment Service
 * Handles all enrollment-related API calls
 */

import api from './api';

class EnrollmentService {
  /**
   * Get all enrollments for authenticated student
   * @returns {Promise<Array>} - Student's enrollments
   */
  async getMyEnrollments() {
    try {
      const response = await api.get('/enrollments/my-enrollments');
      console.log('My enrollments response:', response.data);
      
      // Handle response format: { success: true, data: { enrollments: [...] } }
      if (response.data.success) {
        return response.data.data?.enrollments || response.data.data || [];
      }
      
      return response.data.enrollments || response.data || [];
    } catch (error) {
      console.error('Get my enrollments error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Enroll in a course
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} - Enrollment details
   */
  async enrollInCourse(courseId) {
    try {
      const response = await api.post('/enrollments/enroll', { course_id: courseId });
      
      if (response.data.success) {
        return response.data.data?.enrollment || response.data.data || {};
      }
      
      return response.data.enrollment || response.data || {};
    } catch (error) {
      console.error('Enroll in course error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get enrollment by course ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} - Enrollment details
   */
  async getEnrollmentByCourse(courseId) {
    try {
      const response = await api.get(`/enrollments/course/${courseId}`);
      
      if (response.data.success) {
        return response.data.data?.enrollment || response.data.data || null;
      }
      
      return response.data.enrollment || response.data || null;
    } catch (error) {
      console.error('Get enrollment by course error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Update enrollment progress
   * @param {number} enrollmentId - Enrollment ID
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} - Updated enrollment
   */
  async updateProgress(enrollmentId, progress) {
    try {
      const response = await api.put(`/enrollments/${enrollmentId}/progress`, { progress });
      
      if (response.data.success) {
        return response.data.data?.enrollment || response.data.data || {};
      }
      
      return response.data.enrollment || response.data || {};
    } catch (error) {
      console.error('Update progress error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Mark enrollment as completed
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object>} - Completed enrollment
   */
  async completeEnrollment(enrollmentId) {
    try {
      const response = await api.post(`/enrollments/${enrollmentId}/complete`);
      
      if (response.data.success) {
        return response.data.data?.enrollment || response.data.data || {};
      }
      
      return response.data.enrollment || response.data || {};
    } catch (error) {
      console.error('Complete enrollment error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get student statistics
   * @returns {Promise<Object>} - Student stats
   */
  async getStudentStats() {
    try {
      const response = await api.get('/enrollments/stats');
      
      if (response.data.success) {
        return response.data.data?.stats || response.data.data || {};
      }
      
      return response.data.stats || response.data || {};
    } catch (error) {
      console.error('Get student stats error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Unenroll from a course
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<void>}
   */
  async unenroll(enrollmentId) {
    try {
      await api.delete(`/enrollments/${enrollmentId}`);
    } catch (error) {
      console.error('Unenroll error:', error);
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get course progress details
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} - Progress details
   */
  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/enrollments/course/${courseId}/progress`);
      
      if (response.data.success) {
        return response.data.data?.progress || response.data.data || {};
      }
      
      return response.data.progress || response.data || {};
    } catch (error) {
      console.error('Get course progress error:', error);
      throw error.response?.data || error.message;
    }
  }
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;