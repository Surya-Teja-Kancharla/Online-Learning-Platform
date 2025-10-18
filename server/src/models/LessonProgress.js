/**
 * LessonProgress Model
 * Tracks student progress on individual lessons
 */

class LessonProgress {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.lesson_id = data.lesson_id;
    this.course_id = data.course_id;
    this.completed = data.completed || false;
    this.progress_percentage = data.progress_percentage || 0;
    this.time_spent = data.time_spent || 0; // in seconds
    this.last_position = data.last_position || 0; // for video playback
    this.completed_at = data.completed_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromDatabase(row) {
    return new LessonProgress({
      id: row.id,
      user_id: row.user_id,
      lesson_id: row.lesson_id,
      course_id: row.course_id,
      completed: row.completed,
      progress_percentage: row.progress_percentage,
      time_spent: row.time_spent,
      last_position: row.last_position,
      completed_at: row.completed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      lesson_id: this.lesson_id,
      course_id: this.course_id,
      completed: this.completed,
      progress_percentage: this.progress_percentage,
      time_spent: this.time_spent,
      last_position: this.last_position,
      completed_at: this.completed_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = LessonProgress;