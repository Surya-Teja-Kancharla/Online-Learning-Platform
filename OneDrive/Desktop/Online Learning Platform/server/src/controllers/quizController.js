/**
 * Quiz Controller
 * Handles HTTP requests for quizzes
 */

const QuizService = require('../services/QuizService');
const { successResponse } = require('../utils/responses');

class QuizController {
  /**
   * Create a new quiz
   */
  async create(req, res, next) {
    try {
      const quiz = await QuizService.createQuiz(req.user.id, req.body);
      return successResponse(res, { quiz }, 'Quiz created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get quiz by ID
   */
  async getById(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      
      let quizData;
      if (req.user.role === 'instructor' || req.user.role === 'admin') {
        quizData = await QuizService.getQuizForInstructor(quizId, req.user.id);
      } else {
        quizData = await QuizService.getQuizForStudent(quizId, req.user.id);
      }

      return successResponse(res, quizData, 'Quiz retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update quiz
   */
  async update(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await QuizService.updateQuiz(quizId, req.user.id, req.body);
      return successResponse(res, { quiz }, 'Quiz updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete quiz
   */
  async delete(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      await QuizService.deleteQuiz(quizId, req.user.id);
      return successResponse(res, null, 'Quiz deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add question to quiz
   */
  async addQuestion(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const question = await QuizService.addQuestion(quizId, req.user.id, req.body);
      return successResponse(res, { question }, 'Question added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit quiz
   */
  async submit(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const { answers, timeTaken } = req.body;
      
      const result = await QuizService.submitQuiz(quizId, req.user.id, answers, timeTaken);
      return successResponse(res, result, 'Quiz submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get quiz history for user
   */
  async getHistory(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const history = await QuizService.getUserQuizHistory(quizId, req.user.id);
      return successResponse(res, history, 'Quiz history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();