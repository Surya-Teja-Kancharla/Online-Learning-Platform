/**
 * CourseService - Business Logic Layer
 * Handles course-related business logic and validation
 * Implements Single Responsibility Principle
 */

const CourseRepository = require('../repositories/CourseRepository');
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/errors');

class CourseService {
  /**
   * Create a new course
   */
  async createCourse(courseData, instructorId) {
    // Validate course data
    this.validateCourseData(courseData);

    // Create course
    const course = await CourseRepository.create({
      ...courseData,
      instructor_id: instructorId,
    });

    return course;
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId) {
    const course = await CourseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return course;
  }

  /**
   * Get all courses with filters
   */
  async getAllCourses(filters = {}) {
    return await CourseRepository.findAll(filters);
  }

  /**
   * Get published courses
   */
  async getPublishedCourses(filters = {}) {
    return await CourseRepository.findAll({ ...filters, is_published: true });
  }

  /**
   * Update course
   */
  async updateCourse(courseId, courseData, userId, userRole) {
    // Get existing course
    const course = await this.getCourseById(courseId);

    // Check permissions
    this.checkUpdatePermission(course, userId, userRole);

    // Validate update data
    if (courseData.title || courseData.description || courseData.category) {
      this.validateCourseData({ ...course, ...courseData }, true);
    }

    // Update course
    const updatedCourse = await CourseRepository.update(courseId, courseData);

    return updatedCourse;
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId, userId, userRole) {
    // Get existing course
    const course = await this.getCourseById(courseId);

    // Check permissions
    this.checkDeletePermission(course, userId, userRole);

    // Delete course
    await CourseRepository.delete(courseId);

    return { message: 'Course deleted successfully' };
  }

  /**
   * Publish/Unpublish course
   */
  async togglePublishStatus(courseId, userId, userRole) {
    // Get existing course
    const course = await this.getCourseById(courseId);

    // Check permissions (only instructor owner or admin)
    this.checkUpdatePermission(course, userId, userRole);

    // Toggle publish status
    const updatedCourse = await CourseRepository.update(courseId, {
      is_published: !course.is_published,
    });

    return updatedCourse;
  }

  /**
   * Get instructor's courses
   */
  async getInstructorCourses(instructorId, filters = {}) {
    return await CourseRepository.findByInstructor(instructorId, filters);
  }

  /**
   * Get course statistics
   */
  async getCourseStats(courseId, userId, userRole) {
    // Get course
    const course = await this.getCourseById(courseId);

    // Check if user has permission to view stats
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      throw new ForbiddenError('You do not have permission to view these statistics');
    }

    const stats = await CourseRepository.getStats(courseId);
    return stats;
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(limit = 10) {
    return await CourseRepository.getPopular(limit);
  }

  /**
   * Search courses
   */
  async searchCourses(searchTerm, filters = {}) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new ValidationError('Search term is required');
    }

    return await CourseRepository.search(searchTerm, filters);
  }

  /**
   * Validate course data
   */
  validateCourseData(courseData, isUpdate = false) {
    const errors = [];

    // Title validation
    if (!isUpdate || courseData.title !== undefined) {
      if (!courseData.title || courseData.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
      }
      if (courseData.title && courseData.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    // Description validation
    if (!isUpdate || courseData.description !== undefined) {
      if (!courseData.description || courseData.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
      }
      if (courseData.description && courseData.description.length > 5000) {
        errors.push('Description must be less than 5000 characters');
      }
    }

    // Category validation
    if (!isUpdate || courseData.category !== undefined) {
      const validCategories = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Artificial Intelligence',
        'Cloud Computing',
        'Cybersecurity',
        'DevOps',
        'Database',
        'Programming Languages',
        'Software Engineering',
        'Game Development',
        'UI/UX Design',
        'Business',
        'Marketing',
        'Other',
      ];

      if (!courseData.category) {
        errors.push('Category is required');
      } else if (!validCategories.includes(courseData.category)) {
        errors.push('Invalid category');
      }
    }

    // Difficulty level validation
    if (courseData.difficulty_level !== undefined) {
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(courseData.difficulty_level)) {
        errors.push('Difficulty level must be beginner, intermediate, or advanced');
      }
    }

    // Price validation
    if (courseData.price !== undefined) {
      const price = parseFloat(courseData.price);
      if (isNaN(price) || price < 0) {
        errors.push('Price must be a positive number');
      }
      if (price > 999999) {
        errors.push('Price is too high');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }

  /**
   * Check if user can update course
   */
  checkUpdatePermission(course, userId, userRole) {
    if (userRole === 'admin') {
      return true; // Admin can update any course
    }

    if (userRole === 'instructor' && course.instructor_id === userId) {
      return true; // Instructor can update their own courses
    }

    throw new ForbiddenError('You do not have permission to update this course');
  }

  /**
   * Check if user can delete course
   */
  checkDeletePermission(course, userId, userRole) {
    if (userRole === 'admin') {
      return true; // Admin can delete any course
    }

    if (userRole === 'instructor' && course.instructor_id === userId) {
      return true; // Instructor can delete their own courses
    }

    throw new ForbiddenError('You do not have permission to delete this course');
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file, type = 'image') {
    if (!file) {
      throw new ValidationError('No file uploaded');
    }

    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      video: 500 * 1024 * 1024, // 500MB
      document: 10 * 1024 * 1024, // 10MB
    };

    const allowedMimeTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    };

    // Check file size
    if (file.size > maxSizes[type]) {
      throw new ValidationError(`File size exceeds maximum allowed (${maxSizes[type] / 1024 / 1024}MB)`);
    }

    // Check MIME type
    if (!allowedMimeTypes[type].includes(file.mimetype)) {
      throw new ValidationError(`Invalid file type. Allowed types: ${allowedMimeTypes[type].join(', ')}`);
    }

    return true;
  }
}

module.exports = new CourseService();