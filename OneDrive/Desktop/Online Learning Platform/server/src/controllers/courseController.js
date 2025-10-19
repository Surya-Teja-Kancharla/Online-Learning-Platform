/**
 * CourseController - Presentation Layer
 * Handles HTTP requests for course management
 * Implements Controller pattern
 */

const CourseService = require('../services/CourseService');

class CourseController {
  /**
   * Create a new course
   * POST /api/courses
   */
  async createCourse(req, res, next) {
    try {
      const courseData = req.body;
      const instructorId = req.user.id;

      const course = await CourseService.createCourse(courseData, instructorId);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses (with filters)
   * GET /api/courses
   */
  async getAllCourses(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        difficulty_level: req.query.difficulty,
        search: req.query.search,
        min_price: req.query.minPrice,
        max_price: req.query.maxPrice,
        sort_by: req.query.sortBy,
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await CourseService.getAllCourses(filters);

      res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get published courses only
   * GET /api/courses/published
   */
  async getPublishedCourses(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        difficulty_level: req.query.difficulty,
        search: req.query.search,
        min_price: req.query.minPrice,
        max_price: req.query.maxPrice,
        sort_by: req.query.sortBy,
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await CourseService.getPublishedCourses(filters);

      res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
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
      const courseId = req.params.id;
      const course = await CourseService.getCourseById(courseId);

      res.status(200).json({
        success: true,
        data: { course },
      });
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
      const courseId = req.params.id;
      const courseData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const course = await CourseService.updateCourse(
        courseId,
        courseData,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: { course },
      });
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
      const courseId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      await CourseService.deleteCourse(courseId, userId, userRole);

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle course publish status
   * PATCH /api/courses/:id/publish
   */
  async togglePublishStatus(req, res, next) {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      const course = await CourseService.togglePublishStatus(
        courseId,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: `Course ${course.is_published ? 'published' : 'unpublished'} successfully`,
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get instructor's courses
   * GET /api/courses/instructor/my-courses
   */
  async getMyInstructorCourses(req, res, next) {
    try {
      const instructorId = req.user.id;
      const filters = {
        category: req.query.category,
        difficulty_level: req.query.difficulty,
        is_published: req.query.published,
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await CourseService.getInstructorCourses(instructorId, filters);

      res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course statistics
   * GET /api/courses/:id/stats
   */
  async getCourseStats(req, res, next) {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      const stats = await CourseService.getCourseStats(courseId, userId, userRole);

      res.status(200).json({
        success: true,
        data: { stats },
      });
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

      res.status(200).json({
        success: true,
        data: { courses },
      });
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
      const searchTerm = req.query.q || req.query.search;
      const filters = {
        category: req.query.category,
        difficulty_level: req.query.difficulty,
        min_price: req.query.minPrice,
        max_price: req.query.maxPrice,
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await CourseService.searchCourses(searchTerm, filters);

      res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload course thumbnail
   * POST /api/courses/:id/thumbnail
   */
  async uploadThumbnail(req, res, next) {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Validate file
      await CourseService.validateFileUpload(req.file, 'image');

      // Update course with thumbnail URL
      const thumbnail_url = `/uploads/thumbnails/${req.file.filename}`;
      const course = await CourseService.updateCourse(
        courseId,
        { thumbnail_url },
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: 'Thumbnail uploaded successfully',
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload course video
   * POST /api/courses/:id/video
   */
  async uploadVideo(req, res, next) {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Validate file
      await CourseService.validateFileUpload(req.file, 'video');

      // Update course with video URL
      const video_url = `/uploads/videos/${req.file.filename}`;
      const course = await CourseService.updateCourse(
        courseId,
        { video_url },
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: 'Video uploaded successfully',
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();