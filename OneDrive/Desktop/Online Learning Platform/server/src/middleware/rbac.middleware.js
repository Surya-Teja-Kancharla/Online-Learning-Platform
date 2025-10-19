/**
 * RBAC (Role-Based Access Control) Middleware
 * Restricts access based on user roles
 */

const { ForbiddenError } = require('../utils/errors');

/**
 * Authorize specific roles
 * @param {string[]} roles - Array of allowed roles
 */
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by authenticate middleware)
      if (!req.user) {
        throw new ForbiddenError('User authentication required');
      }

      // Check if user has one of the allowed roles
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
 * Authorize admin only
 */
const authorizeAdmin = (req, res, next) => {
  return authorizeRoles(['admin'])(req, res, next);
};

/**
 * Authorize instructor or admin
 */
const authorizeInstructorOrAdmin = (req, res, next) => {
  return authorizeRoles(['instructor', 'admin'])(req, res, next);
};

/**
 * Authorize student only
 */
const authorizeStudent = (req, res, next) => {
  return authorizeRoles(['student'])(req, res, next);
};

/**
 * Check if user is owner or admin
 * Useful for resource-specific permissions
 */
const authorizeOwnerOrAdmin = (ownerIdField = 'user_id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('User authentication required');
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check ownership (assumes resource is loaded in req.resource)
      const resourceOwnerId = req.resource?.[ownerIdField];
      
      if (!resourceOwnerId) {
        throw new ForbiddenError('Resource owner not found');
      }

      if (req.user.id !== resourceOwnerId) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication
 * Attaches user if token exists, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const AuthService = require('../services/AuthService');
      const user = await AuthService.getUserByToken(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without user if authentication fails
    next();
  }
};

/**
 * Convenience functions for common role checks
 */
const instructorOnly = (req, res, next) => {
  return authorizeRoles(['instructor', 'admin'])(req, res, next);
};

const studentOnly = (req, res, next) => {
  return authorizeRoles(['student'])(req, res, next);
};

module.exports = {
  authorizeRoles,
  authorizeAdmin,
  authorizeInstructorOrAdmin,
  authorizeStudent,
  authorizeOwnerOrAdmin,
  optionalAuth,
  instructorOnly,
  studentOnly,
};