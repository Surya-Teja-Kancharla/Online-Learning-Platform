/**
 * QuizSubmission Model
 * Represents a student's quiz attempt
 */

class QuizSubmission {
  constructor(data) {
    this.id = data.id;
    this.quiz_id = data.quiz_id;
    this.user_id = data.user_id;
    this.score = data.score;
    this.total_points = data.total_points;
    this.percentage = data.percentage;
    this.passed = data.passed;
    this.answers = data.answers; // JSON object with answers
    this.time_taken = data.time_taken; // in seconds
    this.attempt_number = data.attempt_number || 1;
    this.submitted_at = data.submitted_at;
    this.created_at = data.created_at;
  }

  static fromDatabase(row) {
    return new QuizSubmission({
      id: row.id,
      quiz_id: row.quiz_id,
      user_id: row.user_id,
      score: row.score,
      total_points: row.total_points,
      percentage: row.percentage,
      passed: row.passed,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
      time_taken: row.time_taken,
      attempt_number: row.attempt_number,
      submitted_at: row.submitted_at,
      created_at: row.created_at,
    });
  }

  toJSON() {
    return {
      id: this.id,
      quiz_id: this.quiz_id,
      user_id: this.user_id,
      score: this.score,
      total_points: this.total_points,
      percentage: this.percentage,
      passed: this.passed,
      answers: this.answers,
      time_taken: this.time_taken,
      attempt_number: this.attempt_number,
      submitted_at: this.submitted_at,
      created_at: this.created_at,
    };
  }
}

module.exports = QuizSubmission;