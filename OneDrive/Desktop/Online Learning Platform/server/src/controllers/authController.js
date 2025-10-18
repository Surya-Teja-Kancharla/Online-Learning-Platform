/**
 * AuthController - Presentation Layer
 * Handles HTTP requests for authentication
 * Implements Controller pattern
 */

const AuthService = require('../services/AuthService');
const { successResponse, errorResponse } = require('../utils/responses');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/signup
   */
  async signup(req, res, next) {
    try {
      const userData = req.body;
      const result = await AuthService.signup(userData);

      return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getProfile(req, res, next) {
    try {
      const user = req.user; // Set by auth middleware
      return successResponse(res, { user: user.toSafeObject() });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify user role
   * GET /api/auth/verify-role
   */
  async verifyRole(req, res, next) {
    try {
      const user = req.user; // Set by auth middleware
      
      return successResponse(res, {
        role: user.role,
        isAdmin: user.isAdmin(),
        isInstructor: user.isInstructor(),
        isStudent: user.isStudent()
      }, 'Role verified');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      await AuthService.changePassword(userId, oldPassword, newPassword);

      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.generatePasswordResetToken(email);

      // In production, send this token via email
      // For now, return it in response (NOT SECURE - for development only)
      if (resetToken) {
        return successResponse(
          res,
          { resetToken }, // Remove this in production
          'Password reset link sent to email'
        );
      }

      // Always return success to prevent email enumeration
      return successResponse(
        res,
        null,
        'If the email exists, a reset link has been sent'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);

      return successResponse(res, null, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      // With JWT, logout is handled client-side by removing the token
      // You can implement token blacklisting here if needed
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   * POST /api/auth/refresh-token
   */
  async refreshToken(req, res, next) {
    try {
      const user = req.user; // Set by auth middleware
      const newToken = AuthService.generateToken(user);

      return successResponse(res, { token: newToken }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();