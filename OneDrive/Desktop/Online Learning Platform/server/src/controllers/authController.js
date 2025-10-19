/**
 * AuthController - Presentation Layer
 * Handles HTTP requests for authentication
 * Implements Controller pattern
 */

const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/signup
   */
  async signup(req, res, next) {
    try {
      const userData = req.body;
      const result = await AuthService.signup(userData);

      // FIX: Manually build the success response without the missing utility file.
      res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: result
      });
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

      // FIX: Manually build the success response. This is the core of the fix.
      // The 'data' object containing user and token is now correctly sent.
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
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
      res.status(200).json({
          success: true,
          data: { user: user.toSafeObject() }
      });
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
      
      res.status(200).json({
        success: true,
        message: 'Role verified',
        data: {
          role: user.role,
          isAdmin: user.isAdmin(),
          isInstructor: user.isInstructor(),
          isStudent: user.isStudent()
        }
      });
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

      res.status(200).json({ success: true, message: 'Password changed successfully' });
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
      await AuthService.generatePasswordResetToken(email);

      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
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

      res.status(200).json({ success: true, message: 'Password reset successful' });
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
      res.status(200).json({ success: true, message: 'Logout successful' });
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

      res.status(200).json({
          success: true,
          message: 'Token refreshed',
          data: { token: newToken }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

