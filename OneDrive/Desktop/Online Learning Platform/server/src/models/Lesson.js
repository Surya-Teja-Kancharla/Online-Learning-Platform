/**
 * Lesson Model
 * Represents a lesson/content item in a course
 */

class Lesson {
  constructor(data) {
    this.id = data.id;
    this.course_id = data.course_id;
    this.title = data.title;
    this.description = data.description;
    this.content_type = data.content_type; // 'video', 'pdf', 'text', 'quiz'
    this.content_url = data.content_url;
    this.video_provider = data.video_provider; // 'youtube', 'vimeo', 'custom'
    this.duration = data.duration; // in seconds
    this.order_index = data.order_index || 0;
    this.is_free_preview = data.is_free_preview || false;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromDatabase(row) {
    return new Lesson({
      id: row.id,
      course_id: row.course_id,
      title: row.title,
      description: row.description,
      content_type: row.content_type,
      content_url: row.content_url,
      video_provider: row.video_provider,
      duration: row.duration,
      order_index: row.order_index,
      is_free_preview: row.is_free_preview,
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
      content_type: this.content_type,
      content_url: this.content_url,
      video_provider: this.video_provider,
      duration: this.duration,
      order_index: this.order_index,
      is_free_preview: this.is_free_preview,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Lesson;