/**
 * Course Validation Middleware
 * Input validation for course endpoints
 */

const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new ValidationError(errorMessages.join(', '));
  }
  
  next();
};

/**
 * Validation rules for create course
 */
const createCourseValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
  
  body('difficulty')
    .notEmpty().withMessage('Difficulty level is required')
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 9999.99 }).withMessage('Price must be between 0 and 9999.99'),
  
  body('duration')
    .optional()
    .isInt({ min: 0 }).withMessage('Duration must be a positive number (in minutes)'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Language must not exceed 50 characters'),
  
  body('syllabus')
    .optional()
    .trim(),
  
  body('requirements')
    .optional()
    .trim(),
  
  body('learning_outcomes')
    .optional()
    .trim(),
  
  handleValidationErrors
];

/**
 * Validation rules for update course
 */
const updateCourseValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 9999.99 }).withMessage('Price must be between 0 and 9999.99'),
  
  body('duration')
    .optional()
    .isInt({ min: 0 }).withMessage('Duration must be a positive number (in minutes)'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Language must not exceed 50 characters'),
  
  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean'),
  
  handleValidationErrors
];

/**
 * Validation rules for course ID param
 */
const courseIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid course ID'),
  
  handleValidationErrors
];

/**
 * Validation rules for search query
 */
const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Search query must be between 1 and 255 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .trim(),
  
  query('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  
  handleValidationErrors
];

/**
 * Validation rules for pagination
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['created_at', 'title', 'price', 'rating', 'enrollment_count'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC'),
  
  handleValidationErrors
];

/**
 * Validation rules for category param
 */
const categoryValidation = [
  param('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
  
  handleValidationErrors
];

/**
 * Validate file uploads
 */
const validateFileUploads = (req, res, next) => {
  const errors = [];
  
  if (req.files) {
    // Validate video
    if (req.files.video) {
      const video = req.files.video[0];
      const maxVideoSize = 500 * 1024 * 1024; // 500MB
      
      if (video.size > maxVideoSize) {
        errors.push('Video file size must not exceed 500MB');
      }
    }
    
    // Validate thumbnail
    if (req.files.thumbnail) {
      const thumbnail = req.files.thumbnail[0];
      const maxThumbnailSize = 5 * 1024 * 1024; // 5MB
      
      if (thumbnail.size > maxThumbnailSize) {
        errors.push('Thumbnail file size must not exceed 5MB');
      }
    }
    
    // Validate documents
    if (req.files.documents) {
      const maxDocSize = 50 * 1024 * 1024; // 50MB per document
      
      req.files.documents.forEach((doc, index) => {
        if (doc.size > maxDocSize) {
          errors.push(`Document ${index + 1} file size must not exceed 50MB`);
        }
      });
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
  searchValidation,
  paginationValidation,
  categoryValidation,
  validateFileUploads
};