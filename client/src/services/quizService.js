/**
 * Quiz Service
 * Handles all quiz-related API calls
 */

import api from './api';

class QuizService {
  /**
   * Get quiz for taking (student view - no answers)
   */
  async getQuizForStudent(quizId) {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(quizId, answers, timeTaken) {
    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        answers,
        timeTaken,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Get quiz history
   */
  async getQuizHistory(quizId) {
    try {
      const response = await api.get(`/quizzes/${quizId}/history`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Create quiz (instructor)
   */
  async createQuiz(quizData) {
    try {
      const response = await api.post('/quizzes', quizData);
      return response.data.data.quiz;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  /**
   * Add question to quiz
   */
  async addQuestion(quizId, questionData) {
    try {
      const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
      return response.data.data.question;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new QuizService();