/**
 * Lesson Service
 * Business logic for lessons and progress tracking
 */

const LessonRepository = require('../repositories/LessonRepository');
const CourseRepository = require('../repositories/CourseRepository');
const EnrollmentRepository = require('../repositories/EnrollmentRepository');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');

class LessonService {
  /**
   * Create a new lesson
   */
  async createLesson(instructorId, lessonData) {
    // Verify instructor owns the course
    const course = await CourseRepository.findById(lessonData.course_id);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this course');
    }

    // Validate lesson data
    this.validateLessonData(lessonData);

    return await LessonRepository.create(lessonData);
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id, userId = null) {
    const lesson = await LessonRepository.findById(id);
    
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // If user provided, include progress
    if (userId) {
      const progress = await LessonRepository.getOrCreateProgress(
        userId,
        lesson.id,
        lesson.course_id
      );
      
      return {
        ...lesson.toJSON(),
        progress: progress.toJSON(),
      };
    }

    return lesson;
  }

  /**
   * Get all lessons for a course
   */
  async getCourseLessons(courseId, userId = null) {
    const course = await CourseRepository.findById(courseId);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const lessons = await LessonRepository.findByCourse(courseId);

    // If user provided, include progress for each lesson
    if (userId) {
      const lessonsWithProgress = await Promise.all(
        lessons.map(async (lesson) => {
          const progress = await LessonRepository.getOrCreateProgress(
            userId,
            lesson.id,
            courseId
          );
          
          return {
            ...lesson.toJSON(),
            progress: progress.toJSON(),
          };
        })
      );

      return lessonsWithProgress;
    }

    return lessons.map(l => l.toJSON());
  }

  /**
   * Update lesson
   */
  async updateLesson(lessonId, instructorId, lessonData) {
    const lesson = await LessonRepository.findById(lessonId);
    
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const course = await CourseRepository.findById(lesson.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this lesson');
    }

    this.validateLessonData(lessonData);

    return await LessonRepository.update(lessonId, lessonData);
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId, instructorId) {
    const lesson = await LessonRepository.findById(lessonId);
    
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const course = await CourseRepository.findById(lesson.course_id);

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('You do not own this lesson');
    }

    return await LessonRepository.delete(lessonId);
  }

  /**
   * Update lesson progress
   */
  async updateProgress(userId, lessonId, progressData) {
    const lesson = await LessonRepository.findById(lessonId);
    
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify user is enrolled in the course
    const enrollment = await EnrollmentRepository.findByCourseAndUser(
      lesson.course_id,
      userId
    );

    if (!enrollment) {
      throw new ForbiddenError('You are not enrolled in this course');
    }

    // Get or create progress record
    await LessonRepository.getOrCreateProgress(userId, lessonId, lesson.course_id);

    // Update progress
    const updatedProgress = await LessonRepository.updateProgress(
      userId,
      lessonId,
      progressData
    );

    // If lesson completed, update course progress
    if (progressData.completed) {
      await this.updateCourseProgress(userId, lesson.course_id);
    }

    return updatedProgress;
  }

  /**
   * Mark lesson as complete
   */
  async markComplete(userId, lessonId) {
    const lesson = await LessonRepository.findById(lessonId);
    
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify enrollment
    const enrollment = await EnrollmentRepository.findByCourseAndUser(
      lesson.course_id,
      userId
    );

    if (!enrollment) {
      throw new ForbiddenError('You are not enrolled in this course');
    }

    // Get or create progress
    await LessonRepository.getOrCreateProgress(userId, lessonId, lesson.course_id);

    // Mark as complete
    const progress = await LessonRepository.markComplete(userId, lessonId);

    // Update course progress
    await this.updateCourseProgress(userId, lesson.course_id);

    return progress;
  }

  /**
   * Get user's progress for a course
   */
  async getCourseProgress(userId, courseId) {
    const course = await CourseRepository.findById(courseId);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Verify enrollment
    const enrollment = await EnrollmentRepository.findByCourseAndUser(
      courseId,
      userId
    );

    if (!enrollment) {
      throw new ForbiddenError('You are not enrolled in this course');
    }

    const progress = await LessonRepository.getCourseProgress(userId, courseId);
    const stats = await LessonRepository.getCompletionStats(userId, courseId);

    return {
      progress,
      stats: {
        totalLessons: parseInt(stats.total_lessons) || 0,
        completedLessons: parseInt(stats.completed_lessons) || 0,
        averageProgress: parseFloat(stats.average_progress) || 0,
      },
    };
  }

  /**
   * Update course enrollment progress based on lessons
   */
  async updateCourseProgress(userId, courseId) {
    const stats = await LessonRepository.getCompletionStats(userId, courseId);
    
    const totalLessons = parseInt(stats.total_lessons) || 0;
    const completedLessons = parseInt(stats.completed_lessons) || 0;
    
    if (totalLessons === 0) return;

    const progress = Math.round((completedLessons / totalLessons) * 100);

    // Update enrollment progress
    await EnrollmentRepository.updateProgress(userId, courseId, progress);

    return progress;
  }

  /**
   * Get next lesson
   */
  async getNextLesson(currentLessonId, userId) {
    const currentLesson = await LessonRepository.findById(currentLessonId);
    
    if (!currentLesson) {
      throw new NotFoundError('Lesson not found');
    }

    const allLessons = await LessonRepository.findByCourse(currentLesson.course_id);
    
    // Sort by order_index
    allLessons.sort((a, b) => a.order_index - b.order_index);

    // Find current lesson index
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    
    // Get next lesson
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      return await this.getLessonById(nextLesson.id, userId);
    }

    return null; // No more lessons
  }

  /**
   * Get previous lesson
   */
  async getPreviousLesson(currentLessonId, userId) {
    const currentLesson = await LessonRepository.findById(currentLessonId);
    
    if (!currentLesson) {
      throw new NotFoundError('Lesson not found');
    }

    const allLessons = await LessonRepository.findByCourse(currentLesson.course_id);
    
    // Sort by order_index
    allLessons.sort((a, b) => a.order_index - b.order_index);

    // Find current lesson index
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    
    // Get previous lesson
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      return await this.getLessonById(prevLesson.id, userId);
    }

    return null; // No previous lesson
  }

  /**
   * Validate lesson data
   */
  validateLessonData(lessonData) {
    if (!lessonData.title || lessonData.title.length < 3) {
      throw new ValidationError('Lesson title must be at least 3 characters');
    }

    const validTypes = ['video', 'pdf', 'text', 'quiz'];
    if (!validTypes.includes(lessonData.content_type)) {
      throw new ValidationError('Invalid content type');
    }

    if (lessonData.content_type === 'video' && !lessonData.content_url) {
      throw new ValidationError('Video lessons must have a content URL');
    }

    if (lessonData.content_type === 'video') {
      const validProviders = ['youtube', 'vimeo', 'custom'];
      if (lessonData.video_provider && !validProviders.includes(lessonData.video_provider)) {
        throw new ValidationError('Invalid video provider');
      }
    }

    if (lessonData.duration && lessonData.duration < 0) {
      throw new ValidationError('Duration must be positive');
    }

    if (lessonData.order_index && lessonData.order_index < 0) {
      throw new ValidationError('Order index must be positive');
    }
  }
}

module.exports = new LessonService();