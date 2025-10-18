/**
 * CourseService - Business Logic Layer
 * Handles course logic, validation, and file uploads
 * Implements Single Responsibility Principle
 */

const CourseRepository = require('../repositories/CourseRepository');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');
const { getFileUrl, deleteFile } = require('../middleware/upload.middleware');

class CourseService {
  /**
   * Create a new course
   * @param {object} courseData - Course data
   * @param {number} instructorId - Instructor ID
   * @param {object} files - Uploaded files
   * @returns {Promise<Course>}
   */
  async createCourse(courseData, instructorId, files = {}) {
    // Validate course data
    this.validateCourseData(courseData);
    
    // Prepare course data
    const newCourseData = {
      ...courseData,
      instructor_id: instructorId,
      price: parseFloat(courseData.price) || 0,
      duration: parseInt(courseData.duration) || null
    };
    
    // Handle file uploads
    if (files.video) {
      newCourseData.video_url = getFileUrl(files.video[0].path);
    }
    
    if (files.thumbnail) {
      newCourseData.thumbnail_url = getFileUrl(files.thumbnail[0].path);
    }
    
    // Create course
    const course = await CourseRepository.create(newCourseData);
    return course;
  }

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Course>}
   */
  async getCourseById(id) {
    const course = await CourseRepository.findById(id);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    
    return course;
  }

  /**
   * Get all courses with filters
   * @param {object} filters - Filter options
   * @returns {Promise<object>} - Courses and metadata
   */
  async getAllCourses(filters = {}) {
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get courses
    const courses = await CourseRepository.findAll({
      ...filters,
      limit,
      offset
    });
    
    // Get total count
    const total = await CourseRepository.count(filters);
    const totalPages = Math.ceil(total / limit);
    
    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get published courses
   * @param {object} filters - Filter options
   * @returns {Promise<object>} - Courses and metadata
   */
  async getPublishedCourses(filters = {}) {
    return this.getAllCourses({ ...filters, is_published: true });
  }

  /**
   * Get courses by instructor
   * @param {number} instructorId - Instructor ID
   * @param {object} filters - Filter options
   * @returns {Promise<Course[]>}
   */
  async getCoursesByInstructor(instructorId, filters = {}) {
    return await CourseRepository.findAll({
      ...filters,
      instructor_id: instructorId
    });
  }

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {object} updateData - Data to update
   * @param {number} userId - User ID making the update
   * @param {string} userRole - User role
   * @param {object} files - Uploaded files
   * @returns {Promise<Course>}
   */
  async updateCourse(id, updateData, userId, userRole, files = {}) {
    // Get existing course
    const course = await this.getCourseById(id);
    
    // Check ownership
    this.checkOwnership(course, userId, userRole);
    
    // Validate update data
    if (updateData.title || updateData.description || updateData.category || updateData.difficulty) {
      this.validateCourseData({ ...course, ...updateData });
    }
    
    // Prepare update data
    const updatedData = { ...updateData };
    
    // Handle file uploads
    if (files.video) {
      // Delete old video if exists
      if (course.video_url) {
        await deleteFile(course.video_url);
      }
      updatedData.video_url = getFileUrl(files.video[0].path);
    }
    
    if (files.thumbnail) {
      // Delete old thumbnail if exists
      if (course.thumbnail_url) {
        await deleteFile(course.thumbnail_url);
      }
      updatedData.thumbnail_url = getFileUrl(files.thumbnail[0].path);
    }
    
    // Update course
    const updatedCourse = await CourseRepository.update(id, updatedData);
    return updatedCourse;
  }

  /**
   * Delete course
   * @param {number} id - Course ID
   * @param {number} userId - User ID making the deletion
   * @param {string} userRole - User role
   * @returns {Promise<boolean>}
   */
  async deleteCourse(id, userId, userRole) {
    // Get course
    const course = await this.getCourseById(id);
    
    // Check ownership
    this.checkOwnership(course, userId, userRole);
    
    // Delete associated files
    if (course.video_url) {
      await deleteFile(course.video_url);
    }
    
    if (course.thumbnail_url) {
      await deleteFile(course.thumbnail_url);
    }
    
    // Delete course
    const deleted = await CourseRepository.delete(id);
    return deleted;
  }

  /**
   * Publish course
   * @param {number} id - Course ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<Course>}
   */
  async publishCourse(id, userId, userRole) {
    const course = await this.getCourseById(id);
    this.checkOwnership(course, userId, userRole);
    
    // Validate course is ready to be published
    this.validatePublishReadiness(course);
    
    return await CourseRepository.update(id, { is_published: true });
  }

  /**
   * Unpublish course
   * @param {number} id - Course ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<Course>}
   */
  async unpublishCourse(id, userId, userRole) {
    const course = await this.getCourseById(id);
    this.checkOwnership(course, userId, userRole);
    
    return await CourseRepository.update(id, { is_published: false });
  }

  /**
   * Search courses
   * @param {string} query - Search query
   * @param {object} filters - Additional filters
   * @returns {Promise<object>}
   */
  async searchCourses(query, filters = {}) {
    return this.getAllCourses({
      ...filters,
      search: query,
      is_published: true
    });
  }

  /**
   * Get popular courses
   * @param {number} limit - Number of courses
   * @returns {Promise<Course[]>}
   */
  async getPopularCourses(limit = 10) {
    return await CourseRepository.findPopular(limit);
  }

  /**
   * Get top rated courses
   * @param {number} limit - Number of courses
   * @returns {Promise<Course[]>}
   */
  async getTopRatedCourses(limit = 10) {
    return await CourseRepository.findTopRated(limit);
  }

  /**
   * Get courses by category
   * @param {string} category - Category name
   * @param {object} filters - Additional filters
   * @returns {Promise<object>}
   */
  async getCoursesByCategory(category, filters = {}) {
    return this.getAllCourses({
      ...filters,
      category,
      is_published: true
    });
  }

  /**
   * Get available categories
   * @returns {Promise<string[]>}
   */
  async getCategories() {
    return await CourseRepository.getCategories();
  }

  /**
   * Validate course data
   * @param {object} courseData - Course data to validate
   * @throws {ValidationError}
   */
  validateCourseData(courseData) {
    const errors = [];
    
    // Title validation
    if (courseData.title !== undefined) {
      if (!courseData.title || courseData.title.trim().length < 5) {
        errors.push('Title must be at least 5 characters');
      }
      if (courseData.title && courseData.title.length > 255) {
        errors.push('Title must not exceed 255 characters');
      }
    }
    
    // Description validation
    if (courseData.description !== undefined) {
      if (!courseData.description || courseData.description.trim().length < 20) {
        errors.push('Description must be at least 20 characters');
      }
    }
    
    // Category validation
    if (courseData.category !== undefined && !courseData.category) {
      errors.push('Category is required');
    }
    
    // Difficulty validation
    if (courseData.difficulty !== undefined) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(courseData.difficulty)) {
        errors.push('Invalid difficulty level. Must be: beginner, intermediate, or advanced');
      }
    }
    
    // Price validation
    if (courseData.price !== undefined) {
      const price = parseFloat(courseData.price);
      if (isNaN(price) || price < 0) {
        errors.push('Price must be a positive number');
      }
      if (price > 9999.99) {
        errors.push('Price must not exceed $9,999.99');
      }
    }
    
    // Duration validation
    if (courseData.duration !== undefined && courseData.duration !== null) {
      const duration = parseInt(courseData.duration);
      if (isNaN(duration) || duration < 0) {
        errors.push('Duration must be a positive number (in minutes)');
      }
    }
    
    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }
  }

  /**
   * Validate course is ready to be published
   * @param {Course} course - Course object
   * @throws {ValidationError}
   */
  validatePublishReadiness(course) {
    const errors = [];
    
    if (!course.title) errors.push('Title is required');
    if (!course.description) errors.push('Description is required');
    if (!course.category) errors.push('Category is required');
    if (!course.difficulty) errors.push('Difficulty level is required');
    
    if (errors.length > 0) {
      throw new ValidationError(
        'Course cannot be published: ' + errors.join(', ')
      );
    }
  }

  /**
   * Check course ownership
   * @param {Course} course - Course object
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @throws {ForbiddenError}
   */
  checkOwnership(course, userId, userRole) {
    // Admins can access any course
    if (userRole === 'admin') {
      return true;
    }
    
    // Instructors can only access their own courses
    if (userRole === 'instructor' && course.instructor_id === userId) {
      return true;
    }
    
    throw new ForbiddenError('You do not have permission to access this course');
  }

  /**
   * Get course statistics
   * @param {number} instructorId - Instructor ID
   * @returns {Promise<object>}
   */
  async getInstructorStats(instructorId) {
    const courses = await CourseRepository.findByInstructor(instructorId);
    
    const stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.is_published).length,
      draftCourses: courses.filter(c => !c.is_published).length,
      totalEnrollments: courses.reduce((sum, c) => sum + c.enrollment_count, 0),
      averageRating: courses.length > 0
        ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(2)
        : 0,
      totalRevenue: courses.reduce((sum, c) => sum + (c.price * c.enrollment_count), 0).toFixed(2)
    };
    
    return stats;
  }
}

module.exports = new CourseService();