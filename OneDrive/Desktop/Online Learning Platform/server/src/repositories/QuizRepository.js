/**
 * Quiz Repository
 * Handles database operations for quizzes
 */

const pool = require('../config/database');
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizSubmission = require('../models/QuizSubmission');

class QuizRepository {
  /**
   * Create a new quiz
   */
  async create(quizData) {
    const query = `
      INSERT INTO quizzes (
        course_id, title, description, passing_score, 
        max_attempts, time_limit, is_published, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      quizData.course_id,
      quizData.title,
      quizData.description,
      quizData.passing_score || 70,
      quizData.max_attempts || 3,
      quizData.time_limit,
      quizData.is_published || false,
      quizData.order_index || 0,
    ];

    const result = await pool.query(query, values);
    return Quiz.fromDatabase(result.rows[0]);
  }

  /**
   * Find quiz by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM quizzes WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return Quiz.fromDatabase(result.rows[0]);
  }

  /**
   * Find all quizzes for a course
   */
  async findByCourse(courseId) {
    const query = `
      SELECT * FROM quizzes 
      WHERE course_id = $1 
      ORDER BY order_index ASC
    `;
    
    const result = await pool.query(query, [courseId]);
    return result.rows.map(row => Quiz.fromDatabase(row));
  }

  /**
   * Update quiz
   */
  async update(id, quizData) {
    const query = `
      UPDATE quizzes 
      SET title = $1, description = $2, passing_score = $3, 
          max_attempts = $4, time_limit = $5, is_published = $6, 
          order_index = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      quizData.title,
      quizData.description,
      quizData.passing_score,
      quizData.max_attempts,
      quizData.time_limit,
      quizData.is_published,
      quizData.order_index,
      id,
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return Quiz.fromDatabase(result.rows[0]);
  }

  /**
   * Delete quiz
   */
  async delete(id) {
    const query = 'DELETE FROM quizzes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Add question to quiz
   */
  async addQuestion(questionData) {
    const query = `
      INSERT INTO quiz_questions (
        quiz_id, question_text, question_type, options, 
        correct_answer, points, order_index, explanation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      questionData.quiz_id,
      questionData.question_text,
      questionData.question_type,
      JSON.stringify(questionData.options),
      questionData.correct_answer,
      questionData.points || 1,
      questionData.order_index || 0,
      questionData.explanation,
    ];

    const result = await pool.query(query, values);
    return QuizQuestion.fromDatabase(result.rows[0]);
  }

  /**
   * Get all questions for a quiz
   */
  async getQuestions(quizId) {
    const query = `
      SELECT * FROM quiz_questions 
      WHERE quiz_id = $1 
      ORDER BY order_index ASC
    `;
    
    const result = await pool.query(query, [quizId]);
    return result.rows.map(row => QuizQuestion.fromDatabase(row));
  }

  /**
   * Update question
   */
  async updateQuestion(id, questionData) {
    const query = `
      UPDATE quiz_questions 
      SET question_text = $1, question_type = $2, options = $3, 
          correct_answer = $4, points = $5, order_index = $6, 
          explanation = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      questionData.question_text,
      questionData.question_type,
      JSON.stringify(questionData.options),
      questionData.correct_answer,
      questionData.points,
      questionData.order_index,
      questionData.explanation,
      id,
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    return QuizQuestion.fromDatabase(result.rows[0]);
  }

  /**
   * Delete question
   */
  async deleteQuestion(id) {
    const query = 'DELETE FROM quiz_questions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(submissionData) {
    const query = `
      INSERT INTO quiz_submissions (
        quiz_id, user_id, score, total_points, percentage, 
        passed, answers, time_taken, attempt_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      submissionData.quiz_id,
      submissionData.user_id,
      submissionData.score,
      submissionData.total_points,
      submissionData.percentage,
      submissionData.passed,
      JSON.stringify(submissionData.answers),
      submissionData.time_taken,
      submissionData.attempt_number,
    ];

    const result = await pool.query(query, values);
    return QuizSubmission.fromDatabase(result.rows[0]);
  }

  /**
   * Get user's submissions for a quiz
   */
  async getUserSubmissions(quizId, userId) {
    const query = `
      SELECT * FROM quiz_submissions 
      WHERE quiz_id = $1 AND user_id = $2 
      ORDER BY submitted_at DESC
    `;
    
    const result = await pool.query(query, [quizId, userId]);
    return result.rows.map(row => QuizSubmission.fromDatabase(row));
  }

  /**
   * Get submission by ID
   */
  async getSubmissionById(id) {
    const query = 'SELECT * FROM quiz_submissions WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return QuizSubmission.fromDatabase(result.rows[0]);
  }

  /**
   * Count user's attempts
   */
  async countUserAttempts(quizId, userId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM quiz_submissions 
      WHERE quiz_id = $1 AND user_id = $2
    `;
    
    const result = await pool.query(query, [quizId, userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get best score for user
   */
  async getBestScore(quizId, userId) {
    const query = `
      SELECT * FROM quiz_submissions 
      WHERE quiz_id = $1 AND user_id = $2 
      ORDER BY score DESC 
      LIMIT 1
    `;
    
    const result = await pool.query(query, [quizId, userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return QuizSubmission.fromDatabase(result.rows[0]);
  }
}

module.exports = new QuizRepository();