/**
 * Quiz Model
 * Represents a quiz in the system
 */

class Quiz {
  constructor(data) {
    this.id = data.id;
    this.course_id = data.course_id;
    this.title = data.title;
    this.description = data.description;
    this.passing_score = data.passing_score || 70;
    this.max_attempts = data.max_attempts || 3;
    this.time_limit = data.time_limit; // in minutes
    this.is_published = data.is_published || false;
    this.order_index = data.order_index || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromDatabase(row) {
    return new Quiz({
      id: row.id,
      course_id: row.course_id,
      title: row.title,
      description: row.description,
      passing_score: row.passing_score,
      max_attempts: row.max_attempts,
      time_limit: row.time_limit,
      is_published: row.is_published,
      order_index: row.order_index,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  toJSON() {
    return {
      id: this.id,
      course_id: this.course_id,
      title: this.title,
      description: this.description,
      passing_score: this.passing_score,
      max_attempts: this.max_attempts,
      time_limit: this.time_limit,
      is_published: this.is_published,
      order_index: this.order_index,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Quiz;