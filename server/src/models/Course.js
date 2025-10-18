/**
 * Course Domain Model
 * Represents a course entity in the system
 */

class Course {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.instructor_id = data.instructor_id;
    this.category = data.category;
    this.difficulty = data.difficulty;
    this.price = parseFloat(data.price) || 0.00;
    this.duration = data.duration;
    this.thumbnail_url = data.thumbnail_url || null;
    this.video_url = data.video_url || null;
    this.syllabus = data.syllabus || null;
    this.requirements = data.requirements || null;
    this.learning_outcomes = data.learning_outcomes || null;
    this.language = data.language || 'English';
    this.is_published = data.is_published || false;
    this.enrollment_count = data.enrollment_count || 0;
    this.rating = parseFloat(data.rating) || 0.00;
    this.rating_count = data.rating_count || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Include instructor data if available
    if (data.instructor_name) {
      this.instructor = {
        id: data.instructor_id,
        name: data.instructor_name,
        email: data.instructor_email,
        avatar_url: data.instructor_avatar_url
      };
    }
  }

  /**
   * Check if course belongs to a specific instructor
   * @param {number} instructorId - Instructor ID to check
   * @returns {boolean}
   */
  belongsToInstructor(instructorId) {
    return this.instructor_id === instructorId;
  }

  /**
   * Check if course is published
   * @returns {boolean}
   */
  isPublished() {
    return this.is_published;
  }

  /**
   * Check if course is free
   * @returns {boolean}
   */
  isFree() {
    return this.price === 0;
  }

  /**
   * Get course difficulty level
   * @returns {string}
   */
  getDifficulty() {
    return this.difficulty;
  }

  /**
   * Get formatted price
   * @returns {string}
   */
  getFormattedPrice() {
    return this.price === 0 ? 'Free' : `$${this.price.toFixed(2)}`;
  }

  /**
   * Get formatted duration
   * @returns {string}
   */
  getFormattedDuration() {
    if (!this.duration) return 'Not specified';
    
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Get safe course object (for API responses)
   * @returns {object}
   */
  toSafeObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      instructor_id: this.instructor_id,
      instructor: this.instructor,
      category: this.category,
      difficulty: this.difficulty,
      price: this.price,
      duration: this.duration,
      thumbnail_url: this.thumbnail_url,
      video_url: this.video_url,
      syllabus: this.syllabus,
      requirements: this.requirements,
      learning_outcomes: this.learning_outcomes,
      language: this.language,
      is_published: this.is_published,
      enrollment_count: this.enrollment_count,
      rating: this.rating,
      rating_count: this.rating_count,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Validate course data
   * @returns {boolean}
   */
  isValid() {
    return (
      this.title &&
      this.description &&
      this.instructor_id &&
      this.category &&
      this.difficulty &&
      ['beginner', 'intermediate', 'advanced'].includes(this.difficulty)
    );
  }

  /**
   * Get course summary (for listings)
   * @returns {object}
   */
  toSummary() {
    return {
      id: this.id,
      title: this.title,
      description: this.description.substring(0, 150) + '...',
      instructor: this.instructor,
      category: this.category,
      difficulty: this.difficulty,
      price: this.price,
      duration: this.duration,
      thumbnail_url: this.thumbnail_url,
      rating: this.rating,
      rating_count: this.rating_count,
      enrollment_count: this.enrollment_count,
      is_published: this.is_published
    };
  }
}

module.exports = Course;