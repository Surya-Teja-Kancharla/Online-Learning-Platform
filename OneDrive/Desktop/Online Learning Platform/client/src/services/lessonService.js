/**
 * Lesson Service
 * Handles all lesson-related API calls
 */

import api from './api';

class LessonService {
  /**
   * Get all lessons for a course
   */
  async getCourseLessons(courseId) {
    try {
      const response = await api.get(`/lessons/course/${courseId}`);
      return response.data.data.lessons;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data.data.lesson;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Update lesson progress
   */
  async updateProgress(lessonId, progressData) {
    try {
      const response = await api.put(`/lessons/${lessonId}/progress`, progressData);
      return response.data.data.progress;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Mark lesson as complete
   */
  async markComplete(lessonId) {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`);
      return response.data.data.progress;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get course progress
   */
  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/lessons/course/${courseId}/progress`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get next lesson
   */
  async getNextLesson(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/next`);
      return response.data.data.lesson;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get previous lesson
   */
  async getPreviousLesson(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}/previous`);
      return response.data.data.lesson;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Create lesson (instructor)
   */
  async createLesson(lessonData) {
    try {
      const response = await api.post('/lessons', lessonData);
      return response.data.data.lesson;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Update lesson (instructor)
   */
  async updateLesson(lessonId, lessonData) {
    try {
      const response = await api.put(`/lessons/${lessonId}`, lessonData);
      return response.data.data.lesson;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Delete lesson (instructor)
   */
  async deleteLesson(lessonId) {
    try {
      await api.delete(`/lessons/${lessonId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new LessonService();