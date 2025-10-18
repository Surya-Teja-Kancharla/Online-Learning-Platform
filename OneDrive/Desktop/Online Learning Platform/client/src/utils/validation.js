/**
 * Form Validation Utilities
 * Reusable validation functions for forms
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  return null;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  if (name.length > 100) {
    return 'Name must not exceed 100 characters';
  }
  
  return null;
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validate role
 * @param {string} role - Role to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateRole = (role) => {
  const validRoles = ['student', 'instructor', 'admin'];
  
  if (!role) {
    return 'Role is required';
  }
  
  if (!validRoles.includes(role)) {
    return 'Invalid role selected';
  }
  
  return null;
};

/**
 * Get password strength level
 * @param {string} password - Password to check
 * @returns {object} Strength level and label
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { level: 0, label: 'No password', color: 'gray' };
  }
  
  let strength = 0;
  
  // Length check
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  
  // Map strength to level
  if (strength <= 2) {
    return { level: 1, label: 'Weak', color: 'red' };
  } else if (strength <= 4) {
    return { level: 2, label: 'Medium', color: 'yellow' };
  } else {
    return { level: 3, label: 'Strong', color: 'green' };
  }
};

/**
 * Validate entire signup form
 * @param {object} formData - Form data to validate
 * @returns {object} Errors object
 */
export const validateSignupForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (formData.confirmPassword !== undefined) {
    const matchError = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (matchError) errors.confirmPassword = matchError;
  }
  
  if (formData.role) {
    const roleError = validateRole(formData.role);
    if (roleError) errors.role = roleError;
  }
  
  return errors;
};

/**
 * Validate entire login form
 * @param {object} formData - Form data to validate
 * @returns {object} Errors object
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Check if errors object is empty
 * @param {object} errors - Errors object
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};