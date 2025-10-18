/**
 * CourseController - Presentation Layer
 * Handles HTTP requests for course management
 * Implements Controller pattern
 */

const CourseService = require('../services/CourseService');
const { successResponse, paginatedResponse } = require('../utils/responses');

class CourseController {
  /**
   * Create a new course
   * POST /api/courses
   */
  async createCourse(req, res, next) {
    try {
      const courseData = req.body;
      const instructorId = req.user.id;
      const files = req.files || {};
      
      const course = await CourseService.createCourse(
        courseData,
        instructorId,
        files
      );
      
      return successResponse(
        res,
        { course: course.toSafeObject() },
        'Course created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses
   * GET /api/courses
   */
  async getAllCourses(req, res, next) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        category: req.query.category,
        difficulty: req.query.difficulty,
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const result = await CourseService.getAllCourses(filters);
      
      return paginatedResponse(
        res,
        result.courses.map(c => c.toSafeObject()),
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get published courses
   * GET /api/courses/published
   */
  async getPublishedCourses(req, res, next) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        category: req.query.category,
        difficulty: req.query.difficulty,
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const result = await CourseService.getPublishedCourses(filters);
      
      return paginatedResponse(
        res,
        result.courses.map(c => c.toSummary()),
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course by ID
   * GET /api/courses/:id
   */
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseService.getCourseById(id);
      
      return successResponse(res, { course: course.toSafeObject() });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get instructor's courses
   * GET /api/courses/instructor/me
   */
  async getInstructorCourses(req, res, next) {
    try {
      const instructorId = req.user.id;
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        is_published: req.query.is_published,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const courses = await CourseService.getCoursesByInstructor(
        instructorId,
        filters
      );
      
      return successResponse(
        res,
        { courses: courses.map(c => c.toSafeObject()) }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get instructor statistics
   * GET /api/courses/instructor/stats
   */
  async getInstructorStats(req, res, next) {
    try {
      const instructorId = req.user.id;
      const stats = await CourseService.getInstructorStats(instructorId);
      
      return successResponse(res, { stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update course
   * PUT /api/courses/:id
   */
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;
      const files = req.files || {};
      
      const course = await CourseService.updateCourse(
        id,
        updateData,
        userId,
        userRole,
        files
      );
      
      return successResponse(
        res,
        { course: course.toSafeObject() },
        'Course updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete course
   * DELETE /api/courses/:id
   */
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      await CourseService.deleteCourse(id, userId, userRole);
      
      return successResponse(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish course
   * POST /api/courses/:id/publish
   */
  async publishCourse(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      const course = await CourseService.publishCourse(id, userId, userRole);
      
      return successResponse(
        res,
        { course: course.toSafeObject() },
        'Course published successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unpublish course
   * POST /api/courses/:id/unpublish
   */
  async unpublishCourse(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      
      const course = await CourseService.unpublishCourse(id, userId, userRole);
      
      return successResponse(
        res,
        { course: course.toSafeObject() },
        'Course unpublished successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search courses
   * GET /api/courses/search
   */
  async searchCourses(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return successResponse(res, { courses: [] });
      }
      
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        category: req.query.category,
        difficulty: req.query.difficulty,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice
      };
      
      const result = await CourseService.searchCourses(q, filters);
      
      return paginatedResponse(
        res,
        result.courses.map(c => c.toSummary()),
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get popular courses
   * GET /api/courses/popular
   */
  async getPopularCourses(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const courses = await CourseService.getPopularCourses(limit);
      
      return successResponse(
        res,
        { courses: courses.map(c => c.toSummary()) }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top rated courses
   * GET /api/courses/top-rated
   */
  async getTopRatedCourses(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const courses = await CourseService.getTopRatedCourses(limit);
      
      return successResponse(
        res,
        { courses: courses.map(c => c.toSummary()) }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get courses by category
   * GET /api/courses/category/:category
   */
  async getCoursesByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        difficulty: req.query.difficulty,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const result = await CourseService.getCoursesByCategory(
        category,
        filters
      );
      
      return paginatedResponse(
        res,
        result.courses.map(c => c.toSummary()),
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available categories
   * GET /api/courses/categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await CourseService.getCategories();
      return successResponse(res, { categories });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();