/**
 * Validation Utilities
 * Form validation helpers and rules
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};

/**
 * Validate name
 */
export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  return null;
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { level: 0, label: 'None', color: 'gray' };
  }

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&#]/.test(password)) strength++;

  // Normalize to 0-3 scale
  const level = Math.min(3, Math.floor(strength / 1.66));

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['red', 'orange', 'yellow', 'green'];

  return {
    level,
    label: labels[level] || 'Weak',
    color: colors[level] || 'red',
  };
};

/**
 * Validate signup form
 */
export const validateSignupForm = (formData) => {
  const errors = {};

  // Validate name
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  // Validate email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Validate password
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  // Validate confirm password
  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  // Validate role
  if (!formData.role) {
    errors.role = 'Please select a role';
  }

  return errors;
};

/**
 * Validate login form
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  // Validate email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

/**
 * Check if errors object has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  if (!url) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate phone number (basic)
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  return null;
};

/**
 * Validate number range
 */
export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  if (min !== undefined && num < min) {
    return `Value must be at least ${min}`;
  }
  if (max !== undefined && num > max) {
    return `Value must be at most ${max}`;
  }
  return null;
};

/**
 * Sanitize input (basic XSS prevention)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  getPasswordStrength,
  validateSignupForm,
  validateLoginForm,
  hasErrors,
  validateURL,
  validatePhone,
  validateNumberRange,
  sanitizeInput,
};