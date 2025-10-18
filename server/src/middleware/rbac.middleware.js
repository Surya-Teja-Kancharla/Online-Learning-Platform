/**
 * RBAC Middleware - Role-Based Access Control
 * Restricts access based on user roles
 */

const { ForbiddenError, UnauthorizedError } = require('../utils/errors');

/**
 * Check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles
 * @returns {Function} Express middleware
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Convert single role to array
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Access denied. Required role: ${roles.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Allow only students
 */
const studentOnly = authorize('student');

/**
 * Allow only instructors
 */
const instructorOnly = authorize('instructor');

/**
 * Allow only admins
 */
const adminOnly = authorize('admin');

/**
 * Allow instructors and admins
 */
const instructorOrAdmin = authorize(['instructor', 'admin']);

/**
 * Allow students and instructors (not admins)
 */
const studentOrInstructor = authorize(['student', 'instructor']);

/**
 * Check if user owns the resource
 * @param {Function} getResourceOwnerId - Function to get resource owner ID
 * @returns {Function} Express middleware
 */
const checkOwnership = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Admins can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Get resource owner ID
      const ownerId = await getResourceOwnerId(req);

      // Check ownership
      if (req.user.id !== ownerId) {
        throw new ForbiddenError('You do not own this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns resource or is admin
 * @param {Function} getResourceOwnerId - Function to get resource owner ID
 * @returns {Function} Express middleware
 */
const ownerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Admins can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Get resource owner ID
      const ownerId = await getResourceOwnerId(req);

      // Check ownership
      if (req.user.id !== ownerId) {
        throw new ForbiddenError('Access denied. You must be the owner or an admin');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Custom role check with callback
 * @param {Function} checkFunction - Custom check function
 * @returns {Function} Express middleware
 */
const customAuthorize = (checkFunction) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Run custom check
      const isAuthorized = await checkFunction(req);

      if (!isAuthorized) {
        throw new ForbiddenError('Access denied');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorize,
  studentOnly,
  instructorOnly,
  adminOnly,
  instructorOrAdmin,
  studentOrInstructor,
  checkOwnership,
  ownerOrAdmin,
  customAuthorize
};