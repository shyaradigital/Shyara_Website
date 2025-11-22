/**
 * Client-side form validation and sanitization utilities
 * Removes dangerous characters and enforces length limits
 */

/**
 * Remove dangerous characters from input
 * Removes: < > " ' / \ ; () { }
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove dangerous characters: < > " ' / \ ; () { }
  return input
    .replace(/[<>"'/\\;(){}]/g, '')
    .trim();
};

/**
 * Sanitize name field
 * - Remove dangerous characters
 * - Limit to 100 characters
 * 
 * @param {string} name - Name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  // Remove dangerous characters
  let sanitized = sanitizeInput(name);
  
  // Limit to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  return sanitized;
};

/**
 * Sanitize email field
 * - Remove dangerous characters (but preserve @ and . for email format)
 * - Limit to 254 characters (RFC 5321)
 * 
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove dangerous characters but preserve @ and . for email format
  let sanitized = email
    .replace(/[<>"'/\\;(){}]/g, '')
    .trim();
  
  // Limit to 254 characters (RFC 5321 max email length)
  if (sanitized.length > 254) {
    sanitized = sanitized.substring(0, 254);
  }
  
  return sanitized;
};

/**
 * Sanitize message field
 * - Remove dangerous characters
 * - Limit to 2000 characters
 * 
 * @param {string} message - Message to sanitize
 * @returns {string} - Sanitized message
 */
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // Remove dangerous characters
  let sanitized = sanitizeInput(message);
  
  // Limit to 2000 characters
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }
  
  return sanitized;
};

/**
 * Validate name field
 * 
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { valid: false, error: 'Name is required.' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Name cannot be empty.' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must be 100 characters or less.' };
  }

  // Check for dangerous characters
  if (/[<>"'/\\;(){}]/.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid characters.' };
  }

  return { valid: true };
};

/**
 * Validate email field
 * 
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, error: 'Email is required.' };
  }

  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email cannot be empty.' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email must be 254 characters or less.' };
  }

  // Check for dangerous characters (but allow @ and .)
  if (/[<>"'/\\;(){}]/.test(trimmed)) {
    return { valid: false, error: 'Email contains invalid characters.' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  return { valid: true };
};

/**
 * Validate message field
 * 
 * @param {string} message - Message to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string' || !message.trim()) {
    return { valid: false, error: 'Message is required.' };
  }

  const trimmed = message.trim();
  
  if (trimmed.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long.' };
  }

  if (trimmed.length > 2000) {
    return { valid: false, error: 'Message must be 2000 characters or less.' };
  }

  // Check for dangerous characters
  if (/[<>"'/\\;(){}]/.test(trimmed)) {
    return { valid: false, error: 'Message contains invalid characters.' };
  }

  return { valid: true };
};

/**
 * Sanitize all form fields at once
 * 
 * @param {Object} formData - Form data object
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  return {
    name: sanitizeName(formData.name || ''),
    email: sanitizeEmail(formData.email || ''),
    phone: formData.phone || '', // Phone is handled separately
    message: sanitizeMessage(formData.message || '')
  };
};

/**
 * Validate all form fields at once
 * 
 * @param {Object} formData - Form data object
 * @returns {{ valid: boolean, errors: Object }} - Validation result
 */
export const validateFormData = (formData) => {
  const errors = {};
  
  const nameValidation = validateName(formData.name);
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }
  
  const messageValidation = validateMessage(formData.message);
  if (!messageValidation.valid) {
    errors.message = messageValidation.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

