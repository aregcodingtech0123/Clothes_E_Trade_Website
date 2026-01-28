import { ApiError } from './errorHandler';

/**
 * Validates and sanitizes string input
 */
export const validateString = (value: any, fieldName: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
} = {}): string => {
  const { minLength = 0, maxLength = 1000, required = false, pattern } = options;

  if (required && (!value || typeof value !== 'string' || !value.trim())) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  if (value && typeof value !== 'string') {
    throw new ApiError(400, `${fieldName} must be a string`);
  }

  const trimmed = value ? value.trim() : '';

  if (trimmed.length > maxLength) {
    throw new ApiError(400, `${fieldName} must be less than ${maxLength} characters`);
  }

  if (trimmed.length < minLength) {
    throw new ApiError(400, `${fieldName} must be at least ${minLength} characters`);
  }

  if (pattern && trimmed && !pattern.test(trimmed)) {
    throw new ApiError(400, `${fieldName} format is invalid`);
  }

  return trimmed;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string, fieldName: string = 'Email'): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validated = validateString(email, fieldName, { required: true });
  
  if (!emailRegex.test(validated)) {
    throw new ApiError(400, 'Invalid email format');
  }

  return validated;
};

/**
 * Validates number input
 */
export const validateNumber = (value: any, fieldName: string, options: {
  min?: number;
  max?: number;
  required?: boolean;
  integer?: boolean;
} = {}): number => {
  const { min, max, required = false, integer = false } = options;

  if (required && (value === null || value === undefined)) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  if (value === null || value === undefined) {
    return value;
  }

  const num = Number(value);

  if (isNaN(num)) {
    throw new ApiError(400, `${fieldName} must be a number`);
  }

  if (integer && !Number.isInteger(num)) {
    throw new ApiError(400, `${fieldName} must be an integer`);
  }

  if (min !== undefined && num < min) {
    throw new ApiError(400, `${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && num > max) {
    throw new ApiError(400, `${fieldName} must be at most ${max}`);
  }

  return num;
};

/**
 * Sanitizes HTML to prevent XSS attacks
 * Removes dangerous HTML tags, event handlers, and javascript: protocols
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return html;
  
  // Remove script tags and content
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove event handlers
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Remove style tags that could contain malicious CSS
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  return sanitized;
};

/**
 * Validates URL format
 */
export const validateURL = (url: string, fieldName: string = 'URL'): string => {
  try {
    const validated = validateString(url, fieldName, { required: false });
    if (validated && !validated.match(/^https?:\/\/.+/)) {
      throw new ApiError(400, 'Invalid URL format');
    }
    return validated;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, 'Invalid URL format');
  }
};
