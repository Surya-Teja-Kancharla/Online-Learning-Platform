/**
 * QuizQuestion Model
 * Represents a question in a quiz
 */

class QuizQuestion {
  constructor(data) {
    this.id = data.id;
    this.quiz_id = data.quiz_id;
    this.question_text = data.question_text;
    this.question_type = data.question_type; // 'multiple_choice', 'true_false', 'short_answer'
    this.options = data.options; // JSON array for multiple choice
    this.correct_answer = data.correct_answer;
    this.points = data.points || 1;
    this.order_index = data.order_index || 0;
    this.explanation = data.explanation;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromDatabase(row) {
    return new QuizQuestion({
      id: row.id,
      quiz_id: row.quiz_id,
      question_text: row.question_text,
      question_type: row.question_type,
      options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
      correct_answer: row.correct_answer,
      points: row.points,
      order_index: row.order_index,
      explanation: row.explanation,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  toJSON() {
    return {
      id: this.id,
      quiz_id: this.quiz_id,
      question_text: this.question_text,
      question_type: this.question_type,
      options: this.options,
      correct_answer: this.correct_answer,
      points: this.points,
      order_index: this.order_index,
      explanation: this.explanation,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Return question without correct answer (for students)
  toStudentJSON() {
    return {
      id: this.id,
      quiz_id: this.quiz_id,
      question_text: this.question_text,
      question_type: this.question_type,
      options: this.options,
      points: this.points,
      order_index: this.order_index,
    };
  }
}

module.exports = QuizQuestion;