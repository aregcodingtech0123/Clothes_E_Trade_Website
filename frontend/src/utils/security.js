/**
 * Security utilities for XSS protection and input sanitization
 */

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return str;
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Escapes HTML special characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return str.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates and sanitizes user input
 * @param {string} input - Input to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export const validateInput = (input, options = {}) => {
  const {
    maxLength = 1000,
    minLength = 0,
    allowHTML = false,
    required = false,
    pattern = null
  } = options;

  if (typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Input must be a string' };
  }

  if (required && !input.trim()) {
    return { isValid: false, sanitized: '', error: 'This field is required' };
  }

  if (input.length > maxLength) {
    return { isValid: false, sanitized: '', error: `Input must be less than ${maxLength} characters` };
  }

  if (input.length < minLength) {
    return { isValid: false, sanitized: '', error: `Input must be at least ${minLength} characters` };
  }

  let sanitized = input.trim();
  
  if (!allowHTML) {
    sanitized = escapeHTML(sanitized);
  }

  if (pattern && !pattern.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Input does not match required pattern' };
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Sanitizes object properties recursively
 * @param {object} obj - Object to sanitize
 * @param {array} allowedKeys - Keys to allow (optional)
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = (obj, allowedKeys = null) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? escapeHTML(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, allowedKeys));
  }

  const sanitized = {};
  for (const key in obj) {
    if (allowedKeys && !allowedKeys.includes(key)) {
      continue;
    }
    sanitized[key] = sanitizeObject(obj[key], allowedKeys);
  }
  return sanitized;
};
