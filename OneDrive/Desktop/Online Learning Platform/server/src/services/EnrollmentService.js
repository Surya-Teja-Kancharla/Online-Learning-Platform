/**
 * Enrollment Service
 * Business logic for course enrollments
 */

const EnrollmentRepository = require('../repositories/EnrollmentRepository');
const CourseRepository = require('../repositories/CourseRepository');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

class EnrollmentService {
  /**
   * Get all enrollments for a user
   */
  async getMyEnrollments(userId) {
    const enrollments = await EnrollmentRepository.findByUserId(userId);
    return enrollments;
  }

  /**
   * Enroll a user in a course
   */
  async enrollInCourse(userId, courseId) {
    // Validate course exists
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await EnrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );

    if (existingEnrollment) {
      throw new ConflictError('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await EnrollmentRepository.create({
      user_id: userId,
      course_id: courseId,
      progress: 0,
    });

    return enrollment;
  }

  /**
   * Get enrollment by user and course
   */
  async getEnrollmentByCourse(userId, courseId) {
    const enrollment = await EnrollmentRepository.findByUserAndCourse(userId, courseId);
    return enrollment;
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(enrollmentId, userId, progress) {
    // Verify enrollment belongs to user
    const enrollment = await EnrollmentRepository.findById(enrollmentId);
    
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.user_id !== userId) {
      throw new ValidationError('Unauthorized to update this enrollment');
    }

    // Update progress
    const updatedEnrollment = await EnrollmentRepository.updateProgress(
      enrollmentId,
      progress
    );

    return updatedEnrollment;
  }

  /**
   * Mark enrollment as completed
   */
  async completeEnrollment(enrollmentId, userId) {
    // Verify enrollment belongs to user
    const enrollment = await EnrollmentRepository.findById(enrollmentId);
    
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.user_id !== userId) {
      throw new ValidationError('Unauthorized to complete this enrollment');
    }

    // Mark as completed
    const completedEnrollment = await EnrollmentRepository.markAsCompleted(enrollmentId);

    return completedEnrollment;
  }

  /**
   * Get student statistics
   */
  async getStudentStats(userId) {
    const stats = await EnrollmentRepository.getStudentStats(userId);
    return stats;
  }

  /**
   * Unenroll from a course
   */
  async unenroll(enrollmentId, userId) {
    // Verify enrollment belongs to user
    const enrollment = await EnrollmentRepository.findById(enrollmentId);
    
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.user_id !== userId) {
      throw new ValidationError('Unauthorized to unenroll from this course');
    }

    await EnrollmentRepository.delete(enrollmentId);
  }

  /**
   * Get course progress details
   */
  async getCourseProgress(userId, courseId) {
    const enrollment = await EnrollmentRepository.findByUserAndCourse(userId, courseId);
    
    if (!enrollment) {
      throw new NotFoundError('Not enrolled in this course');
    }

    return {
      enrollment_id: enrollment.id,
      course_id: enrollment.course_id,
      progress: enrollment.progress,
      enrolled_at: enrollment.enrolled_at,
      last_accessed_at: enrollment.last_accessed_at,
      completed_at: enrollment.completed_at,
    };
  }
}

module.exports = new EnrollmentService();