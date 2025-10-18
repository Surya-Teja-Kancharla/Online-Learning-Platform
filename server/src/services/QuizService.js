/**
 * Quiz Service
 * Business logic for quizzes
 */

const QuizRepository = require('../repositories/QuizRepository');
const CourseRepository = require('../repositories/CourseRepository');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');

class QuizService {
  /**
   * Create a new quiz
   */
  async createQuiz(instructorId, quizData) {
    // Verify instructor owns the course
    const course = await CourseRepository.findById(quizData.course_id);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this course');
    }

    // Validate quiz data
    this.validateQuizData(quizData);

    return await QuizRepository.create(quizData);
  }

  /**
   * Get quiz by ID
   */
  async getQuizById(id) {
    const quiz = await QuizRepository.findById(id);
    
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    return quiz;
  }

  /**
   * Get quiz with questions (for students - no correct answers)
   */
  async getQuizForStudent(quizId, userId) {
    const quiz = await this.getQuizById(quizId);
    const questions = await QuizRepository.getQuestions(quizId);

    // Check remaining attempts
    const attempts = await QuizRepository.countUserAttempts(quizId, userId);
    const attemptsLeft = quiz.max_attempts - attempts;

    if (attemptsLeft <= 0) {
      throw new ForbiddenError('Maximum attempts reached for this quiz');
    }

    // Return quiz with questions (without correct answers)
    return {
      quiz,
      questions: questions.map(q => q.toStudentJSON()),
      attemptsLeft,
      totalAttempts: attempts,
    };
  }

  /**
   * Get quiz with questions (for instructors - with correct answers)
   */
  async getQuizForInstructor(quizId, instructorId) {
    const quiz = await this.getQuizById(quizId);
    const course = await CourseRepository.findById(quiz.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this quiz');
    }

    const questions = await QuizRepository.getQuestions(quizId);

    return {
      quiz,
      questions,
    };
  }

  /**
   * Update quiz
   */
  async updateQuiz(quizId, instructorId, quizData) {
    const quiz = await this.getQuizById(quizId);
    const course = await CourseRepository.findById(quiz.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this quiz');
    }

    this.validateQuizData(quizData);

    return await QuizRepository.update(quizId, quizData);
  }

  /**
   * Delete quiz
   */
  async deleteQuiz(quizId, instructorId) {
    const quiz = await this.getQuizById(quizId);
    const course = await CourseRepository.findById(quiz.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this quiz');
    }

    return await QuizRepository.delete(quizId);
  }

  /**
   * Add question to quiz
   */
  async addQuestion(quizId, instructorId, questionData) {
    const quiz = await this.getQuizById(quizId);
    const course = await CourseRepository.findById(quiz.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this quiz');
    }

    this.validateQuestionData(questionData);

    return await QuizRepository.addQuestion({
      ...questionData,
      quiz_id: quizId,
    });
  }

  /**
   * Submit quiz and calculate score
   */
  async submitQuiz(quizId, userId, answers, timeTaken) {
    const quiz = await this.getQuizById(quizId);
    
    // Check if max attempts exceeded
    const attempts = await QuizRepository.countUserAttempts(quizId, userId);
    
    if (attempts >= quiz.max_attempts) {
      throw new ForbiddenError('Maximum attempts reached for this quiz');
    }

    // Get questions with correct answers
    const questions = await QuizRepository.getQuestions(quizId);

    // Calculate score
    const scoreResult = this.calculateScore(questions, answers);

    // Determine if passed
    const passed = scoreResult.percentage >= quiz.passing_score;

    // Save submission
    const submission = await QuizRepository.submitQuiz({
      quiz_id: quizId,
      user_id: userId,
      score: scoreResult.score,
      total_points: scoreResult.totalPoints,
      percentage: scoreResult.percentage,
      passed,
      answers,
      time_taken: timeTaken,
      attempt_number: attempts + 1,
    });

    // Return submission with detailed results
    return {
      submission,
      results: scoreResult.results,
      passed,
      canRetry: attempts + 1 < quiz.max_attempts,
      attemptsLeft: quiz.max_attempts - (attempts + 1),
    };
  }

  /**
   * Calculate quiz score
   */
  calculateScore(questions, userAnswers) {
    let score = 0;
    let totalPoints = 0;
    const results = [];

    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id];
      const isCorrect = this.checkAnswer(question, userAnswer);

      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question.id,
        question: question.question_text,
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0,
        explanation: question.explanation,
      });
    });

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    return {
      score,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      results,
    };
  }

  /**
   * Check if answer is correct
   */
  checkAnswer(question, userAnswer) {
    if (!userAnswer) return false;

    switch (question.question_type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer.toString().toLowerCase() === question.correct_answer.toString().toLowerCase();
      
      case 'short_answer':
        return userAnswer.toString().toLowerCase().trim() === 
               question.correct_answer.toString().toLowerCase().trim();
      
      default:
        return false;
    }
  }

  /**
   * Get user's quiz history
   */
  async getUserQuizHistory(quizId, userId) {
    const submissions = await QuizRepository.getUserSubmissions(quizId, userId);
    const bestScore = await QuizRepository.getBestScore(quizId, userId);

    return {
      submissions,
      bestScore,
      totalAttempts: submissions.length,
    };
  }

  /**
   * Get quiz statistics (for instructors)
   */
  async getQuizStatistics(quizId, instructorId) {
    const quiz = await this.getQuizById(quizId);
    const course = await CourseRepository.findById(quiz.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this quiz');
    }

    // This would need additional repository methods
    // For now, returning basic info
    return {
      quiz,
      // Add more statistics as needed
    };
  }

  /**
   * Validate quiz data
   */
  validateQuizData(quizData) {
    if (!quizData.title || quizData.title.length < 3) {
      throw new ValidationError('Quiz title must be at least 3 characters');
    }

    if (quizData.passing_score && (quizData.passing_score < 0 || quizData.passing_score > 100)) {
      throw new ValidationError('Passing score must be between 0 and 100');
    }

    if (quizData.max_attempts && quizData.max_attempts < 1) {
      throw new ValidationError('Max attempts must be at least 1');
    }

    if (quizData.time_limit && quizData.time_limit < 1) {
      throw new ValidationError('Time limit must be at least 1 minute');
    }
  }

  /**
   * Validate question data
   */
  validateQuestionData(questionData) {
    if (!questionData.question_text || questionData.question_text.length < 5) {
      throw new ValidationError('Question text must be at least 5 characters');
    }

    const validTypes = ['multiple_choice', 'true_false', 'short_answer'];
    if (!validTypes.includes(questionData.question_type)) {
      throw new ValidationError('Invalid question type');
    }

    if (questionData.question_type === 'multiple_choice' && !questionData.options) {
      throw new ValidationError('Multiple choice questions must have options');
    }

    if (!questionData.correct_answer) {
      throw new ValidationError('Correct answer is required');
    }

    if (questionData.points && questionData.points < 0) {
      throw new ValidationError('Points must be positive');
    }
  }
}

module.exports = new QuizService();