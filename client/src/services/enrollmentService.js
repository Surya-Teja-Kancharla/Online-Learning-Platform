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
      return response.data.data.enrollments;
    } catch (error) {
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
      return response.data.data.enrollment;
    } catch (error) {
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
      return response.data.data.enrollment;
    } catch (error) {
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
      return response.data.data.enrollment;
    } catch (error) {
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
      return response.data.data.enrollment;
    } catch (error) {
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
      return response.data.data.stats;
    } catch (error) {
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
      return response.data.data.progress;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new EnrollmentService();