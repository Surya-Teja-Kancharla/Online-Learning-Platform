/**
 * AuthContext - Global Authentication State
 * Provides authentication state and functions throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      const token = authService.getToken();
      
      if (token) {
        // Verify token by fetching user profile
        const userData = await authService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid auth data
      authService.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData } = response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Signup user
   */
  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      const { user: newUser } = response.data;
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user data
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user && user.role === role;
  };

  /**
   * Get user's dashboard path
   */
  const getDashboardPath = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'student':
        return '/dashboard/student';
      case 'instructor':
        return '/dashboard/instructor';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    hasRole,
    getDashboardPath,
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'instructor',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;