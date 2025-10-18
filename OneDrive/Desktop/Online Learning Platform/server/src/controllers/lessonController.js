/**
 * Lesson Controller
 * Handles HTTP requests for lessons
 */

const LessonService = require('../services/LessonService');
const { successResponse } = require('../utils/responses');

class LessonController {
  /**
   * Create a new lesson
   */
  async create(req, res, next) {
    try {
      const lesson = await LessonService.createLesson(req.user.id, req.body);
      return successResponse(res, { lesson }, 'Lesson created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lesson by ID
   */
  async getById(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await LessonService.getLessonById(lessonId, req.user?.id);
      return successResponse(res, { lesson }, 'Lesson retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all lessons for a course
   */
  async getByCourse(req, res, next) {
    try {
      const courseId = parseInt(req.params.courseId);
      const lessons = await LessonService.getCourseLessons(courseId, req.user?.id);
      return successResponse(res, { lessons }, 'Lessons retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lesson
   */
  async update(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await LessonService.updateLesson(lessonId, req.user.id, req.body);
      return successResponse(res, { lesson }, 'Lesson updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lesson
   */
  async delete(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      await LessonService.deleteLesson(lessonId, req.user.id);
      return successResponse(res, null, 'Lesson deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lesson progress
   */
  async updateProgress(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const progress = await LessonService.updateProgress(
        req.user.id,
        lessonId,
        req.body
      );
      return successResponse(res, { progress }, 'Progress updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark lesson as complete
   */
  async markComplete(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const progress = await LessonService.markComplete(req.user.id, lessonId);
      return successResponse(res, { progress }, 'Lesson marked as complete');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course progress
   */
  async getCourseProgress(req, res, next) {
    try {
      const courseId = parseInt(req.params.courseId);
      const progressData = await LessonService.getCourseProgress(req.user.id, courseId);
      return successResponse(res, progressData, 'Progress retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get next lesson
   */
  async getNext(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const nextLesson = await LessonService.getNextLesson(lessonId, req.user.id);
      
      if (!nextLesson) {
        return successResponse(res, { lesson: null }, 'No next lesson available');
      }

      return successResponse(res, { lesson: nextLesson }, 'Next lesson retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get previous lesson
   */
  async getPrevious(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const prevLesson = await LessonService.getPreviousLesson(lessonId, req.user.id);
      
      if (!prevLesson) {
        return successResponse(res, { lesson: null }, 'No previous lesson available');
      }

      return successResponse(res, { lesson: prevLesson }, 'Previous lesson retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();